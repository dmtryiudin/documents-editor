import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { RefreshToken } from "../models/ResreshToken";

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
    const foundTokenForUser = await RefreshToken.findOne({ user: userId });

    if (foundTokenForUser) {
      await RefreshToken.deleteOne({ user: userId });
    }

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

  static generatePreLoginToken(userId: Types.ObjectId) {
    return jwt.sign(
      {
        data: { userId },
      },
      process.env.JWT_PRE_LOGIN_SECRET!,
      { expiresIn: "30m" }
    );
  }

  static validatePreLoginToken(token: string) {
    try {
      return jwt.verify(token, process.env.JWT_PRE_LOGIN_SECRET!);
    } catch {
      return null;
    }
  }
}
