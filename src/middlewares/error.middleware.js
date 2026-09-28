export const errorHandler = (err, req, res, next) => {
  console.error(err); // Prints the error in the console

  const statuscode = err.statuscode || 500; // Uses the error status code or defaults to 500

  res.status(statuscode).json({
    sccess: false, // Indicates that the request was unsuccessful
    message: err.message || "Internal server error", // Sends the error message or a default message
  });
};
