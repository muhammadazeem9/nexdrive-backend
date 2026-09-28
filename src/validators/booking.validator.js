import AppError from "../utils/AppError.js";

export const validateCreateBooking = (req, res, next) => {
  const { vehicle, startDate, endDate } = req.body;
  // 1 check required feilds
  if (!vehicle || !startDate || !endDate) {
    throw new AppError("vehicle ,start date and end date is required", 400);
  }
  next();
};
