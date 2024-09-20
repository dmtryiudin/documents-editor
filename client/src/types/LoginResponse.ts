import { User } from "./User";

export type LoginResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};
