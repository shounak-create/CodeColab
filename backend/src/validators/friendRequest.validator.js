import { param } from "express-validator";

export const userIdValidator = [
    param("userId")
        .isMongoId()
        .withMessage("Invalid user ID."),
];

export const requestIdValidator = [
    param("requestId")
        .isMongoId()
        .withMessage(
            "Invalid friend request ID."
        ),
];