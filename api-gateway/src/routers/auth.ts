import { Router } from "express";
import { AuthController } from "../controllers/authController";

const router = Router();

router.post("/registration", AuthController.registration);
router.post("/login/pre-login", AuthController.preLogin);
router.post("/login/f2a-login", AuthController.f2aLogin);
router.post("/refresh-token", AuthController.refreshToken);

export const authRouter = router;
