import mongoose from "mongoose";

import User from "../models/user.model.js";
import FriendRequest from "../models/friendRequest.model.js";
import Friendship from "../models/friendship.model.js";

import {
    normalizeUserPair,
} from "../utils/friendship.util.js";

export const createFriendship = async (
    userIdA,
    userIdB
) => {
    if (userIdA === userIdB) {
        throw new Error(
            "A user cannot be friends with themselves."
        );
    }

    if (
        !mongoose.Types.ObjectId.isValid(
            userIdA
        ) ||
        !mongoose.Types.ObjectId.isValid(
            userIdB
        )
    ) {
        throw new Error("Invalid user ID.");
    }

    const [userA, userB] =
        await Promise.all([
            User.findById(userIdA),
            User.findById(userIdB),
        ]);

    if (!userA || !userB) {
        throw new Error(
            "One or both users do not exist."
        );
    }

    const {
        user1,
        user2,
    } = normalizeUserPair(
        userIdA,
        userIdB
    );

    const existingFriendship =
        await Friendship.findOne({
            user1,
            user2,
        });

    if (existingFriendship) {
        return existingFriendship;
    }

    const friendship =
        await Friendship.create({
            user1,
            user2,
        });

    return friendship;
};

export const getFriends = async (
    userId
) => {
    if (
        !mongoose.Types.ObjectId.isValid(userId)
    ) {
        throw new Error("Invalid user ID.");
    }

    const friendships =
        await Friendship.find({
            $or: [
                { user1: userId },
                { user2: userId },
            ],
        })
            .populate(
                "user1",
                "name username avatar status"
            )
            .populate(
                "user2",
                "name username avatar status"
            )
            .sort({
                createdAt: -1,
            });

    const friends =
        friendships.map(
            (friendship) => {
                if (
                    friendship.user1._id.toString() ===
                    userId
                ) {
                    return friendship.user2;
                }

                return friendship.user1;
            }
        );

    return friends;
};

export const areFriends = async (
    userIdA,
    userIdB
) => {
    if (
        !mongoose.Types.ObjectId.isValid(
            userIdA
        ) ||
        !mongoose.Types.ObjectId.isValid(
            userIdB
        )
    ) {
        throw new Error("Invalid user ID.");
    }

    if (userIdA === userIdB) {
        return false;
    }

    const {
        user1,
        user2,
    } = normalizeUserPair(
        userIdA,
        userIdB
    );

    const friendship =
        await Friendship.exists({
            user1,
            user2,
        });

    return Boolean(friendship);
};

export const removeFriendship = async (
    userId,
    friendId
) => {
    if (
        !mongoose.Types.ObjectId.isValid(
            friendId
        )
    ) {
        throw new Error(
            "Invalid friend ID."
        );
    }

    if (userId === friendId) {
        throw new Error(
            "You cannot remove yourself as a friend."
        );
    }

    const {
        user1,
        user2,
    } = normalizeUserPair(
        userId,
        friendId
    );

    const friendship =
        await Friendship.findOneAndDelete({
            user1,
            user2,
        });

    if (!friendship) {
        throw new Error(
            "Friendship not found."
        );
    }

    return friendship;
};