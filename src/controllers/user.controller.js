import asyncHandler from "../utils/asyncHandler.js";
import {
  getCustomerByIdSevice,
  getCustomersService,
} from "../services/user.service.js";

export const getCustomers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = String(req.query.search || "");

  const data = await getCustomersService({ page, limit, search });

  res.status(200).json({ success: true, ...data });
});

export const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await getCustomerByIdSevice(req.params.id);

  res.status(200).json({
    success: true,
    customer,
  });
});
