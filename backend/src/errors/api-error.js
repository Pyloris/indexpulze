/**
 * Custom API Error class for consistent error handling
 */
class ApiError extends Error {
    constructor(statusCode, message, meta = {}) {
        super(message);
        this.statusCode = statusCode;
        this.meta = meta;
        this.success = false;

        // Maintains proper stack trace (only in V8 engines)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    static badRequest(message = "Bad request", meta = {}) {
        return new ApiError(400, message, meta);
    }

    static unauthorized(message = "Unauthorized", meta = {}) {
        return new ApiError(401, message, meta);
    }

    static forbidden(message = "Forbidden", meta = {}) {
        return new ApiError(403, message, meta);
    }

    static notFound(message = "Resource not found", meta = {}) {
        return new ApiError(404, message, meta);
    }

    static conflict(message = "Conflict", meta = {}) {
        return new ApiError(409, message, meta);
    }

    static validationError(message = "Validation error", meta = {}) {
        return new ApiError(400, message, meta);
    }

    static internal(message = "Internal server error", meta = {}) {
        return new ApiError(500, message, meta);
    }
}

export { ApiError };
export default ApiError;
