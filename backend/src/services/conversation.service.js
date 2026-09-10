import mongoose from "mongoose";

import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";

import {
    normalizeMemberPair,
} from "../utils/conversation.utils.js";

export const createDirectConversation = async (
    userIdA,
    userIdB
) => {
    if (userIdA === userIdB) {
        throw new Error(
            "You cannot create a conversation with yourself."
        );
    }

    if (
        !mongoose.Types.ObjectId.isValid(userIdA) ||
        !mongoose.Types.ObjectId.isValid(userIdB)
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

    const members = normalizeMemberPair(
        userIdA,
        userIdB
    );

    const existingConversation =
        await Conversation.findOne({
            members,
            type: "direct",
        });

    if (existingConversation) {
        return existingConversation;
    }

    const conversation =
        await Conversation.create({
            members,
            type: "direct",
        });

    return conversation;
};

export const getMyConversations = async (
    userId
) => {
    if (
        !mongoose.Types.ObjectId.isValid(userId)
    ) {
        throw new Error("Invalid user ID.");
    }

    const conversations =
        await Conversation.find({
            members: userId,
            type: "direct",
        })
            .populate(
                "members",
                "name username avatar status"
            )
            .sort({
                updatedAt: -1,
            });

    return conversations;
};

export const getConversationById = async (
    conversationId,
    userId
) => {
    if (
        !mongoose.Types.ObjectId.isValid(
            conversationId
        )
    ) {
        throw new Error(
            "Invalid conversation ID."
        );
    }

    const conversation =
        await Conversation.findOne({
            _id: conversationId,
            members: userId,
        }).populate(
            "members",
            "name username avatar status"
        );

    if (!conversation) {
        throw new Error(
            "Conversation not found."
        );
    }

    return conversation;
};

export const getDirectConversation = async (
    userIdA,
    userIdB
) => {
    if (
        !mongoose.Types.ObjectId.isValid(userIdA) ||
        !mongoose.Types.ObjectId.isValid(userIdB)
    ) {
        throw new Error("Invalid user ID.");
    }

    if (userIdA === userIdB) {
        throw new Error(
            "A user cannot have a direct conversation with themselves."
        );
    }

    const members = normalizeMemberPair(
        userIdA,
        userIdB
    );

    const conversation =
        await Conversation.findOne({
            members,
            type: "direct",
        }).populate(
            "members",
            "name username avatar status"
        );

    return conversation;
};