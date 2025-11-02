import { userService } from './userServices.js';
import { responseHandler } from '../../shared/utils/responseHandler.js';

export async function registerController(req, res, next) {
  try {
    const service = await userService();
    const user = await service.registerUser(req.body);
    if (user.success) {
      res.status(200).json({
        message: 'User registered succcessfully',
        user: user.newUser,
      });
    }
  } catch (error) {
    if (error.message === 'resourceAlreadyExist') {
      return res.status(409).json({ message: 'Resource already exist' });
    }
    next(error);
  }
}

export async function loginController(req, res, next) {
  try {
    const service = await userService();
    const result = await service.loginUser(req.body);
    responseHandler(res, result);
  } catch (error) {
    next(error);
  }
}

export async function logoutController() {}

export async function userProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const service = await userService();
    const data = await service.getUserById(userId);
    return res.json(data);
  } catch (err) {
    next(err);
  }
}
