import jwt, { decode } from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import { verifyAccessToken } from "../utils/token.js";

export const protect = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    throw new AppError("Authentication is required", 401);
  }
  try {
    const decoded = verifyAccessToken(token);
    req.user = { userId: decoded.sub, role: decoded.role };
    next();
  } catch (error) {
    throw new AppError("Invalid or expired token", 401);
  }
};
