import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPencilAlt, FaBuilding, FaBriefcase, FaSearch, FaEllipsisH, FaEdit, FaUsers, FaTrash, FaBookmark, FaExternalLinkAlt, FaFilePdf, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaCamera, FaEnvelope } from 'react-icons/fa';
import { MdEmail, MdPhone } from 'react-icons/md';
import './Profile.css';
import axios from 'axios';
import Navbar from '../components/auth/Navbar';
import ConfirmApplyModal from '../components/ConfirmApplyModal';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    bio: '',
    skills: '',
    resume: null,
    profilePhoto: null,
    jobProfile: ''
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
  const [notifications, setNotifications] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [showEditTooltip, setShowEditTooltip] = useState(false);
  const [avatarHover, setAvatarHover] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState(null); // 'company' or 'job'

  // Function to load applied jobs for the current user
  const loadAppliedJobs = () => {
    const userFromStorage = JSON.parse(localStorage.getItem('user'));
    const userId = userFromStorage?.id || userFromStorage?._id;
    if (userId) {
      const allAppliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
      // Filter jobs that were applied by the current user.
      // This is a placeholder logic. You might need to adjust `appliedBy` based on how you store it.
      const userAppliedJobs = allAppliedJobs.filter(job => job.appliedBy === userId);
      setAppliedJobs(userAppliedJobs);
    } else {
      setAppliedJobs([]);
    }
  };

  // Function to load saved jobs for the current user
  const loadSavedJobs = (currentUser) => {
    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const userId = currentUser && (currentUser.id || currentUser._id);
    if (userId) {
      // Assuming saved jobs in localStorage are stored with a userId
      // If the structure is different, this needs to be adjusted
      const userSavedJobs = saved.filter(job => job.userId === userId || job.savedBy === userId);
      setSavedJobs(userSavedJobs);
    } else {
      // Fallback for when user object is not fully loaded, or for older data
      // This part might need adjustment based on how saved jobs are stored
      const userFromStorage = JSON.parse(localStorage.getItem('user'));
      if (userFromStorage) {
        const storedUserId = userFromStorage.id || userFromStorage._id;
        const userSavedJobs = saved.filter(job => job.userId === storedUserId || job.savedBy === storedUserId);
        setSavedJobs(userSavedJobs);
      } else {
        setSavedJobs(saved); // Or set to [] if saved jobs should be user-specific
      }
    }
  };

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
          bio: parsedUser.role === 'recruiter' ? (parsedUser.profile?.bio || 'Experienced software developer') : '',
          skills: parsedUser.profile?.skills?.join(',') || 'Nextjs14,Typescript,Prisma,developer',
          resume: null,
          profilePhoto: parsedUser.profile?.profilePhoto || null,
          jobProfile: parsedUser.profile?.jobProfile || ''
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
              bio: response.data.role === 'recruiter' ? (response.data.profile?.bio || 'Experienced software developer') : '',
              skills: response.data.profile?.skills?.join(',') || 'Nextjs14,Typescript,Prisma,developer',
              resume: null,
              profilePhoto: response.data.profile?.profilePhoto || null,
              jobProfile: response.data.profile?.jobProfile || ''
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

      // Load applied jobs for the current user
      loadAppliedJobs();
      loadSavedJobs(user);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  }, [navigate]);

  // Also reload applied jobs when switching to the 'applied-jobs' tab
  useEffect(() => {
    if (activeTab === 'applied-jobs') {
      loadAppliedJobs(user);
    }
    if (activeTab === 'saved-jobs') {
      loadSavedJobs(user);
    }
  }, [activeTab, user]);

  const handleEditClick = () => {
    setEditForm({
      fullname: user.fullname || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      bio: user.role === 'recruiter' ? (user.profile?.bio || 'Experienced software developer') : '',
      skills: user.profile?.skills?.join(',') || '',
      resume: null,
      profilePhoto: user.profile?.profilePhoto || null,
      jobProfile: user.profile?.jobProfile || ''
    });
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

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setEditForm(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };

  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        addNotification('Please login again to continue.', 'error');
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
        addNotification('Name and email are required fields', 'error');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editForm.email)) {
        addNotification('Please enter a valid email address', 'error');
        return;
      }
      
      // Add basic fields - only if they have values
      formData.append('fullname', editForm.fullname);
      formData.append('email', editForm.email);
      formData.append('phoneNumber', editForm.phoneNumber || '');
      formData.append('bio', editForm.bio || '');
      formData.append('skills', JSON.stringify(skillsArray));

      // Add job profile for recruiters
      if (user.role === 'recruiter' && editForm.jobProfile) {
        formData.append('jobProfile', editForm.jobProfile);
      }

      // Add resume if exists and is valid (only for students)
      if (user.role === 'student' && editForm.resume && editForm.resume instanceof File) {
        formData.append('resume', editForm.resume);
      }

      // Add profile photo if exists and is valid
      if (editForm.profilePhoto && editForm.profilePhoto instanceof File) {
        formData.append('profilePhoto', editForm.profilePhoto);
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
        // Update local user state and storage
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        
        // Close modal and show success notification
        setShowEditModal(false);
        addNotification('Profile updated successfully!', 'success');
        
        // Update edit form with new values
        setEditForm({
          fullname: response.data.fullname || '',
          email: response.data.email || '',
          phoneNumber: response.data.phoneNumber || '',
          bio: response.data.role === 'recruiter' ? (response.data.profile?.bio || 'Experienced software developer') : '',
          skills: response.data.profile?.skills?.join(',') || 'Nextjs14,Typescript,Prisma,developer',
          resume: null,
          profilePhoto: null,
          jobProfile: response.data.profile?.jobProfile || ''
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile. Please try again.';
      addNotification(errorMessage, 'error');
      
      // Handle unauthorized error
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
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
      if (!token) {
        alert('Your session has expired. Please log in again.');
        navigate('/login');
        return;
      }
      
      const formData = new FormData();
      formData.append('resume', file);
      
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
      const errorMessage = error.response?.data?.message || 'Failed to upload resume. Please try again.';
      alert(errorMessage);

      if (error.response?.status === 401) {
        // Clear session and redirect to login for authorization errors
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
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

  const handleRemoveAppliedJob = (jobId) => {
    try {
      const applications = JSON.parse(localStorage.getItem('applications') || '[]');
      const updatedApplications = applications.filter(app => app.id !== jobId);
      localStorage.setItem('applications', JSON.stringify(updatedApplications));
      setAppliedJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
      addNotification('Job application removed successfully', 'success');
    } catch (error) {
      console.error('Error removing job application:', error);
      addNotification('Failed to remove job application', 'error');
    }
  };

  const handleProfilePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        addNotification('Profile photo must be less than 5MB', 'error');
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        addNotification('Invalid file type. Only JPG, PNG, GIF, and WEBP are allowed', 'error');
        return;
      }

      try {
        const formData = new FormData();
        formData.append('profilePhoto', file);

        const token = localStorage.getItem('token');
        const response = await axios.post(
          'http://localhost:5000/api/users/profile/photo',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        // Update user state with new profile photo
        setUser(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            profilePhoto: response.data.profilePhoto
          }
        }));

        // Update local storage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        storedUser.profile = {
          ...storedUser.profile,
          profilePhoto: response.data.profilePhoto
        };
        localStorage.setItem('user', JSON.stringify(storedUser));

        addNotification('Profile photo updated successfully', 'success');
      } catch (error) {
        console.error('Error uploading profile photo:', error);
        addNotification(error.response?.data?.message || 'Failed to update profile photo', 'error');
      }
    }
  };

  if (!user) return null;

  // Render different profile based on user role
  if (user.role === 'recruiter') {
    // Recruiter profile (restore original layout)
    return (
      <>
        <div style={{ fontFamily: 'Inter, Roboto, system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh', padding: '40px 0' }}>
          <Navbar />
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '60vh' }}>
            <div
              style={{
                position: 'relative',
                background: '#fff',
                borderRadius: '1.25rem', // rounded-xl
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                padding: '3.5rem 4rem',
                minWidth: 600,
                maxWidth: 900,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2.5rem',
              }}
            >
              {/* Edit Icon in card's top-right */}
              <div
                style={{ position: 'absolute', top: 20, right: 24, zIndex: 2 }}
                onMouseEnter={() => setShowEditTooltip(true)}
                onMouseLeave={() => setShowEditTooltip(false)}
              >
                <button
                  style={{
                    background: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    padding: 8,
                    cursor: 'pointer',
                    color: '#6b7280',
                    fontSize: 20,
                    transition: 'background 0.2s, color 0.2s',
                  }}
                  title="Edit Profile"
                  onClick={handleEditClick}
                  tabIndex={0}
                  aria-label="Edit Profile"
                >
                  <FaPencilAlt />
                </button>
                {showEditTooltip && (
                  <div style={{
                    position: 'absolute',
                    top: -32,
                    right: 0,
                    background: '#22223b',
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: 6,
                    fontSize: 13,
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                    zIndex: 10,
                  }}>
                    Edit Profile
                  </div>
                )}
              </div>
              {/* Avatar Section centered */}
              <div style={{ position: 'relative', width: 64, height: 64, marginBottom: 8 }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 28,
                    color: '#7c3aed',
                    overflow: 'hidden',
                    position: 'relative',
                    border: '2px solid #e5e7eb',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.2s',
                    boxShadow: avatarHover ? '0 0 0 4px #ede9fe' : undefined,
                  }}
                  onClick={() => document.getElementById('profilePhotoInput').click()}
                  title="Change Profile Picture"
                  onMouseEnter={() => setAvatarHover(true)}
                  onMouseLeave={() => setAvatarHover(false)}
                >
                  {user.profile?.profilePhoto ? (
                    <img
                      src={`http://localhost:5000/uploads/profile/${user.profile.profilePhoto}`}
                      alt={user.fullname}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                      onError={e => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullname)}&background=random`;
                      }}
                    />
                  ) : (
                    <span>{user.fullname?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)}</span>
                  )}
                  {/* Hidden file input for avatar upload */}
                  <input
                    type="file"
                    id="profilePhotoInput"
                    className="profile-photo-input"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleProfilePhotoChange}
                    tabIndex={-1}
                    aria-hidden="true"
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
              {/* Content Section */}
              <div style={{ width: '100%', textAlign: 'left', padding: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 22, color: '#22223b', marginBottom: 2 }}>{user.fullname}</div>
                {user?.role === 'recruiter' && (
                  <div style={{ color: '#6b7280', fontSize: 15, marginBottom: 10 }}>
                    {user.profile?.bio}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', color: '#6b7280', fontSize: 15, gap: 8, marginBottom: 4 }}>
                  <FaEnvelope style={{ fontSize: 16, color: '#8b5cf6', marginRight: 4 }} />
                  <span>{user.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', color: '#6b7280', fontSize: 15, gap: 8, marginBottom: 18 }}>
                  <MdPhone style={{ fontSize: 16, color: '#8b5cf6', marginRight: 4 }} />
                  <span>{user.phoneNumber || 'Not Provided'}</span>
                </div>
                {/* Skills */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontWeight: 600, color: '#111827', marginBottom: 8, fontSize: 16 }}>Skills</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {(user.profile?.skills || editForm.skills.split(',')).map((skill, idx) => (
                      <span key={idx} style={{ background: '#111827', color: 'white', borderRadius: 16, padding: '6px 18px', fontSize: 15, fontWeight: 500 }}>{skill.trim()}</span>
                    ))}
                  </div>
                </div>
                {/* Companies Created */}
                <div style={{ marginBottom: 32 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ fontWeight: 600, color: '#111827', fontSize: 16 }}>Companies Created</div>
                    <button onClick={() => navigate('/new-company')} style={{ background: '#8b5cf6', color: 'white', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>+ New Company</button>
                  </div>
                  {companies.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {companies.map(company => (
                        <div key={company.id} style={{ background: '#f8fafc', borderRadius: 10, padding: '14px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: 18 }}>
                          <div style={{ width: 44, height: 44, borderRadius: 8, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#7c3aed', fontSize: 20 }}>{company.name[0]}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, color: '#22223b', fontSize: 16 }}>{company.name}</div>
                            <div style={{ color: '#6b7280', fontSize: 13 }}>{company.industry || 'Industry'}</div>
                          </div>
                          <button style={{ background: 'none', border: 'none', color: '#8b5cf6', cursor: 'pointer', fontWeight: 500, fontSize: 15, marginRight: 8 }} onClick={() => navigate('/company-setup', { state: { editMode: true, companyData: company } })}>Edit</button>
                          <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 500, fontSize: 15 }} onClick={() => { setDeleteTarget(company); setDeleteType('company'); setShowDeleteModal(true); }}>Delete</button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: '#6b7280', fontSize: 14 }}>No companies created yet.</div>
                  )}
                </div>
                {/* Jobs Created */}
                <div style={{ marginBottom: 32 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ fontWeight: 600, color: '#111827', fontSize: 16 }}>Jobs Created</div>
                    <button onClick={() => navigate('/new-job')} style={{ background: '#8b5cf6', color: 'white', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>+ New Job</button>
                  </div>
                  {jobs.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {jobs.map(job => (
                        <div key={job.id} style={{ background: '#f8fafc', borderRadius: 10, padding: '14px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: 18 }}>
                          <div style={{ width: 44, height: 44, borderRadius: 8, background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#6366f1', fontSize: 20 }}>{job.title ? job.title[0] : '?'}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, color: '#22223b', fontSize: 16 }}>{job.title}</div>
                            <div style={{ color: '#6b7280', fontSize: 13 }}>{job.companyName || 'Company'}</div>
                          </div>
                          <button style={{ background: 'none', border: 'none', color: '#8b5cf6', cursor: 'pointer', fontWeight: 500, fontSize: 15, marginRight: 8 }} onClick={() => navigate('/new-job', { state: { editMode: true, jobData: job } })}>Edit</button>
                          <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 500, fontSize: 15 }} onClick={() => { setDeleteTarget(job); setDeleteType('job'); setShowDeleteModal(true); }}>Delete</button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: '#6b7280', fontSize: 14 }}>No jobs created yet.</div>
                  )}
                </div>
                {/* Delete Account Button */}
                <div className="delete-account-section">
                  <button className="delete-account-button" onClick={handleDeleteAccount}>
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: '#111827', fontSize: '1.5rem', fontWeight: 600 }}>Update Profile</h2>
                <button 
                  onClick={handleCloseModal}
                  style={{ 
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    color: '#6B7280',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleUpdateProfile}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullname"
                    value={editForm.fullname}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #E5E7EB',
                      fontSize: '14px',
                      marginTop: '4px'
                    }}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #E5E7EB',
                      fontSize: '14px',
                      marginTop: '4px'
                    }}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={editForm.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #E5E7EB',
                      fontSize: '14px',
                      marginTop: '4px'
                    }}
                  />
                </div>
                {user?.role === 'recruiter' && (
                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      name="bio"
                      value={editForm.bio}
                      onChange={handleInputChange}
                      placeholder="Enter a short bio"
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #E5E7EB',
                        fontSize: '14px',
                        marginTop: '4px',
                        resize: 'vertical',
                        minHeight: '80px'
                      }}
                    />
                  </div>
                )}
                <div className="form-group">
                  <label>Skills & Expertise</label>
                  <input
                    type="text"
                    name="skills"
                    value={editForm.skills}
                    onChange={handleInputChange}
                    placeholder="e.g., Technical Recruiting, Talent Acquisition (comma-separated)"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #E5E7EB',
                      fontSize: '14px',
                      marginTop: '4px'
                    }}
                  />
                </div>
                <div className="modal-actions" style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: '1px solid #E5E7EB',
                      background: 'white',
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      background: '#8B5CF6',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7C3AED'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#8B5CF6'}
                  >
                    Update Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
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
        <ConfirmApplyModal
          open={showDeleteModal}
          onClose={() => { setShowDeleteModal(false); setDeleteTarget(null); setDeleteType(null); }}
          onConfirm={() => {
            if (deleteType === 'company' && deleteTarget) {
              setCompanies(prev => prev.filter(c => c.id !== deleteTarget.id));
              localStorage.setItem('companies', JSON.stringify(companies.filter(c => c.id !== deleteTarget.id)));
            } else if (deleteType === 'job' && deleteTarget) {
              setJobs(prev => prev.filter(j => j.id !== deleteTarget.id));
              localStorage.setItem('jobs', JSON.stringify(jobs.filter(j => j.id !== deleteTarget.id)));
            }
            setShowDeleteModal(false);
            setDeleteTarget(null);
            setDeleteType(null);
          }}
          message="Are you sure you want to delete?"
        />
      </>
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

          .delete-account-section {
            margin-top: 24px;
            text-align: right;
          }

          .delete-account-button {
            color: #dc2626;
            background: none;
            border: none;
            padding: 8px;
            font-size: 14px;
            cursor: pointer;
            transition: color 0.2s;
          }

          .delete-account-button:hover {
            color: #ef4444;
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
              <div className="profile-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div 
                    className="profile-avatar"
                    onClick={() => document.getElementById('profilePhotoInput').click()}
                    title="Click to change profile picture"
                  >
                    {user.profile?.profilePhoto ? (
                      <img
                        src={`http://localhost:5000/uploads/profile/${user.profile.profilePhoto}`}
                        alt={user.fullname}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullname)}&background=random`;
                        }}
                      />
                    ) : (
                      <span>{user.fullname?.[0]?.toUpperCase()}</span>
                    )}
                    <input
                      type="file"
                      id="profilePhotoInput"
                      className="profile-photo-input"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleProfilePhotoChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                  <div className="profile-header-content">
                    <div className="profile-info">
                      <h2>{user.fullname}</h2>
                    </div>
                  </div>
                </div>
                <button className="edit-icon-button" onClick={handleEditClick}>
                  <FaPencilAlt />
                </button>
              </div>

              <div className="user-details-section">
                <div className="contact-info">
                  <div className="contact-item">
                    <MdEmail />
                    <span>{user.email}</span>
                  </div>
                  <div className="contact-item">
                    <MdPhone />
                    <span>{user.phoneNumber || 'Not Provided'}</span>
                  </div>
                </div>

                <div className="profile-section">
                  <h3>Skills</h3>
                  <div className="skills-list">
                    {(user.profile?.skills || []).map((skill, index) => (
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
                      href={`http://localhost:5000/uploads/resume/${user.profile.resume.trim()}`}
                      className="resume-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {user.profile.resumeOriginalName || 'View Resume'}
                    </a>
                  ) : (
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>No resume uploaded.</p>
                  )}
                </div>

                <div className="delete-account-section">
                  <button className="delete-account-button" onClick={handleDeleteAccount}>
                    Delete Account
                  </button>
                </div>
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
                        {job.company?.[0]?.toUpperCase()}
                      </div>
                      <div className="job-info">
                        <span className="job-company">{job.company}</span>
                        <h3 className="job-title">{job.title || job.position}</h3>
                        <span className="job-location">{job.location}</span>
                        <div className="job-tags">
                          <span className="job-tag salary-tag">{job.salary}</span>
                          <span className="job-tag type-tag">{job.type || job.jobType}</span>
                          <span className="job-tag positions-tag">{job.positions || job.numberOfPositions} positions</span>
                        </div>
                      </div>
                      <div className="job-actions">
                        <button
                          className="action-button"
                          onClick={() => handleViewJobDetails(job)}
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="action-button remove-button"
                          onClick={() => handleRemoveSavedJob(job.id)}
                          title="Remove from Saved"
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
                  <button onClick={() => navigate('/browse')} className="browse-button">
                    Browse Jobs
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'applied-jobs' && (
            <div className="saved-jobs-section">
              <h2 className="section-title">Your Applied Jobs</h2>
              {appliedJobs.length > 0 ? (
                <div className="saved-jobs-container">
                  {appliedJobs.map(job => (
                    <div key={job.id} className="saved-job-card">
                      <div className={`job-logo ${job.company?.toLowerCase()}`}>
                        {job.company?.[0]?.toUpperCase()}
                      </div>
                      <div className="job-info">
                        <span className="job-company">{job.company}</span>
                        <h3 className="job-title">{job.title}</h3>
                        <span className="job-location">{job.location}</span>
                        <div className="job-tags">
                          <span className="job-tag salary-tag">{job.salary}</span>
                          <span className="job-tag type-tag">{job.type}</span>
                          <span className="job-tag positions-tag">{job.positions} positions</span>
                        </div>
                      </div>
                      <div className="job-actions">
                        <button
                          className="action-button"
                          onClick={() => handleViewJobDetails(job)}
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="action-button remove-button"
                          onClick={() => handleRemoveAppliedJob(job.id)}
                          title="Remove from Applied"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <h3>No job applications yet</h3>
                  <p>Browse available jobs and apply to start building your application history.</p>
                  <button onClick={() => navigate('/jobs')} className="browse-button">
                    Browse Jobs
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: '#111827', fontSize: '1.5rem', fontWeight: 600 }}>Update Profile</h2>
                <button 
                  onClick={handleCloseModal}
                  style={{ 
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    color: '#6B7280',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleUpdateProfile}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullname"
                    value={editForm.fullname}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={editForm.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>
                {user?.role === 'recruiter' && (
                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      name="bio"
                      value={editForm.bio}
                      onChange={handleInputChange}
                      placeholder="Enter a short bio"
                      rows={3}
                    />
                  </div>
                )}
                <div className="form-group">
                  <label>Skills (comma-separated)</label>
                  <input
                    type="text"
                    name="skills"
                    value={editForm.skills}
                    onChange={handleInputChange}
                    placeholder="e.g., JavaScript, React, Node.js"
                  />
                </div>
                <div className="form-group">
                  <label>Profile Photo</label>
                  <input
                    type="file"
                    name="profilePhoto"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,image/gif,image/webp"
                  />
                </div>
                <div className="form-group">
                  <label>Resume</label>
                  <input
                    type="file"
                    name="resume"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={handleCloseModal} className="cancel-button">
                    Cancel
                  </button>
                  <button type="submit" className="update-button">
                    Update Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
      </div>
    );
  }
};

export default Profile; 