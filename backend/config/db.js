const mongoose = require('mongoose');

const connectDB = async () => {
  try {
 const mongouri=   await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
      console.log(process.env.MONGO_URI,"MongoDB URI");

    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

module.exports = connectDB;