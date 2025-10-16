import { body } from "express-validator";



export const registerValidation = [
    body("username")
        .notEmpty()
        .withMessage('Username is required')

        .isAlpha()
        .withMessage('Username must be only letters'),

    
    body("email")
      .notEmpty()
      .withMessage('Email is required')

      .isEmail()
      .withMessage('Invalid email'),



    body("password")
        .isLength({min: 6})
        .withMessage('Password length must be atleast 6 characters long')
]      
