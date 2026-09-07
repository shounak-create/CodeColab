import {
    sendFriendRequest,
    getReceivedRequests,
    getSentRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest,
} from "../services/friendRequest.service.js";

export const sendRequest = async (
    req,
    res
) => {
    try {
        const request =
            await sendFriendRequest(
                req.user.id,
                req.params.userId
            );

        return res.status(201).json({
            success: true,
            message:
                "Friend request sent successfully.",
            data: {
                request,
            },
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getReceived = async (
    req,
    res
) => {
    try {
        const requests =
            await getReceivedRequests(
                req.user.id
            );

        return res.status(200).json({
            success: true,
            data: {
                requests,
            },
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getSent = async (
    req,
    res
) => {
    try {
        const requests =
            await getSentRequests(
                req.user.id
            );

        return res.status(200).json({
            success: true,
            data: {
                requests,
            },
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const acceptRequest = async (
    req,
    res
) => {
    try {
        const request =
            await acceptFriendRequest(
                req.params.requestId,
                req.user.id
            );

        return res.status(200).json({
            success: true,
            message:
                "Friend request accepted.",
            data: {
                request,
            },
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const rejectRequest = async (
    req,
    res
) => {
    try {
        const request =
            await rejectFriendRequest(
                req.params.requestId,
                req.user.id
            );

        return res.status(200).json({
            success: true,
            message:
                "Friend request rejected.",
            data: {
                request,
            },
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const cancelRequest = async (
    req,
    res
) => {
    try {
        const request =
            await cancelFriendRequest(
                req.params.requestId,
                req.user.id
            );

        return res.status(200).json({
            success: true,
            message:
                "Friend request cancelled.",
            data: {
                request,
            },
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};