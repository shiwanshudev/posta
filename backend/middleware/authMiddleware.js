import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      } else {
        req.user = decoded;
      }
    });
  }
  next();
};

export default authMiddleware;
