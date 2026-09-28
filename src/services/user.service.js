import mongoose from "mongoose";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";

export const getCustomersService = async ({
  page = 1,
  limit = 10,
  search = "",
}) => {
  const skip = (page - 1) * limit;
  const filter = {
    role: "user",
  };

  if (search.trim()) {
    filter.$or = [
      {
        name: {
          $regex: search.trim(),
          $options: "i",
        },
      },
      {
        email: {
          $regex: search.trim(),
          $options: "i",
        },
      },
    ];
  }

  const [customers, total] = await Promise.all([
    User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    User.countDocuments(filter),
  ]);

  return {
    customers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getCustomerByIdSevice = async (customerId) => {
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    throw new AppError("Invalid customer id", 404);
  }

  const customer = await User.findOne({
    _id: customerId,
    role: "user",
  }).select("-password");

  if (!customer) {
    throw new AppError("customer not found", 404);
  }

  return customer;
};
