import { Router } from 'express';
import { isAuthenticed } from './../middlewares/authMiddlewares';
import { getUser, login, logout, register, verifyOtp } from './user.controller';

const userRouter = Router();

userRouter.route('/register').post(register);
userRouter.route('/verify-otp').post(verifyOtp);
userRouter.route('/login').post(login);
userRouter.route('/logout').get(isAuthenticed, logout);
userRouter.route('/profile').get(isAuthenticed, getUser);

export default userRouter;
