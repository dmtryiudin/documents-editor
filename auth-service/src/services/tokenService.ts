import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { RefreshToken } from "../models/ResreshToken";
import { PreLoginToken } from "../models/PreLoginToken";
import bcrypt from "bcrypt";
import { JWTTokenData } from "../types/JWTTokenData";
import { ResponseError } from "../lib/responseError";

export class TokenService {
  static generateAccessToken(userId: Types.ObjectId) {
    return jwt.sign(
      {
        data: { userId },
      },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: "5m" }
    );
  }

  static async generateRefreshToken(userId: Types.ObjectId) {
    await RefreshToken.findOneAndDelete({ user: userId });

    const newRefreshToken = jwt.sign(
      {
        data: { userId },
      },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "14d" }
    );

    const hashToken = await bcrypt.hash(newRefreshToken, 12);

    await RefreshToken.create({ user: userId, token: hashToken });
    return newRefreshToken;
  }

  static async validateRefreshToken(token: string) {
    try {
      const verifyTokenResult = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET!
      );

      if (!verifyTokenResult) {
        return null;
      }

      const owner = this.getTokenData(verifyTokenResult);

      const ownerId = owner?.userId;

      if (!ownerId) {
        return null;
      }

      const foundToken = await RefreshToken.findOne({ user: ownerId });

      if (!foundToken) {
        return null;
      }

      const compareHash = await bcrypt.compare(token, foundToken.token);

      if (!compareHash) {
        return null;
      }

      return verifyTokenResult;
    } catch (e) {
      return null;
    }
  }

  static async killPreLoginToken(userId: Types.ObjectId) {
    return await PreLoginToken.findOneAndDelete({ user: userId });
  }

  static async generatePreLoginToken(userId: Types.ObjectId) {
    await this.killPreLoginToken(userId);
    const newToken = jwt.sign(
      {
        data: { userId },
      },
      process.env.JWT_PRE_LOGIN_SECRET!,
      { expiresIn: "30m" }
    );

    const hashToken = await bcrypt.hash(newToken, 12);

    await PreLoginToken.create({ user: userId, token: hashToken });
    return newToken;
  }

  static async validatePreLoginToken(token: string) {
    try {
      const verifyTokenResult = jwt.verify(
        token,
        process.env.JWT_PRE_LOGIN_SECRET!
      );

      if (!verifyTokenResult) {
        return null;
      }

      const owner = this.getTokenData(verifyTokenResult);

      const ownerId = owner?.userId;

      const foundToken = await PreLoginToken.findOne({ user: ownerId });

      if (!foundToken) {
        return null;
      }

      const compareHash = await bcrypt.compare(token, foundToken.token);

      if (!ownerId) {
        return null;
      }

      if (!compareHash) {
        return null;
      }

      return verifyTokenResult;
    } catch {
      return null;
    }
  }

  static getTokenData(verifyTokenResult: string | jwt.JwtPayload | null) {
    const owner =
      typeof verifyTokenResult === "string"
        ? null
        : (verifyTokenResult?.data as JWTTokenData);

    return owner;
  }

  static async validateAccessToken(token: string) {
    try {
      const verifyTokenResult = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET!
      );

      if (!verifyTokenResult) {
        return null;
      }

      return verifyTokenResult;
    } catch {
      return null;
    }
  }

  static getAccessTokenData = async (token: string) => {
    const tokenData = await this.validateAccessToken(token);
    const result = this.getTokenData(tokenData);

    if (!result) {
      throw ResponseError.unauthorized("Надайте валідні дані автентифікації");
    }

    return result;
  };
}
