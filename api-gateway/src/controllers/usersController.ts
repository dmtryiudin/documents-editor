import { Response } from "express";
import { AmqpClient } from "../lib/amqpClient";
import { UsersQueues } from "../types/Queues";
import { RequestJWT as Request } from "../types/RequestJWT";
import { UpdateUserDataPayload } from "../types/UpdateUserDataPayload";

export class UsersController {
  static async getUserData(req: Request, res: Response) {
    try {
      const userId = req.params.id;

      const response = await AmqpClient.sendRpcRequest(
        UsersQueues.GET_USER_ITEM,
        JSON.stringify({
          userId,
        })
      );

      res.status(response.status).json(response);
    } catch {
      res.status(500).json({});
    }
  }

  static async updateUserData(req: Request, res: Response) {
    try {
      const token = req.accessToken;
      const payload = req.body as UpdateUserDataPayload | null;

      const response = await AmqpClient.sendRpcRequest(
        UsersQueues.UPDATE_USER_DATA,
        JSON.stringify({
          token,
          payload: {
            firstName: payload?.firstName,
            lastName: payload?.lastName,
          },
        })
      );

      res.status(response.status).json(response);
    } catch {
      res.status(500).json({});
    }
  }

  static async deleteUserProfile(req: Request, res: Response) {
    try {
      const token = req.accessToken;

      const response = await AmqpClient.sendRpcRequest(
        UsersQueues.DELETE_USER_PROFILE,
        JSON.stringify({
          token,
        })
      );

      res.status(response.status).json(response);
    } catch {
      res.status(500).json({});
    }
  }
}
