import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { config } from '../config/config';
import {
  sendResetPasswordEmail,
  sendVerificationCode,
} from '../email/emailConfig';
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

export const forgotPassword = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
      return next(createHttpError(400, 'Email is required'));
    }

    try {
      const user = await userModel.findOne({ email, accountVerified: true });

      if (!user) {
        return next(createHttpError(404, 'User not found'));
      }

      const resetPasswordToken = await user.generateResetPasswordToken();
      await user.save({ validateModifiedOnly: false });
      const resetPasswordUrl = `${config.FRONT_END_URL}/reset-password/${resetPasswordToken}`;
      console.log(resetPasswordUrl);

      await sendResetPasswordEmail(resetPasswordUrl, user.email, user.name);

      res.status(200).json({
        success: true,
        message: `Reset password link sent to your email ${user.email}`,
      });
    } catch (error) {
      return next(createHttpError(500, 'Internal server error'));
    }
  }
);

export const resetPassword = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.params;
      const { password, confirmPassword } = req.body;

      if (!password || !confirmPassword) {
        return next(createHttpError(400, 'Both password fields are required.'));
      }

      if (password.length < 8 || password.length > 16) {
        return next(
          createHttpError(400, 'Password must be between 8 to 16 characters.')
        );
      }

      if (password !== confirmPassword) {
        return next(createHttpError(400, 'Passwords do not match.'));
      }

      // Hash the token before searching in DB
      const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      // Find user with valid reset token
      const user = await userModel.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordTokenExpire: { $gt: Date.now() },
      });

      if (!user) {
        return next(createHttpError(400, 'Invalid or expired token.'));
      }

      // Hash password & reset token
      user.password = await bcryptjs.hash(password, 10);
      user.resetPasswordToken = null;
      user.resetPasswordTokenExpire = null;
      await user.save();

      // Generate new JWT token for user login
      const jwtToken = jwt.sign(
        { _id: user._id },
        config.JWT_SECRET as string,
        {
          expiresIn: '7d',
        }
      );

      // Send response with JWT token
      res
        .status(200)
        .cookie('jwt', jwtToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Secure=true only in production
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json({
          message: 'Password reset successful! You are now logged in.',
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
          success: true,
          token: jwtToken,
        });
    } catch (error) {
      return next(createHttpError(500, 'Internal server error'));
    }
  }
);

export const updatePassword = expressAsyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { currentPassword, newPassword, confirmNewPassword } = req.body;

      // Check if all fields are provided
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        return next(createHttpError(400, 'All fields are required'));
      }

      // Find user with password field
      const user = await userModel.findById(req.user?._id).select('+password');

      // If user not found
      if (!user) {
        return next(createHttpError(404, 'User not found'));
      }

      // Check if current password matches
      const isPasswordMatch = await bcryptjs.compare(
        currentPassword,
        user.password
      );

      if (!isPasswordMatch) {
        return next(createHttpError(400, 'Current Password is Incorrect'));
      }

      // Validate new password length
      if (newPassword.length < 8 || newPassword.length > 16) {
        return next(
          createHttpError(400, 'Password must be between 8 to 16 characters.')
        );
      }

      // Check if new password and confirm password match
      if (newPassword !== confirmNewPassword) {
        return next(createHttpError(400, 'Passwords do not match.'));
      }

      // Hash and save new password
      user.password = await bcryptjs.hash(newPassword, 10);
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Password updated successfully',
      });
    } catch (error) {
      return next(createHttpError(500, 'Internal Server Error'));
    }
  }
);
