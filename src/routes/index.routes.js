import { Router } from "express";

import proposalRoutes from "./proposal.routes.js";

/**
 * Initialize all routes
 * @param app - Express application instance
 * @param baseUrl - Base URL for the API
 */
export const initializeRoutes = ( app ) => {
    app.use('/api/v1/proposals', proposalRoutes);
}