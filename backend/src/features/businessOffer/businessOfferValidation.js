
import {body, param} from "express-validator";

export const createBusinessOfferValidation = [

    body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be string')
    .isLength({ max: 100 }).withMessage('Name is too long'),

    body("businessId")
    .notEmpty().withMessage('Business field is required')
    .isMongoId().withMessage('Invalid business id'),

    body('price')
     .notEmpty().withMessage('Price is required')
     .isInt({min:1}).withMessage('Price must be value'),


    body('duration')
    .notEmpty().withMessage('Duration is required')
    .isInt({min:1}).withMessage('Duration must be integer value')
    
]


export const updateAndDeleteBusinessValidation = [
    param('offerId')
    .notEmpty().withMessage('Business offer id is required')
    .isMongoId().withMessage('Invalid business offer id')
] 