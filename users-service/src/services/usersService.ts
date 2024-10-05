import { Types } from "mongoose";
import { UpdateUserDataDto } from "../dto/UpdateUserDataDto";
import { User } from "../models/User";
import { ResponseError } from "../lib/responseError";
import { UserDTO } from "../dto/UserDTO";

export class UsersService {
  static async getUserData(userId: Types.ObjectId) {
    const foundUser = await User.findById(userId);

    if (!foundUser) {
      throw ResponseError.notFound("Не вдалося знайти користувача");
    }

    return { ...new UserDTO(foundUser) };
  }

  static async updateUserData(
    userId: Types.ObjectId,
    userData: UpdateUserDataDto
  ) {
    const { firstName, lastName } = userData;

    await User.findByIdAndUpdate(userId, {
      firstName,
      lastName,
    });
  }

  static async deleteUser(userId: Types.ObjectId) {
    await User.findByIdAndDelete(userId);
  }
}
