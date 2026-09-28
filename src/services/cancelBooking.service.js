import Booking from "../models/booking.model.js";
import AppError from "../utils/AppError.js";

export const cancelBookingService = async (bookingId, userId) => {
  const booking = await Booking.findOne({
    _id: bookingId,
    user: userId,
  });

  if (!booking) {
    throw new AppError("Booking not found");
  }

  if (!["pending", "confirmed"].includes(booking.status)) {
    throw new AppError(
      `Booking cannot be cancelled because it is ${booking.status}`,
    );
  }

  booking.status = "cancelled";

  await booking.save();

  return booking;
};
