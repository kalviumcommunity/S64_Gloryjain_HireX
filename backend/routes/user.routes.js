// backend/routes/user.routes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { upload, handleMulterError, cleanupFilesOnError } from '../middleware/upload.middleware.js';

const router = express.Router();

// GET all users
router.get('/', async (req, res) => {
    try {
        // Exclude password field from the result
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        console.error("GET /api/users error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST - User Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRY }
        );

        // Prepare response (exclude password)
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({
            message: 'Login successful',
            token,
            user: userResponse
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST - Create a new user with file uploads
router.post('/', upload, handleMulterError, async (req, res) => {
    try {
        const {
            fullname,
            email,
            phoneNumber,
            password,
            role
        } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            cleanupFilesOnError(req.files);
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            cleanupFilesOnError(req.files);
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const resumeFile = req.files?.resume?.[0];
        const profilePhotoFile = req.files?.profilePhoto?.[0];

        const profileData = {
            bio: req.body.bio || "",
            skills: req.body.skills || [],
            ...(resumeFile && {
                resume: resumeFile.filename,
                resumeOriginalName: resumeFile.originalname
            }),
            ...(profilePhotoFile && {
                profilePhoto: profilePhotoFile.filename
            })
        };

        const newUser = new User({
            fullname,
            email: email.toLowerCase().trim(),
            phoneNumber,
            password,
            role,
            profile: profileData
        });

        const savedUser = await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: savedUser._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRY }
        );

        const userResponse = savedUser.toObject();
        delete userResponse.password;

        res.status(201).json({
            message: "User registered successfully!",
            token,
            user: userResponse
        });

    } catch (error) {
        console.error("Error in POST /api/users:", error);
        cleanupFilesOnError(req.files);

        if (error.code === 11000) {
            return res.status(400).json({ message: "Email address already in use." });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ message: "Validation Error", errors: messages });
        }

        res.status(500).json({ message: 'Server Error during user creation.' });
    }
});

// Protected routes
router.use(authMiddleware);

// GET user profile
router.get('/profile', async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// PUT - Update user profile
router.put('/profile', upload, handleMulterError, async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        
        // Create update object
        const updateData = {
            fullname,
            email,
            phoneNumber,
            'profile.bio': bio,
            'profile.skills': JSON.parse(skills)
        };

        const resumeFile = req.files?.resume?.[0];
        const profilePhotoFile = req.files?.profilePhoto?.[0];

        if (resumeFile) {
            updateData['profile.resume'] = resumeFile.filename;
            updateData['profile.resumeOriginalName'] = resumeFile.originalname;
        }
        if (profilePhotoFile) {
            updateData['profile.profilePhoto'] = profilePhotoFile.filename;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateData },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error("Update profile error:", error);
        cleanupFilesOnError(req.files);
        res.status(500).json({ message: 'Server Error' });
    }
});

// DELETE - Delete user profile
router.delete('/profile', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user._id);
        
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User account deleted successfully' });
    } catch (error) {
        console.error("Delete profile error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;