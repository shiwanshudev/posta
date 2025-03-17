import { sql } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register user
export const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // User exists then return with message.
    const userExists = await sql`SELECT * FROM users WHERE email=${email}`;
    if (userExists.length > 0) {
      return res.status(400).json({
        message: "User already exists!",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [newUser] =
      await sql`INSERT INTO users(name, email, password) VALUES(${name}, ${email}, ${hashedPassword}) RETURNING *`;

    // JWT
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(201).json({
      token,
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
