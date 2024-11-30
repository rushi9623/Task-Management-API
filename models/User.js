const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the user schema
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true, // Automatically trim whitespace
    },
    lastname: {
        type: String,
        required: [true, 'Lastname is required'],
        unique: true,
        trim: true, // Automatically trim whitespace
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true, // Store email in lowercase
        trim: true, // Automatically trim whitespace
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6, // Minimum length for password
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt timestamps
});

// Pre-save hook to hash passwords before saving them to the database
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
