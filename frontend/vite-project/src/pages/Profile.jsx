import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPencilAlt, FaBuilding, FaBriefcase, FaSearch, FaEllipsisH, FaEdit, FaUsers, FaTrash, FaBookmark, FaExternalLinkAlt } from 'react-icons/fa';
import { MdEmail, MdPhone } from 'react-icons/md';
import './Profile.css';
import axios from 'axios';
import Navbar from '../components/auth/Navbar';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    bio: '',
    skills: '',
    resume: null
  });
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [companySearchTerm, setCompanySearchTerm] = useState('');
  const [jobSearchTerm, setJobSearchTerm] = useState('');
  const [activeJobMenu, setActiveJobMenu] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const fileInputRef = React.useRef(null);
  const profileFileInputRef = React.useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userFromStorage = localStorage.getItem('user');
    
    // Check if token exists and redirect if not
    if (!token) {
      navigate('/login');
      return;
    }

    // Check if token is valid (not expired)
    try {
      if (userFromStorage) {
        const parsedUser = JSON.parse(userFromStorage);
        setUser(parsedUser);
        setEditForm({
          fullname: parsedUser.fullname || '',
          email: parsedUser.email || '',
          phoneNumber: parsedUser.phoneNumber || '',
          bio: parsedUser.profile?.bio || 'Experienced software developer',
          skills: parsedUser.profile?.skills?.join(',') || 'Nextjs14,Typescript,Prisma,developer',
          resume: null
        });
        
        // Load companies and jobs if user is a recruiter
        if (parsedUser.role === 'recruiter') {
          const storedCompanies = localStorage.getItem('companies');
          if (storedCompanies) {
            setCompanies(JSON.parse(storedCompanies));
          }
          
          const storedJobs = localStorage.getItem('jobs');
          if (storedJobs) {
            setJobs(JSON.parse(storedJobs));
          }
        } else {
          // Load saved jobs if user is a student
          const storedSavedJobs = localStorage.getItem('savedJobs');
          if (storedSavedJobs) {
            setSavedJobs(JSON.parse(storedSavedJobs));
          }
        }
      } else {
        // If no user data, fetch it from the server
        const fetchUserData = async () => {
          try {
            const response = await axios.get('http://localhost:5000/api/users/profile', {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            setEditForm({
              fullname: response.data.fullname || '',
              email: response.data.email || '',
              phoneNumber: response.data.phoneNumber || '',
              bio: response.data.profile?.bio || 'Experienced software developer',
              skills: response.data.profile?.skills?.join(',') || 'Nextjs14,Typescript,Prisma,developer',
              resume: null
            });
            
            // Load companies and jobs if user is a recruiter
            if (response.data.role === 'recruiter') {
              const storedCompanies = localStorage.getItem('companies');
              if (storedCompanies) {
                setCompanies(JSON.parse(storedCompanies));
              }
              
              const storedJobs = localStorage.getItem('jobs');
              if (storedJobs) {
                setJobs(JSON.parse(storedJobs));
              }
            } else {
              // Load saved jobs if user is a student
              const storedSavedJobs = localStorage.getItem('savedJobs');
              if (storedSavedJobs) {
                setSavedJobs(JSON.parse(storedSavedJobs));
              }
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            if (error.response?.status === 401) {
              // Token is invalid or expired
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/login');
            }
          }
        };
        fetchUserData();
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  }, [navigate]);

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm(prev => ({
        ...prev,
        resume: file
      }));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please login again to continue.');
        navigate('/login');
        return;
      }

      const formData = new FormData();
      
      // Validate and clean skills array - filter out empty values
      const skillsArray = editForm.skills
        ? editForm.skills
            .split(',')
            .map(skill => skill.trim())
            .filter(skill => skill.length > 0)
        : [];
      
      // Validate required fields
      if (!editForm.fullname || !editForm.email) {
        alert('Name and email are required fields');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editForm.email)) {
        alert('Please enter a valid email address');
        return;
      }
      
      // Add basic fields - only if they have values
      if (editForm.fullname) formData.append('fullname', editForm.fullname);
      if (editForm.email) formData.append('email', editForm.email);
      if (editForm.phoneNumber) formData.append('phoneNumber', editForm.phoneNumber);
      if (editForm.bio) formData.append('bio', editForm.bio);
      
      // Always send skills array, even if empty
      formData.append('skills', JSON.stringify(skillsArray));

      // Add resume if exists and is valid
      if (editForm.resume && editForm.resume instanceof File) {
        formData.append('resume', editForm.resume);
      }

      const response = await axios.put(
        'http://localhost:5000/api/users/profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        setShowEditModal(false);
        // Show success message
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile. Please try again.';
      alert(errorMessage);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account. Please try again.');
      }
    }
  };

  // Function to handle resume upload from profile view
  const handleProfileResumeChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('resume', file);
      // Only send resume, keep other fields as is
      const response = await axios.put(
        'http://localhost:5000/api/users/profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      if (response.data) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        alert('Resume uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      alert('Failed to upload resume. Please try again.');
    }
  };

  const handleProfileChooseFile = () => {
    profileFileInputRef.current.click();
  };

  const handleViewCompany = (companyId) => {
    navigate('/company-setup', { 
      state: { 
        editMode: true,
        companyData: companies.find(c => c.id === companyId)
      } 
    });
  };

  const handleViewJob = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  // Filter companies based on search term
  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(companySearchTerm.toLowerCase())
  );

  // Filter jobs based on search term (match by title or company name)
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(jobSearchTerm.toLowerCase()) || 
    job.companyName.toLowerCase().includes(jobSearchTerm.toLowerCase())
  );

  const handleCompanySearch = (e) => {
    setCompanySearchTerm(e.target.value);
  };

  const handleJobSearch = (e) => {
    setJobSearchTerm(e.target.value);
  };

  // New functions for job actions
  const toggleJobMenu = (e, jobId) => {
    e.stopPropagation(); // Prevent job card click
    setActiveJobMenu(activeJobMenu === jobId ? null : jobId);
  };

  const handleEditJob = (e, jobId) => {
    e.stopPropagation(); // Prevent job card click
    setActiveJobMenu(null);
    // Navigate to edit job page with the selected job data
    const jobToEdit = jobs.find(job => job.id === jobId);
    navigate('/new-job', { state: { editMode: true, jobData: jobToEdit } });
  };

  const handleViewApplicants = (e, jobId) => {
    e.stopPropagation(); // Prevent job card click
    setActiveJobMenu(null);
    // Navigate to applicants page for this job
    navigate(`/job-applicants/${jobId}`);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (activeJobMenu && !e.target.closest('.job-menu-container')) {
        setActiveJobMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeJobMenu]);

  // Add this function for deleting a job
  const handleDeleteJob = (e, jobId) => {
    e.stopPropagation(); // Prevent job card click
    setActiveJobMenu(null);
    
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      // Filter out the job to delete
      const updatedJobs = jobs.filter(job => job.id !== jobId);
      setJobs(updatedJobs);
      
      // Update localStorage
      localStorage.setItem('jobs', JSON.stringify(updatedJobs));
      
      // Show alert to confirm
      alert('Job posting deleted successfully');
    }
  };

  const handleViewJobDetails = (job) => {
    // Save the job data to localStorage so it can be accessed from the details page
    localStorage.setItem('selectedJobDetails', JSON.stringify(job));
    // Navigate to the job details page
    navigate(`/job-details/${job.id}`);
  };

  const handleRemoveSavedJob = (jobId) => {
    // Remove the job from saved jobs
    const updatedSavedJobs = savedJobs.filter(job => job.id !== jobId);
    setSavedJobs(updatedSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
  };

  if (!user) return null;

  // Render different profile based on user role
  if (user.role === 'recruiter') {
    // Recruiter profile
    return (
      <div className="profile-page">
        <Navbar />
        <div className="navbar-spacer"></div>
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                <span>{user.fullname ? user.fullname.charAt(0).toUpperCase() : 'R'}</span>
              </div>
              <div className="profile-info">
                <h2>{user.fullname}</h2>
                <p className="recruiter-badge">Recruiter</p>
                <p className="recruiter-bio">{user.profile?.bio || 'Professional Recruiter'}</p>
              </div>
            </div>
            <button className="edit-icon-button" onClick={handleEditClick}>
              <FaPencilAlt />
            </button>
          </div>

          <div className="contact-info">
            <div className="contact-item">
              <MdEmail />
              <span>{user.email}</span>
            </div>
            <div className="contact-item">
              <MdPhone />
              <span>{user.phoneNumber || '90000000'}</span>
            </div>
          </div>

          <div className="profile-section">
            <h3>Skills</h3>
            <div className="skills-list">
              {(user.profile?.skills || ['Recruiting', 'Hiring', 'Talent Acquisition', 'HR']).map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="profile-section">
            <h3>Statistics</h3>
            <div className="recruiter-stats">
              <div className="stat-item">
                <span className="stat-number">{companies.length}</span>
                <span className="stat-label">Companies</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{jobs.length}</span>
                <span className="stat-label">Job Postings</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">0</span>
                <span className="stat-label">Hires</span>
              </div>
            </div>
          </div>
        </div>

        <div className="companies-section">
          <div className="section-header">
            <h3>My Companies</h3>
            <button className="section-action-btn" onClick={() => navigate('/new-company')}>
              Add Company
            </button>
          </div>
          
          <div className="search-container">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search companies by name..."
                value={companySearchTerm}
                onChange={handleCompanySearch}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="companies-grid">
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map(company => (
                <div key={company.id} className="company-card" onClick={() => handleViewCompany(company.id)}>
                  <div className="company-logo">
                    {company.logo ? (
                      <img src={company.logo} alt={company.name} />
                    ) : (
                      <div className="default-logo">
                        <FaBuilding />
                      </div>
                    )}
                  </div>
                  <h4>{company.name}</h4>
                  <p>{company.location || 'No location specified'}</p>
                </div>
              ))
            ) : (
              companySearchTerm ? (
                <div className="empty-state">
                  <p>No companies found matching "{companySearchTerm}"</p>
                  <button onClick={() => setCompanySearchTerm('')}>Clear Search</button>
                </div>
              ) : (
                <div className="empty-state">
                  <p>You haven't added any companies yet.</p>
                  <button onClick={() => navigate('/new-company')}>Add Company</button>
                </div>
              )
            )}
          </div>
        </div>

        <div className="jobs-section">
          <div className="section-header">
            <h3>My Job Postings</h3>
            <button className="section-action-btn" onClick={() => navigate('/new-job')}>
              Post New Job
            </button>
          </div>
          
          <div className="search-container">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search jobs by title or company..."
                value={jobSearchTerm}
                onChange={handleJobSearch}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="jobs-list">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <div key={job.id} className="job-card" onClick={() => handleViewJob(job.id)}>
                  <div className="job-icon">
                    <FaBriefcase />
                  </div>
                  <div className="job-details">
                    <h4>{job.title}</h4>
                    <p>{job.companyName} • {job.location}</p>
                    <div className="job-meta">
                      <span>{job.jobType}</span>
                      <span>{job.date}</span>
                    </div>
                  </div>
                  <div className="job-menu-container" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="job-menu-btn" 
                      onClick={(e) => toggleJobMenu(e, job.id)}
                      aria-label="Job actions"
                    >
                      <FaEllipsisH />
                    </button>
                    {activeJobMenu === job.id && (
                      <div className="job-menu">
                        <button 
                          className="job-menu-item" 
                          onClick={(e) => handleEditJob(e, job.id)}
                        >
                          <FaEdit className="menu-icon" />
                          <span>Edit</span>
                        </button>
                        <button 
                          className="job-menu-item delete-menu-item" 
                          onClick={(e) => handleDeleteJob(e, job.id)}
                        >
                          <FaTrash className="menu-icon" />
                          <span>Delete</span>
                        </button>
                        <button 
                          className="job-menu-item" 
                          onClick={(e) => handleViewApplicants(e, job.id)}
                        >
                          <FaUsers className="menu-icon" />
                          <span>Applicants</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              jobSearchTerm ? (
                <div className="empty-state">
                  <p>No jobs found matching "{jobSearchTerm}"</p>
                  <button onClick={() => setJobSearchTerm('')}>Clear Search</button>
                </div>
              ) : (
                <div className="empty-state">
                  <p>You haven't posted any jobs yet.</p>
                  <button onClick={() => navigate('/new-job')}>Post Job</button>
                </div>
              )
            )}
          </div>
        </div>

        <div className="delete-account-section">
          <button className="delete-account-button" onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>

        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Update Profile</h2>
              <form onSubmit={handleUpdateProfile}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="fullname"
                    value={editForm.fullname}
                    onChange={handleInputChange}
                    placeholder="Glory Jain"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    placeholder="gloryjain@gmail.com"
                  />
                </div>
                <div className="form-group">
                  <label>Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={editForm.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+918290153826"
                  />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <input
                    type="text"
                    name="bio"
                    value={editForm.bio}
                    onChange={handleInputChange}
                    placeholder="Professional Recruiter"
                  />
                </div>
                <div className="form-group">
                  <label>Skills</label>
                  <input
                    type="text"
                    name="skills"
                    value={editForm.skills}
                    onChange={handleInputChange}
                    placeholder="Recruiting,Hiring,Talent Acquisition,HR"
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="update-button">
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  } else {
    // Student profile
    return (
      <div className="profile-page">
        <Navbar />
        <div className="navbar-spacer"></div>
        <style jsx>{`
          .profile-page {
            min-height: 100vh;
            background-color: #f8f9fa;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          }
          
          .navbar-spacer {
            height: 70px;
          }
          
          .profile-tabs {
            display: flex;
            gap: 8px;
            margin-bottom: 24px;
            border-bottom: 1px solid #e5e7eb;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
          }
          
          .profile-tab {
            padding: 12px 20px;
            font-size: 16px;
            font-weight: 500;
            color: #6b7280;
            cursor: pointer;
            background: none;
            border: none;
            border-bottom: 2px solid transparent;
          }
          
          .profile-tab.active {
            color: #8b5cf6;
            border-bottom: 2px solid #8b5cf6;
          }
          
          .profile-container {
            max-width: 1200px;
            margin: 20px auto;
            padding: 0 20px;
          }
          
          .section-title {
            font-size: 22px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 24px;
          }
          
          .saved-jobs-container {
            display: grid;
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .saved-job-card {
            background-color: #ffffff;
            border-radius: 10px;
            border: 1px solid #e5e7eb;
            padding: 20px;
            display: grid;
            grid-template-columns: 60px 1fr auto;
            gap: 16px;
            transition: transform 0.2s, box-shadow 0.2s;
          }
          
          .saved-job-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          
          .job-logo {
            width: 60px;
            height: 60px;
            background-color: #f4f4f5;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 24px;
          }
          
          .google {
            color: #1a73e8;
          }
          
          .microsoft {
            color: #107c10;
          }
          
          .amazon {
            color: #ff9900;
          }
          
          .job-info {
            display: flex;
            flex-direction: column;
          }
          
          .job-company {
            font-size: 14px;
            font-weight: 500;
            color: #6b7280;
          }
          
          .job-title {
            font-size: 18px;
            font-weight: 600;
            color: #111827;
            margin: 4px 0;
          }
          
          .job-location {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 8px;
          }
          
          .job-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 8px;
          }
          
          .job-tag {
            padding: 4px 10px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: 500;
          }
          
          .salary-tag {
            background-color: #dbeafe;
            color: #2563eb;
          }
          
          .type-tag {
            background-color: #8b5cf6;
            color: white;
          }
          
          .positions-tag {
            background-color: #e0f2fe;
            color: #0369a1;
          }
          
          .job-actions {
            display: flex;
            gap: 8px;
            align-items: flex-start;
          }
          
          .action-button {
            background: none;
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #6b7280;
            transition: background-color 0.2s, color 0.2s;
          }
          
          .action-button:hover {
            background-color: #f3f4f6;
            color: #8b5cf6;
          }
          
          .remove-button:hover {
            color: #ef4444;
          }
          
          .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #6b7280;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          
          .empty-state h3 {
            margin-bottom: 12px;
            font-size: 18px;
            font-weight: 600;
            color: #111827;
          }
          
          .empty-state p {
            margin-bottom: 24px;
            max-width: 400px;
            margin: 0 auto 24px;
          }
          
          .browse-button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #8b5cf6;
            color: white;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
            border: none;
            transition: background-color 0.2s;
          }
          
          .browse-button:hover {
            background-color: #7c3aed;
          }
        `}</style>
        
        <div className="profile-tabs">
          <button 
            className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button 
            className={`profile-tab ${activeTab === 'saved-jobs' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved-jobs')}
          >
            Saved Jobs
          </button>
          <button 
            className={`profile-tab ${activeTab === 'applied-jobs' ? 'active' : ''}`}
            onClick={() => setActiveTab('applied-jobs')}
          >
            Applied Jobs
          </button>
        </div>
        
        <div className="profile-container">
          {activeTab === 'profile' && (
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar-section">
                  <div className="profile-avatar">
                    <span>G</span>
                  </div>
                  <div className="profile-info">
                    <h2>{user.fullname}</h2>
                    <p>Experienced software developer</p>
                  </div>
                </div>
                <button className="edit-icon-button" onClick={handleEditClick}>
                  <FaPencilAlt />
                </button>
              </div>

              <div className="contact-info">
                <div className="contact-item">
                  <MdEmail />
                  <span>{user.email}</span>
                </div>
                <div className="contact-item">
                  <MdPhone />
                  <span>{user.phoneNumber || '90000000'}</span>
                </div>
              </div>

              <div className="profile-section">
                <h3>Skills</h3>
                <div className="skills-list">
                  {['NextJs', 'Typescript', 'Prisma', 'graphQL'].map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="profile-section">
                <h3>Resume</h3>
                {user.profile?.resume ? (
                  <a
                    href={`http://localhost:5000/uploads/resume/${user.profile.resume}`}
                    className="resume-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user.profile.resumeOriginalName || 'Download Resume'}
                  </a>
                ) : (
                  <div className="file-input-container">
                    <button type="button" className="choose-file-button" onClick={handleProfileChooseFile}>
                      Choose File
                    </button>
                    <input
                      type="file"
                      ref={profileFileInputRef}
                      onChange={handleProfileResumeChange}
                      accept=".pdf,.doc,.docx"
                      style={{ display: 'none' }}
                    />
                  </div>
                )}
              </div>
              
              <div className="delete-account-section">
                <button className="delete-account-button" onClick={handleDeleteAccount}>
                  Delete Account
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'saved-jobs' && (
            <div className="saved-jobs-section">
              <h2 className="section-title">Your Saved Jobs</h2>
              
              {savedJobs.length > 0 ? (
                <div className="saved-jobs-container">
                  {savedJobs.map(job => (
                    <div key={job.id} className="saved-job-card">
                      <div className={`job-logo ${job.company?.toLowerCase()}`}>
                        {job.logo || job.company?.[0]}
                      </div>
                      
                      <div className="job-info">
                        <span className="job-company">{job.company}</span>
                        <h3 className="job-title">{job.title || job.position}</h3>
                        <span className="job-location">{job.location}</span>
                        
                        <div className="job-tags">
                          <span className="job-tag salary-tag">{job.salary}</span>
                          <span className="job-tag type-tag">{job.type}</span>
                          <span className="job-tag positions-tag">{job.positions} Positions</span>
                        </div>
                      </div>
                      
                      <div className="job-actions">
                        <button 
                          className="action-button" 
                          title="View Details"
                          onClick={() => handleViewJobDetails(job)}
                        >
                          <FaExternalLinkAlt />
                        </button>
                        
                        <button 
                          className="action-button remove-button" 
                          title="Remove from Saved"
                          onClick={() => handleRemoveSavedJob(job.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <h3>No saved jobs yet</h3>
                  <p>Browse available jobs and click "Save For Later" to add them to your saved jobs list.</p>
                  <button onClick={() => navigate('/jobs')} className="browse-button">
                    Browse Jobs
                  </button>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'applied-jobs' && (
            <div className="applied-jobs-section">
              <h2 className="section-title">Your Applied Jobs</h2>
              
              <div className="empty-state">
                <h3>No job applications yet</h3>
                <p>Browse available jobs and apply to start building your application history.</p>
                <button onClick={() => navigate('/jobs')} className="browse-button">
                  Browse Jobs
                </button>
              </div>
            </div>
          )}
        </div>

        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Update Profile</h2>
              <form onSubmit={handleUpdateProfile}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="fullname"
                    value={editForm.fullname}
                    onChange={handleInputChange}
                    placeholder="Glory Jain"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    placeholder="gloryjain@gmail.com"
                  />
                </div>
                <div className="form-group">
                  <label>Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={editForm.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+918290153826"
                  />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <input
                    type="text"
                    name="bio"
                    value={editForm.bio}
                    onChange={handleInputChange}
                    placeholder="Experienced software developer"
                  />
                </div>
                <div className="form-group">
                  <label>Skills</label>
                  <input
                    type="text"
                    name="skills"
                    value={editForm.skills}
                    onChange={handleInputChange}
                    placeholder="Nextjs14,Typescript,Prisma,developer"
                  />
                </div>
                <div className="form-group">
                  <label>Resume</label>
                  <div className="file-input-container">
                    <button type="button" className="choose-file-button" onClick={handleFileButtonClick}>
                      Choose File
                    </button>
                    <span className="file-name">
                      {editForm.resume ? editForm.resume.name : 'No file chosen'}
                    </span>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="update-button">
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }
};

export default Profile; 