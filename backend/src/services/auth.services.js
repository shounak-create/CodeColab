import bcrypt from "bcrypt";

import User from "../models/user.model.js";
import RefreshToken from "../models/refreshToken.model.js";

import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../utils/token.util.js";

const SALT_ROUNDS = 12;

export const registerUser = async ({
    name,
    username,
    email,
    password,
}) => {
    const existingUser = await User.findOne({
        $or: [
            { email },
            { username },
        ],
    });

    if (existingUser) {
        if (existingUser.email === email) {
            throw new Error("Email already registered.");
        }

        throw new Error("Username already taken.");
    }

    const hashedPassword = await bcrypt.hash(
        password,
        SALT_ROUNDS
    );

    const user = await User.create({
        name,
        username,
        email,
        password: hashedPassword,
    });

    return {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
    };
};

export const loginUser = async ({
    email,
    password,
}) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Invalid email or password.");
    }

    const passwordMatches = await bcrypt.compare(
        password,
        user.password
    );

    if (!passwordMatches) {
        throw new Error("Invalid email or password.");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const tokenHash = await bcrypt.hash(
        refreshToken,
        SALT_ROUNDS
    );

    const expiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    await RefreshToken.create({
        tokenHash,
        user: user._id,
        expiresAt,
    });

    return {
        user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
        },
        accessToken,
        refreshToken,
    };
};

export const refreshUserToken = async (
    refreshToken
) => {
    const payload = verifyRefreshToken(refreshToken);

    const tokenRecords = await RefreshToken.find({
        user: payload.userId,
    });

    let matchedToken = null;

    for (const record of tokenRecords) {
        const matches = await bcrypt.compare(
            refreshToken,
            record.tokenHash
        );

        if (matches) {
            matchedToken = record;
            break;
        }
    }

    if (!matchedToken) {
        throw new Error("Invalid refresh token.");
    }

    if (matchedToken.expiresAt < new Date()) {
        await matchedToken.deleteOne();
        throw new Error("Refresh token expired.");
    }

    const user = await User.findById(payload.userId);

    if (!user) {
        throw new Error("User not found.");
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    const newTokenHash = await bcrypt.hash(
        newRefreshToken,
        SALT_ROUNDS
    );

    const newExpiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    await matchedToken.deleteOne();

    await RefreshToken.create({
        tokenHash: newTokenHash,
        user: user._id,
        expiresAt: newExpiresAt,
    });

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    };
};

export const logoutUser = async (refreshToken) => {
    if (!refreshToken) {
        return;
    }

    try {
        const payload = verifyRefreshToken(refreshToken);

        const tokenRecords = await RefreshToken.find({
            user: payload.userId,
        });

        for (const record of tokenRecords) {
            const matches = await bcrypt.compare(
                refreshToken,
                record.tokenHash
            );

            if (matches) {
                await record.deleteOne();
                break;
            }
        }
    } catch {
        // Logout should remain successful even
        // when the token is already invalid/expired.
    }
};

export const getCurrentUser = async (userId) => {
    const user = await User.findById(userId).select(
        "-password"
    );

    if (!user) {
        throw new Error("User not found.");
    }

    return user;
};

