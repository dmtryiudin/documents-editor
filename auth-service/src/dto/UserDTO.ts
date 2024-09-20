import { UserType } from "../models/User";

export class UserDTO {
  username: string;

  constructor({ username }: UserType) {
    this.username = username;
  }
}
