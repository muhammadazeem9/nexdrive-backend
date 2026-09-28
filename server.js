import dotenv from "dotenv";

dotenv.config();

const { default: app } = await import("./src/app.js");
const { default: connectDB } = await import("./src/config/database.js");

await connectDB();

export default app;
