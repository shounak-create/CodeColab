import { Router } from "express";

import {
    sendRequest,
    getReceived,
    getSent,
    acceptRequest,
    rejectRequest,
    cancelRequest,
} from "../controllers/friendRequest.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

import { validate } from "../middlewares/validation.middleware.js";

import {
    userIdValidator,
    requestIdValidator,
} from "../validators/friendRequest.validator.js";

const router = Router();

router.use(authenticate);

router.post(
    "/:userId",
    userIdValidator,
    validate,
    sendRequest
);

router.get(
    "/received",
    getReceived
);

router.get(
    "/sent",
    getSent
);

router.patch(
    "/:requestId/accept",
    requestIdValidator,
    validate,
    acceptRequest
);

router.patch(
    "/:requestId/reject",
    requestIdValidator,
    validate,
    rejectRequest
);

router.delete(
    "/:requestId",
    requestIdValidator,
    validate,
    cancelRequest
);

export default router;