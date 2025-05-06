const User = require('../models/User');
const Course = require('../models/Course');
const generateToken = require('../utils/generateToken');
const CryptoJS = require('crypto-js');
// exports.register = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       password,
//       gender,
//       phone,
//       CrNo,
//       courseName,
//       yearName,
//       semesterName,
//     } = req.body;

//     const course = await Course.findOne({ courseName: { $regex: new RegExp(`^${courseName}$`, 'i') } });
//     // console.log(course, "course");

//     if (!course) return res.status(404).json({ message: 'Course not found' });

//     const year = course.years.find(y => y.yearName === yearName);
//     if (!year) return res.status(404).json({ message: 'Year not found in course' });

//     const semester = year.semesters.find(s => s.semesterName === semesterName);
//     if (!semester) return res.status(404).json({ message: 'Semester not found in year' });

//     const subjects = semester.subjects.map(s => s.subjectName);

//     const user = await User.create({
//       name,
//       email,
//       password,
//       gender,
//       phone,
//       CrNo,
//       role: 'student',
//       courseName,
//       year: yearName,
//       semester: semesterName,
//       subjects
//     });

//     res.status(201).json({ token: generateToken(user._id) });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

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
      year,
      semester,
      role = 'student' // default to 'student' if not provided
    } = req.body;

    const course = await Course.findOne({
      courseName: { $regex: new RegExp(`^${courseName}$`, 'i') }
    });

    if (!course) return res.status(404).json({ message: 'Course not found' });

    const courseYear = course.years.find(y => y.year === year);
    if (!courseYear) {
      console.log('Year not found in course:', year);
      return res.status(404).json({ message: 'Year not found in course' });
    }

    const courseSemester = courseYear.semesters.find(s => s.semester === semester);
    if (!courseSemester) {
      console.log('Semester not found in year:', semester);
      return res.status(404).json({ message: 'Semester not found in year' });
    }

    const subjects = courseSemester.subjects.map(s => s.subjectName);

    const user = await User.create({
      name,
      email,
      password,
      gender,
      phone,
      CrNo,
      role, // dynamically set role
      courseName,
      year,
      semester,
      subjects
    });

    const token = generateToken(
      user._id,
      user.role,
      user.courseName,
      user.year,
      user.semester,
      subjects
    );

    res.status(201).json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const isMatch = await user.matchPassword(password);

//     if (isMatch) {
//       if (user.role === 'student') {
//         const course = await Course.findOne({ courseName: user.courseName });
//         if (!course) return res.status(404).json({ message: 'Course not found' });

//         const year = course.years.find(y => Number(y.year) === Number(user.year));
//         if (!year) return res.status(404).json({ message: 'Year not found in course' });

//         const semester = year.semesters.find(s => s.semester === user.semester);
//         if (!semester) return res.status(404).json({ message: 'Semester not found in year' });

//         const subjects = semester.subjects.map(sub => sub.subjectName);

//         const token = generateToken({
//           userId: user._id,
//           role: user.role,
//           courseName: user.courseName,
//           year: user.year,
//           semester: user.semester,
//           subjects,
//         });

//         return res.json({
//           message: 'Login successful',
//           token
//         });
//       } else {
//         const token = generateToken({
//           userId: user._id,
//           role: user.role,
//         });

//         return res.json({
//           message: 'Login successful',
//           token,
//         });
//       }
//     } else {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }
//   } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).json({ message: 'Server error during login' });
//   }
// };


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(password);

    if (isMatch) {
      if (user.role === 'student') {
        const course = await Course.findOne({ courseName: user.courseName });
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const year = course.years.find(y => Number(y.year) === Number(user.year));
        if (!year) return res.status(404).json({ message: 'Year not found in course' });

        const semester = year.semesters.find(s => s.semester === user.semester);
        if (!semester) return res.status(404).json({ message: 'Semester not found in year' });

        // Include both subjectName and subjectId
        const subjects = semester.subjects.map(sub => ({
          subjectName: sub.subjectName,
          subjectId: sub._id,
        }));

        const token = generateToken({
          userId: user._id,
          role: user.role,
          courseName: user.courseName,
          year: user.year,
          semester: user.semester,
          subjects, // Include subjects with subjectId
        });

        return res.json({
          message: 'Login successful',
          token,
        });
      } else {
        const token = generateToken({
          userId: user._id,
          role: user.role,
        });

        return res.json({
          message: 'Login successful',
          token,
        });
      }
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};