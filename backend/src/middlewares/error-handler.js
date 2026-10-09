/**
 * Global error handler middleware
 * Handles ApiError and other errors consistently
 */
import { ApiError } from '../errors/api-error.js';

function errorHandler(err, req, res, next) {
    // If response already sent, delegate to default Express error handler
    if (res.headersSent) {
        return next(err);
    }

    // Handle ApiError instances
    if (err instanceof ApiError) {
        console.warn(`[ApiError] ${err.statusCode} - ${err.message}`);
        return res.status(err.statusCode).json({
            status: 0,
            message: err.message,
            ...(err.meta && Object.keys(err.meta).length > 0 && { data: err.meta })
        });
    }

    // Log full stack trace for unexpected errors
    console.error('[Unhandled Error]', err);

    // Handle validation errors from express-validator
    if (err.array && typeof err.array === 'function') {
        return res.status(400).json({
            status: 0,
            message: 'Validation error',
            data: err.array()
        });
    }

    // Handle MongoDB duplicate key errors
    if (err.code === 11000) {
        return res.status(409).json({
            status: 0,
            message: 'Duplicate entry found'
        });
    }

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            status: 0,
            message: messages.join(', ')
        });
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({
            status: 0,
            message: 'Invalid or expired token'
        });
    }

    // Default server error
    return res.status(500).json({
        status: 0,
        message: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message || 'Internal server error'
    });
}

export { errorHandler };
