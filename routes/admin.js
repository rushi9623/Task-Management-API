const express = require('express');
const User = require('../models/Admin'); // Ensure this points to the correct Admin model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');
const roleAuthorization = require('../middlewares/role');

const router = express.Router();

// Admin Registration
router.post('/register', async (req, res) => {
    try {
        const { username, lastname, email, password } = req.body;

        // Check if the admin already exists
        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin with this email already exists' });
        }

        // Create a new admin
        const newAdmin = new User({ username, lastname, email, password, role: 'admin' });
        await newAdmin.save();

        res.status(201).json({ message: 'Admin created successfully', admin: newAdmin });
    } catch (error) {
        res.status(500).json({ message: 'Error creating admin', error: error.message });
    }
});

// Admin Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await User.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        res.status(200).json({ message: 'Login successful', admin: { username: admin.username, role: admin.role } });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

// Get Current Admin Details
router.get('/me', auth, roleAuthorization('admin'), async (req, res) => {
    try {
        const admin = await User.findById(req.user.id).select('-password');
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admin details', error: error.message });
    }
});

module.exports = router;
