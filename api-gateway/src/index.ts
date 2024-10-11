import express, { Application } from "express";
import dotenv from "dotenv";
import { authRouter } from "./routers/auth";
import { usersRouter } from "./routers/users";
import { attachJWTToken } from "./middlewares/attachJWTToken";

dotenv.config();

const port = process.env.PORT || 3001;
const app: Application = express();

app.use(express.json());
app.use(attachJWTToken);
app.use("/auth", authRouter);
app.use("/users", usersRouter);

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
