import { Router } from "express";

import {
    getMe,
    getProfile,
    updateMyProfile,
    updateEmail,
    updatePassword,
    search,
} from "../controllers/user.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

import { validate } from "../middlewares/validation.middleware.js";

import {
    updateProfileValidator,
    updateEmailValidator,
    updatePasswordValidator,
    searchUsersValidator,
} from "../validators/user.validator.js";

const router = Router();

router.get(
    "/search",
    authenticate,
    searchUsersValidator,
    validate,
    search
);

router.get(
    "/me",
    authenticate,
    getMe
);

router.patch(
    "/me",
    authenticate,
    updateProfileValidator,
    validate,
    updateMyProfile
);

router.patch(
    "/me/email",
    authenticate,
    updateEmailValidator,
    validate,
    updateEmail
);

router.patch(
    "/me/password",
    authenticate,
    updatePasswordValidator,
    validate,
    updatePassword
);

router.get(
    "/:username",
    getProfile
);

export default router;