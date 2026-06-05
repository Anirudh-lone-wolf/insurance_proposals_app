/**
 * Send success response
 * 
 * @param {object} res - Express response object
 * @param {string} message - Success message
 * @param {object|array|null} data - Response data
 * @param {number} statusCode - HTTP success status code
 */
export const sendSuccess = (res, message, data = null, code = 200 ) => {
    return res.status(code).json({
        success: true,
        message: message,
        data: data,
    });
}; 

/**
 * Send error response
 * 
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP error status code
 */
export const sendError = (res, message, code = 500, error = null ) => {
    return res.status(code).json({
        success: false,
        message,
        error
    });
}; 