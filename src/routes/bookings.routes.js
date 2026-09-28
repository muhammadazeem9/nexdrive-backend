import express from "express";
const router = express.Router();

import {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingsById,
  updateBookingsStatus,
  cancelBooking,
  getCustomerBookings,
} from "../controllers/bookings.controller.js";
import { validateCreateBooking } from "../validators/booking.validator.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

router.get("/my-bookings", protect, getMyBookings);
router.post("/", protect, validateCreateBooking, createBooking);
router.patch("/:bookingId/cancel-booking", protect, cancelBooking);

// admin routes
router.get("/all-bookings", protect, authorize("admin"), getAllBookings);
router.get(
  "/customer/:customerId",
  protect,
  authorize("admin"),
  getCustomerBookings,
);
router.get("/:id", protect, authorize("admin"), getBookingsById);
router.patch("/:id/status", protect, authorize("admin"), updateBookingsStatus);

export default router;
