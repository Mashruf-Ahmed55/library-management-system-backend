import { NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';
import { config } from '../config/config';

const globalError = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const errorResponse = {
    message: err.message,
    stack: config.NODE_ENV === 'development' ? err.stack : null,
  };
  res.status(statusCode).json(errorResponse);
};

export default globalError;
