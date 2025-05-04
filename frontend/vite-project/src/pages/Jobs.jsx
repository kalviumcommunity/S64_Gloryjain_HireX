import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { FaUsers } from 'react-icons/fa';
import Navbar from '../components/auth/Navbar';

const Jobs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [notification, setNotification] = useState(null);
  const [user, setUser] = useState(null);

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
    if (user && user.role === 'recruiter') {
      const storedJobs = localStorage.getItem('jobs');
      const allJobs = storedJobs ? JSON.parse(storedJobs) : [];
      
      // Either filter jobs by recruiter ID or show all if no specific filtering mechanism
      // Here we'll assume all jobs in localStorage belong to the current recruiter
      // In a real app, you'd filter by user.id or similar
      setJobs(allJobs);
      
      // If no jobs yet, initialize with empty array instead of sample data
      if (!storedJobs) {
        localStorage.setItem('jobs', JSON.stringify([]));
      }
    }
  }, [user]);

  // Check for notification message from location state
  useEffect(() => {
    if (location.state?.notification) {
      setNotification(location.state.notification);
      
      // Clear notification after 3 seconds
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(job => 
    job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.role.toLowerCase().includes(searchTerm.toLowerCase())
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
    // Navigate to job edit page (to be implemented)
    navigate('/edit-job', { state: { jobData: job } });
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
    setNotification('Job deleted successfully');
    setTimeout(() => setNotification(null), 3000);
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
    return null;
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
            <div className="role-column">Role</div>
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
                  <div className="role-column">{job.role}</div>
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
                            <FaUsers className="applicants-icon" />
                            Applicants
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">No jobs found</div>
            )}
          </div>
        </div>
        
        <div className="jobs-footer">
          <p>A list of your recent posted jobs</p>
        </div>
        
        {notification && (
          <div className="notification-toast">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span>{notification}</span>
          </div>
        )}
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
          background-color: #111827;
          color: white;
          padding: 10px 20px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          text-decoration: none;
        }
        
        .new-job-btn:hover {
          background-color: #1f2937;
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
          background: transparent;
          border: none;
          padding: 6px;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s ease;
        }
        
        .actions-btn:hover {
          color: #111827;
        }
        
        .dropdown-menu {
          position: fixed;
          width: 170px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
          border-bottom: 1px solid #f3f4f6;
        }
        
        .dropdown-item:last-child {
          border-bottom: none;
        }
        
        .dropdown-item:hover {
          background-color: #f9fafb;
        }
        
        .dropdown-item svg.edit-icon {
          color: #374151;
        }
        
        .delete-item {
          color: #dc2626;
        }
        
        .delete-item svg.delete-icon {
          color: #dc2626;
        }
        
        .no-results {
          padding: 20px;
          text-align: center;
          color: #6b7280;
        }
        
        .jobs-footer {
          text-align: center;
          margin-top: 20px;
          color: #6b7280;
          font-size: 14px;
        }
        
        .notification-toast {
          position: fixed;
          bottom: 20px;
          right: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          background: #111827;
          color: white;
          border-radius: 6px;
          padding: 12px 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }
      `}</style>
    </div>
  );
};

export default Jobs; 