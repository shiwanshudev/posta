import { sql } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register user
export const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required!",
      });
    }

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
      await sql`INSERT INTO users(name, email, password) VALUES(${name}, ${email}, ${hashedPassword}) RETURNING id, name, email, created_at`;

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
      message: error.message,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required!",
      });
    }

    const [user] = await sql`SELECT * FROM users WHERE email=${email}`;

    if (!user) {
      return res.status(400).json({
        message: "Invalid Credentials!",
      });
    }

    const isMatch = bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({
      token,
      user: userWithoutPassword,
      message: "Succssfully logged in!",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
