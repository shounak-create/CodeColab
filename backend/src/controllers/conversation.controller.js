import {
    createDirectConversation,
    getMyConversations,
    getConversationById,
    getDirectConversation,
} from "../services/conversation.service.js";

export const createConversation = async (
    req,
    res
) => {
    try {
        const conversation =
            await createDirectConversation(
                req.user.id,
                req.params.userId
            );

        return res.status(201).json({
            success: true,
            message:
                "Conversation created successfully.",
            data: {
                conversation,
            },
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getConversations = async (
    req,
    res
) => {
    try {
        const conversations =
            await getMyConversations(
                req.user.id
            );

        return res.status(200).json({
            success: true,
            data: {
                conversations,
            },
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getConversation = async (
    req,
    res
) => {
    try {
        const conversation =
            await getConversationById(
                req.params.conversationId,
                req.user.id
            );

        return res.status(200).json({
            success: true,
            data: {
                conversation,
            },
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

export const getConversationWithUser =
    async (req, res) => {
        try {
            const conversation =
                await getDirectConversation(
                    req.user.id,
                    req.params.userId
                );

            return res.status(200).json({
                success: true,
                data: {
                    conversation,
                },
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    };