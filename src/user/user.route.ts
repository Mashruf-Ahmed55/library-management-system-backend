import { Router } from 'express';
import { register } from './user.controller';

const userRouter = Router();

userRouter.route('/register').post(register);

export default userRouter;
