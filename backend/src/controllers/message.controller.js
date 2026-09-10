import {
    createMessage as createMessageService,
    getConversationMessages,
    updateMessage as updateMessageService,
    deleteMessage as deleteMessageService,
} from "../services/message.service.js";

export const createMessage = async (
    req,
    res
) => {
    try {
        const message =
            await createMessageService(
                req.user.id,
                req.params.conversationId,
                req.body.content
            );

        return res.status(201).json({
            success: true,
            message:
                "Message sent successfully.",
            data: {
                message,
            },
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getMessages = async (
    req,
    res
) => {
    try {
        const result =
            await getConversationMessages(
                req.user.id,
                req.params.conversationId,
                req.query.page,
                req.query.limit
            );

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateMessage = async (
    req,
    res
) => {
    try {
        const message =
            await updateMessageService(
                req.user.id,
                req.params.messageId,
                req.body.content
            );

        return res.status(200).json({
            success: true,
            message:
                "Message updated successfully.",
            data: {
                message,
            },
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteMessage = async (
    req,
    res
) => {
    try {
        const message =
            await deleteMessageService(
                req.user.id,
                req.params.messageId
            );

        return res.status(200).json({
            success: true,
            message:
                "Message deleted successfully.",
            data: {
                message,
            },
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};