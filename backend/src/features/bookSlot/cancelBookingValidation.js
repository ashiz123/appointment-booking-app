
import {body, param} from "express-validator";
export const cancelBookingValidation = [
    body("booking_reference")
    .notEmpty().withMessage("Booking reference is required")
    .isUUID()
    .withMessage("Booking reference must be valid UUID"),

    param("email")
    .notEmpty().withMessage("Email is required in params")
    .isEmail()
    .withMessage("Email must be valid")
]