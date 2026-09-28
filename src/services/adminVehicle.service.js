import Booking from "../models/booking.model.js";

export const getPopularVehicles = async () => {
  const popularVehicles = await Booking.aggregate([
    // Ignore cancelled bookings
    {
      $match: {
        status: {
          $ne: "cancelled",
        },
      },
    },

    // Group bookings by vehicle
    {
      $group: {
        _id: "$vehicle",
        bookings: {
          $sum: 1,
        },
      },
    },

    // Most booked first
    {
      $sort: {
        bookings: -1,
      },
    },

    // Only top 5
    {
      $limit: 5,
    },

    // Get vehicle information
    {
      $lookup: {
        from: "vehicles",
        localField: "_id",
        foreignField: "_id",
        as: "vehicle",
      },
    },

    // Convert vehicle array to object
    {
      $unwind: "$vehicle",
    },

    // Return clean response
    {
      $project: {
        _id: 0,
        id: "$vehicle._id",
        name: "$vehicle.name",
        brand: "$vehicle.brand",
        model: "$vehicle.model",
        year: "$vehicle.year",
        pricePerDay: "$vehicle.pricePerDay",
        bookings: 1,
      },
    },
  ]);

  return popularVehicles;
};
