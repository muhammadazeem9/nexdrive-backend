import RefreshToken from "../models/refreshToken.model.js";
import {
  generateRefreshToken,
  hashRefreshToken,
} from "../utils/refreshToken.js";
import AppError from "../utils/AppError.js";

const REFRESH_TOKEN_DAYS = 7;

// Create refresh token
export const createRefreshToken = async (user) => {
  const rawToken = generateRefreshToken();

  const tokenHash = hashRefreshToken(rawToken);

  const expiresAt = new Date(
    Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
  );

  await RefreshToken.create({
    user: user._id,
    tokenHash,
    expiresAt,
  });

  return rawToken;
};

// Validate refresh token
export const validateRefreshToken = async (rawToken) => {
  if (!rawToken) {
    throw new AppError("Refresh token is required", 401);
  }

  const tokenHash = hashRefreshToken(rawToken);

  const storedToken = await RefreshToken.findOne({
    tokenHash,
    revokedAt: null,
  }).populate("user");

  if (!storedToken) {
    throw new AppError("Invalid refresh token", 401);
  }

  // Check expiration
  if (storedToken.expiresAt <= new Date()) {
    storedToken.revokedAt = new Date();
    await storedToken.save();

    throw new AppError("Refresh token expired", 401);
  }

  // Check user
  if (!storedToken.user) {
    throw new AppError("User not found", 401);
  }

  return storedToken;
};

// Rotate refresh token
export const rotateRefreshToken = async (rawToken) => {
  // Validate old token
  const storedToken = await validateRefreshToken(rawToken);

  // Revoke old token
  storedToken.revokedAt = new Date();
  await storedToken.save();

  // Create new token
  const newRefreshToken = await createRefreshToken(storedToken.user);

  return {
    user: storedToken.user,
    refreshToken: newRefreshToken,
  };
};

// Revoke refresh token
export const revokeRefreshToken = async (rawToken) => {
  if (!rawToken) {
    return;
  }

  const tokenHash = hashRefreshToken(rawToken);

  await RefreshToken.findOneAndUpdate(
    {
      tokenHash,
      revokedAt: null,
    },
    {
      revokedAt: new Date(),
    },
  );
};
