import {
    getMyProfile,
    getUserByUsername,
    updateProfile,
    changeEmail,
    changePassword,
    searchUsers,
} from "../services/user.service.js";

export const getMe = async (req, res) => {
    try {
        const user = await getMyProfile(
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

export const getProfile = async (req, res) => {
    try {
        const user = await getUserByUsername(
            req.params.username
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

export const updateMyProfile = async (
    req,
    res
) => {
    try {
        const user = await updateProfile(
            req.user.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
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

export const updateEmail = async (
    req,
    res
) => {
    try {
        const user = await changeEmail(
            req.user.id,
            req.body.email
        );

        return res.status(200).json({
            success: true,
            message: "Email updated successfully.",
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

export const updatePassword = async (
    req,
    res
) => {
    try {
        await changePassword(
            req.user.id,
            req.body.currentPassword,
            req.body.newPassword
        );

        return res.status(200).json({
            success: true,
            message: "Password updated successfully.",
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const search = async (req, res) => {
    try {
        const users = await searchUsers(
            req.query.q
        );

        return res.status(200).json({
            success: true,
            data: {
                users,
            },
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};