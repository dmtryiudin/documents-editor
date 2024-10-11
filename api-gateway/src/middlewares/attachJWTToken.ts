import { Response, NextFunction } from "express";
import { RequestJWT } from "../types/RequestJWT";

export const attachJWTToken = (
  req: RequestJWT,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.headers.authorization;

  if (accessToken) {
    req.accessToken = accessToken.split(" ")[1];
  }

  next();
};
