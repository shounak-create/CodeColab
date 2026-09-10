import { Router } from "express";

import {
    getMyFriends,
    checkFriendship,
    removeFriend,
} from "../controllers/friendship.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

import { validate } from "../middlewares/validation.middleware.js";

import {
    friendIdValidator,
} from "../validators/friend.validator.js";

const router = Router();

router.use(authenticate);

router.get(
    "/",
    getMyFriends
);

router.get(
    "/check/:userId",
    friendIdValidator,
    validate,
    checkFriendship
);

router.delete(
    "/:userId",
    friendIdValidator,
    validate,
    removeFriend
);

export default router;