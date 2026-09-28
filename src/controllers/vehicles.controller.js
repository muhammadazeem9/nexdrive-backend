import mongoose from "mongoose";
import Vehicle from "../models/vehicle.model.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getVehicles } from "../services/vehicle.service.js";

// get all vehicles
export const getAllVehicles = asyncHandler(async (req, res) => {
  const result = await getVehicles(req.query);
  res.status(200).json({
    success: true, // Request was successful
    count: result.vehicles.length, // Number of vehicles in current page
    ...result, // Vehicle data for current page
  });
});

// get vehicle by id
export const getVehicleById = asyncHandler(async (req, res) => {
  // Check if the ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new AppError("Invalid vehicle ID", 400);
  }

  const vehicle = await Vehicle.findById(req.params.id);

  // Vehicle doesn't exist
  if (!vehicle) {
    throw new AppError("Vehicle not found", 404);
  }

  res.status(200).json({
    success: true,
    vehicle,
  });
});

// creates vehicles
export const createVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.create(req.body);

  res.status(201).json({
    success: true,
    message: "Vehicle created successfully",
    vehicle,
  });
});

// update vehicles
export const updateVehicle = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new AppError("Invalid vehicle id", 400);
  }

  const updateVehicle = await Vehicle.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true },
  );
  if (!updateVehicle) {
    throw new AppError("Vehicle not found", 404);
  }
  res.status(200).json({
    success: true,
    message: "Vehicle updated successfully",
    updateVehicle,
  });
});

// delete vehicle
export const deleteVehicle = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new AppError("Invalid vehicle ID", 400);
  }

  const deleteVehicle = await Vehicle.findByIdAndDelete(req.params.id);

  if (!deleteVehicle) {
    throw new AppError("Vehicle not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Vehicle deleted successfully",
    deleteVehicle,
  });
});
