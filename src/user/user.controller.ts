import bcryptjs from 'bcryptjs'; // Fixed typo
import { NextFunction, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import createHttpError from 'http-errors';

import { sendVerificationCode } from '../config/utils';
import userModel from './user.model';

export const register = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return next(createHttpError(400, 'All fields are required'));
      }

      const isRegister = await userModel.findOne({
        email,
        accountVerified: true,
      });

      if (isRegister) {
        return next(createHttpError(400, 'User already exists'));
      }

      const registrationAttemptsByUser = await userModel.find({
        email,
        accountVerified: false,
      });

      if (registrationAttemptsByUser.length >= 5) {
        return next(
          createHttpError(
            400,
            'You have exceeded the number of registration attempts, please contact support'
          )
        );
      }

      const hashedPassword = await bcryptjs.hash(password, 10);

      if (!hashedPassword) {
        return next(createHttpError(500, 'Password hashing failed'));
      }

      const newUser = await userModel.create({
        name,
        email,
        password: hashedPassword,
      });
      const verificationCode = await newUser.generateVerificationCodes();
      sendVerificationCode(verificationCode, email, name, res);
    } catch (error) {
      next(error);
    }
  }
);
