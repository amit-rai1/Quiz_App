const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true, unique: true },
  years: [
    {
      yearName: String,
      semesters: [
        {
          semesterName: String,
          subjects: [
            { subjectName: String }
          ]
        }
      ]
    }
  ]
}, { timestamps: true });
module.exports = mongoose.model('Course', courseSchema);