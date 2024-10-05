import { Types } from "mongoose";
import { UserType } from "../models/User";

export class UserDTO {
  username: string;
  id: Types.ObjectId;

  constructor({ username, _id }: UserType) {
    this.username = username;
    this.id = _id;
  }
}
