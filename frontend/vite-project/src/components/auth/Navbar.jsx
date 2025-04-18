import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="logo">
          Hire<span className="red">X</span>
        </span>
      </div>
      <div className="navbar-right">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>
          Home
        </Link>
        <Link to="/jobs" className={location.pathname === "/jobs" ? "active" : ""}>
          Jobs
        </Link>
        <Link to="/browse" className={location.pathname === "/browse" ? "active" : ""}>
          Browse
        </Link>
        <Link to="/login" className={`login-btn ${location.pathname === "/login" ? "selected" : ""}`}>
          Login
        </Link>
        <Link to="/signup" className="signup-btn">
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
