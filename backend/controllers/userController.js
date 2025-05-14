const Course = require('../models/Course');
const Question = require('../models/Question');
const TestResponse = require('../models/TestResponse');
exports.getCourses = async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
};
// exports.takeTest = async (req, res) => {
//   const response = await TestResponse.create({ user: req.user._id, ...req.body });
//   res.status(201).json(response);
// };

// exports.takeTest = async (req, res) => {
//     // Save the test response
//     const response = await TestResponse.create({ user: req.user._id, ...req.body });
  
//     // Extract all questionIds from the user's responses
//     const questionIds = req.body.responses.map(ans => ans.questionId);
  
//     // Fetch all questions in one query using the $in operator
//     const questions = await Question.find({ _id: { $in: questionIds } });
  
//     // Create a Map to access the correct answer quickly
//     const questionMap = questions.reduce((acc, question) => {
//       acc[question._id.toString()] = question.correctAnswer;
//       return acc;
//     }, {});
  
//     // Calculate the marks by comparing selected options with correct answers
//     let marks = 0;
//     for (const ans of req.body.responses) {
//       if (questionMap[ans.questionId.toString()] === ans.selectedOption) {
//         marks += 1; // +1 mark for correct answer
//       }
//     }
  
//     // Return the total marks and test response data
//     res.status(201).json({
//       message: "Test submitted successfully!",
//       totalMarks: marks,
//       totalQuestions: req.body.responses.length,
//       data: response
//     });
//   };

exports.takeTest = async (req, res) => {
  try {
    // Check if the user has already submitted the test for the subject
    const existingResponse = await TestResponse.findOne({ 
      user: req.user._id, 
      subject: req.body.subjectId 
    });

    if (existingResponse) {
      return res.status(400).json({
        message: "You have already submitted the test for this subject. Retakes are not allowed."
      });
    }

    // Get user details from req.user
    const { name, email } = req.user;
    const { subjectId, responses } = req.body;

    // Fetch the subject details (optional)
    // const subject = await Subject.findById(subjectId);

    // Save the test response with user details
    const response = await TestResponse.create({
      user: req.user._id,
      name,
      email,
      responses
    });

    // Extract all questionIds from the user's responses
    const questionIds = responses.map(ans => ans.questionId);

    // Fetch all questions in one query using the $in operator
    const questions = await Question.find({ _id: { $in: questionIds } });

    // Create a Map to access the correct answer quickly
    const questionMap = questions.reduce((acc, question) => {
      acc[question._id.toString()] = question.correctAnswer;
      return acc;
    }, {});

    // Calculate the marks by comparing selected options with correct answers
    let marks = 0;
    for (const ans of responses) {
      if (questionMap[ans.questionId.toString()] === ans.selectedOption) {
        marks += 1; // +1 mark for correct answer
      }
    }

    // Return the total marks and test response data
    res.status(201).json({
      message: "Test submitted successfully!",
      totalMarks: marks,
      totalQuestions: responses.length,
      userInfo: { name, email },
      data: response
    });

  } catch (error) {
    console.error('Error in submitting test:', error);
    res.status(500).json({ message: "An error occurred while submitting the test.", error });
  }
};
