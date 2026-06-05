import { validationResult } from "express-validator";

import { sendError } from "../utils/response.util.js";

import * as logger from "../utils/logger.util.js";

// Validation Middleware
export const validationMiddleware = (req, res, next) => {

    // Get Validation errors
    const errors = validationResult(req);

    if(!errors.isEmpty()) {

        logger.error('Validation Failed', errors.array());

        return sendError(res, 'Validation Failed', 400, errors.array());

    }

    // Move to next middleware/controller
    next();
 
}