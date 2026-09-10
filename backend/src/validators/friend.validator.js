import { param } from "express-validator";

export const friendIdValidator = [
    param("userId")
        .isMongoId()
        .withMessage(
            "Invalid user ID."
        ),
];