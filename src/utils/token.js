import jwt from "jsonwebtoken";
import AppError from "./AppError.js";

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new AppError("JWT secret is not configured", 500);
  }

  return process.env.JWT_SECRET;
};

export const createAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
    },
    getJwtSecret(),
    {
      expiresIn: "15m",
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
    },
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, getJwtSecret(), {
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
  });
};
