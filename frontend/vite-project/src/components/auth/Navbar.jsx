import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/api";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const userFromStorage = localStorage.getItem("user");
    if (userFromStorage) {
      setUser(JSON.parse(userFromStorage));
    }
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    try {
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.navbar-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showDropdown]);

  // Check if user is a recruiter
  const isRecruiter = user?.role === 'recruiter';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Hire<span>X</span>
        </Link>

        <div className="navbar-links">
          {user ? (
            <>
              {isRecruiter ? (
                // Recruiter navigation links
                <>
                  <Link 
                    to="/companies" 
                    className={location.pathname === "/companies" ? "active" : ""}
                  >
                    Companies
                  </Link>
                  <Link 
                    to="/jobs" 
                    className={
                      location.pathname === "/jobs" || 
                      location.pathname.startsWith("/jobs/") 
                        ? "active" 
                        : ""
                    }
                  >
                    Jobs
                  </Link>
                </>
              ) : (
                // Student navigation links
                <>
                  <Link 
                    to="/home" 
                    className={location.pathname === "/home" ? "active" : ""}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/jobs" 
                    className={
                      location.pathname === "/jobs" || 
                      location.pathname.startsWith("/jobs/") 
                        ? "active" 
                        : ""
                    }
                  >
                    Jobs
                  </Link>
                  <Link 
                    to="/browse" 
                    className={location.pathname === "/browse" ? "active" : ""}
                  >
                    Browse
                  </Link>
                </>
              )}
              <div className="navbar-dropdown">
                <button 
                  onClick={toggleDropdown} 
                  className="navbar-dropdown-button"
                >
                  <div className="user-circle">
                    {user.fullname ? user.fullname[0].toUpperCase() : 'U'}
                  </div>
                </button>
                {showDropdown && (
                  <div className="navbar-dropdown-content">
                    <div className="dropdown-header">
                      <div className="user-circle">
                        {user.fullname ? user.fullname[0].toUpperCase() : 'U'}
                      </div>
                      <div className="user-info">
                        <span className="user-name">{user.fullname}</span>
                        <span className="user-role">{isRecruiter ? 'Recruiter' : 'Student'}</span>
                      </div>
                    </div>
                    <Link to="/profile">View Profile</Link>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/home">Home</Link>
              <Link to="/jobs">Jobs</Link>
              <Link to="/browse">Browse</Link>
              <Link 
                to="/login" 
                className="login-btn"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="signup-btn"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirm-modal">
          <div className="delete-confirm-content">
            <h3>Delete Account</h3>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className="delete-confirm-buttons">
              <button onClick={handleDeleteAccount} className="delete-confirm">
                Delete
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} className="delete-cancel">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
