import config from '@/config';
import mongoose from 'mongoose';

if (!config.mongodbUri) {
  throw new Error('MONGODB_URI must be set in .env');
}
const MONGODB_URI = config.mongodbUri;

export async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}
