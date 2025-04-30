const User = require('../models/User');
const Course = require('../models/Course');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      gender,
      phone,
      CrNo,
      courseName,
      yearName,
      semesterName,
    } = req.body;

    const course = await Course.findOne({ courseName: { $regex: new RegExp(`^${courseName}$`, 'i') } });
    // console.log(course, "course");

    if (!course) return res.status(404).json({ message: 'Course not found' });

    const year = course.years.find(y => y.yearName === yearName);
    if (!year) return res.status(404).json({ message: 'Year not found in course' });

    const semester = year.semesters.find(s => s.semesterName === semesterName);
    if (!semester) return res.status(404).json({ message: 'Semester not found in year' });

    const subjects = semester.subjects.map(s => s.subjectName);

    const user = await User.create({
      name,
      email,
      password,
      gender,
      phone,
      CrNo,
      role: 'student',
      courseName,
      year: yearName,
      semester: semesterName,
      subjects
    });

    res.status(201).json({ token: generateToken(user._id) });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({ token: generateToken(user._id) });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};