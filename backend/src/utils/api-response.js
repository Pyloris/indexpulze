/**
 * Standardized API Response Helper Class
 */
export class ApiResponse {
    /**
     * Return a success response
     * @param {Object} res - Express response object
     * @param {Object} data - Data payload or object containing data and optional meta
     * @param {string} message - Success message
     * @param {number} statusCode - HTTP status code
     */
    static success(res, data = {}, message = "Success", statusCode = 200) {
        const hasMeta = data && typeof data === 'object' && 'meta' in data;
        const payloadData = hasMeta ? data.data : data;

        return res.status(statusCode).json({
            status: 1,
            message,
            data: payloadData !== undefined ? payloadData : {},
            ...(hasMeta && data.meta && { meta: data.meta })
        });
    }

    /**
     * Return a 201 Created response
     * @param {Object} res - Express response object
     * @param {Object} data - Data payload
     * @param {string} message - Success message
     */
    static created(res, data = {}, message = "Resource created successfully") {
        return ApiResponse.success(res, data, message, 201);
    }
}
