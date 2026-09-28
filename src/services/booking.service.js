import Booking from "../models/booking.model.js";
import Vehicle from "../models/vehicle.model.js";
import AppError from "../utils/AppError.js";

export const createBookingService = async ({
  userId,
  vehicle,
  startDate,
  endDate,
}) => {
  console.log("SERVICE USER ID:", userId);

  // find vehicle
  const vehicleData = await Vehicle.findById(vehicle);
  if (!vehicleData) {
    throw new AppError("Vehicle not found", 404);
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new AppError("Invalid date format", 400);
  }

  if (start >= end) {
    throw new AppError("End date must be after start date", 400);
  }

  const existingBook = await Booking.findOne({
    vehicle: vehicle,
    startDate: { $lt: end },
    endDate: { $gt: start },
  });

  if (existingBook) {
    throw new AppError("Vehicle already booked for these date", 400);
  }

  // Calculate total days
  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  const totalDays = Math.ceil((end - start) / millisecondsPerDay);

  // Calculate total price
  const totalPrice = totalDays * vehicleData.pricePerDay;

  // create booking
  const booking = await Booking.create({
    user: userId,
    vehicle: vehicleData._id,
    startDate: start,
    endDate: end,
    totalDays,
    totalPrice,
  });
  return booking;
};

export const getCustomerBookingsService = async (customerId) => {
  const bookings = await Booking.find({ user: customerId })
    .populate("vehicle", "name brand model year pricePerDay")
    .sort({ createdAt: -1 });

  return bookings;
};
