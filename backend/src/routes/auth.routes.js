import { Router } from "express";

import {
    register,
    login,
    refresh,
    logout,
    me,
} from "../controllers/auth.controller.js";

import {
    registerValidator,
    loginValidator,
} from "../validators/auth.validator.js";

import { validate } from "../middlewares/validation.middleware.js";

import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
    "/register",
    registerValidator,
    validate,
    register
);

router.post(
    "/login",
    loginValidator,
    validate,
    login
);

router.post(
    "/refresh",
    refresh
);

router.post(
    "/logout",
    logout
);

router.get(
    "/me",
    authenticate,
    me
);

export default router;