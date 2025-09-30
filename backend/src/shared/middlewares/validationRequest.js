import {validationResult} from "express-validator";


export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);
    if(!errors.isEmpty()){
        return res.status(400).json({
            success: false,
            errors: errors.array(),
            message: "Validation error"
        });
    }

    next();
}