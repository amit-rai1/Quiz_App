const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    phone: Number,
    CrNo: { type: Number, unique: true },
    role: { type: String, enum: ['admin', 'student'], default: 'student' },
    courseName: String,
    year: {
        type: Number, // or String if you use strings like "First", "Second", etc.
        required: true
      },
      semester: {
        type: Number, // or String, depending on your app
        required: true
      },
    subjects: [String]
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    console.log('Original password:', this.password);
    if (!this.isModified('password')) {
      console.log('Password not modified, skipping hashing');
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Hashed password:', this.password);
    next();
  });

  
  // Method to compare passwords
  userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
module.exports = mongoose.model('User', userSchema);
