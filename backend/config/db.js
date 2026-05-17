import mongoose from 'mongoose';

global.isDbConnected = false;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/noir_brew', {
      serverSelectionTimeoutMS: 2000 // Quick timeout to fallback instantly
    });
    global.isDbConnected = true;
    console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    global.isDbConnected = false;
    console.log(`📡 MongoDB is currently offline. Fallback mode activated.`);
    console.log(`💡 Resilient Storage: Local JSON Repository Active!`);
  }
};
