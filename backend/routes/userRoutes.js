const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getCourses, takeTest } = require('../controllers/userController');
// router.get('/courses', protect, getCourses);
router.post('/submit-test', protect, takeTest);
module.exports = router;
