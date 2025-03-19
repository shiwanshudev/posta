import express from "express";
import {
  getPostsController,
  createPostController,
  getUserPostsController,
} from "../controllers/postController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/all", getPostsController);
router.post("/", authMiddleware, createPostController);
router.get("/", authMiddleware, getUserPostsController);

export default router;
