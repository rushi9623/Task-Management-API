const express = require('express');
const Task = require('../models/Task');
const auth = require('../middlewares/auth');
const roleAuthorization = require('../middlewares/role');

const router = express.Router();

// Create a new task (Only admin can create a task)
router.post('/', auth, roleAuthorization('admin'), async (req, res) => {
    const { title, description, dueDate, assignedTo } = req.body; // Ensure field names match

    try {
        const task = new Task({ title, description, dueDate, assignedTo }); // Ensure field names match
        await task.save(); // Fixed the variable name here
        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error: error.message });
    }
});

// Get all tasks (All users)
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find().populate('assignedTo', 'username email'); // Ensure field names match
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
});

// Update a task (Admin Only can update)
router.put('/:id', auth, roleAuthorization('admin'), async (req, res) => {
    const { title, description, status, dueDate, assignedTo } = req.body; // Ensure field names match

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, { title, description, status, dueDate, assignedTo }, { new: true });
        res.status(200).json({ message: 'Task updated successfully', task });
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
});

// Delete a task (Admin only can delete)
router.delete('/:id', auth, roleAuthorization('admin'), async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
});

module.exports = router;
