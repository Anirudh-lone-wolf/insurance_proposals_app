import {
  createProposalService,
  listProposalsService,
  viewProposalService,
  updateProposalsService,
  deleteProposalService,
} from "../services/proposal.service.js";

import { sendSuccess, sendError } from "../utils/response.util.js";

import * as logger from "../utils/logger.util.js";

export const createProposalController = async (req, res) => {
  try {
    logger.info("Create proposal request received");

    const result = await createProposalService(req.body);

    logger.success("Proposal created successfully", result);

    return sendSuccess(res, "Proposal created successfully", result, 201);
  } catch (error) {
    logger.error("Error creating proposal", error);
    return sendError(res, "Failed to create proposal", 500, error);
  }
};

export const listProposalsController = async (req, res) => {
  try {
    logger.info("Request received, fetching all proposals.....");

    const result = await listProposalsService(req.query);

    logger.success("Proposals fetched successfully", result);

    return sendSuccess(res, "Proposals fetched successfully", result, 200);
  } catch (error) {
    logger.error("Error fetching proposals", error);

    return sendError(res, "Failed to fetch proposals", 500, error);
  }
};

export const viewProposalController = async (req, res) => {
  try {
    logger.info("Request received, fetching proposal....");

    const result = await viewProposalService(req.params.id);

    if (!result) return sendError(res, "Proposal not found", 404);

    logger.success("Proposal fetched successfully", result);

    return sendSuccess(res, "Proposal fetched successfully", result, 200);
  } catch (error) {
    logger.error("Error fetching proposal", error);

    return sendError(res, "Failed to fetch proposal", 500);
  }
};

export const updateProposalController = async (req, res) => {
  try {
    logger.info("Update proposal request received");

    const result = await updateProposalsService(req.params.id, req.body);

    if (!result) return sendError(res, "Proposal not found", 404);

    logger.success("Proposal updated successfully", result);

    return sendSuccess(res, "Proposal updated successfully", result, 200);
  } catch (error) {
    logger.error("Error updating proposal", error);

    return sendError(res, "Failed to update proposal", 500);
  }
};

export const deleteProposalController = async (req, res) => {
  try {
    logger.info("Delete proposal request received");

    const result = await deleteProposalService(req.params.id);

    if (!result) return sendError(res, "Proposal not found", 404);

    logger.success("Proposal deleted successfully", result);

    return sendSuccess(res, "Proposal deleted successfully", null, 200);
  } catch (error) {
    logger.error("Error deleting proposal", error);

    return sendError(res, "Failed to delete proposal", 500);
  }
};
