import { sql } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Joi from "joi";

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.base": "Name must be a string.",
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name must not exceed 50 characters.",
    "any.required": "Name is required.",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string.",
    "string.email": "Email must be a valid email address.",
    "string.empty": "Email is required.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(6).max(128).required().messages({
    "string.base": "Password must be a string.",
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 6 characters long.",
    "string.max": "Password must not exceed 128 characters.",
    "any.required": "Password is required.",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string.",
    "string.email": "Email must be a valid email address.",
    "string.empty": "Email is required.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(6).max(128).required().messages({
    "string.base": "Password must be a string.",
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 6 characters long.",
    "string.max": "Password must not exceed 128 characters.",
    "any.required": "Password is required.",
  }),
});

// Register user
export const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate request body
    const { error } = registerSchema.validate(
      { name, email, password },
      { abortEarly: false }
    );
    if (error) {
      const validationMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({ message: validationMessages });
    }

    // Check if user already exists
    const userExists = await sql`SELECT * FROM users WHERE email=${email}`;
    if (userExists.length > 0) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user into the database
    const [newUser] =
      await sql`INSERT INTO users(name, email, password) VALUES(${name}, ${email}, ${hashedPassword}) RETURNING id, name, email, created_at`;

    // Generate JWT token
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(201).json({
      token,
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request body
    const { error } = loginSchema.validate(
      { email, password },
      { abortEarly: false }
    );
    if (error) {
      const validationMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({ message: validationMessages });
    }

    // Check if user exists
    const [user] = await sql`SELECT * FROM users WHERE email=${email}`;
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({
      token,
      user: userWithoutPassword,
      message: "Successfully logged in!",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Verify token
export const verifyTokenController = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [user] =
      await sql`SELECT id, name, email, created_at FROM users WHERE id=${decoded.id}`;

    if (!user) {
      return res.status(401).json({ message: "Invalid token!" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// Logout user
