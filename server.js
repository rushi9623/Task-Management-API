const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const taskRoutes = require('./routes/task');
const cookieParser = require('cookie-parser'); // Import cookie-parser

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware here

// Routes
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/task', taskRoutes);

// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
    res.send('Welcome to the Task Management API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
