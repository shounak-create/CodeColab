import {
    verifyAccessToken,
} from "../utils/token.util.js";

export const authenticate = (
    req,
    res,
    next
) => {
    const authorization =
        req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({
            success: false,
            message: "Authentication required.",
        });
    }

    const [scheme, token] =
        authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({
            success: false,
            message: "Invalid authorization header.",
        });
    }

    try {
        const payload = verifyAccessToken(token);

        req.user = {
            id: payload.userId,
        };

        next();
    } catch {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired access token.",
        });
    }
};