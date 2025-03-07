import { Router } from 'express';
import { isAuthenticed } from './../middlewares/authMiddlewares';
import {
  forgotPassword,
  getUser,
  login,
  logout,
  register,
  verifyOtp,
} from './user.controller';

const userRouter = Router();

userRouter.route('/register').post(register);
userRouter.route('/verify-otp').post(verifyOtp);
userRouter.route('/login').post(login);
userRouter.route('/logout').get(isAuthenticed, logout);
userRouter.route('/profile').get(isAuthenticed, getUser);
userRouter.route('/forgot-password').post(forgotPassword);

export default userRouter;
