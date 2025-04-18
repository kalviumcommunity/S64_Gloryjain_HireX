import React, { useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "student",
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    console.log("Signup Data:", formData);
    // Add signup logic here
  };

  return (
    <div className="signup-container">
      <style>
        {`
          .signup-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #f4f6f9;
            padding: 20px;
          }

          .signup-box {
            background: white;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 450px;
            text-align: center;
          }

          .signup-logo {
            width: 120px;
            margin: 0 auto 20px;
          }

          .signup-box h2 {
            margin-bottom: 20px;
            font-size: 24px;
            color: #333;
          }

          .signup-box input,
          .signup-box select {
            width: 100%;
            padding: 12px;
            margin: 10px 0;
            border-radius: 8px;
            border: 1px solid #ccc;
            font-size: 16px;
          }

          .signup-box button {
            width: 100%;
            background: #28a745;
            color: white;
            padding: 12px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            margin-top: 15px;
            transition: background 0.3s;
          }

          .signup-box button:hover {
            background: #1e7e34;
          }

          .signup-footer {
            margin-top: 15px;
            font-size: 14px;
            color: #555;
          }

          .signup-footer a {
            color: #28a745;
            text-decoration: none;
          }
        `}
      </style>
      
      <div className="signup-box">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={formData.fullname}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Gloryjain@gmail.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="+91..."
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <div>
            <label>
              <input
                type="radio"
                name="role"
                value="student"
                checked={formData.role === "student"}
                onChange={handleChange}
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
              />
              Recruiter
            </label>
          </div>
          <input type="file" name="resume" onChange={handleChange} />
          <button type="submit">Sign Up</button>
        </form>
        <p className="signup-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
