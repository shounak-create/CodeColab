import { Server } from "socket.io";

import {
    authenticateSocket,
} from "./socket.auth.js";

import {
    addUserSocket,
    removeUserSocket,
    isUserOnline,
} from "./socket.manager.js";

import {
    createMessage,
} from "../services/message.service.js";

import Conversation from "../models/conversation.model.js";

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
                    "conversation:join",
                    async (
                        conversationId
                    ) => {
                        try {
                            const conversation =
                                await Conversation.findOne(
                                    {
                                        _id: conversationId,
                                        members: userId,
                                    }
                                );

                            if (
                                !conversation
                            ) {
                                return socket.emit(
                                    "conversation:error",
                                    {
                                        success:
                                            false,
                                        message:
                                            "Conversation not found or you are not a member.",
                                    }
                                );
                            }

                            socket.join(
                                `conversation:${conversationId}`
                            );

                            socket.emit(
                                "conversation:joined",
                                {
                                    success:
                                        true,
                                    conversationId,
                                }
                            );
                        } catch (error) {
                            socket.emit(
                                "conversation:error",
                                {
                                    success:
                                        false,
                                    message:
                                        "Unable to join conversation.",
                                }
                            );
                        }
                    }
                );

                socket.on(
                    "message:send",
                    async (data) => {
                        try {
                            const {
                                conversationId,
                                content,
                            } = data || {};

                            if (
                                !conversationId ||
                                !content
                            ) {
                                return socket.emit(
                                    "message:error",
                                    {
                                        success:
                                            false,
                                        message:
                                            "Conversation ID and message content are required.",
                                    }
                                );
                            }

                            const message =
                                await createMessage(
                                    userId,
                                    conversationId,
                                    content
                                );

                            io.to(
                                `conversation:${conversationId}`
                            ).emit(
                                "message:new",
                                {
                                    success:
                                        true,
                                    message,
                                }
                            );
                        } catch (error) {
                            socket.emit(
                                "message:error",
                                {
                                    success:
                                        false,
                                    message:
                                        error.message,
                                }
                            );
                        }
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