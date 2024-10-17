import { Router } from "express";
import { UsersController } from "../controllers/usersController";

const router = Router();

router.get("/:id", UsersController.getUserData);
router.put("/", UsersController.updateUserData);
router.delete("/", UsersController.deleteUserProfile);

export const usersRouter = router;
