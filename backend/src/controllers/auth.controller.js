import {
    registerUser,
    loginUser,
    refreshUserToken,
    logoutUser,
    getCurrentUser,
} from "../services/auth.services.js";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = async (req, res) => {
    try {
        const user = await registerUser(req.body);

        return res.status(201).json({
            success: true,
            message: "Account created successfully.",
            data: {
                user,
            },
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const login = async (req, res) => {
    try {
        const result = await loginUser(req.body);

        res.cookie(
            "refreshToken",
            result.refreshToken,
            cookieOptions
        );

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            data: {
                user: result.user,
                accessToken: result.accessToken,
            },
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};

export const refresh = async (req, res) => {
    try {
        const refreshToken =
            req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token missing.",
            });
        }

        const result =
            await refreshUserToken(refreshToken);

        res.cookie(
            "refreshToken",
            result.refreshToken,
            cookieOptions
        );

        return res.status(200).json({
            success: true,
            message: "Token refreshed successfully.",
            data: {
                accessToken: result.accessToken,
            },
        });
    } catch (error) {
        res.clearCookie("refreshToken");

        return res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};

export const logout = async (req, res) => {
    try {
        const refreshToken =
            req.cookies.refreshToken;

        await logoutUser(refreshToken);

        res.clearCookie("refreshToken");

        return res.status(200).json({
            success: true,
            message: "Logout successful.",
        });
    } catch {
        res.clearCookie("refreshToken");

        return res.status(200).json({
            success: true,
            message: "Logout successful.",
        });
    }
};

export const me = async (req, res) => {
    try {
        const user = await getCurrentUser(
            req.user.id
        );

        return res.status(200).json({
            success: true,
            data: {
                user,
            },
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};