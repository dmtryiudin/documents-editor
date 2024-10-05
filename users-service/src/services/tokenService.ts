import jwt from "jsonwebtoken";
import { JWTTokenData } from "../types/JWTTokenData";

export class TokenService {
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

  static getTokenData(verifyTokenResult: string | jwt.JwtPayload | null) {
    const owner =
      typeof verifyTokenResult === "string"
        ? null
        : (verifyTokenResult?.data as JWTTokenData);

    return owner;
  }
}
