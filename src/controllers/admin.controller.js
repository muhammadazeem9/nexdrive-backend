import { getDashboardStats } from "../services/admin.service.js";
import { getRevenueData } from "../services/adminRevenue.service.js";
import { getPopularVehicles } from "../services/adminVehicle.service.js";

import asyncHandler from "../utils/asyncHandler.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const result = await getDashboardStats();
  res.status(200).json({
    success: true,
    message: "dashboard stats",
    ...result,
  });
});

export const getRevenue = asyncHandler(async (req, res) => {
  const period = req.query.period || "1Y";

  const revenue = await getRevenueData(period);

  res.status(200).json({
    success: true,
    period,
    revenue,
  });
});

export const getPopularVehicle = asyncHandler(async (req, res) => {
  const vehicles = await getPopularVehicles();

  res.status(200).json({
    success: true,
    count: vehicles.length,
    vehicles,
  });
});
