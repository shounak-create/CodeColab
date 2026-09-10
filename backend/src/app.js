import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.route.js";
import friendRequestRoutes from "./routes/friendRequest.route.js";
import friendshipRoutes from "./routes/friendship.route.js";
import conversationRoutes from "./routes/conversation.route.js";

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
app.use("/api/users", userRoutes);
app.use("/api/friend-requests",friendRequestRoutes);
app.use("/api/friendships",friendshipRoutes);
app.use("/api/conversation",conversationRoutes);

export default app;