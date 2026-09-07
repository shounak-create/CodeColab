import { body, query } from "express-validator";

export const updateProfileValidator = [
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage(
            "Name must be between 2 and 50 characters."
        ),

    body("username")
        .optional()
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage(
            "Username must be between 3 and 30 characters."
        )
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage(
            "Username can only contain letters, numbers and underscores."
        ),

    body("avatar")
        .optional({ nullable: true })
        .isURL()
        .withMessage(
            "Avatar must be a valid URL."
        ),
];

export const updateEmailValidator = [
    body("email")
        .trim()
        .isEmail()
        .withMessage(
            "Please provide a valid email."
        )
        .normalizeEmail(),
];

export const updatePasswordValidator = [
    body("currentPassword")
        .notEmpty()
        .withMessage(
            "Current password is required."
        ),

    body("newPassword")
        .isLength({ min: 8 })
        .withMessage(
            "New password must be at least 8 characters."
        ),
];

export const searchUsersValidator = [
    query("q")
        .trim()
        .notEmpty()
        .withMessage(
            "Search query is required."
        )
        .isLength({ min: 2 })
        .withMessage(
            "Search query must be at least 2 characters."
        ),
];