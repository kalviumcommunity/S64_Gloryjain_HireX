// backend/routes/user.routes.js
import express from 'express';
// Removed bcrypt import
import { User } from '../models/user.model.js';
// Import both upload middleware and its error handler
import { upload, handleMulterError } from '../middleware/upload.middleware.js';
import fs from 'fs'; // Needed for potential file cleanup on error

const router = express.Router();

// --- Helper Function to Clean Up Uploaded Files on Error ---
const cleanupFilesOnError = (files) => {
    if (!files) return;
    Object.values(files).forEach(fileArray => {
        if (Array.isArray(fileArray)) {
            fileArray.forEach(file => {
                if (file && file.path) {
                    fs.unlink(file.path, (err) => {
                        if (err) console.error(`Error deleting file ${file.path} on cleanup:`, err);
                    });
                }
            });
        }
    });
};

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

// POST - Create a new user with file uploads
// Apply upload middleware first, then the error handler, then the route logic
router.post('/', upload, handleMulterError, async (req, res) => {
    try {
        const {
            fullname,
            email,
            phoneNumber,
            password, // Plain text password
            role
        } = req.body;

        // --- Basic Validation ---
        if (!fullname || !email || !phoneNumber || !password || !role) {
            // Cleanup files if validation fails early
            cleanupFilesOnError(req.files);
            return res.status(400).json({ message: 'Missing required fields' });
        }
        // Add more specific validation if needed

        // --- Check for existing user ---
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            // Cleanup files if user already exists
            cleanupFilesOnError(req.files);
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // --- Access uploaded files ---
        // req.files will be an object like: { resume: [file], profilePhoto: [file] }
        const resumeFile = req.files?.resume?.[0];
        const profilePhotoFile = req.files?.profilePhoto?.[0];

        // --- Construct Profile Data ---
        const profileData = {
            bio: req.body.bio || "", // Allow passing bio if you add it to frontend form
            skills: req.body.skills || [], // Allow passing skills
            ...(resumeFile && {
                resume: resumeFile.filename,
                resumeOriginalName: resumeFile.originalname
            }),
            ...(profilePhotoFile && {
                profilePhoto: profilePhotoFile.filename
            })
            // company: role === 'recruiter' ? req.body.companyId : null // Handle company assignment
        };

        // --- Create New User Instance (Password is NOT hashed) ---
        const newUser = new User({
            fullname,
            email: email.toLowerCase().trim(),
            phoneNumber,
            password: password, // Saving plain text password - UNSAFE!
            role,
            profile: profileData
        });

        // --- Save User ---
        const savedUser = await newUser.save();

        // --- Prepare Response (Exclude Password) ---
        const userResponse = savedUser.toObject(); // Convert mongoose doc to plain object
        delete userResponse.password; // Remove password before sending back

        res.status(201).json({ message: "User registered successfully!", user: userResponse });

    } catch (error) {
        console.error("Error in POST /api/users:", error);
         // Cleanup files if saving fails
        cleanupFilesOnError(req.files);

        // Handle potential duplicate key errors from MongoDB (for email unique constraint)
        if (error.code === 11000) {
             return res.status(400).json({ message: "Email address already in use." });
        }
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            // Extract useful messages from validation errors
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ message: "Validation Error", errors: messages });
        }

        res.status(500).json({ message: 'Server Error during user creation.' });
    }
});

// POST - User Login (Comparing Plain Text Passwords - UNSAFE!)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });

        // Direct comparison of plain text passwords
        if (!user || user.password !== password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // --- Prepare Response (Exclude Password) ---
        const userResponse = user.toObject();
        delete userResponse.password;

        // Just return the user data (no token generation shown here)
        res.status(200).json({ message: 'Login successful', user: userResponse });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// PUT - Update a user by ID (Example - Needs more refinement for file updates)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Find user first to ensure it exists
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // IMPORTANT: Handle password updates carefully. If a new password is provided,
    // it should ideally be hashed (but here we store plain text as per request).
    // Exclude password from direct update if not provided or handle specifically.
    const updateData = { ...req.body };
    if (!updateData.password) {
        delete updateData.password; // Don't update password if not provided
    }
    // Handle profile updates, potentially including new file uploads (more complex)

    // { new: true } returns the updated document
    // select('-password') excludes password from the returned updated document
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');

    if (!updatedUser) { // Should not happen if findById worked, but good check
         return res.status(404).json({ message: 'User not found during update' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("PUT /api/users/:id error:", error);
     if (error.name === 'CastError') { // Handle invalid ID format
         return res.status(400).json({ message: 'Invalid user ID format' });
     }
     if (error.code === 11000) { // Handle potential duplicate email on update
            return res.status(400).json({ message: "Email address already in use by another account." });
     }
    res.status(500).json({ message: 'Server Error during user update' });
  }
});


export default router;