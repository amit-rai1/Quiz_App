const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middlewares/authMiddleware');
const { createCourse, getCourseDetails, uploadExcelQuestions, toggleTest, getQuestionsBySubjectId, viewQuestionForm } = require('../controllers/adminController');
router.post('/course', protect, isAdmin, createCourse);
router.get('/course/:courseName',protect, getCourseDetails);
router.get('/questions/:subjectId', protect, getQuestionsBySubjectId);
router.get('/viewQuestionForm/:subjectId', protect, viewQuestionForm);


// router.post('/question', protect, isAdmin, addQuestion);
router.post('/upload-questions', protect, isAdmin, uploadExcelQuestions);
module.exports = router;