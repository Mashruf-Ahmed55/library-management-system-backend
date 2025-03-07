import { NextFunction, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import userModel from '../user/user.model';
import { IUser } from './../user/user.type';

// Custom Request type to support req.user
interface AuthRequest extends Request {
  user?: IUser;
}

export const isAuthenticed = expressAsyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { jwt: token } = req.cookies;

    if (!token) {
      return next(createHttpError(401, 'Unauthorized user'));
    }

    try {
      const decoded = jwt.verify(token, config.JWT_SECRET as string) as {
        _id: string;
      };

      const user = await userModel.findById(decoded._id);

      if (!user) {
        return next(createHttpError(401, 'User not found'));
      }

      req.user = user;

      next();
    } catch (error) {
      return next(createHttpError(401, 'Invalid token'));
    }
  }
);
