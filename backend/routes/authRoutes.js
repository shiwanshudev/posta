import express from "express";
import {
  loginController,
  registerController,
  verifyTokenController,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/verify", verifyTokenController);

export default router;
