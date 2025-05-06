const Course = require('../models/Course');
const Question = require('../models/Question');

const XLSX = require('xlsx');
// exports.createCourse = async (req, res) => {
//   const course = await Course.create(req.body);
//   res.status(201).json(course);
// };


exports.createCourse = async (req, res) => {
  const { courseName, subjectsPerSemester } = req.body; // subjectsPerSemester is a map

  try {
    // Build years and semesters dynamically
    const years = [];

    for (let y = 1; y <= 3; y++) {
      const semesters = [];

      for (let s = (y - 1) * 2 + 1; s <= y * 2; s++) {
        semesters.push({
          semester: s,
          subjects: (subjectsPerSemester[s] || []).map(subjectName => ({ subjectName }))
        });
      }

      years.push({ year: y, semesters });
    }

    const course = new Course({ courseName, years });
    await course.save();

    res.status(201).json({ message: 'Course created with subjects', course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

// exports.getCourseDetails = async (req, res) => {
//   try {
//     const { courseName } = req.params; // Get course name from the URL parameter

//     // Find the course by name (case-insensitive)
//     const course = await Course.findOne({ courseName: { $regex: new RegExp(`^${courseName}$`, 'i') } });

//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' });
//     }

//     res.status(200).json({ course });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error', error });
//   }
// };

exports.getCourseDetails = async (req, res) => {
  try {
    const { courseName } = req.params;

    const course = await Course.findOne({
      courseName: { $regex: new RegExp(`^${courseName}$`, 'i') }
    }).lean(); // lean() returns plain JS object

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Transform subject _id to subjectId
    course.years = course.years.map(year => ({
      ...year,
      semesters: year.semesters.map(sem => ({
        ...sem,
        subjects: sem.subjects.map(subject => ({
          subjectId: subject._id, // Add subjectId
          subjectName: subject.subjectName
        }))
      }))
    }));

    res.status(200).json({ course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error });
  }
};





exports.getQuestionsBySubjectId = async (req, res) => {
  const { subjectId } = req.params;

  try {
    // Fetch all quizzes for the given subjectId
    const quizzes = await Question.find({ subjectId }).select(
      'subject testStartTime testEndTime durationInMinutes isActive'
    );

    if (!quizzes || quizzes.length === 0) {
      return res.status(404).json({ message: 'No quizzes found for this subject' });
    }

    // Prepare the response
    const response = {
      success: true,
      subjectId,
      subject: quizzes[0]?.subject || 'Unknown Subject', // Use the subject name from the first quiz
      quizzes: quizzes.map((quiz, index) => ({
        quizName: `Quiz ${index + 1}`, // Generate quiz names like Quiz 1, Quiz 2, etc.
        id: quiz._id,
        status: quiz.isActive ? 'Active' : 'Inactive', // Show status
        scheduledDate: quiz.testStartTime.toISOString().split('T')[0], // Extract date
        scheduledTime: quiz.testStartTime.toISOString().split('T')[1].split('.')[0], // Extract time
        durationInMinutes: quiz.durationInMinutes,
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching quizzes by subjectId:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.viewQuestionForm = async (req, res) => {
  const { subjectId } = req.params;

  try {
    // Fetch all quizzes for the given subjectId without filtering fields
    const quizzes = await Question.find({ subjectId });

    if (!quizzes || quizzes.length === 0) {
      return res.status(404).json({ message: 'No quizzes found for this subject' });
    }

    // Prepare the response
    const response = {
      success: true,
      subjectId,
      quizzes, // Return all data as-is
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching quizzes by subjectId:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

   
// exports.uploadExcelQuestions = async (req, res) => {
//   if (!req.files || !req.files.file) return res.status(400).json({ message: 'No file uploaded' });
//   const file = req.files.file;
 
//   const workbook = XLSX.read(file.data);
//   const sheet = workbook.Sheets[workbook.SheetNames[0]];
//   const questions = XLSX.utils.sheet_to_json(sheet);
//   const now = new Date();
//   const oneHourLater = new Date(now.getTime() + (60 * 60 * 1000));
//   const formatted = questions.map(q => ({
//     subject: q.subject,
//     questionText: q.questionText,
//     options: [q.option1, q.option2, q.option3, q.option4],
//     correctAnswer: q.correctAnswer,
//     fileName: file.name,
//     testStartTime: now,
//     testEndTime: oneHourLater,    
//     isActive: false                      
//   }));

//   await Question.insertMany(formatted);
//   res.status(201).json({ message: 'Questions uploaded successfully' });
// };

exports.uploadExcelQuestions = async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const file = req.files.file;
  const { startTime, durationInMinutes, subjectId } = req.body; // Extract from body

  try {
    const workbook = XLSX.read(file.data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const questions = XLSX.utils.sheet_to_json(sheet);

    if (!questions || questions.length === 0) {
      return res.status(400).json({ message: 'No questions found in the uploaded file' });
    }

    const testStartTime = new Date(startTime); // Use startTime from request
    const testEndTime = new Date(testStartTime.getTime() + durationInMinutes * 60 * 1000); // Add duration

    // Map questions properly
    const mappedQuestions = questions.map((q) => ({
      questionText: q.questionText || 'No question text provided',
      options: [q.option1, q.option2, q.option3, q.option4].filter((opt) => opt), // Filter out empty options
      correctAnswer: q.correctAnswer || 'No correct answer provided',
    }));

    // Log the mapped questions for debugging
    console.log('Mapped Questions:', mappedQuestions);

    // Create a single document for all questions
    const quizDocument = {
      subjectId,
      subject: questions[0]?.subject || 'Unknown Subject', // Use subject from the first question
      fileName: file.name,
      durationInMinutes,
      testStartTime,
      testEndTime,
      isActive: false,
      questions: mappedQuestions,
    };

    // Save the single document
    await Question.create(quizDocument);

    res.status(201).json({ message: 'Quiz uploaded successfully as a single document' });
  } catch (error) {
    console.error('Error uploading quiz:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};
// Activate or Deactivate a Test
exports.toggleQuestionStatus = async (req, res) => {
    const { questionId, isActive } = req.body;
  
    try {
      const question = await Question.findById(questionId);
      if (!question) return res.status(404).json({ message: 'Question not found' });
  
      question.isActive = isActive;
      await question.save();
  
      res.status(200).json({ message: `Question ${isActive ? 'activated' : 'deactivated'}` });
    } catch (err) {
      res.status(500).json({ message: 'Error toggling question status', error: err });
    }
  };

  exports.getActiveTests = async (req, res) => {
    try {
      const activeTests = await Question.find({ isActive: true });
      res.status(200).json({ success: true, tests: activeTests });
    } catch (error) {
      console.error('Error fetching active tests:', error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  };