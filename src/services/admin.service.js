import User from "../models/user.model.js";
import Vehicle from "../models/vehicle.model.js";
import Booking from "../models/booking.model.js";

export const getDashboardStats = async () => {
  const [
    totalVehicles,
    totalBookings,
    totalCustomers,
    pendingBookings,
    confirmedBookings,
    activeBookings,
    completedBookings,
    cancelledBookings,
    revenueResult,
    recentBookings,
  ] = await Promise.all([
    Vehicle.countDocuments(),

    Booking.countDocuments(),

    User.countDocuments({ role: "user" }),

    Booking.countDocuments({ status: "pending" }),

    Booking.countDocuments({ status: "confirmed" }),

    Booking.countDocuments({ status: "active" }),

    Booking.countDocuments({ status: "completed" }),

    Booking.countDocuments({ status: "cancelled" }),

    Booking.aggregate([
      {
        $match: {
          status: {
            $in: ["confirmed", "active", "completed"],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalPrice",
          },
        },
      },
    ]),

    Booking.find()
      .populate("user", "name email")
      .populate("vehicle", "name brand model year pricePerDay")
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  const totalRevenue = revenueResult[0]?.totalRevenue || 0;

  return {
    stats: {
      totalVehicles,
      totalBookings,
      totalCustomers,
      totalRevenue,
      pendingBookings,
      confirmedBookings,
      activeBookings,
      completedBookings,
      cancelledBookings,
    },
    recentBookings,
  };
};
