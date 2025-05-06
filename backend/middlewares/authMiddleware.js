const jwt = require('jsonwebtoken');
const User = require('../models/User');
// exports.protect = async (req, res, next) => {
//   let token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'No token' });
//   const decoded = jwt.verify(token, process.env.JWT_SECRET);
//   console.log("Decoded token:", decoded);

  
//   req.user = await User.findById(decoded.id).select('-password');
//   console.log("User found:", req.user);

//   next();
// };

// exports.protect = async (req, res, next) => {
//     try {
//       console.log('Authorization Header:', req.headers.authorization);
  
//       let token = req.headers.authorization?.split(' ')[1];
//       console.log('Extracted token:', token);
  
//       if (!token) return res.status(401).json({ message: 'No token provided' });
  
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       console.log('Decoded token:', decoded);
  
//       req.user = await User.findById(decoded.id).select('-password');
//       console.log('User found:', req.user);
  
//       if (!req.user) {
//         return res.status(401).json({ message: 'No user found with this token' });
//       }
  
//       next();
//     } catch (error) {
//       console.error('Error in protect middleware:', error.message);
//       res.status(401).json({ message: 'Token validation failed' });
//     }
//   };
exports.protect = async (req, res, next) => {
  try {
    console.log('Authorization Header:', req.headers.authorization);

    let token = req.headers.authorization?.split(' ')[1];
    console.log('Extracted token:', token);

    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    // Extract userId from the decoded token
    const userId = decoded.id?.userId || decoded.id;
    console.log('Extracted userId:', userId);

    req.user = await User.findById(userId).select('-password');
    console.log('User found:', req.user);

    if (!req.user) {
      return res.status(401).json({ message: 'No user found with this token' });
    }

    next();
  } catch (error) {
    console.error('Error in protect middleware:', error.message);
    res.status(401).json({ message: 'Token validation failed' });
  }
};
exports.isAdmin = (req, res, next) => {
    // console.log('Authorization Header:', req.headers.authorization);

  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });
  next();
};