const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  years: [
    {
      year: Number,
      semesters: [
        {
          semester: Number,
          subjects: [{ subjectName: String }]
        }
      ]
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
