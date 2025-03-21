import express from "express";
import {
  getPostsController,
  createPostController,
  getUserPostsController,
  deletePostController,
} from "../controllers/postController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/all", getPostsController);
router.post("/", authMiddleware, createPostController);
router.get("/", authMiddleware, getUserPostsController);
router.delete("/:id", authMiddleware, deletePostController);

export default router;
