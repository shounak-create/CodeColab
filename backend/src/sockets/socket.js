import { Server } from "socket.io";

import {
    authenticateSocket,
} from "./socket.auth.js";

import {
    addUserSocket,
    removeUserSocket,
    isUserOnline,
} from "./socket.manager.js";

export const initializeSocket =
    (httpServer) => {
        const io = new Server(
            httpServer,
            {
                cors: {
                    origin:
                        "http://localhost:3000",
                    credentials: true,
                },
            }
        );

        io.use(
            authenticateSocket
        );

        io.on(
            "connection",
            (socket) => {
                const userId =
                    socket.user.id;

                addUserSocket(
                    userId,
                    socket.id
                );

                socket.join(
                    `user:${userId}`
                );

                console.log(
                    `Socket connected: ${socket.id} | User: ${userId}`
                );

                socket.emit(
                    "socket:connected",
                    {
                        success: true,
                        socketId:
                            socket.id,
                        userId,
                        online:
                            isUserOnline(
                                userId
                            ),
                    }
                );

                socket.on(
                    "disconnect",
                    (reason) => {
                        removeUserSocket(
                            userId,
                            socket.id
                        );

                        console.log(
                            `Socket disconnected: ${socket.id} | User: ${userId} | Reason: ${reason}`
                        );
                    }
                );
            }
        );

        return io;
    };