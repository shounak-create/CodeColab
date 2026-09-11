import jwt from "jsonwebtoken";
import { generateAccessToken,generateRefreshToken,verifyAccessToken,verifyRefreshToken } from "../utils/token.util.js";

export const authenticateSocket = (
    socket,
    next
) => {
    try {
        const token =
            socket.handshake.auth?.token;

        if (!token) {
            return next(
                new Error(
                    "Authentication token is required."
                )
            );
        }

        const decoded = verifyAccessToken(token);

        socket.user = {
            id: decoded.id,
        };

        next();
    } catch (error) {
        return next(
            new Error(
                "Invalid or expired authentication token."
            )
        );
    }
};