import {
    getFriends,
    areFriends,
    removeFriendship,
} from "../services/friendship.service.js";

export const getMyFriends = async (
    req,
    res
) => {
    try {
        const friends =
            await getFriends(
                req.user.id
            );

        return res.status(200).json({
            success: true,
            data: {
                friends,
            },
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const checkFriendship = async (
    req,
    res
) => {
    try {
        const isFriend =
            await areFriends(
                req.user.id,
                req.params.userId
            );

        return res.status(200).json({
            success: true,
            data: {
                isFriend,
            },
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const removeFriend = async (
    req,
    res
) => {
    try {
        await removeFriendship(
            req.user.id,
            req.params.userId
        );

        return res.status(200).json({
            success: true,
            message:
                "Friend removed successfully.",
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};