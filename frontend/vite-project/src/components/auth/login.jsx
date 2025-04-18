import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login Data:", formData);
    // Add login logic here
  };

  return (
    <div className="login-container">
      <style>
        {`
          .login-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #f4f6f9;
            padding: 20px;
          }

          .login-box {
            background: white;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
            text-align: center;
          }

          .login-logo {
            width: 120px;
            margin: 0 auto 20px;
          }

          .login-box h2 {
            margin-bottom: 20px;
            font-size: 24px;
            color: #333;
          }

          .login-box input {
            width: 100%;
            padding: 12px;
            margin: 10px 0;
            border-radius: 8px;
            border: 1px solid #ccc;
            font-size: 16px;
          }

          .login-box button {
            width: 100%;
            background: #007bff;
            color: white;
            padding: 12px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            margin-top: 15px;
            transition: background 0.3s;
          }

          .login-box button:hover {
            background: #0056b3;
          }

          .login-footer {
            margin-top: 15px;
            font-size: 14px;
            color: #555;
          }

          .login-footer a {
            color: #007bff;
            text-decoration: none;
          }
        `}
      </style>
      
      <div className="login-box">
        <img
          src="path_to_logo.png" // Replace with your logo image path
          alt="Logo"
          className="login-logo"
        />
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="aryan@gmail.com"
            value={formData.email}
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
          <button type="submit">Login</button>
        </form>
        <p className="login-footer">
          Don’t have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
