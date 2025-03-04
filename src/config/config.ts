import 'dotenv/config';

const _config = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGO_URI,
  FRONT_END_URL: process.env.FRONT_END_URL,
  NODE_ENV: process.env.NODE_ENV,
};

export const config = Object.freeze(_config);
