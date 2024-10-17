import amqp from "amqplib";
import { errorHandler } from "../lib/errorHandler";
import { ResponseError } from "../lib/responseError";
import mongoose, { Types } from "mongoose";
import { UsersService } from "../services/usersService";
import { response } from "../lib/response";
import { UpdateUserDataDto } from "../dto/UpdateUserDataDto";
import { UpdateUserDataPayload } from "../types/UpdateUserDataPayload";
import { TokenService } from "../services/tokenService";
import { z } from "zod";

export class UsersController {
  static async getUserData(msg: amqp.ConsumeMessage) {
    try {
      const parsedPayload =
        msg.content.toString() && JSON.parse(msg.content.toString());

      const { userId } = parsedPayload as { userId: Types.ObjectId };

      const isIdValid =
        userId && mongoose.Types.ObjectId.isValid(userId?.toString());

      if (!isIdValid) {
        throw ResponseError.badRequest(
          "Надайте валідний ідентифікатор користувача"
        );
      }

      const responseData = await UsersService.getUserData(userId);

      return response({
        ok: true,
        status: 200,
        data: responseData,
        error: null,
      });
    } catch (e) {
      return errorHandler(e);
    }
  }

  static async updateUserData(msg: amqp.ConsumeMessage) {
    try {
      const parsedPayload =
        msg.content.toString() && JSON.parse(msg.content.toString());

      const { token, payload } = parsedPayload as UpdateUserDataPayload;

      const UpdateUserDataPayloadValidation = z.object({
        firstName: z
          .string({ message: "Має бути строкою" })
          .min(3, { message: "Має містити принаймні 3 символи" })
          .max(30, { message: "Має містити не більше 30 символів" })
          .optional()
          .or(z.literal("")),
        lastName: z
          .string({ message: "Має бути строкою" })
          .min(3, { message: "Має містити принаймні 3 символи" })
          .max(30, { message: "Має містити не більше 30 символів" })
          .optional()
          .or(z.literal("")),
      });

      const validationResult =
        UpdateUserDataPayloadValidation.safeParse(payload);

      if (!validationResult.success) {
        throw ResponseError.badRequest(
          "Надайте валідні дані",
          validationResult.error.errors
        );
      }

      const { userId } = await TokenService.getAccessTokenData(token);
      const { firstName, lastName } = payload;

      const responseData = await UsersService.updateUserData(userId, {
        firstName,
        lastName,
      });

      return response({
        ok: true,
        status: 200,
        data: responseData,
        error: null,
      });
    } catch (e) {
      return errorHandler(e);
    }
  }

  static async deleteUserProfile(msg: amqp.ConsumeMessage) {
    try {
      const parsedPayload =
        msg.content.toString() && JSON.parse(msg.content.toString());

      const { token } = parsedPayload as { token: string };
      const { userId } = await TokenService.getAccessTokenData(token);
      const responseData = await UsersService.deleteUser(userId);

      return response({
        ok: true,
        status: 200,
        data: responseData,
        error: null,
      });
    } catch (e) {
      return errorHandler(e);
    }
  }
}
