import { Types } from "mongoose";
import { UserType } from "../models/User";

export class UserDTO {
  username: string;
  id: Types.ObjectId;
  firstName: string;
  lastName: string;

  constructor({ username, _id, firstName, lastName }: UserType) {
    this.username = username;
    this.id = _id;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
