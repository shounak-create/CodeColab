import { Router } from "express";

import {
    createConversation,
    getConversations,
    getConversation,
    getConversationWithUser,
} from "../controllers/conversation.controller.js";

import {
    authenticate,
} from "../middlewares/auth.middleware.js";

import {
    validate,
} from "../middlewares/validation.middleware.js";

import {
    conversationUserIdValidator,
    conversationIdValidator,
} from "../validators/conversation.validator.js";

const router = Router();

router.use(authenticate);

router.get(
    "/",
    getConversations
);

router.post(
    "/:userId",
    conversationUserIdValidator,
    validate,
    createConversation
);

router.get(
    "/with/:userId",
    conversationUserIdValidator,
    validate,
    getConversationWithUser
);

router.get(
    "/:conversationId",
    conversationIdValidator,
    validate,
    getConversation
);

export default router;