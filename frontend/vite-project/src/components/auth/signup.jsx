import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

const Signup = () => {
    const navigate = useNavigate(); // Hook for navigation
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "student", // Default role
        resume: null,
        profilePhoto: null,
    });

    const [error, setError] = useState(""); // To hold backend/general error messages
    const [successMessage, setSuccessMessage] = useState(""); // To hold success message
    const [isSubmitting, setIsSubmitting] = useState(false); // To disable button during submission

    // Refs for file inputs to allow clearing them programmatically
    const resumeInputRef = useRef(null);
    const profilePhotoInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        // Clear messages when user starts typing again
        setError("");
        setSuccessMessage("");

        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "file" ? files[0] : value,
        }));
    };

    const handleSignup = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setError(""); // Clear previous errors
        setSuccessMessage(""); // Clear previous success message
        setIsSubmitting(true); // Disable button

        // --- Create FormData ---
        const data = new FormData();
        data.append("fullname", formData.fullname);
        data.append("email", formData.email);
        data.append("phoneNumber", formData.phoneNumber);
        data.append("password", formData.password);
        data.append("role", formData.role);

        // Conditionally append files only if they exist
        if (formData.resume) {
            data.append("resume", formData.resume); // Field name must match backend multer config
        }
        if (formData.profilePhoto) {
            data.append("profilePhoto", formData.profilePhoto); // Field name must match backend
        }

        // --- API Call ---
        try {
            // Adjust URL to your backend API endpoint
            const response = await axios.post(
                "http://localhost:5000/api/users",
                data,
                {
                    headers: {
                        // Content-Type is automatically set by axios when using FormData
                        // 'Content-Type': 'multipart/form-data',
                    },
                }
            );

            // --- Handle Success ---
            console.log("Signup successful:", response.data);
            setSuccessMessage("User registered successfully! Redirecting to login..."); // Set success message
            setError(""); // Clear any previous error

            // Reset form fields after success
            setFormData({
                fullname: "",
                email: "",
                phoneNumber: "",
                password: "",
                role: "student",
                resume: null,
                profilePhoto: null,
            });
             // Clear file input fields visually using refs
            if (resumeInputRef.current) resumeInputRef.current.value = "";
            if (profilePhotoInputRef.current) profilePhotoInputRef.current.value = "";


            // Optionally redirect after a delay
            setTimeout(() => {
                navigate("/login"); // Redirect to login page
            }, 2000); // Wait 2 seconds

        } catch (err) {
            // --- Handle Error ---
            console.error(
                "Signup error:",
                err.response?.data || err.message || err
            );

            // Set specific error message from backend if available, otherwise generic
            const message =
                err.response?.data?.message || // Check for specific message from backend
                "Signup failed! Please check your details and try again.";
            setError(message);
            setSuccessMessage(""); // Clear success message on error

        } finally {
            setIsSubmitting(false); // Re-enable button
        }
    };

    return (
        <div className="signup-container">
            <style>
                {`
                  .signup-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh; /* Use min-height for flexibility */
                    background: #f4f6f9;
                    padding: 20px;
                    box-sizing: border-box; /* Include padding in height/width */
                  }

                  .signup-box {
                    background: white;
                    padding: 30px 40px; /* Adjust padding */
                    border-radius: 16px;
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
                    width: 100%;
                    max-width: 480px; /* Slightly wider for more fields */
                    text-align: center;
                    box-sizing: border-box;
                  }

                  .signup-box h2 {
                    margin-bottom: 25px;
                    font-size: 26px; /* Slightly larger heading */
                    color: #333;
                    font-weight: 600;
                  }

                  .form-group {
                      margin-bottom: 18px; /* Spacing between form groups */
                      text-align: left; /* Align labels/inputs left */
                  }

                  .form-group label {
                      display: block;
                      margin-bottom: 6px;
                      font-weight: 500;
                      color: #555;
                      font-size: 14px;
                  }

                  .signup-box input[type="text"],
                  .signup-box input[type="email"],
                  .signup-box input[type="password"],
                  .signup-box input[type="file"] {
                    width: 100%;
                    padding: 12px 15px;
                    margin: 0; /* Remove default margin */
                    border-radius: 8px;
                    border: 1px solid #ccc;
                    font-size: 16px;
                    box-sizing: border-box; /* Include padding/border in width */
                    transition: border-color 0.2s;
                  }

                  .signup-box input:focus {
                      border-color: #28a745; /* Highlight on focus */
                      outline: none;
                  }

                   .signup-box input[type="file"] {
                       padding: 8px 10px; /* Adjust padding for file input */
                       font-size: 14px;
                       cursor: pointer;
                   }
                   /* Style file input button */
                   .signup-box input[type="file"]::file-selector-button {
                        margin-right: 10px;
                        padding: 6px 12px;
                        border: none;
                        background-color: #eee;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                   }


                  .role-selection {
                      display: flex;
                      justify-content: flex-start; /* Align radio buttons left */
                      gap: 20px; /* Space between radio buttons */
                      margin-top: 5px; /* Align with other inputs */
                  }
                   .role-selection label {
                      display: flex;
                      align-items: center;
                      gap: 5px;
                      font-weight: normal; /* Normal weight for radio labels */
                      font-size: 15px;
                      cursor: pointer;
                  }
                   .role-selection input[type="radio"] {
                      width: auto; /* Let radio button size naturally */
                      margin: 0;
                  }


                  .signup-box button {
                    width: 100%;
                    background: #28a745;
                    color: white;
                    padding: 14px; /* Slightly larger button */
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    margin-top: 20px; /* Space above button */
                    transition: background 0.3s, opacity 0.3s;
                  }

                  .signup-box button:hover {
                    background: #1e7e34;
                  }
                   .signup-box button:disabled {
                      background: #cccccc; /* Grey out when disabled */
                      cursor: not-allowed;
                      opacity: 0.7;
                  }

                  .signup-footer {
                    margin-top: 20px;
                    font-size: 14px;
                    color: #555;
                  }

                  .signup-footer a {
                    color: #28a745;
                    text-decoration: none;
                    font-weight: 500;
                  }
                   .signup-footer a:hover {
                      text-decoration: underline;
                  }

                  .message { /* Base class for messages */
                    margin-top: 15px;
                    padding: 10px;
                    border-radius: 6px;
                    font-size: 15px;
                    text-align: center;
                  }
                  .success {
                    background-color: #d4edda; /* Light green */
                    color: #155724; /* Dark green */
                    border: 1px solid #c3e6cb;
                  }
                  .error {
                    background-color: #f8d7da; /* Light red */
                    color: #721c24; /* Dark red */
                    border: 1px solid #f5c6cb;
                  }
                `}
            </style>

            <div className="signup-box">
                <h2>Create Your Account</h2>

                {/* Display Success Message */}
                {successMessage && (
                    <div className="message success">{successMessage}</div>
                )}

                {/* Display Error Message */}
                {error && <div className="message error">{error}</div>}

                <form onSubmit={handleSignup} noValidate> {/* noValidate prevents browser validation */}
                    <div className="form-group">
                        <label htmlFor="fullname">Full Name</label>
                        <input
                            type="text"
                            id="fullname"
                            name="fullname"
                            placeholder="Enter your full name"
                            value={formData.fullname}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                         <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                     <div className="form-group">
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input
                            type="text" // Changed to text to allow "+" etc.
                            id="phoneNumber"
                            name="phoneNumber"
                            placeholder="e.g., +1 123 456 7890"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Choose a strong password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label>Register As</label>
                         <div className="role-selection">
                            <label>
                                <input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={formData.role === "student"}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                />
                                Student
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={formData.role === "recruiter"}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                />
                                Recruiter
                            </label>
                        </div>
                    </div>

                     <div className="form-group">
                        <label htmlFor="resume">Resume (PDF, DOC, DOCX - Optional)</label>
                        <input
                            type="file"
                            id="resume"
                            name="resume"
                            ref={resumeInputRef} // Assign ref
                            accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" // More specific accept
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                    </div>

                     <div className="form-group">
                        <label htmlFor="profilePhoto">Profile Photo (JPG, PNG - Optional)</label>
                        <input
                            type="file"
                            id="profilePhoto"
                            name="profilePhoto"
                            ref={profilePhotoInputRef} // Assign ref
                            accept="image/jpeg, image/png, image/gif, image/webp" // Standard image types
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                    </div>

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>

                <p className="signup-footer">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;