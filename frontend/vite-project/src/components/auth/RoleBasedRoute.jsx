import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Component that restricts access based on user role
 * @param {Object} props - Component props
 * @param {Array} props.allowedRoles - Array of roles that are allowed to access this route
 */
const RoleBasedRoute = ({ allowedRoles }) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check user role from localStorage
    const userFromStorage = localStorage.getItem("user");
    if (userFromStorage) {
      const user = JSON.parse(userFromStorage);
      setHasAccess(allowedRoles.includes(user.role));
    }
    setIsLoading(false);
  }, [allowedRoles]);

  if (isLoading) {
    // Show a loading state while determining the user role
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Allow access if the user's role is in the allowedRoles array, otherwise redirect to home
  return hasAccess ? <Outlet /> : <Navigate to="/home" replace />;
};

export default RoleBasedRoute;

// Add CSS for the loading spinner
const styles = document.createElement('style');
styles.innerHTML = `
  .loading-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f7fb;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top-color: #111827;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 10px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styles); 