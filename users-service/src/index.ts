import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const main = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_URL!);
};

main();
