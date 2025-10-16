import { body } from "express-validator";



export const loginValidation = [
    body("username")
        .notEmpty()
        .withMessage('Username is required')

        .isAlpha()
        .withMessage('Username must be only letters'),

    
    body("password")
        .isLength({min: 6})
        .withMessage('Password length must be atleast 6 characters long')
]      
