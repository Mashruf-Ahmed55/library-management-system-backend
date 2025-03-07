import { Router } from 'express';
import { isAuthenticed } from './../middlewares/authMiddlewares';
import {
  forgotPassword,
  getUser,
  login,
  logout,
  register,
  resetPassword,
  verifyOtp,
} from './user.controller';

const userRouter = Router();

userRouter.route('/register').post(register);
userRouter.route('/verify-otp').post(verifyOtp);
userRouter.route('/login').post(login);
userRouter.route('/logout').get(isAuthenticed, logout);
userRouter.route('/profile').get(isAuthenticed, getUser);
userRouter.route('/password/forgot-password').post(forgotPassword);
userRouter.route('/password/reset-password/:token').put(resetPassword);

export default userRouter;
