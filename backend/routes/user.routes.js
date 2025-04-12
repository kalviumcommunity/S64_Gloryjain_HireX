import express from 'express';
import { User } from '../models/user.model.js';

const router = express.Router();

// GET all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST - Create a new user
router.post('/', async (req, res) => {
    try {
        const {
            fullname,
            email,
            phoneNumber,
            password,
            role,
            profile
        } = req.body;

        // Validate required fields
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check for existing user with same email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create and save new user
        const newUser = new User({
            fullname,
            email,
            phoneNumber,
            password,
            role,
            profile
        });

        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// PUT - Update a user by ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("PUT /api/users/:id error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});


export default router;
