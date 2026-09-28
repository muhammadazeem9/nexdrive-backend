import express from "express";
import {
  getDashboard,
  getPopularVehicle,
  getRevenue,
} from "../controllers/admin.controller.js";
import { authorize } from "../middlewares/role.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/dashboard", protect, authorize("admin"), getDashboard);
router.get("/revenue", protect, authorize("admin"), getRevenue);
router.get("/popular-vehicles", protect, authorize("admin"), getPopularVehicle);

export default router;
