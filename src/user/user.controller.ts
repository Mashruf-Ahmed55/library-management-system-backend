import bcryptjs from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { config } from '../config/config';
import { sendVerificationCode } from '../email/emailConfig';
import userModel from './user.model';
import { IUser } from './user.type';

export const register = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        next(createHttpError(400, 'All fields are required'));
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

      await userModel.deleteMany({ email, accountVerified: false });

      const hashedPassword = await bcryptjs.hash(password, 10);

      const newUser = new userModel({
        name,
        email,
        password: hashedPassword,
      });

      const verificationCode = await newUser.generateVerificationCodes();

      await newUser.save({ session });

      await sendVerificationCode(verificationCode, email, name);

      await session.commitTransaction();

      await session.endSession();

      res.status(201).json({
        message: 'User registered successfully. Please verify your email.',
      });
    } catch (error) {
      await session.abortTransaction();

      await session.endSession();

      next(error);
    }
  }
);

export const verifyOtp = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return next(createHttpError(400, 'All fields are required'));
    }

    try {
      const userAllEntries = await userModel
        .find({ email, accountVerified: false })
        .sort({ createdAt: -1 });

      if (userAllEntries.length === 0) {
        return next(createHttpError(404, 'User not found'));
      }

      let user = userAllEntries[0];

      if (userAllEntries.length > 1) {
        await userModel.deleteMany({
          _id: { $ne: user._id },
          email,
          accountVerified: false,
        });
      }

      if (
        !user ||
        user.verificationCode === null ||
        user.verificationCode !== otp.toString()
      ) {
        return next(createHttpError(400, 'Invalid OTP'));
      }

      const currentTime = Date.now();

      const verificationCodeExpire: number | null = user.verificationCodeExpire
        ? new Date(user.verificationCodeExpire).getTime()
        : null;

      if (!verificationCodeExpire || currentTime > verificationCodeExpire) {
        return next(createHttpError(400, 'OTP has expired'));
      }

      user.accountVerified = true;

      user.verificationCode = null;

      user.verificationCodeExpire = null;

      await user.save({ validateModifiedOnly: true });

      const token = jwt.sign({ _id: user._id }, config.JWT_SECRET as string, {
        expiresIn: '7d', // 7 days
      });

      res
        .status(200)
        .cookie('jwt', token, {
          httpOnly: true,
          secure: true,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .json({
          success: true,
          token: token,
          message: 'OTP verified successfully',
          user: user,
        });
    } catch (error) {
      return next(createHttpError(500, 'Internal server error'));
    }
  }
);

export const login = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return next(createHttpError(400, 'All fields are required'));
      }

      const user = await userModel
        .findOne({ email, accountVerified: true })
        .select('+password');

      if (!user) {
        return next(createHttpError(404, 'User not found'));
      }
      const isPasswordMatch = await bcryptjs.compare(password, user.password);

      if (!isPasswordMatch) {
        return next(createHttpError(404, 'Invalid credentials'));
      }

      const token = jwt.sign({ _id: user._id }, config.JWT_SECRET as string, {
        expiresIn: '7d', // 7 days
      });
      res
        .status(200)
        .cookie('jwt', token, {
          httpOnly: true,
          secure: true,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .json({
          message: 'User logged in successfully',
          user: {
            user: user._id,
            name: user.name,
            email: user.email,
          },
          success: true,
          token: token,
        });
    } catch (error) {
      return next(createHttpError(500, 'Internal server error'));
    }
  }
);

export const logout = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res
      .status(200)
      .cookie('jwt', '', {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .json({
        success: true,
        message: 'User logged out successfully',
      });
  }
);

interface AuthRequest extends Request {
  user?: IUser;
}

export const getUser = expressAsyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const users = req.user;
    res.status(200).json({
      success: true,
      users,
    });
  }
);

