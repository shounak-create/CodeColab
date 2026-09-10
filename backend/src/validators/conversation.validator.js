import { param } from "express-validator";

export const conversationUserIdValidator = [
    param("userId")
        .isMongoId()
        .withMessage("Invalid user ID."),
];

export const conversationIdValidator = [
    param("conversationId")
        .isMongoId()
        .withMessage(
            "Invalid conversation ID."
        ),
];