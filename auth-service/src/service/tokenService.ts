import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { RefreshToken } from "../models/ResreshToken";
import { PreLoginToken } from "../models/PreLoginToken";

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
  static async validateAccessToken(token: string) {}

  static async generateRefreshToken(userId: Types.ObjectId) {
    await RefreshToken.findOneAndDelete({ user: userId });

    const newRefreshToken = jwt.sign(
      {
        data: { userId },
      },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "14d" }
    );

    await RefreshToken.create({ user: userId, token: newRefreshToken });
    return newRefreshToken;
  }

  static async validateRefreshToken(token: string) {
    try {
      const savedToken = await RefreshToken.findOne({ token });

      if (!savedToken) {
        return null;
      }

      return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
    } catch {
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

    await PreLoginToken.create({ user: userId, token: newToken });
    return newToken;
  }

  static async validatePreLoginToken(token: string) {
    try {
      const dbToken = await PreLoginToken.findOne({ token });

      if (!dbToken) {
        return null;
      }

      return jwt.verify(token, process.env.JWT_PRE_LOGIN_SECRET!);
    } catch {
      return null;
    }
  }
}
