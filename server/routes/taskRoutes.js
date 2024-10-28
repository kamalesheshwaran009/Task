import { Router } from 'express';
import { Types } from 'mongoose';
import Task from '../models/task.js';
import jwt from 'jsonwebtoken';

const router = Router();

const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('Token verification failed:', err);
        return res.status(403).json({ error: 'Failed to authenticate token' });
      }
      req.userId = decoded.userId;
      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

router.get('/', authenticateUser, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

// Add a new task
router.post('/', authenticateUser, async (req, res) => {
    try {
        const { title, description, dueDate, status, category } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required.' });
        }

        const newTask = new Task({
            title,
            description,
            dueDate,
            status,
            category,
            userId: req.userId // Use userId from the request
        });

        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        console.error('Error saving task:', error);
        res.status(500).json({ error: 'Error saving task' });
    }
});

// Update a task
router.put('/:id', authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, dueDate, status, category } = req.body;

        if (!id || !Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid Task ID' });
        }

        const updateData = { title, description, dueDate, status, category, userId: req.userId }; // Use userId from the request

        const updatedTask = await Task.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Error updating task' });
    }
});

// Delete a task
router.delete('/:id', authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || !Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid Task ID' });
        }

        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(204).send(); // No content to send back
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Error deleting task' });
    }
});

export default router;
