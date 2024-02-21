import express from "express";
import {
  signUpController,
  loginController,
  refreshTokenController,
  revokeRefreshTokens,
} from "../controllers/auth";

const router = express.Router();

router.post("/sign-up", signUpController);
router.post("/login", loginController);
router.post("/refreshToken", refreshTokenController);
router.post("/revokeRefreshTokens", revokeRefreshTokens);
export default router;
