import { connect } from 'mongoose';
import { config } from 'dotenv';

config();

const connectDB = async () => {
  try {
    await connect(process.env.ATLAS_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;