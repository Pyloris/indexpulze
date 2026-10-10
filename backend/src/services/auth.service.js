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
            { id: user._id, username: user.username, email: user.email },
            appConfig.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return { data: { token, user: { id: user._id, username: user.username, email: user.email, full_name: user.full_name, profile_picture: user.profile_picture } } };
    };

    static register = async ({ username, email, password, full_name, profile_picture }) => {
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            throw ApiError.conflict("Username already exists");
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            throw ApiError.conflict("Email already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            full_name,
            profile_picture
        });

        return { data: { id: user._id, username: user.username, email: user.email, full_name: user.full_name, profile_picture: user.profile_picture } };
    };
}
