import dotenv from "dotenv"; // Loads environment variables
import app from "./src/app.js"; // start app server
import connectDB from "./src/config/database.js";
import cors from "cors";

dotenv.config();

await connectDB();

export default app;
