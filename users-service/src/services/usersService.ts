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

    const user = await User.findByIdAndUpdate(userId, {
      firstName,
      lastName,
    });

    if (!user) {
      throw ResponseError.notFound("Не вдалося знайти користувача");
    }

    user.firstName = userData.firstName || user.firstName;
    user.lastName = userData.lastName || user.lastName;

    await user.save();

    return { ...new UserDTO(user) };
  }

  static async deleteUser(userId: Types.ObjectId) {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      throw ResponseError.notFound("Не вдалося знайти користувача");
    }

    return { ...new UserDTO(user) };
  }
}
