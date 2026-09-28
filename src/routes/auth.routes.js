import express from "express";
import {
  register,
  login,
  getMe,
  logout,
  refresh,
  updateProfile,
  changePassword,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import {
  validateLogin,
  validateRegister,
} from "../validators/auth.validator.js"; // validate the url value given by user
import { authorize } from "../middlewares/role.middleware.js";
const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/refresh", refresh);

router.get("/me", protect, authorize("user", "admin"), getMe);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, changePassword);

router.post("/logout", logout);

export default router;
