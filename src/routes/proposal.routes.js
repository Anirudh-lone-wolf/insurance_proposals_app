import { Router } from "express";

import { createProposalController, 
        listProposalsController,
        viewProposalController, 
        updateProposalController,
        deleteProposalController
} from "../controllers/proposal.controller.js";
import { createProposalValidator, updateProposalValidator } from "../validators/proposal.validators.js";
import { validationMiddleware } from "../middlewares/validation.middleware.js";

const proposalRoutes = Router();

// Create proposal route
proposalRoutes.post(
        '/', 
        createProposalValidator,
        validationMiddleware,
        createProposalController);

//List proposals route
proposalRoutes.get('/', listProposalsController);

// View proposal route
proposalRoutes.get('/:id', viewProposalController)

// Update proposal route
proposalRoutes.put(
        '/:id',
        updateProposalValidator,
        validationMiddleware, 
        updateProposalController);
 
// Delete proposal route
proposalRoutes.delete(
        '/:id', 
        deleteProposalController)

export default proposalRoutes;