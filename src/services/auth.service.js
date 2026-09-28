import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcrypt"; // make password hashed

export const authservice = async ({
  name,
  email,
  phone,
  password,
  confirmPassword,
}) => {
  // check password
  if (password !== confirmPassword) {
    throw new AppError("Passwords do not match", 400);
  }
  //   check existing user
  const existinguser = await User.findOne({ email });
  if (existinguser) {
    throw new AppError("User already exists", 409);
  }
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
  });
  // Don't return the password
  const userResponse = user.toObject();
  delete userResponse.password;

  return userResponse;
};
