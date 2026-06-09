import { body } from "express-validator";
import { checkDob, calculateAge } from "../utils/checkdob.util.js";

export const createProposalValidator = [
  // Step 1 fields
  body("full_name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .matches(/^[A-za-z\s]+$/)
    .withMessage("Name should contain only alphabets"),

  body("mobile_number")
    .trim()
    .notEmpty()
    .withMessage("Mobile number is required")
    .bail()
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Enter a valid 10-digit Indian mobile number"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Enter a valid email address"),

  body("dob")
    .notEmpty()
    .withMessage("Date of birth is required")
    .bail()
    .isDate()
    .withMessage("Date format is not valid")
    .bail()
    .custom((value) => {
      if (!value) return true;
      return checkDob(value);
    }),

  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .bail()
    .isIn(["Male", "Female", "Other"]),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required")
    .bail()
    .matches(/^[A-za-z\s]+$/)
    .withMessage("City should contain only alphabets"),

  body("occupation")
    .trim()
    .notEmpty()
    .withMessage("Occupation is required")
    .bail()
    .matches(/^[A-za-z\s]+$/)
    .withMessage("City should contain only alphabets"),

  // Step 2 fields
  body("currently_insured")
    .optional()
    .isIn([0, 1, "0", "1"])
    .withMessage("Currently insured (Yes/No) ?"),

  body("insurance_company")
  .if(body("currently_insured").equals("1"))
  .trim()
  .notEmpty().withMessage("Insurance company is required if currently insured")
  .bail()
  .matches(/^[A-Za-z0-9\s\-\.]+$/)
  .withMessage("Enter a valid insurance company name"),

  body("policy_number")
  .if(body("currently_insured").equals("1"))
  .trim()
  .notEmpty().withMessage("Policy number is required if currently insured")
  .bail()
  .matches(/^[A-Za-z0-9]{8,20}$/)
  .withMessage("Policy number must be 8-20 alphanumeric characters"),

  body("policy_start_date")
    .if(body("currently_insured").equals("1"))
    .notEmpty()
    .withMessage("Policy start date is required if currently insured")
    .bail()
    .isDate()
    .withMessage("Enter a valid policy start date"),

  body("policy_expiry_date")
    .if(body("currently_insured").equals("1"))
    .notEmpty()
    .withMessage("Policy expiry date is required if currently insured")
    .bail()
    .isDate()
    .withMessage("Enter a valid policy start date")
    .bail()
    .custom((value, { req }) => {
      if (!req.body.policy_start_date) return true;
      if (new Date(value) <= new Date(req.body.policy_start_date)) {
        throw new Error("Policy expiry date must be after policy start date");
      }
      return true;
    }),

  body("sum_insured")
    .if(body("currently_insured").equals("1"))
    .notEmpty()
    .withMessage("Sum insured is required if currently insured")
    .bail()
    .isNumeric()
    .withMessage("Sum insured must be a number"),

  body("claim_history")
    .optional()
    .isIn([0, 1, "0", "1"])
    .withMessage("Claim history (Yes/No)?"),

  body("claim_amount")
    .if(body("claim_history").equals("1"))
    .notEmpty()
    .withMessage("Claim amount is required if claim history exists")
    .bail()
    .isNumeric()
    .withMessage("Claim amount must be a number")
    .bail()
    .custom( (value, {req}) => {
      if(value > req.body.sum_insured) {
        throw new Error("Claim amount cannot be greater than sum insured.")
      }
    }),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .bail()
    .matches(/^[A-Za-z0-9\s,./-]+$/)
    .withMessage("Invalid Address data"),

  body("members").optional().isArray().withMessage("Invalid Members data"),

  body("members.*.member_name")
    .if(body("members").isArray({ min: 1 }))
    .trim()
    .notEmpty()
    .withMessage("Member name is required")
    .bail()
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Invalid name. Name should consist of alphabets"),

  body("members.*.relationship")
    .if(body("members").isArray({ min: 1 }))
    .trim()
    .notEmpty()
    .withMessage("Relationship is required")
    .bail()
    .matches(/^[A-Za-z\s-]+$/),

  body("members.*.gender")
    .if(body("members").isArray({ min: 1 }))
    .notEmpty()
    .withMessage("Gender is required")
    .bail()
    .isIn(["Male", "Female", "Other"]),

  body("members.*.dob")
    .if(body("members").isArray({ min: 1 }))
    .notEmpty()
    .withMessage("Date of birth is required")
    .bail()
    .isDate()
    .withMessage("Enter a valid date")
    .custom((value) => {
      const dob = new Date(value);
      const today = new Date();
      if (dob > today) throw new Error("Date of birth cannot be a future date");
      const age = calculateAge(value);
      if (age > 80) throw new Error("Member age cannot exceed 80 years");
      return true;
    }),
];

export const updateProposalValidator = [
  body("full_name")
    .optional()
    .trim()
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name should contain only alphabets"),

  body("mobile_number")
    .optional()
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Enter a valid 10-digit Indian mobile number"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Enter a valid email address"),

  body("dob")
    .optional()
    .isDate()
    .withMessage("Date format is not valid")
    .bail()
    .custom((value) => {
      if (!value) return true;
      return checkDob(value);
    }),

  body("gender")
    .optional()
    .isIn(["Male", "Female", "Other"])
    .withMessage("Invalid gender value"),

  body("city")
    .optional()
    .trim()
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("City should contain only alphabets"),

  body("occupation")
    .optional()
    .trim()
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Occupation should contain only alphabets"),

  body("currently_insured")
    .optional()
    .isIn([0, 1, "0", "1"])
    .withMessage("Currently insured must be 0 or 1"),

  body("insurance_company")
  .optional()
  .trim()
  .matches(/^[A-Za-z0-9\s\-\.]+$/)
  .withMessage("Enter a valid insurance company name"),

  body("policy_number")
  .optional()
  .trim()
  .matches(/^[A-Za-z0-9]{8,20}$/)
  .withMessage("Policy number must be 8-20 alphanumeric characters"),

  body("policy_start_date")
    .optional()
    .trim()
    .isDate()
    .withMessage("Enter a valid policy start date"),

  body("policy_expiry_date")
    .optional()
    .trim()
    .isDate()
    .withMessage("Enter a valid policy expiry date")
    .bail()
    .custom((value, { req }) => {
      if (!req.body.policy_start_date) return true;
      if (new Date(value) <= new Date(req.body.policy_start_date)) {
        throw new Error("Policy expiry date must be after policy start date");
      }
      return true;
    }),

  body("sum_insured")
    .optional()
    .trim()
    .isNumeric()
    .withMessage("Sum insured must be a number"),

  body("claim_history")
    .optional()
    .isIn([0, 1, "0", "1"])
    .withMessage("Claim history must be 0 or 1"),

  body("claim_amount")
    .optional()
    .trim()
    .isNumeric()
    .withMessage("Claim amount must be a number")
    .bail()
    .custom( (value, {req}) => {
      if(value > req.body.sum_insured) {
        throw new Error("Claim amount cannot be greater than sum insured.")
      }
    }),

  body("address")
    .optional()
    .trim()
    .matches(/^[A-Za-z0-9\s,./-]+$/)
    .withMessage("Invalid address format"),

  body("members").optional().isArray().withMessage("Invalid members data"),

  body("members.*.member_name")
    .optional()
    .trim()
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Member name should contain only alphabets"),

    body("members.*.relationship")
    .optional()
    .trim()
    .matches(/^[A-Za-z\s-]+$/)
    .withMessage("Enter a valid Relationship name"),

  body("members.*.gender")
    .optional()
    .trim()
    .isIn(["Male", "Female", "Other"])
    .withMessage("Invalid gender value"),

  body("members.*.dob")
    .optional()
    .trim()
    .isDate()
    .withMessage("Enter a valid date")
    .custom((value) => {
      const dob = new Date(value);
      const today = new Date();
      if (dob > today) throw new Error("Date of birth cannot be a future date");
      const age = calculateAge(value);
      if (age > 80) throw new Error("Member age cannot exceed 80 years");
      return true;
    }),
];
