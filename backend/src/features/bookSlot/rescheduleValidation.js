import {body} from "express-validator";

export const rescheduleValidation = [
    body("booking_reference")
    .notEmpty()
    .withMessage("Booking Reference is required"),


    body("appointment_slot_id")
    .notEmpty()
    .withMessage("Select the appointment slot")


]