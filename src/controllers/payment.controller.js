import asyncHandler from "../utils/asyncHandler.js";

import {
  getAllPaymentsService,
  createPaymentService,
} from "../services/payment.service.js";

export const getAllPayments = asyncHandler(async (req, res) => {
  const { search = "", status, method, page = 1, limit = 10 } = req.query;

  const result = await getAllPaymentsService({
    search,
    status,
    method,
    page,
    limit,
  });

  res.status(200).json({
    success: true,
    message: "Payments fetched successfully",
    ...result,
  });
});

export const createPayment = asyncHandler(async (req, res) => {
  const { bookingId, method, transactionId } = req.body;

  const payment = await createPaymentService({
    bookingId,
    userId: req.user.userId,
    method,
    transactionId,
  });

  res.status(201).json({
    success: true,
    message: "Payment created successfully",
    payment,
  });
});
