/**
 * Wraps an async controller function to automatically catch errors
 * and pass them to the next middleware (error handler)
 * @param {Function} controller - The async controller function to wrap
 * @returns {Function} - Express middleware function
 */
function catchError(controller) {
    return async (req, res, next) => {
        try {
            await controller(req, res, next);
        } catch (err) {
            next(err);
        }
    };
}

export { catchError };
export default catchError;
