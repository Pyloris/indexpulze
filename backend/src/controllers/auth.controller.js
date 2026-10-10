import { AuthService } from "../services/auth.service.js";
import { catchError } from "../errors/catch-error.js";
import { ApiResponse } from "../utils/api-response.js";

export class AuthController {
    static login = catchError(async (req, res, next) => {
        const { username, password } = req.body;
        const result = await AuthService.login({ username, password });
        return ApiResponse.success(res, result, "Logged in successfully");
    });

    static register = catchError(async (req, res, next) => {
        const { username, email, password, full_name, profile_picture } = req.body;
        const result = await AuthService.register({ username, email, password, full_name, profile_picture });
        return ApiResponse.created(res, result, "User registered successfully");
    });
}
