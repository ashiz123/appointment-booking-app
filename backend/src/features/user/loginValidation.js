import { body } from "express-validator";



export const loginValidation = [
    body("email")
      .notEmpty()
      .withMessage('Email is required')

      .isEmail()
      .withMessage('Invalid email'),

    
    body("password")
        .isLength({min: 6})
        .withMessage('Password length must be atleast 6 characters long')
]      
