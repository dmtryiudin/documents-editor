import express, { Application } from "express";
import dotenv from "dotenv";
import { authRouter } from "./routers/auth";

dotenv.config();

const port = process.env.PORT || 3001;
const app: Application = express();

app.use(express.json());
app.use("/auth", authRouter);

const main = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server is Fire at http://localhost:${port}`);
    });
  } catch (e) {
    console.log(e);
  }
};

main();
