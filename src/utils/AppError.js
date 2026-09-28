class AppError extends Error {
  // Called automatically when the class is instantiated
  constructor(message, statuscode) {
    super(message); // Calls the parent Error constructor

    this.message = message; // Stores the error message
    this.statuscode = statuscode; // Stores the HTTP status code

    Error.captureStackTrace(this, this.constructor); // Captures the stack trace
  }
}

export default AppError;
