import express from "express";
import {
  getPostsController,
  createPostController,
} from "../controllers/postController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getPostsController);
router.post("/", authMiddleware, createPostController);

export default router;
