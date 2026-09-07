import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);

export default app;