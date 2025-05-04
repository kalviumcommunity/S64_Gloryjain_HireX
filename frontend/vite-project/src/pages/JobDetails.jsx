import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/auth/Navbar';

// Sample jobs data with more detailed descriptions
const sampleJobs = [
  {
    id: 1,
    company: 'Google',
    logo: 'G',
    location: 'India',
    position: 'FullStack Developer',
    description: "We're looking for a Senior Full-Stack Developer who can write clean, efficient, and scalable code, and is proficient in handling both frontend and backend development seamlessly.",
    postedDate: 'Today',
    positions: 2,
    type: 'Full Time',
    salary: '45LPA'
  },
  {
    id: 2,
    company: 'Microsoft India',
    logo: 'M',
    location: 'India',
    position: 'FullStack Developer',
    description: "Seeking a Senior Full-Stack Developer skilled in building robust frontend and backend solutions, with a strong focus on writing clean, efficient, and maintainable code.",
    postedDate: 'Today',
    positions: 2,
    type: 'Full Time',
    salary: '24LPA'
  },
  {
    id: 3,
    company: 'Amazon',
    logo: 'A',
    location: 'India',
    position: 'Frontend Developer',
    description: "Looking for a Frontend Developer with strong skills in React and TypeScript to build responsive, user-focused interfaces for millions of users.",
    postedDate: 'Today',
    positions: 2,
    type: 'Full Time',
    salary: '30LPA'
  }
];

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [user, setUser] = useState(null);
  const [isApplied, setIsApplied] = useState(false);
  
  useEffect(() => {
    // Get job data from localStorage
    const jobData = localStorage.getItem('selectedJobDetails');
    if (jobData) {
      const parsedJob = JSON.parse(jobData);
      setSelectedJob(parsedJob);
    }
    
    // Get user data from localStorage
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage) {
      const parsedUser = JSON.parse(userFromStorage);
      setUser(parsedUser);
      
      // If user is not a student, redirect to home
      if (parsedUser.role !== 'student') {
        navigate('/home');
      }
    } else {
      // If no user is logged in, redirect to login
      navigate('/login');
    }
    
    // Check if the user has already applied for this job
    checkIfApplied();
  }, [id, navigate]);
  
  const checkIfApplied = () => {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const userId = JSON.parse(localStorage.getItem('user'))?.id;
    
    if (userId && id) {
      const hasApplied = applications.some(
        app => app.jobId === parseInt(id) && app.studentId === userId
      );
      setIsApplied(hasApplied);
    }
  };
  
  const handleApply = () => {
    if (!user) {
      alert('Please log in to apply for this job');
      navigate('/login');
      return;
    }
    
    // Get existing applications from localStorage
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    
    // Check if user has already applied
    if (isApplied) {
      alert('You have already applied for this job');
      return;
    }
    
    // Create new application
    const newApplication = {
      id: applications.length + 1,
      jobId: parseInt(id),
      jobTitle: selectedJob.position,
      company: selectedJob.company,
      studentId: user.id,
      studentName: user.name,
      studentEmail: user.email,
      studentContact: user.contact || 'Not provided',
      resume: 'resume.pdf', // In a real app, this would be a link to the actual resume
      appliedDate: new Date().toLocaleDateString(),
      status: 'Pending'
    };
    
    // Add to applications
    applications.push(newApplication);
    
    // Save back to localStorage
    localStorage.setItem('applications', JSON.stringify(applications));
    
    // Update application status
    setIsApplied(true);
    
    alert('Application submitted successfully!');
  };

  if (!selectedJob) {
    return (
      <div className="job-details-page">
        <Navbar />
        <div className="navbar-spacer"></div>
        <div className="loading">Loading job details...</div>
      </div>
    );
  }

  return (
    <div className="job-details-page">
      <Navbar />
      <div className="navbar-spacer"></div>
      <style>{`
        .job-details-page {
          min-height: 100vh;
          background: #f8f9fa;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        
        .navbar-spacer {
          height: 70px;
        }
        
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 300px;
          font-size: 18px;
          color: #6B7280;
        }
        
        .job-details-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        
        .back-button {
          display: inline-flex;
          align-items: center;
          margin-bottom: 24px;
          color: #4B5563;
          font-size: 16px;
          cursor: pointer;
          text-decoration: none;
        }
        
        .back-button:hover {
          color: #1F2937;
        }
        
        .job-header {
          display: flex;
          align-items: flex-start;
          margin-bottom: 32px;
        }
        
        .company-logo {
          width: 80px;
          height: 80px;
          background-color: #f4f4f5;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          font-weight: bold;
          margin-right: 24px;
        }
        
        .company-logo.google {
          color: #1a73e8;
        }
        
        .company-logo.microsoft {
          color: #107c10;
        }
        
        .company-logo.amazon {
          color: #ff9900;
        }
        
        .job-title-section {
          flex: 1;
        }
        
        .company-name {
          font-size: 20px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }
        
        .job-location {
          font-size: 16px;
          color: #6B7280;
          margin-bottom: 12px;
        }
        
        .job-title {
          font-size: 32px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 16px;
        }
        
        .tag-container {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        
        .tag {
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
        }
        
        .tag.positions {
          background-color: #E0F2FE;
          color: #0369A1;
        }
        
        .tag.type {
          background-color: #8B5CF6;
          color: white;
        }
        
        .tag.salary {
          background-color: #DBEAFE;
          color: #2563EB;
        }
        
        .tag.date {
          background-color: #F3F4F6;
          color: #4B5563;
        }
        
        .apply-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          background-color: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .deadline {
          font-size: 16px;
          color: #4B5563;
        }
        
        .deadline strong {
          color: #111827;
        }
        
        .apply-button {
          padding: 12px 24px;
          background-color: #8B5CF6;
          color: white;
          font-size: 16px;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .apply-button:hover {
          background-color: #7C3AED;
        }
        
        .apply-button:disabled {
          background-color: #D1D5DB;
          cursor: not-allowed;
        }
        
        .job-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }
        
        .job-description-section {
          background-color: white;
          padding: 32px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .section-title {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 20px;
        }
        
        .job-description {
          font-size: 16px;
          line-height: 1.7;
          color: #4B5563;
          margin-bottom: 32px;
        }
        
        .requirements-list {
          list-style-type: none;
          padding: 0;
          margin-bottom: 32px;
        }
        
        .requirements-list li {
          position: relative;
          padding-left: 28px;
          margin-bottom: 16px;
          font-size: 16px;
          color: #4B5563;
        }
        
        .requirements-list li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #8B5CF6;
          font-weight: bold;
        }
        
        .job-meta-section {
          background-color: white;
          padding: 32px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          height: fit-content;
        }
        
        .meta-item {
          margin-bottom: 24px;
        }
        
        .meta-label {
          font-size: 14px;
          color: #6B7280;
          margin-bottom: 8px;
        }
        
        .meta-value {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
        }
        
        @media (max-width: 768px) {
          .job-content {
            grid-template-columns: 1fr;
          }
          
          .company-logo {
            width: 60px;
            height: 60px;
            font-size: 24px;
          }
          
          .job-title {
            font-size: 24px;
          }
        }
      `}</style>
      
      <div className="job-details-container">
        <div className="back-button" onClick={() => navigate('/jobs')}>
          ← Back to Jobs
        </div>
        
        <div className="job-header">
          <div className={`company-logo ${selectedJob.company.toLowerCase()}`}>
            {selectedJob.logo}
          </div>
          
          <div className="job-title-section">
            <div className="company-name">{selectedJob.company}</div>
            <div className="job-location">{selectedJob.location}</div>
            <h1 className="job-title">{selectedJob.position}</h1>
            
            <div className="tag-container">
              <span className="tag positions">{selectedJob.positions} Positions</span>
              <span className="tag type">{selectedJob.type}</span>
              <span className="tag salary">{selectedJob.salary}</span>
              <span className="tag date">Posted: {selectedJob.postedDate}</span>
            </div>
          </div>
        </div>
        
        <div className="apply-section">
          <div className="deadline">
            <strong>Application Deadline:</strong> October 15, 2023
          </div>
          <button 
            className="apply-button" 
            onClick={handleApply}
            disabled={isApplied}
          >
            {isApplied ? 'Already Applied' : 'Apply Now'}
          </button>
        </div>
        
        <div className="job-content">
          <div className="job-description-section">
            <h2 className="section-title">Job Description</h2>
            <p className="job-description">
              {selectedJob.description}
            </p>
            
            <h2 className="section-title">Requirements</h2>
            <ul className="requirements-list">
              {selectedJob.requirements?.map((req, index) => (
                <li key={index}>{req}</li>
              )) || (
                <>
                  <li>Bachelor's degree in Computer Science or related field</li>
                  <li>3+ years of experience in software development</li>
                  <li>Strong proficiency in JavaScript, HTML, and CSS</li>
                  <li>Experience with React.js or similar frontend frameworks</li>
                  <li>Knowledge of backend technologies and RESTful APIs</li>
                </>
              )}
            </ul>
            
            <h2 className="section-title">Benefits</h2>
            <ul className="requirements-list">
              <li>Competitive salary and equity package</li>
              <li>Medical, dental, and vision insurance</li>
              <li>Flexible work arrangements</li>
              <li>Professional development opportunities</li>
              <li>Collaborative and innovative work environment</li>
            </ul>
          </div>
          
          <div className="job-meta-section">
            <div className="meta-item">
              <div className="meta-label">Experience</div>
              <div className="meta-value">{selectedJob.experience || "3+ years"}</div>
            </div>
            
            <div className="meta-item">
              <div className="meta-label">Job Type</div>
              <div className="meta-value">{selectedJob.type}</div>
            </div>
            
            <div className="meta-item">
              <div className="meta-label">Salary</div>
              <div className="meta-value">{selectedJob.salary}</div>
            </div>
            
            <div className="meta-item">
              <div className="meta-label">Location</div>
              <div className="meta-value">{selectedJob.location}</div>
            </div>
            
            <div className="meta-item">
              <div className="meta-label">Available Positions</div>
              <div className="meta-value">{selectedJob.positions}</div>
            </div>
            
            <div className="meta-item">
              <div className="meta-label">Company</div>
              <div className="meta-value">{selectedJob.company}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails; 