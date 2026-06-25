import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    // ✅ REMOVE all deprecated options
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Only use these options if needed:
      // - No useNewUrlParser (default in v4+)
      // - No useUnifiedTopology (default in v4+)
      // - Add other options if required
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;