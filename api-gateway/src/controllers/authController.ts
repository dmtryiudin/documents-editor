import { AmqpClient } from "../lib/amqpClient";
import { AuthQueues } from "../types/Queues";
import { AuthPayload } from "../types/AuthPayload";
import { Request, Response } from "express";
import { F2ALoginRequest } from "../types/F2ALoginRequest";
import { RefreshTokenPayload } from "../types/RefreshTokenPayload";

export class AuthController {
  static async registration(req: Request, res: Response) {
    const payload = req.body as AuthPayload | null;

    const response = await AmqpClient.sendRpcRequest(
      AuthQueues.REGISTRATION,
      JSON.stringify({
        username: payload?.username,
        password: payload?.password,
      })
    );

    res.status(response.status).json(response);
  }

  static async preLogin(req: Request, res: Response) {
    const payload = req.body as AuthPayload | null;

    const response = await AmqpClient.sendRpcRequest(
      AuthQueues.PRE_LOGIN,
      JSON.stringify({
        username: payload?.username,
        password: payload?.password,
      })
    );

    res.status(response.status).json(response);
  }

  static async f2aLogin(req: Request, res: Response) {
    const payload = req.body as F2ALoginRequest | null;
    const token = req.headers.authorization;
    const parsedToken = token && token.split(" ")[1];

    const response = await AmqpClient.sendRpcRequest(
      AuthQueues.F2A_LOGIN,
      JSON.stringify({
        totpCode: payload?.totpCode,
        token: parsedToken,
      })
    );

    res.status(response.status).json(response);
  }

  static async refreshToken(req: Request, res: Response) {
    const payload = req.body as RefreshTokenPayload | null;

    const response = await AmqpClient.sendRpcRequest(
      AuthQueues.REFRESH_TOKEN,
      JSON.stringify({
        refreshToken: payload?.refreshToken,
      })
    );

    res.status(response.status).json(response);
  }
}
