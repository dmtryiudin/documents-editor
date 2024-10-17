import { Request } from "express";

export type RequestJWT = Request & { accessToken?: string };
