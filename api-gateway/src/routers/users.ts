import { Router } from "express";
import { UsersControllers } from "../controllers/usersController";

const router = Router();

router.get("/:id", UsersControllers.getUserData);

export const usersRouter = router;
