import asyncHandler from "../utils/asyncHandler.js";
import Booking from "../models/booking.model.js";
import AppError from "../utils/AppError.js";
import {
  createBookingService,
  getCustomerBookingsService,
} from "../services/booking.service.js";
import { cancelBookingService } from "../services/cancelBooking.service.js";

export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user.userId })
    // .populate("vehicle", "name brand model year pricePerDay")
    .populate("vehicle")
    .sort({ createdAt: -1 });
  res.json({
    success: true,
    count: bookings.length,
    bookings,
  });
});

export const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate("user", "name email")
    .populate("vehicle", "name model brand year pricePerDay")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    bookings,
  });
});

export const getBookingsById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("user", "name email")
    .populate("vehicle", "name brand model year pricePerDay");

  if (!booking) {
    throw new AppError("Booking not found", 400);
  }
  res.status(200).json({
    success: true,
    booking,
  });
});

export const updateBookingsStatus = asyncHandler(async (req, res) => {
  const allowedTransitions = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["active", "cancelled"],
    active: ["completed"],
    completed: [],
    cancelled: [],
  };

  const { status } = req.body;

  const allowedStatus = [
    "pending",
    "confirmed",
    "active",
    "completed",
    "cancelled",
  ];

  if (!allowedStatus.includes(status)) {
    throw new AppError("Invalid booking status", 400);
  }

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  const currentStatus = booking.status;
  const allowedNextStatuses = allowedTransitions[currentStatus] || [];

  if (!allowedNextStatuses.includes(status)) {
    throw new AppError(
      `Booking cannot move from ${currentStatus} to ${status}`,
      400,
    );
  }

  booking.status = status;

  await booking.save();

  res.status(200).json({
    success: true,
    message: "Booking updated successfully",
    booking,
  });
});

export const createBooking = asyncHandler(async (req, res) => {
  console.log("REQ.USER:", req.user);
  console.log("USER ID:", req.user?.userId);

  const booking = await createBookingService({
    userId: req.user.userId,
    vehicle: req.body.vehicle,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  });

  res.status(201).json({
    message: "booking create successfully",
    booking,
  });
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user.userId;

  if (!bookingId) {
    throw new AppError("Booking Id is required", 400);
  }

  const booking = await cancelBookingService(bookingId, userId);

  res.status(200).json({
    success: true,
    message: "Booking cancelled successfully",
    booking,
  });
});

export const getCustomerBookings = asyncHandler(async (req, res) => {
  const { customerId } = req.params;

  if (!customerId) {
    throw new AppError("Customer ID is required", 400);
  }

  const bookings = await getCustomerBookingsService(customerId);

  res.status(200).json({
    success: true,
    count: bookings.length,
    bookings,
  });
});
