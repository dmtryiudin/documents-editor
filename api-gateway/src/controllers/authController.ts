import { AmqpClient } from "../lib/amqpClient";
import { AuthQueues } from "../types/Queues";
import { AuthPayload } from "../types/AuthPayload";
import { Response } from "express";
import { F2ALoginRequest } from "../types/F2ALoginRequest";
import { RefreshTokenPayload } from "../types/RefreshTokenPayload";
import { RequestJWT as Request } from "../types/RequestJWT";

export class AuthController {
  static async registration(req: Request, res: Response) {
    try {
      const payload = req.body as AuthPayload | null;

      const response = await AmqpClient.sendRpcRequest(
        AuthQueues.REGISTRATION,
        JSON.stringify({
          username: payload?.username,
          password: payload?.password,
        })
      );

      res.status(response.status).json(response);
    } catch {
      res.status(500).json({});
    }
  }

  static async preLogin(req: Request, res: Response) {
    try {
      const payload = req.body as AuthPayload | null;

      const response = await AmqpClient.sendRpcRequest(
        AuthQueues.PRE_LOGIN,
        JSON.stringify({
          username: payload?.username,
          password: payload?.password,
        })
      );

      res.status(response.status).json(response);
    } catch {
      res.status(500).json({});
    }
  }

  static async f2aLogin(req: Request, res: Response) {
    try {
      const payload = req.body as F2ALoginRequest | null;
      const token = req.accessToken;

      const response = await AmqpClient.sendRpcRequest(
        AuthQueues.F2A_LOGIN,
        JSON.stringify({
          totpCode: payload?.totpCode,
          token,
        })
      );

      res.status(response.status).json(response);
    } catch {
      res.status(500).json({});
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const payload = req.body as RefreshTokenPayload | null;

      const response = await AmqpClient.sendRpcRequest(
        AuthQueues.REFRESH_TOKEN,
        JSON.stringify({
          refreshToken: payload?.refreshToken,
        })
      );

      res.status(response.status).json(response);
    } catch {
      res.status(500).json({});
    }
  }

  static async checkAccessToken(req: Request, res: Response) {
    try {
      const token = req.accessToken;

      const response = await AmqpClient.sendRpcRequest(
        AuthQueues.CHECK_ACCESS_TOKEN,
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
