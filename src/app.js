import express from "express"; // Imports Express to create the server
import vehiclesRoutes from "./routes/vehicles.routes.js"; // Imports vehicle-related routes
import bookingsRoutes from "./routes/bookings.routes.js"; // Imports booking-related routes
import authRouter from "./routes/auth.routes.js"; //Imports auth-related routes
import adminRoutes from "./routes/admin.routes.js"; //Imports admin-related routes
import userRoutes from "./routes/user.routes.js"; //Import user related routes
import paymentsRoutes from "./routes/payments.routes.js"; //Import payments related routes
import { errorHandler } from "./middlewares/error.middleware.js"; // Imports the error-handling middleware
import CookieParser from "cookie-parser";

const app = express(); // Creates an Express application

const allowedOrigins = [
  "http://localhost:5173",
  "https://nex-drive-react-app-git-dev-nexdrive-m-azeem.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json()); // Middleware to parse incoming JSON data
app.use(CookieParser());

// health check live server is runing or not
app.get("/", (req, res) => {
  res.send("nexdrive server is runing");
});

// ==================================routes==========
// Vehicle routes
app.use("/api/vehicles", vehiclesRoutes); // Handles all requests starting with /api/vehicles
// Booking routes
app.use("/api/bookings", bookingsRoutes); // Handles all requests starting with /api/bookings
// auth routes
app.use("/api/auth", authRouter); // Handles all requests starting with /api/user

// admin routes
app.use("/api/admin", adminRoutes); //Handle all request starting with /api/admin
// user routes
app.use("/api/users", userRoutes); //Handle all request starting with /api/users

app.use("/api/payments", paymentsRoutes); //Handle all request starting with /api/payments

app.use(errorHandler); // Handles errors that occur in the application

export default app; // Exports the Express app for use in the server file
