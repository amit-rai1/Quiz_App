const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    subject: { type: String, required: true },
    fileName: { type: String, required: true },
    testStartTime: { type: Date, required: true },
    testEndTime: { type: Date, required: true },
    durationInMinutes: { type: Number, required: true },
    isActive: { type: Boolean, default: false },
    questions: [
      {
        questionText: { type: String, required: true },
        options: { type: [String], required: true },
        correctAnswer: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);