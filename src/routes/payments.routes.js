import express from "express";
import {
  createPayment,
  getAllPayments,
} from "../controllers/payment.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
const router = express.Router();

router.get("/", protect, authorize("admin"), getAllPayments);
router.post("/", protect, createPayment);

export default router;
