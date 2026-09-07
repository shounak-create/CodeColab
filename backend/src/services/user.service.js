import bcrypt from "bcrypt";

import User from "../models/user.model.js";

export const getMyProfile = async (userId) => {
    const user = await User.findById(userId).select(
        "-password"
    );

    if (!user) {
        throw new Error("User not found.");
    }

    return user;
};

export const getUserByUsername = async (username) => {
    const user = await User.findOne({
        username: username.toLowerCase(),
    }).select(
        "name username avatar status createdAt"
    );

    if (!user) {
        throw new Error("User not found.");
    }

    return user;
};

export const updateProfile = async (
    userId,
    { name, username, avatar }
) => {
    const updates = {};

    if (name !== undefined) {
        updates.name = name;
    }

    if (username !== undefined) {
        updates.username = username.toLowerCase();
    }

    if (avatar !== undefined) {
        updates.avatar = avatar;
    }

    if (username !== undefined) {
        const existingUser = await User.findOne({
            username: username.toLowerCase(),
            _id: { $ne: userId },
        });

        if (existingUser) {
            throw new Error("Username already taken.");
        }
    }

    const user = await User.findByIdAndUpdate(
        userId,
        updates,
        {
            new: true,
            runValidators: true,
        }
    ).select("-password");

    if (!user) {
        throw new Error("User not found.");
    }

    return user;
};

export const changeEmail = async (
    userId,
    newEmail
) => {
    const email = newEmail.toLowerCase();

    const existingUser = await User.findOne({
        email,
        _id: { $ne: userId },
    });

    if (existingUser) {
        throw new Error("Email already registered.");
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { email },
        {
            new: true,
            runValidators: true,
        }
    ).select("-password");

    if (!user) {
        throw new Error("User not found.");
    }

    return user;
};

export const changePassword = async (
    userId,
    currentPassword,
    newPassword
) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found.");
    }

    const passwordMatches = await bcrypt.compare(
        currentPassword,
        user.password
    );

    if (!passwordMatches) {
        throw new Error("Current password is incorrect.");
    }

    const hashedPassword = await bcrypt.hash(
        newPassword,
        12
    );

    user.password = hashedPassword;

    await user.save();
};

export const searchUsers = async (query) => {
    const users = await User.find({
        $or: [
            {
                username: {
                    $regex: query,
                    $options: "i",
                },
            },
            {
                name: {
                    $regex: query,
                    $options: "i",
                },
            },
        ],
    })
        .select(
            "name username avatar status"
        )
        .limit(20);

    return users;
};