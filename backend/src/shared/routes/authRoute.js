import express from 'express';
import { registerController, loginController } from '../../features/user/userController.js';
import { validateRequest } from '../middlewares/validationRequest.js';
import { registerValidation } from '../../features/user/registerValidation.js';
import { loginValidation } from '../../features/user/loginValidation.js';

const router = express.Router();

router.post('/register',registerValidation, validateRequest,  registerController);
router.post('/login', loginValidation, validateRequest, loginController);
//logout
//forgot-password
//reset-user


export default router;

  