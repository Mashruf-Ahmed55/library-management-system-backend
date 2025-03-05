import bcryptjs from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import { sendVerificationCode } from '../email/emailConfig';
import userModel from './user.model';

export const register = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        throw createHttpError(400, 'All fields are required');
      }
      console.log('first');
      const isRegister = await userModel.findOne({
        email,
        accountVerified: true,
      });
      console.log('s');

      if (isRegister) {
        throw createHttpError(400, 'User already exists');
      }

      const registrationAttemptsByUser = await userModel.find({
        email,
        accountVerified: false,
      });

      console.log('t');
      if (registrationAttemptsByUser.length >= 5) {
        throw createHttpError(
          400,
          'You have exceeded the number of registration attempts, please contact support'
        );
      }
      console.log('t');

      const hashedPassword = await bcryptjs.hash(password, 10);

      const newUser = new userModel({
        name,
        email,
        password: hashedPassword,
      });
      console.log('4');

      const verificationCode = await newUser.generateVerificationCodes();

      console.log('5');
      await newUser.save({ session });

      console.log('6');
      await sendVerificationCode(verificationCode, email, name);

      console.log('7');
      await session.commitTransaction();
      console.log('8');
      session.endSession();
      console.log('9');

      res.status(201).json({
        message: 'User registered successfully. Please verify your email.',
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  }
);
