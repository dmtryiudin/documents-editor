import amqp from "amqplib";
import { errorHandler } from "../lib/errorHandler";
import { AuthService } from "../services/authService";
import { AuthRequest } from "../types/AuthRequest";
import { F2ALoginRequest } from "../types/F2ALoginRequest";
import { RefreshTokenRequest } from "../types/RefreshTokenRequest";
import { response } from "../lib/response";
import { z } from "zod";
import { ResponseError } from "../lib/responseError";
import { TokenService } from "../services/tokenService";

export class AuthController {
  static async registration(msg: amqp.ConsumeMessage) {
    try {
      const parsedPayload =
        msg.content.toString() && JSON.parse(msg.content.toString());

      const RegistrationPayloadValidation = z.object({
        username: z
          .string({ message: "Має бути строкою" })
          .min(3, { message: "Має містити принаймні 3 символи" })
          .max(30, { message: "Має містити не більше 30 символів" }),
        password: z
          .string({ message: "Має бути строкою" })
          .min(8, { message: "Має містити принаймні 8 символів" }),
      });

      const validationResult =
        RegistrationPayloadValidation.safeParse(parsedPayload);

      if (!validationResult.success) {
        throw ResponseError.badRequest(
          "Надайте валідні дані",
          validationResult.error.errors
        );
      }

      const { username, password } = parsedPayload as AuthRequest;

      const responseData = await AuthService.registration({
        username,
        password,
      });

      return response({
        ok: true,
        status: 201,
        data: responseData,
        error: null,
      });
    } catch (e: any) {
      return errorHandler(e);
    }
  }

  static async preLogin(msg: amqp.ConsumeMessage) {
    try {
      const parsedPayload =
        msg.content.toString() && JSON.parse(msg.content.toString());

      const PreLoginPayloadValidation = z.object({
        username: z
          .string({ message: "Має бути строкою" })
          .min(1, { message: "Поле обов'язкове" }),
        password: z
          .string({ message: "Має бути строкою" })
          .min(1, { message: "Поле обов'язкове" }),
      });

      const validationResult =
        PreLoginPayloadValidation.safeParse(parsedPayload);

      if (!validationResult.success) {
        throw ResponseError.badRequest(
          "Надайте валідні дані",
          validationResult.error.errors
        );
      }

      const { username, password } = parsedPayload as AuthRequest;

      const responseData = await AuthService.preLogin({ username, password });

      return response({
        ok: true,
        status: 200,
        data: responseData,
        error: null,
      });
    } catch (e: any) {
      return errorHandler(e);
    }
  }

  static async f2aLogin(msg: amqp.ConsumeMessage) {
    try {
      const parsedPayload =
        msg.content.toString() && JSON.parse(msg.content.toString());

      const F2APayloadValidation = z.object({
        token: z.string({ message: "Має бути строкою" }),
        totpCode: z.string({ message: "Має бути строкою" }),
      });

      const validationResult = F2APayloadValidation.safeParse(parsedPayload);

      if (!validationResult.success) {
        throw ResponseError.badRequest(
          "Надайте валідні дані",
          validationResult.error.errors
        );
      }

      const { token, totpCode } = parsedPayload as F2ALoginRequest;

      const responseData = await AuthService.f2aLogin({ token, totpCode });

      return response({
        ok: true,
        status: 200,
        data: responseData,
        error: null,
      });
    } catch (e: any) {
      return errorHandler(e);
    }
  }

  static async refreshToken(msg: amqp.ConsumeMessage) {
    try {
      const parsedPayload =
        msg.content.toString() && JSON.parse(msg.content.toString());

      const RefreshTokenPayloadValidation = z.object({
        refreshToken: z.string({ message: "Має бути строкою" }),
      });

      const validationResult =
        RefreshTokenPayloadValidation.safeParse(parsedPayload);

      if (!validationResult.success) {
        throw ResponseError.badRequest(
          "Надайте валідні дані",
          validationResult.error.errors
        );
      }

      const { refreshToken } = parsedPayload as RefreshTokenRequest;

      const responseData = await AuthService.refreshToken(refreshToken);

      return response({
        ok: true,
        status: 200,
        data: responseData,
        error: null,
      });
    } catch (e: any) {
      return errorHandler(e);
    }
  }

  static async checkAccessToken(msg: amqp.ConsumeMessage) {
    try {
      const parsedPayload =
        msg.content.toString() && JSON.parse(msg.content.toString());
      const { token } = parsedPayload as { token: string };

      const { userId } = await TokenService.getAccessTokenData(token);

      return response({
        ok: true,
        status: 200,
        data: { userId },
        error: null,
      });
    } catch (e: any) {
      return errorHandler(e);
    }
  }
}
