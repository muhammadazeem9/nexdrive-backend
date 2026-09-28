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
  }),
);
const port = process.env.PORT || 3000; //server runing port

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, "0.0.0.0", () => {
      console.log(`server is runing on port ${port}`);
    });
  } catch (error) {
    console.log("server failed to start", error.message);
  }
};

startServer();
