import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import {
  getCustomerById,
  getCustomers,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/customers", protect, authorize("admin"), getCustomers);

router.get("/customers/:id", protect, authorize("admin"), getCustomerById);

export default router;
