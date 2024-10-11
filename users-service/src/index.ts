import mongoose from "mongoose";
import dotenv from "dotenv";
import { AmqpClient } from "./lib/amqpClient";
import { Queues } from "./types/Queues";
import { UsersController } from "./controllers/usersController";

dotenv.config();

const main = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_URL!);

  await AmqpClient.initRpcListener(
    Queues.GET_USER_ITEM,
    UsersController.getUserData
  );

  await AmqpClient.initRpcListener(
    Queues.UPDATE_USER_DATA,
    UsersController.updateUserData
  );

  await AmqpClient.initRpcListener(
    Queues.DELETE_USER_PROFILE,
    UsersController.deleteUserProfile
  );
};

main();
