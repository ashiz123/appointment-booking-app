import express from 'express';
import { registerController, loginController } from '../../features/user/userController.js';

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
//logout
//forgot-password
//reset-user


export default router;

