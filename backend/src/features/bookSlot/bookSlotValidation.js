import {body} from "express-validator";

export const bookSlotValidation = [
    body("appointment_slot_id").notEmpty().withMessage("Appointment slot is required"),
    body("fullname").notEmpty().withMessage("Fullname is required"),
    body("email").notEmpty().withMessage("Email field is required"),
    body("phone").notEmpty().withMessage("Phone field is required").matches(/^[0-9]{10}$/).withMessage('Phone number must be exactly 10 digit')
];