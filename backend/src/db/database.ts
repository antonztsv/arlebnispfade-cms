import config from '@/config';
import mongoose from 'mongoose';

export async function connectToDatabase() {
  console.log('Connecting to MongoDB...');

  if (!config.mongodbUri) {
    throw new Error('MONGODB_URI must be set in .env');
  }

  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}
