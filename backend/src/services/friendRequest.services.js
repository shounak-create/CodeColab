import mongoose from "mongoose";

import User from "../models/user.model.js";
import FriendRequest from "../models/friendRequest.model.js";

import {
    createFriendship,
} from "./friendship.service.js";

export const sendFriendRequest = async (
    senderId,
    receiverId
) => {
    if (senderId === receiverId) {
        throw new Error(
            "You cannot send a friend request to yourself."
        );
    }

    if (
        !mongoose.Types.ObjectId.isValid(receiverId)
    ) {
        throw new Error("Invalid user ID.");
    }

    const receiver = await User.findById(receiverId);

    if (!receiver) {
        throw new Error("User not found.");
    }

    const existingRequest =
        await FriendRequest.findOne({
            $or: [
                {
                    sender: senderId,
                    receiver: receiverId,
                    status: "pending",
                },
                {
                    sender: receiverId,
                    receiver: senderId,
                    status: "pending",
                },
            ],
        });

    if (existingRequest) {
        if (
            existingRequest.sender.toString() ===
            senderId
        ) {
            throw new Error(
                "Friend request already sent."
            );
        }

        throw new Error(
            "This user has already sent you a friend request. Accept it instead."
        );
    }

    const request = await FriendRequest.create({
        sender: senderId,
        receiver: receiverId,
    });

    await request.populate(
        "receiver",
        "name username avatar status"
    );

    return request;
};

export const getReceivedRequests = async (
    userId
) => {
    const requests =
        await FriendRequest.find({
            receiver: userId,
            status: "pending",
        })
            .populate(
                "sender",
                "name username avatar status"
            )
            .sort({
                createdAt: -1,
            });

    return requests;
};

export const getSentRequests = async (
    userId
) => {
    const requests =
        await FriendRequest.find({
            sender: userId,
            status: "pending",
        })
            .populate(
                "receiver",
                "name username avatar status"
            )
            .sort({
                createdAt: -1,
            });

    return requests;
};

export const acceptFriendRequest = async (
    requestId,
    userId
) => {
    if (
        !mongoose.Types.ObjectId.isValid(requestId)
    ) {
        throw new Error(
            "Invalid friend request ID."
        );
    }

    const request =
        await FriendRequest.findOneAndUpdate(
            {
                _id: requestId,
                receiver: userId,
                status: "pending",
            },
            {
                $set: {
                    status: "accepted",
                },
            },
            {
                new: true,
            }
        ).populate(
            "sender",
            "name username avatar status"
        );

    if (!request) {
        throw new Error(
            "Friend request not found or cannot be accepted."
        );
    }

    await createFriendship(
        request.sender._id.toString(),
        request.receiver.toString()
    );

    return request;
};

export const rejectFriendRequest = async (
    requestId,
    userId
) => {
    if (
        !mongoose.Types.ObjectId.isValid(requestId)
    ) {
        throw new Error("Invalid friend request ID.");
    }

    const request =
        await FriendRequest.findOneAndUpdate(
            {
                _id: requestId,
                receiver: userId,
                status: "pending",
            },
            {
                $set: {
                    status: "rejected",
                },
            },
            {
                new: true,
            }
        ).populate(
            "sender",
            "name username avatar status"
        );

    if (!request) {
        throw new Error(
            "Friend request not found or cannot be rejected."
        );
    }

    return request;
};

export const cancelFriendRequest = async (
    requestId,
    userId
) => {
    if (
        !mongoose.Types.ObjectId.isValid(requestId)
    ) {
        throw new Error("Invalid friend request ID.");
    }

    const request =
        await FriendRequest.findOneAndUpdate(
            {
                _id: requestId,
                sender: userId,
                status: "pending",
            },
            {
                $set: {
                    status: "cancelled",
                },
            },
            {
                new: true,
            }
        ).populate(
            "receiver",
            "name username avatar status"
        );

    if (!request) {
        throw new Error(
            "Friend request not found or cannot be cancelled."
        );
    }

    return request;
};