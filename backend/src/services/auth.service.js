import bcrypt from "bcrypt";

import User from "../models/user.model.js";
import RefreshToken from "../models/refreshToken.model.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utills/token.utills.js";

const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  const tokenHash = await bcrypt.hash(refreshToken, 12);

  const refreshTokenExpiry = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  );

  await RefreshToken.create({
    user: user._id,
    tokenHash,
    expiresAt: refreshTokenExpiry,
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token required");
  }

  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }

  const storedTokens = await RefreshToken.find({
    user: decoded.userId,
  });

  let matchedToken = null;

  for (const storedToken of storedTokens) {
    const isMatch = await bcrypt.compare(
      refreshToken,
      storedToken.tokenHash
    );

    if (isMatch) {
      matchedToken = storedToken;
      break;
    }
  }

  if (!matchedToken) {
    throw new Error("Invalid session");
  }

  if (matchedToken.expiresAt < new Date()) {
    await matchedToken.deleteOne();
    throw new Error("Refresh token expired");
  }

  const newAccessToken = generateAccessToken(
    decoded.userId
  );

  const newRefreshToken = generateRefreshToken(
    decoded.userId
  );

  const newTokenHash = await bcrypt.hash(
    newRefreshToken,
    12
  );

  const newExpiry = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  );

  await matchedToken.deleteOne();

  await RefreshToken.create({
    user: decoded.userId,
    tokenHash: newTokenHash,
    expiresAt: newExpiry,
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    return;
  }

  const storedTokens = await RefreshToken.find({});

  for (const storedToken of storedTokens) {
    const isMatch = await bcrypt.compare(
      refreshToken,
      storedToken.tokenHash
    );

    if (isMatch) {
      await storedToken.deleteOne();
      break;
    }
  }
};

export {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
};