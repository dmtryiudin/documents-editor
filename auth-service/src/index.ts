import mongoose from "mongoose";
import dotenv from "dotenv";
import { AmqpClient } from "./lib/amqpClient";
import { Queues } from "./types/Queues";
import { AuthController } from "./controllers/authController";

dotenv.config();

const main = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_URL!);

  await AmqpClient.initRpcListener(
    Queues.REGISTRATION,
    AuthController.registration
  );
  await AmqpClient.initRpcListener(Queues.PRE_LOGIN, AuthController.preLogin);
  await AmqpClient.initRpcListener(Queues.F2A_LOGIN, AuthController.f2aLogin);
  await AmqpClient.initRpcListener(
    Queues.REFRESH_TOKEN,
    AuthController.refreshToken
  );
  await AmqpClient.initRpcListener(
    Queues.CHECK_ACCESS_TOKEN,
    AuthController.checkAccessToken
  );
};

main();
