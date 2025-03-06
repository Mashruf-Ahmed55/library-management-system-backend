import 'dotenv/config';

const _config = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGO_URI,
  FRONT_END_URL: process.env.FRONT_END_URL,
  NODE_ENV: process.env.NODE_ENV,
  NODEMAILER_HOST: process.env.NODEMAILER_HOST || '',
  NODEMAILER_PORT: process.env.NODEMAILER_PORT || '',
  NODEMAILER_USER: process.env.NODEMAILER_USER || '',
  NODEMAILER_PASS: process.env.NODEMAILER_PASS || '',
  NODEMAILER_SERVICE: process.env.NODEMAILER_SERVICE || '',
  JWT_SECRET: process.env.JWT_SECRET
};

export const config = Object.freeze(_config);
