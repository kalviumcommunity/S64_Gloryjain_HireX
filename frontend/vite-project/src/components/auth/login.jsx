import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student"
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Redirect based on user role
        if (formData.role === "recruiter") {
          navigate("/companies");
        } else {
          navigate("/home");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login");
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
        <h2 className="auth-title">Login</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="email@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="password"
              value={formData.password}
              onChange={handleChange}
              required
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
              />
              Recruiter
            </label>
          </div>

          <button type="submit" className="submit-btn">
            Login
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
