const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middlewares/authMiddleware');
const { createCourse, addQuestion, uploadExcelQuestions, toggleTest, getQuestionsBySubjectId, viewQuestionForm } = require('../controllers/adminController');
router.post('/course', protect, isAdmin, createCourse);
router.get('/questions/:subjectId', protect, isAdmin, getQuestionsBySubjectId);
router.get('/viewQuestionForm/:subjectId', protect, isAdmin, viewQuestionForm);


router.post('/question', protect, isAdmin, addQuestion);
router.post('/upload-questions', protect, isAdmin, uploadExcelQuestions);
module.exports = router;