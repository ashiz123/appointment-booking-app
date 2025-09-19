import {body} from "express-validator";

export const createBusinessValidation = [
    // body("owner")
    // .notEmpty()
    // .withMessage("Owner is required")
    // .isMongoId()
    // .withMessage("Owner must be a valid mongodb objectId"),

    body("address")
    .notEmpty()
    .withMessage("Address is required"),
    
    body("start_time")
    .notEmpty()
    .withMessage("Start time is required"),

    body("end_time")
    .notEmpty()
    .withMessage("End time is required")
]