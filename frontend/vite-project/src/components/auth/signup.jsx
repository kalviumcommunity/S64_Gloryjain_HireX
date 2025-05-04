import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "student",
        profilePhoto: null,
    });

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "file" ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        const data = new FormData();
        data.append("fullname", formData.fullname);
        data.append("email", formData.email);
        data.append("phoneNumber", formData.phoneNumber);
        data.append("password", formData.password);
        data.append("role", formData.role);

        if (formData.profilePhoto) {
            data.append("profilePhoto", formData.profilePhoto);
        }

        try {
            const response = await fetch("http://localhost:5000/api/users", {
                method: "POST",
                body: data,
            });

            const result = await response.json();

            if (response.ok) {
                navigate("/login");
            } else {
                setError(result.message || "Registration failed");
            }
        } catch (err) {
            console.error("Signup error:", err);
            setError("An error occurred during registration");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-container">
            <style>
                {`
                  .auth-container {
                    min-height: 100vh;
                    background: #ffffff;
                  }

                  .auth-content {
                    max-width: 400px;
                    margin: 40px auto;
                    padding: 40px;
                  }

                  .auth-title {
                    font-size: 24px;
                    color: #000;
                    margin-bottom: 30px;
                    font-weight: 600;
                  }

                  .form-group {
                    margin-bottom: 20px;
                  }

                  .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    color: #333;
                    font-size: 14px;
                    font-weight: 500;
                  }

                  .form-control {
                    width: 100%;
                    padding: 10px 16px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-size: 14px;
                    transition: border-color 0.3s;
                  }

                  .form-control:focus {
                    outline: none;
                    border-color: #7b2cbf;
                  }

                  .role-group {
                    display: flex;
                    gap: 20px;
                    margin-bottom: 20px;
                  }

                  .role-option {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                  }

                  .role-option input {
                    cursor: pointer;
                  }

                  .file-input {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                  }

                  .file-input label {
                    flex: 1;
                  }

                  .file-input .choose-file {
                    padding: 8px 16px;
                    background: #f5f5f5;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-size: 14px;
                    color: #333;
                    cursor: pointer;
                    transition: all 0.3s;
                  }

                  .file-input .choose-file:hover {
                    background: #eee;
                    border-color: #7b2cbf;
                  }

                  .submit-btn {
                    width: 100%;
                    padding: 12px;
                    background: #1a1a1a;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.3s;
                  }

                  .submit-btn:hover {
                    background: #333;
                  }

                  .submit-btn:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                  }

                  .auth-footer {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 14px;
                    color: #666;
                  }

                  .auth-footer a {
                    color: #7b2cbf;
                    text-decoration: none;
                    font-weight: 500;
                  }

                  .auth-footer a:hover {
                    text-decoration: underline;
                  }

                  .error-message {
                    color: #dc3545;
                    font-size: 14px;
                    margin-top: 10px;
                  }
                `}
            </style>

            <Navbar />
            
            <div className="auth-content">
                <h2 className="auth-title">Sign Up</h2>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="fullname">Full Name</label>
                        <input
                            type="text"
                            id="fullname"
                            name="fullname"
                            className="form-control"
                            placeholder="Glory jain"
                            value={formData.fullname}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder="Gloryjain@gmail.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phoneNumber">Phone number</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            className="form-control"
                            placeholder="+919876543210"
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
                            className="form-control"
                            placeholder="•••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="role-group">
                        <label className="role-option">
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
                        <label className="role-option">
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

                    <div className="form-group">
                        <div className="file-input">
                            <label htmlFor="profilePhoto">Profile</label>
                            <input
                                type="file"
                                id="profilePhoto"
                                name="profilePhoto"
                                accept="image/*"
                                className="choose-file"
                                onChange={handleChange}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;