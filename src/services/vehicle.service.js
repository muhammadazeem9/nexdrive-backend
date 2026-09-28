import Vehicle from "../models/vehicle.model.js";

export const getVehicles = async ({
  search,
  brand,
  year,
  model,
  minPrice,
  maxPrice,
  minRating,
  sort,
  page = 1,
  limit = 20,
}) => {
  const filter = {};

  // Search
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
      { model: { $regex: search, $options: "i" } },
    ];
  }

  // Brand
  if (brand) {
    const brands = Array.isArray(brand) ? brand : brand.split(",");

    if (brands.length > 0) {
      filter.brand = {
        $in: brands,
      };
    }
  }

  // Year
  if (year) {
    filter.year = Number(year);
  }

  // Model
  if (model) {
    filter.model = model;
  }

  // Price
  if (minPrice || maxPrice) {
    filter.pricePerDay = {};

    if (minPrice) {
      filter.pricePerDay.$gte = Number(minPrice);
    }

    if (maxPrice) {
      filter.pricePerDay.$lte = Number(maxPrice);
    }
  }

  // Rating
  if (minRating) {
    filter.rating = {
      $gte: Number(minRating),
    };
  }

  // Sorting
  let sortOption = {};

  switch (sort) {
    case "price_asc":
      sortOption.pricePerDay = 1;
      break;

    case "price_desc":
      sortOption.pricePerDay = -1;
      break;

    case "rating":
      sortOption.rating = -1;
      break;

    case "newest":
    default:
      sortOption.createdAt = -1;
      break;
  }

  // Pagination
  const currentPage = Number(page);
  const itemsPerPage = Number(limit);

  const skip = (currentPage - 1) * itemsPerPage;

  const vehicles = await Vehicle.find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(itemsPerPage);

  const totalVehicles = await Vehicle.countDocuments(filter);

  const totalPages = Math.ceil(totalVehicles / itemsPerPage);

  return {
    vehicles,
    totalPages,
    totalVehicles,
    currentPage,
    itemsPerPage,
  };
};
