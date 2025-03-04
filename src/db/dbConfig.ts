import { MongoError } from 'mongodb';
import mongoose from 'mongoose';
import { config } from '../config/config';
export default async function connectDb() {
  try {
    mongoose.connection.on('connected', () => {
      console.log('Connecting to MongoDB...');
    });
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err.message);
      process.exit(1);
    });
    await mongoose.connect(config.MONGODB_URI as string, {
      dbName: 'book_library',
    });
    console.log('MongoDB connected successfully');
  } catch (err: unknown) {
    if (err instanceof MongoError) {
      console.error('Failed to connect to MongoDB:', err.message);
    } else {
      console.error('An unexpected error occurred');
    }
    process.exit(1);
  }
}
