import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const handleDeleteAccount = () => {
    // Here we'll add the API call to delete the account
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="navbar">
      <style>
        {`
          .delete-option {
            color: #dc3545 !important;
          }

          .delete-option:hover {
            background-color: #ffebee !important;
          }

          .confirm-delete-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 24px;
            border-radius: 12px;
            width: 90%;
            max-width: 400px;
            z-index: 1100;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }

          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }

          .confirm-delete-modal h3 {
            margin: 0 0 16px;
            color: #333;
          }

          .confirm-delete-modal p {
            margin: 0 0 24px;
            color: #666;
          }

          .confirm-actions {
            display: flex;
            gap: 12px;
            justify-content: center;
          }

          .confirm-delete {
            padding: 8px 16px;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
          }

          .cancel-delete {
            padding: 8px 16px;
            background: #f5f5f5;
            color: #333;
            border: none;
            border-radius: 6px;
            cursor: pointer;
          }
        `}
      </style>

      <div className="navbar-left">
        <Link to="/" className="logo">
          Hire<span className="x">X</span>
        </Link>
      </div>
      <div className="navbar-right">
        <Link to="/home" className={location.pathname === "/home" ? "active" : ""}>
          Home
        </Link>
        <Link to="/jobs" className={location.pathname === "/jobs" ? "active" : ""}>
          Jobs
        </Link>
        <Link to="/browse" className={location.pathname === "/browse" ? "active" : ""}>
          Browse
        </Link>
        
        {user ? (
          <div className="user-profile">
            <button className="profile-button" onClick={toggleDropdown}>
              <div className="profile-circle">
                {user.profilePhoto ? (
                  <img src={user.profilePhoto} alt={user.fullname} />
                ) : (
                  <span>{user.fullname?.charAt(0).toUpperCase()}</span>
                )}
              </div>
            </button>
            {showDropdown && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <div className="profile-circle">
                    {user.profilePhoto ? (
                      <img src={user.profilePhoto} alt={user.fullname} />
                    ) : (
                      <span>{user.fullname?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="user-info">
                    <p className="user-name">{user.fullname}</p>
                    <p className="user-role">{user.role === "student" ? "Experienced software developer" : "Recruiter"}</p>
                  </div>
                </div>
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">
                    <i className="fas fa-user"></i> View Profile
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item">
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                  <button onClick={() => setShowDeleteConfirm(true)} className="dropdown-item delete-option">
                    <i className="fas fa-trash"></i> Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="login-btn">
              Login
            </Link>
            <Link to="/signup" className="signup-btn">
              Signup
            </Link>
          </>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="confirm-delete-modal">
            <h3>Delete Account</h3>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className="confirm-actions">
              <button className="confirm-delete" onClick={handleDeleteAccount}>
                Yes, Delete
              </button>
              <button className="cancel-delete" onClick={() => setShowDeleteConfirm(false)}>
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
