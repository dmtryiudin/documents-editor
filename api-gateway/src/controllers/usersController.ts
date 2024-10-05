import { Request, Response } from "express";
import { AmqpClient } from "../lib/amqpClient";
import { UsersQueues } from "../types/Queues";

export class UsersControllers {
  static async getUserData(req: Request, res: Response) {
    const userId = req.params.id;

    const response = await AmqpClient.sendRpcRequest(
      UsersQueues.GET_USER_ITEM,
      JSON.stringify({
        userId,
      })
    );

    res.status(response.status).json(response);
  }
}
