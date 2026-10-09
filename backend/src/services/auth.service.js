import { User } from "../database/models/user.model.js";
import { ApiError } from "../errors/api-error.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { appConfig } from "../config/app-config.js";

export class AuthService {
    static login = async ({ username, password }) => {
        const user = await User.findOne({ username });
        if (!user) {
            throw ApiError.unauthorized("Invalid credentials");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw ApiError.unauthorized("Invalid credentials");
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            appConfig.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return { data: { token, user: { id: user._id, username: user.username } } };
    };

    static register = async ({ username, password }) => {
        const existing = await User.findOne({ username });
        if (existing) {
            throw ApiError.conflict("Username already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            password: hashedPassword
        });

        return { data: { id: user._id, username: user.username } };
    };
}
