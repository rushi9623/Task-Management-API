const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the admin schema
const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6, // Minimum length for password
    },
    role: {
        type: String,
        default: 'admin', // Default role
    },
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt timestamps
});

// Pre-save hook to hash password before saving the admin
adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare passwords
adminSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Create the Admin model
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
