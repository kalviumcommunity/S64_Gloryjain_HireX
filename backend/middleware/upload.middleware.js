// backend/middleware/upload.middleware.js
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'; // Import fs to create directories if needed

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the base upload directory and subdirectories
const uploadDir = path.join(process.cwd(), 'backend/uploads');
const resumeDir = path.join(uploadDir, 'resume');
const profileDir = path.join(uploadDir, 'profile');

// --- Ensure Upload Directories Exist ---
try {
    // Use { recursive: true } which creates parent directories if needed
    // and doesn't throw an error if the directory already exists.
    fs.mkdirSync(resumeDir, { recursive: true });
    fs.mkdirSync(profileDir, { recursive: true });
} catch (err) {
    console.error("Error creating upload directories:", err);
    // Depending on the application, you might want to exit or throw a fatal error
    // For example: process.exit(1);
    // Or rethrow the error to be handled higher up: throw err;
}
// --- End Directory Creation ---


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Check the fieldname and set the appropriate destination
        if (file.fieldname === "resume") {
            cb(null, resumeDir); // Save resumes to ../uploads/resume
        } else if (file.fieldname === "profilePhoto") {
            cb(null, profileDir); // Save profile photos to ../uploads/profile
        } else {
            // Optional: Handle unexpected field names if they somehow bypass the .fields filter
            // This shouldn't normally happen with the current setup.
            console.warn(`Unexpected fieldname encountered: ${file.fieldname}. Using default upload directory.`);
            cb(null, uploadDir); // Fallback to base directory (or handle as error)
            // Or throw an error: cb(new Error(`Unexpected fieldname: ${file.fieldname}`));
        }
    },
    filename: function (req, file, cb) {
        // Create a unique filename to avoid collisions
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        // Keep fieldname in filename for clarity within subdirectories
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const fileFilter = function (req, file, cb) {
    // Define allowed types based on field name
    if (file.fieldname === "resume") {
        // Allowed types for resume
        const allowedResumeTypes = [
            'image/jpeg',
            'image/jpg'
        ];
        if (allowedResumeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type for resume. Only JPG images allowed.'), false);
        }
    } else if (file.fieldname === "profilePhoto") {
        // Allowed types for profile photo
        const allowedPhotoTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedPhotoTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type for profile photo. Only JPG, PNG, GIF, WEBP allowed.'), false);
        }
    } else {
        // Reject other unexpected fields (should be caught by .fields() first)
        cb(new Error(`Unexpected file field: ${file.fieldname}`), false);
    }
};

// Configure multer to accept specific fields
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB file size limit (adjust as needed)
    }
    // Use .fields() for multiple named file inputs
}).fields([
    { name: 'resume', maxCount: 1 },
    { name: 'profilePhoto', maxCount: 1 }
]);

// Custom error handler middleware for Multer errors
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.error("Multer Error:", err);
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File size too large. Maximum size is 5MB.' });
        }
        return res.status(400).json({ message: err.message });
    } else if (err) {
        // An unknown error occurred (could be from fileFilter or destination function).
        console.error("File Upload Related Error:", err);
        // Handle specific file filter errors or destination errors thrown manually
        if (err.message.includes('Invalid file type') || err.message.includes('Unexpected file field') || err.message.includes('Unexpected fieldname')) {
             return res.status(400).json({ message: err.message });
        }
        // Handle other potential errors passed to next(err)
        return res.status(500).json({ message: "An error occurred during file processing." });
    }
    // Everything went fine with multer processing, proceed to the route handler.
    next();
};

// Cleanup files on error
const cleanupFilesOnError = (files) => {
    if (!files) return;
    
    Object.values(files).forEach(fileArray => {
        if (Array.isArray(fileArray)) {
            fileArray.forEach(file => {
                if (file && file.path) {
                    fs.unlink(file.path, (err) => {
                        if (err) console.error(`Error deleting file ${file.path}:`, err);
                    });
                }
            });
        }
    });
};

export { upload, handleMulterError, cleanupFilesOnError }; // Export both upload and the error handler