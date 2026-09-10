import mongoose from "mongoose";

import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

const validateObjectId = (
    value,
    message
) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error(message);
    }
};

const getConversationForMember = async (
    conversationId,
    userId
) => {
    const conversation =
        await Conversation.findOne({
            _id: conversationId,
            members: userId,
        });

    if (!conversation) {
        throw new Error(
            "Conversation not found or you are not a member."
        );
    }

    return conversation;
};

export const createMessage = async (
    userId,
    conversationId,
    content
) => {
    validateObjectId(
        conversationId,
        "Invalid conversation ID."
    );

    if (
        typeof content !== "string" ||
        content.trim().length === 0
    ) {
        throw new Error(
            "Message content cannot be empty."
        );
    }

    const trimmedContent = content.trim();

    if (trimmedContent.length > 5000) {
        throw new Error(
            "Message cannot exceed 5000 characters."
        );
    }

    const conversation =
        await getConversationForMember(
            conversationId,
            userId
        );

    const message =
        await Message.create({
            conversation: conversation._id,
            sender: userId,
            content: trimmedContent,
            type: "text",
        });

    await Conversation.findByIdAndUpdate(
        conversation._id,
        {
            $set: {
                updatedAt: new Date(),
            },
        }
    );

    await message.populate(
        "sender",
        "name username avatar status"
    );

    return message;
};

export const getConversationMessages =
    async (
        userId,
        conversationId,
        page = 1,
        limit = 50
    ) => {
        validateObjectId(
            conversationId,
            "Invalid conversation ID."
        );

        await getConversationForMember(
            conversationId,
            userId
        );

        const currentPage = Math.max(
            1,
            Number(page) || 1
        );

        const currentLimit = Math.min(
            100,
            Math.max(1, Number(limit) || 50)
        );

        const skip =
            (currentPage - 1) *
            currentLimit;

        const [
            messages,
            totalMessages,
        ] = await Promise.all([
            Message.find({
                conversation: conversationId,
            })
                .populate(
                    "sender",
                    "name username avatar status"
                )
                .sort({
                    createdAt: -1,
                })
                .skip(skip)
                .limit(currentLimit),

            Message.countDocuments({
                conversation: conversationId,
            }),
        ]);

        const totalPages = Math.ceil(
            totalMessages / currentLimit
        );

        return {
            messages,
            pagination: {
                page: currentPage,
                limit: currentLimit,
                totalMessages,
                totalPages,
                hasNextPage:
                    currentPage < totalPages,
                hasPreviousPage:
                    currentPage > 1,
            },
        };
    };

export const updateMessage = async (
    userId,
    messageId,
    content
) => {
    validateObjectId(
        messageId,
        "Invalid message ID."
    );

    if (
        typeof content !== "string" ||
        content.trim().length === 0
    ) {
        throw new Error(
            "Message content cannot be empty."
        );
    }

    const trimmedContent = content.trim();

    if (trimmedContent.length > 5000) {
        throw new Error(
            "Message cannot exceed 5000 characters."
        );
    }

    const message =
        await Message.findOneAndUpdate(
            {
                _id: messageId,
                sender: userId,
            },
            {
                $set: {
                    content: trimmedContent,
                },
            },
            {
                new: true,
                runValidators: true,
            }
        ).populate(
            "sender",
            "name username avatar status"
        );

    if (!message) {
        throw new Error(
            "Message not found or you are not allowed to edit it."
        );
    }

    return message;
};

export const deleteMessage = async (
    userId,
    messageId
) => {
    validateObjectId(
        messageId,
        "Invalid message ID."
    );

    const message =
        await Message.findOneAndDelete({
            _id: messageId,
            sender: userId,
        });

    if (!message) {
        throw new Error(
            "Message not found or you are not allowed to delete it."
        );
    }

    return message;
};