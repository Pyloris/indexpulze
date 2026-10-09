import jwt from "jsonwebtoken";
import { appConfig } from "../config/app-config.js";
import { ApiError } from "../errors/api-error.js";

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(ApiError.unauthorized("Missing or invalid token"));
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, appConfig.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return next(ApiError.unauthorized("Invalid or expired token"));
    }
};
