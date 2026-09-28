import dotenv from "dotenv"; // Loads environment variables
import app from "./src/app.js"; // start app server
import connectDB from "./src/config/database.js";
import cors from "cors";

dotenv.config();

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

await connectDB();

export default app;
