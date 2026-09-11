import { Router } from "express";

import {
    createMessage,
    getMessages,
    updateMessage,
    deleteMessage,
} from "../controllers/message.controller.js";

import {
    authenticate,
} from "../middlewares/auth.middleware.js";

import {
    validate,
} from "../middlewares/validation.middleware.js";

import {
    createMessageValidator,
    getMessagesValidator,
    updateMessageValidator,
    deleteMessageValidator,
} from "../validators/message.validator.js";

const router = Router();

router.use(authenticate);

router.post(
    "/:conversationId",
    createMessageValidator,
    validate,
    createMessage
);

router.get(
    "/:conversationId",
    getMessagesValidator,
    validate,
    getMessages
);

router.patch(
    "/:messageId",
    updateMessageValidator,
    validate,
    updateMessage
);

router.delete(
    "/:messageId",
    deleteMessageValidator,
    validate,
    deleteMessage
);

export default router;