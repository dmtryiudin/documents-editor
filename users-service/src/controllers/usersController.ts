import amqp from "amqplib";
import { errorHandler } from "../lib/errorHandler";
import { ResponseError } from "../lib/responseError";
import mongoose, { Types } from "mongoose";
import { UsersService } from "../services/usersService";
import { response } from "../lib/response";

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
}
