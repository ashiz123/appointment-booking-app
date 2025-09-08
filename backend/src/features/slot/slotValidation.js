import {body} from "express-validator";

export const createSlotValidation = [
    body("business_id")
    .notEmpty()
    .withMessage('Business id is required'),

    body("service_id")
    .notEmpty()
    .withMessage("Service id is required"),

    body("business_start")
    .notEmpty()
    .withMessage("business start time is required")
    .matches(/^\d{2}:\d{2}$/)
    .withMessage("business start time must be HH:MM"),


    body("business_end")
    .notEmpty()
    .withMessage('business end time is required')
    .matches(/^\d{2}:\d{2}$/)
    .withMessage("business end time must be HH:MM"),

    body("service_duration")
    .notEmpty()
    .withMessage('business service duration is required')
    .isInt({min : 1})
    .withMessage("service duration must be at least 1 minute"),

    body("date")
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .toDate()
    .withMessage("Date must be valid ISO 8601 date"),

    body("seats")
    .notEmpty()
    .withMessage("seats is required")
    .isInt({min: 1})
    .withMessage('Seats must be at least 1')
]