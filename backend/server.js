const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const { errorHandler } = require('./middlewares/errorMiddleware');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cronJobs = require('./cronJobs');

dotenv.config();
connectDB();
const app = express();

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(mongoSanitize());
app.use(rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
}));
app.use(fileUpload());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT,"0.0.0.0",() => console.log(`Server running on port ${PORT}`));
