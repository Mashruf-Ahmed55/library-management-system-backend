import {Router} from 'express';
import {register, verifyOtp} from './user.controller';

const userRouter = Router();

userRouter.route('/register').post(register);
userRouter.route('/verify-otp').post(verifyOtp)

export default userRouter;
