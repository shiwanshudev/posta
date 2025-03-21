import { sql } from "../config/db.js";

export const getPostsController = async (req, res) => {
  try {
    const posts = await sql`SELECT * FROM posts ORDER BY created_at DESC`;
    return res.status(200).json({ posts });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getUserPostsController = async (req, res) => {
  try {
    const userId = req.user?.id;
    const posts =
      await sql`SELECT * FROM posts WHERE user_id=${userId} ORDER BY created_at DESC`;
    return res.status(200).json({ posts });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const createPostController = async (req, res) => {
  // Middleware does the decoding part from token to user id and stores it in req
  try {
    const { title, content } = req.body;
    const userId = req.user?.id;
    if (!title || !content || !userId) {
      return res
        .status(400)
        .json({ message: "Title, content and user id are required!" });
    }

    const [newPost] =
      await sql`INSERT INTO posts(title, content, user_id) VALUES(${title}, ${content}, ${userId}) RETURNING id, title, content, user_id, created_at`;
    return res.status(201).json({ post: newPost });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deletePostController = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user?.id;
    if (!postId || !userId) {
      return res
        .status(400)
        .json({ message: "Post id and user id are required!" });
    }

    const [post] =
      await sql`DELETE FROM posts WHERE id=${postId} AND user_id=${userId} RETURNING *`;
    if (!post) {
      return res.status(400).json({ message: "Post not found!" });
    }

    return res.status(200).json({ post });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
