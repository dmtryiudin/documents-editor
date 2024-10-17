import jwt from "jsonwebtoken";
import { JWTTokenData } from "../types/JWTTokenData";
import { ResponseError } from "../lib/responseError";

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

  static getAccessTokenData = async (token: string) => {
    const tokenData = await this.validateAccessToken(token);
    const result = this.getTokenData(tokenData);

    if (!result) {
      throw ResponseError.unauthorized("Надайте валідні дані автентифікації");
    }

    return result;
  };
}
