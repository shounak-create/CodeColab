import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// import healthRoutes from "./routes/health.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CodeColab API is running",
  });
});

export default app;