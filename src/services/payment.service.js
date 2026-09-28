import Payment from "../models/payment.model.js";
import Booking from "../models/booking.model.js";
import AppError from "../utils/AppError.js";

export const getAllPaymentsService = async ({
  search = "",
  status,
  method,
  page = 1,
  limit = 10,
}) => {
  const skip = (page - 1) * limit;

  const filter = {};

  // Status filter
  if (status && status !== "All") {
    filter.status = status;
  }

  // Method filter
  if (method && method !== "All") {
    filter.method = method;
  }

  const payments = await Payment.find(filter)
    .populate("user", "name email")
    .populate({
      path: "booking",
      select: "vehicle totalDays totalPrice startDate endDate",
      populate: {
        path: "vehicle",
        select: "name brand model",
      },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Payment.countDocuments(filter);

  // Search populated fields
  let filteredPayments = payments;

  if (search) {
    const searchValue = search.toLowerCase();

    filteredPayments = payments.filter((payment) => {
      return (
        payment._id.toString().toLowerCase().includes(searchValue) ||
        payment.transactionId?.toLowerCase().includes(searchValue) ||
        payment.user?.name?.toLowerCase().includes(searchValue) ||
        payment.user?.email?.toLowerCase().includes(searchValue) ||
        payment.booking?._id?.toString().toLowerCase().includes(searchValue) ||
        payment.booking?.vehicle?.name?.toLowerCase().includes(searchValue)
      );
    });
  }

  return {
    payments: filteredPayments,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const createPaymentService = async ({
  bookingId,
  userId,
  method,
  transactionId,
}) => {
  // Find booking
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  // Make sure booking belongs to logged-in user
  if (booking.user.toString() !== userId.toString()) {
    throw new AppError("You are not allowed to pay for this booking", 403);
  }

  // Check if payment already exists
  const existingPayment = await Payment.findOne({
    booking: bookingId,
  });

  if (existingPayment) {
    throw new AppError("Payment already exists for this booking", 409);
  }

  // Create payment using booking totalPrice
  const payment = await Payment.create({
    booking: booking._id,
    user: booking.user,
    amount: booking.totalPrice,
    method,
    status: "Paid",
    transactionId,
  });

  return payment;
};
