import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { FaUsers, FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';
import Navbar from '../components/auth/Navbar';

const Jobs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  // Check if user is logged in and is a recruiter
  useEffect(() => {
    const userFromStorage = localStorage.getItem("user");
    if (userFromStorage) {
      const parsedUser = JSON.parse(userFromStorage);
      setUser(parsedUser);
      
      // If user is not a recruiter, redirect to home
      if (parsedUser.role !== 'recruiter') {
        navigate('/home');
      }
    } else {
      // If no user is logged in, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  // Load jobs from localStorage that belong to the recruiter
  useEffect(() => {
    if (user && user.role === 'recruiter' && (user.id || user.email)) {
      const storedJobs = localStorage.getItem('jobs');
      const allJobs = storedJobs ? JSON.parse(storedJobs) : [];
      let recruiterJobs = [];
      if (user.id) {
        recruiterJobs = allJobs.filter(job => job.recruiterId === user.id);
      } else if (user.email) {
        recruiterJobs = allJobs.filter(job => job.recruiterEmail === user.email);
      }
      setJobs(recruiterJobs);
      if (!storedJobs) {
        localStorage.setItem('jobs', JSON.stringify([]));
      }
    }
  }, [user]);

  // Check for notification message from location state and show it
  useEffect(() => {
    if (location.state?.notification) {
      addNotification(location.state.notification, 'success');
      // Clean the state to avoid re-showing notification on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(job => 
    job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.jobType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle dropdown menu
  const toggleDropdown = (e, jobId) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (activeDropdown === jobId) {
      setActiveDropdown(null);
    } else {
      // Get the button's position
      const rect = e.currentTarget.getBoundingClientRect();
      
      // Calculate dropdown position
      const newPosition = {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      };
      
      // Check if dropdown would go off screen to the right
      if (rect.left + 170 > window.innerWidth) {
        // Position to the left of the button instead
        newPosition.left = rect.right - 170 + window.scrollX;
      }
      
      setDropdownPosition(newPosition);
      setActiveDropdown(jobId);
    }
  };

  // Add event listener to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close if clicking outside the dropdown
      const dropdownElement = document.querySelector('.dropdown-menu');
      if (activeDropdown !== null && 
          dropdownElement && 
          !dropdownElement.contains(event.target) &&
          !event.target.closest('.actions-btn')) {
        setActiveDropdown(null);
      }
    };
    
    if (activeDropdown !== null) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [activeDropdown]);

  // Handle edit job
  const handleEditJob = (e, job) => {
    e.stopPropagation();
    setActiveDropdown(null);
    // Navigate to job edit page (reusing NewJob page in edit mode)
    navigate('/new-job', { state: { editMode: true, jobData: job } });
  };

  // Handle delete job
  const handleDeleteJob = (e, jobId) => {
    e.stopPropagation();
    setActiveDropdown(null);
    
    // Update jobs state
    const updatedJobs = jobs.filter(job => job.id !== jobId);
    setJobs(updatedJobs);
    
    // Update localStorage
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
    
    // Show notification
    addNotification('Job deleted successfully', 'success');
  };

  // Handle view job details
  const handleViewJobDetails = (job) => {
    navigate('/job-details', { state: { jobData: job } });
  };

  // Handle view applicants
  const handleViewApplicants = (e, jobId) => {
    e.stopPropagation();
    setActiveDropdown(null);
    // Navigate to the applicants page for this job
    navigate(`/job-applicants/${jobId}`);
  };

  // If user is not a recruiter or not logged in, don't render the page
  if (!user || user.role !== 'recruiter') {
    return <div>Loading...</div>;
  }
  if (!user.id && !user.email) {
    return <div>Unable to identify recruiter. Please log out and log in again, or contact support.</div>;
  }

  return (
    <div className="jobs-page">
      <Navbar />
      <div className="navbar-spacer"></div>
      
      <div className="jobs-content">
        <div className="jobs-header">
          <div className="search-filter">
            <input 
              type="text" 
              placeholder="Filter by company name & role" 
              value={searchTerm}
              onChange={handleSearchChange}
              className="filter-input"
            />
          </div>
          <button onClick={() => navigate('/new-job')} className="new-job-btn">
            New Jobs
          </button>
        </div>

        <div className="jobs-table">
          <div className="table-header">
            <div className="company-column">Company Name</div>
            <div className="role-column">Job Type</div>
            <div className="date-column">Date</div>
            <div className="action-column">Action</div>
          </div>
          
          <div className="table-body">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <div 
                  key={job.id} 
                  className="table-row"
                  onClick={() => handleViewJobDetails(job)}
                >
                  <div className="company-column">{job.companyName}</div>
                  <div className="role-column">{job.jobType}</div>
                  <div className="date-column">{job.date}</div>
                  <div className="action-column">
                    <div className="dropdown-container">
                      <button 
                        className="actions-btn" 
                        onClick={(e) => toggleDropdown(e, job.id)}
                        aria-label="Job actions"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="5" cy="12" r="1"></circle>
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="19" cy="12" r="1"></circle>
                        </svg>
                      </button>
                      {activeDropdown === job.id && (
                        <div className="dropdown-menu" style={dropdownPosition}>
                          <button 
                            className="dropdown-item"
                            onClick={(e) => handleEditJob(e, job)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="edit-icon">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Edit
                          </button>
                          <button 
                            className="dropdown-item delete-item"
                            onClick={(e) => handleDeleteJob(e, job.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="delete-icon">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                            Delete
                          </button>
                          <button 
                            className="dropdown-item"
                            onClick={(e) => handleViewApplicants(e, job.id)}
                          >
                            <FaUsers style={{ marginRight: '8px' }} />
                            Applicants
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="table-row no-jobs">
                You haven't posted any jobs yet.
              </div>
            )}
          </div>
        </div>
        
        <div className="jobs-footer">
          <p>A list of your recent posted jobs</p>
        </div>
      </div>
      
      {/* Notifications */}
      <div className="notification-container">
        {notifications.map((n) => (
          <div key={n.id} className={`notification ${n.type}`}>
            <div className="notification-icon">
              {n.type === 'success' && <FaCheckCircle />}
              {n.type === 'error' && <FaTimesCircle />}
              {n.type === 'info' && <FaInfoCircle />}
            </div>
            <span>{n.message}</span>
          </div>
        ))}
      </div>

      <style jsx="true">{`
        .jobs-page {
          min-height: 100vh;
          background: #f5f5f5;
        }
        
        .navbar-spacer {
          height: 60px;
        }
        
        .jobs-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          position: relative;
        }
        
        .jobs-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .filter-input {
          padding: 10px 16px;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          width: 280px;
          font-size: 14px;
        }
        
        .filter-input:focus {
          outline: none;
          border-color: #8B5CF6;
          box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
        }
        
        .new-job-btn {
          background-color: #8B5CF6;
          color: white;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          text-decoration: none;
          box-shadow: 0 2px 4px rgba(139, 92, 246, 0.2);
          transition: all 0.2s ease;
        }
        
        .new-job-btn:hover {
          background-color: #7C3AED;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(139, 92, 246, 0.3);
        }
        
        .jobs-table {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }
        
        .table-header {
          display: grid;
          grid-template-columns: 1fr 1fr 150px 100px;
          padding: 16px;
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          font-weight: 500;
          color: #4b5563;
        }
        
        .table-row {
          display: grid;
          grid-template-columns: 1fr 1fr 150px 100px;
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
          align-items: center;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .table-row:hover {
          background-color: #f9fafb;
        }
        
        .table-row:last-child {
          border-bottom: none;
        }
        
        .company-column, .role-column {
          font-weight: 500;
          color: #111827;
        }
        
        .date-column {
          color: #6b7280;
        }
        
        .action-column {
          display: flex;
          justify-content: center;
        }
        
        .dropdown-container {
          position: relative;
        }
        
        .actions-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
          border: none;
          padding: 8px;
          border-radius: 4px;
          cursor: pointer;
          color: #4b5563;
          transition: all 0.2s ease;
        }
        
        .actions-btn:hover {
          color: #111827;
          background: #e5e7eb;
        }
        
        .dropdown-menu {
          position: fixed;
          width: 170px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          padding: 0;
          z-index: 1000;
          border: 1px solid #e5e7eb;
          overflow: visible;
        }
        
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          width: 100%;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          color: #4b5563;
          text-align: left;
          font-size: 14px;
          font-weight: 500;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .dropdown-item:last-child {
          border-bottom: none;
        }
        
        .dropdown-item:hover {
          background-color: #f9fafb;
          color: #111827;
        }
        
        .dropdown-item svg.edit-icon {
          color: #374151;
        }
        
        .delete-item {
          color: #ef4444;
        }
        
        .delete-item:hover {
          background-color: #fee2e2;
        }
        
        .delete-item svg.delete-icon {
          color: #ef4444;
        }
        
        .no-jobs {
          text-align: center;
          padding: 40px;
          color: #6b7280;
          font-size: 1.1rem;
        }
        
        .jobs-footer {
          text-align: center;
          margin-top: 20px;
          color: #6b7280;
          font-size: 14px;
        }
        
        /* Notification Styles */
        .notification-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 10000;
          display: flex;
          flex-direction: column-reverse;
          gap: 12px;
        }

        .notification {
          background: #f1f5f9;
          color: #1e293b;
          padding: 16px 24px;
          border-radius: 8px;
          font-weight: 500;
          box-shadow: 0 8px 24px rgba(30, 41, 59, 0.1);
          animation: fadeInSlideUp 0.4s ease-out forwards;
          min-width: 320px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .notification-icon {
          font-size: 1.2rem;
          display: flex;
          align-items: center;
        }

        .notification.success .notification-icon {
          color: #22c55e;
        }

        .notification.error .notification-icon {
          color: #ef4444;
        }

        .notification.info .notification-icon {
          color: #3b82f6;
        }

        @keyframes fadeInSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Jobs; 