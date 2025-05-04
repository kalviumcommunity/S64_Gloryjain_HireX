import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaDownload } from 'react-icons/fa';
import Navbar from '../components/auth/Navbar';
import '../components/auth/JobApplicants.css';

const JobApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [user, setUser] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRefs = useRef({});
  
  useEffect(() => {
    // Get user data from localStorage
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage) {
      const parsedUser = JSON.parse(userFromStorage);
      setUser(parsedUser);
      
      // Redirect if not a recruiter
      if (parsedUser.role !== 'recruiter') {
        navigate('/home');
        return;
      }
    } else {
      // Redirect to login if not logged in
      navigate('/login');
      return;
    }
    
    // Get job data from localStorage
    const storedJobs = localStorage.getItem('jobs');
    if (storedJobs) {
      const jobs = JSON.parse(storedJobs);
      const foundJob = jobs.find(j => j.id.toString() === jobId);
      
      if (foundJob) {
        // Initialize empty applicants array if it doesn't exist
        if (!foundJob.applicants) {
          foundJob.applicants = [];
          // Save back to localStorage
          localStorage.setItem('jobs', JSON.stringify(jobs));
        }
        
        setJob(foundJob);
        setApplicants(foundJob.applicants || []);
      } else {
        // Job not found
        navigate('/jobs');
      }
    }
  }, [jobId, navigate]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleDownloadResume = (resume) => {
    // In a real application, this would download the resume file
    // For this demo, just show an alert
    alert(`Downloading resume: ${resume}`);
  };
  
  const toggleDropdown = (applicantId) => {
    if (activeDropdown === applicantId) {
      setActiveDropdown(null);
    } else {
      // Close any open dropdown first
      setActiveDropdown(null);
      // Use setTimeout to ensure the state update completes before opening the new dropdown
      setTimeout(() => {
        setActiveDropdown(applicantId);
      }, 10);
    }
  };
  
  // Store ref for each dropdown container
  const setDropdownRef = (id, element) => {
    dropdownRefs.current[id] = element;
  };
  
  const handleStatusChange = (applicantId, status) => {
    // Update applicant's status
    const updatedApplicants = applicants.map(applicant => {
      if (applicant.id === applicantId) {
        return { ...applicant, status };
      }
      return applicant;
    });
    
    setApplicants(updatedApplicants);
    
    // Update in localStorage
    const storedJobs = localStorage.getItem('jobs');
    if (storedJobs) {
      const jobs = JSON.parse(storedJobs);
      const foundJob = jobs.find(j => j.id.toString() === jobId);
      
      if (foundJob) {
        foundJob.applicants = updatedApplicants;
        localStorage.setItem('jobs', JSON.stringify(jobs));
      }
    }
    
    // Close dropdown
    setActiveDropdown(null);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Only close if clicking outside any dropdown
      if (!e.target.closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  if (!job) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="applicants-page">
      <Navbar />
      <div className="navbar-spacer"></div>
      
      <div className="applicants-header">
        <button className="back-button" onClick={handleBack}>
          <FaArrowLeft /> Back
        </button>
        <h1>Applicants ({applicants.length})</h1>
      </div>
      
      <div className="applicants-container">
        <div className="applicants-table">
          <div className="table-header">
            <div className="name-column">Full Name</div>
            <div className="email-column">Email</div>
            <div className="contact-column">Contact</div>
            <div className="resume-column">Resume</div>
            <div className="date-column">Date</div>
            <div className="action-column">Action</div>
          </div>
          
          {applicants.length > 0 ? (
            <div className="table-body">
              {applicants.map((applicant, index) => (
                <div key={applicant.id} className="table-row">
                  <div className="name-column">
                    {applicant.fullName}
                    {applicant.status && (
                      <span className={`status-badge ${applicant.status.toLowerCase()}`}>
                        {applicant.status}
                      </span>
                    )}
                  </div>
                  <div className="email-column">{applicant.email}</div>
                  <div className="contact-column">{applicant.contact}</div>
                  <div className="resume-column">
                    <button 
                      className="resume-link"
                      onClick={() => handleDownloadResume(applicant.resume)}
                    >
                      {applicant.resume}
                    </button>
                  </div>
                  <div className="date-column">{applicant.date}</div>
                  <div className="action-column">
                    <div 
                      className={`dropdown-container position-${index}`}
                      ref={(el) => setDropdownRef(applicant.id, el)}
                    >
                      <button 
                        className="action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDropdown(applicant.id);
                        }}
                      >
                        <span>•••</span>
                      </button>
                      {activeDropdown === applicant.id && (
                        <div 
                          className="action-dropdown"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button 
                            className="dropdown-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(applicant.id, 'Accepted');
                            }}
                          >
                            Accepted
                          </button>
                          <button 
                            className="dropdown-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(applicant.id, 'Rejected');
                            }}
                          >
                            Rejected
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No applicants for this job posting yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobApplicants; 