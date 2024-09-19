import { User } from "./User";

export type RegistrationResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
  totpUri: string;
};
