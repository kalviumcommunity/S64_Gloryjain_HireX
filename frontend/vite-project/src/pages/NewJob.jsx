import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/auth/Navbar';

const NewJob = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [companies, setCompanies] = useState([]);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    numberOfPositions: '0',
    companyId: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editJobId, setEditJobId] = useState(null);

  // Check if user is logged in and is a recruiter
  useEffect(() => {
    const userFromStorage = localStorage.getItem("user");
    if (userFromStorage) {
      const parsedUser = JSON.parse(userFromStorage);
      setUser(parsedUser);
      if (parsedUser.role !== 'recruiter') {
        navigate('/home');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Load companies from localStorage
  useEffect(() => {
    if (user && user.role === 'recruiter') {
      const storedCompanies = localStorage.getItem('companies');
      if (storedCompanies) {
        setCompanies(JSON.parse(storedCompanies));
      }
    }
  }, [user]);

  // Prefill form if in edit mode
  useEffect(() => {
    if (location.state && location.state.editMode && location.state.jobData) {
      const job = location.state.jobData;
      setEditMode(true);
      setEditJobId(job.id);
      setFormData({
        title: job.title || '',
        description: job.description || '',
        requirements: job.requirements || '',
        salary: job.salary || '',
        location: job.location || '',
        jobType: job.jobType || '',
        experienceLevel: job.experienceLevel || '',
        numberOfPositions: job.numberOfPositions ? String(job.numberOfPositions) : '0',
        companyId: job.companyId ? String(job.companyId) : ''
      });
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.companyId) {
      alert('Please select a company');
      return;
    }
    const selectedCompany = companies.find(company => company.id.toString() === formData.companyId);
    const jobData = {
      id: editMode ? editJobId : Date.now(),
      recruiterId: user.id || null,
      recruiterEmail: user.email || null,
      companyName: selectedCompany.name,
      companyId: selectedCompany.id,
      title: formData.title,
      description: formData.description,
      requirements: formData.requirements,
      salary: formData.salary,
      location: formData.location,
      jobType: formData.jobType,
      experienceLevel: formData.experienceLevel,
      numberOfPositions: formData.numberOfPositions,
      date: editMode && location.state.jobData.date ? location.state.jobData.date : new Date().toISOString().split('T')[0]
    };
    const existingJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    let updatedJobs;
    if (editMode) {
      updatedJobs = existingJobs.map(job => job.id === editJobId ? { ...job, ...jobData } : job);
    } else {
      updatedJobs = [...existingJobs, jobData];
    }
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
    navigate('/jobs', {
      state: {
        notification: editMode ? 'Job updated successfully.' : 'Job posting created successfully.'
      }
    });
  };

  const handleBack = () => {
    navigate('/jobs');
  };

  if (!user || user.role !== 'recruiter') {
    return null;
  }

  return (
    <div className="new-job-page">
      <Navbar />
      <div className="navbar-spacer"></div>
      <div className="new-job-container">
        <div className="back-section">
          <button onClick={handleBack} className="back-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
        </div>
        <div className="new-job-form-container">
          <form onSubmit={handleSubmit} className="new-job-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="requirements">Requirements</label>
                <input
                  type="text"
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="salary">Salary (in LPA)</label>
                <input
                  type="text"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="jobType">Job Type</label>
                <input
                  type="text"
                  id="jobType"
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="experienceLevel">Experience Level (in years)</label>
                <input
                  type="text"
                  id="experienceLevel"
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="numberOfPositions">No of Position</label>
                <input
                  type="number"
                  id="numberOfPositions"
                  name="numberOfPositions"
                  value={formData.numberOfPositions}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
            </div>
            
            <div className="company-select">
              <select
                id="companyId"
                name="companyId"
                value={formData.companyId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a Company</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              {companies.length === 0 && (
                <p className="no-companies-message">
                  No companies found. Please <a onClick={() => navigate('/new-company')} className="text-link">create a company</a> first.
                </p>
              )}
            </div>
            
            <button type="submit" className="post-job-btn">
              {editMode ? 'Update Job' : 'Post New Job'}
            </button>
          </form>
        </div>
      </div>
      
      <style jsx="true">{`
        .new-job-page {
          min-height: 100vh;
          background: #f5f7fb;
          padding-bottom: 40px;
        }
        
        .navbar-spacer {
          height: 60px;
        }
        
        .new-job-container {
          max-width: 640px;
          margin: 20px auto;
          padding: 0 20px;
        }
        
        .back-section {
          margin-bottom: 20px;
        }
        
        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          font-size: 16px;
          font-weight: 500;
          color: #4b5563;
          cursor: pointer;
          padding: 0;
        }
        
        .new-job-form-container {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .form-group {
          margin-bottom: 8px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #111827;
          font-size: 14px;
        }
        
        .form-group input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .company-select {
          margin-bottom: 24px;
        }
        
        .company-select select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          font-size: 14px;
          background-color: white;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 16px;
        }
        
        .no-companies-message {
          margin-top: 8px;
          font-size: 14px;
          color: #6b7280;
        }
        
        .text-link {
          color: #6366f1;
          cursor: pointer;
          text-decoration: underline;
        }
        
        .post-job-btn {
          width: 100%;
          padding: 12px 0;
          background-color: #111827;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          text-align: center;
        }
        
        .post-job-btn:hover {
          background-color: #1f2937;
        }
      `}</style>
    </div>
  );
};

export default NewJob; 