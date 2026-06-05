import { Router } from "express";

import { createProposalController, 
        listProposalsController,
        viewProposalController, 
        updateProposalController,
        deleteProposalController
} from "../controllers/proposal.controller.js";

const proposalRoutes = Router();

// Create proposal route
proposalRoutes.post(
        '/', 
        createProposalController);

//List proposals route
proposalRoutes.get('/', listProposalsController);

// View proposal route
proposalRoutes.get('/:id', viewProposalController)

// Update proposal route
proposalRoutes.put(
        '/:id', 
        updateProposalController);
 
// Delete proposal route
proposalRoutes.delete(
        '/:id', 
        deleteProposalController)

export default proposalRoutes;