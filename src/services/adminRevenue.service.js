import Booking from "../models/booking.model.js";

export const getRevenueData = async (period = "1Y") => {
  const now = new Date();

  let startDate = new Date(now);
  let groupFormat;

  if (period === "7D") {
    startDate.setDate(now.getDate() - 7);
    groupFormat = "%Y-%m-%d";
  } else if (period === "30D") {
    startDate.setDate(now.getDate() - 30);
    groupFormat = "%Y-%m-%d";
  } else if (period === "1Y") {
    startDate.setFullYear(now.getFullYear() - 1);
    groupFormat = "%Y-%m";
  } else {
    throw new Error("Invalid revenue period");
  }

  const revenue = await Booking.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: now,
        },
        status: {
          $in: ["confirmed", "active", "completed"],
        },
      },
    },

    {
      $group: {
        _id: {
          $dateToString: {
            format: groupFormat,
            date: "$createdAt",
          },
        },

        revenue: {
          $sum: "$totalPrice",
        },

        bookings: {
          $sum: 1,
        },
      },
    },

    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  return revenue;
};
