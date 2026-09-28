import AppError from "../utils/AppError.js";

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new AppError("name, email and password are required", 400);
  }
  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError("Invalid email or password", 400);
  }
  next();
};
