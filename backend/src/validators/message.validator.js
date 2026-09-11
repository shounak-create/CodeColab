import {
    param,
    body,
    query,
} from "express-validator";

export const createMessageValidator = [
    param("conversationId")
        .isMongoId()
        .withMessage(
            "Invalid conversation ID."
        ),

    body("content")
        .isString()
        .withMessage(
            "Message content must be a string."
        )
        .trim()
        .notEmpty()
        .withMessage(
            "Message content cannot be empty."
        )
        .isLength({
            max: 5000,
        })
        .withMessage(
            "Message cannot exceed 5000 characters."
        ),
];

export const getMessagesValidator = [
    param("conversationId")
        .isMongoId()
        .withMessage(
            "Invalid conversation ID."
        ),

    query("page")
        .optional()
        .isInt({
            min: 1,
        })
        .withMessage(
            "Page must be at least 1."
        )
        .toInt(),

    query("limit")
        .optional()
        .isInt({
            min: 1,
            max: 100,
        })
        .withMessage(
            "Limit must be between 1 and 100."
        )
        .toInt(),
];

export const updateMessageValidator = [
    param("messageId")
        .isMongoId()
        .withMessage(
            "Invalid message ID."
        ),

    body("content")
        .isString()
        .withMessage(
            "Message content must be a string."
        )
        .trim()
        .notEmpty()
        .withMessage(
            "Message content cannot be empty."
        )
        .isLength({
            max: 5000,
        })
        .withMessage(
            "Message cannot exceed 5000 characters."
        ),
];

export const deleteMessageValidator = [
    param("messageId")
        .isMongoId()
        .withMessage(
            "Invalid message ID."
        ),
];