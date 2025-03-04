import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { config } from './config/config';
import globalError from './middlewares/globalError';

const app = express();
// Middwares configuration
app.use(
  cors({
    credentials: true,
    origin: [config.FRONT_END_URL as string],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Route Configuration

// Global Error Handler
app.use(globalError);
export default app;
