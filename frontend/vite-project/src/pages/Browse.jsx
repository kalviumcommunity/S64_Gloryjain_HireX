import React, { useState, useEffect } from 'react';
import Navbar from '../components/auth/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { FaTimes, FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';
import ConfirmApplyModal from '../components/ConfirmApplyModal';

const Browse = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyTarget, setApplyTarget] = useState(null);

  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  // Fetch jobs and companies from localStorage when component mounts
  useEffect(() => {
    try {
      const storedJobs = localStorage.getItem('jobs');
      const userFromStorage = localStorage.getItem('user');
      let userId = null;
      if (userFromStorage) {
        userId = JSON.parse(userFromStorage)?.id;
      }
      if (storedJobs) {
        const parsedJobs = JSON.parse(storedJobs);
        // Filter out incomplete jobs and format the valid ones
        const userJobs = parsedJobs.filter(job => job.companyName && job.title);

        // Transform the jobs data to match the required format
        const formattedJobs = userJobs.map(job => ({
          id: job.id || Math.random().toString(36).substr(2, 9),
          company: job.companyName || 'Company Name Not Available',
          logo: (job.companyName || 'C')[0],
          location: job.location || 'Location Not Available',
          position: job.title || 'Position Not Available',
          description: job.description || 'No description available',
          postedDate: job.date || 'Date not available',
          positions: job.numberOfPositions || job.positions || 1,
          type: job.jobType || 'Not specified',
          salary: job.salary || 'Not specified',
          requirements: job.requirements || [],
          experience: job.experienceLevel || job.experience || 'Not specified',
          companyId: job.companyId
        }));
        setJobs(formattedJobs);
      } else {
        setJobs([]);
      }
      // Fetch companies
      const storedCompanies = localStorage.getItem('companies');
      if (storedCompanies) {
        setCompanies(JSON.parse(storedCompanies));
      } else {
        setCompanies([]);
      }
    } catch (err) {
      console.error('Error loading jobs:', err);
      setError('Failed to load jobs. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const viewJobDetails = (e, job) => {
    if (e) {
      e.stopPropagation();
    }
    if (!job || !job.id) {
      console.error('Invalid job data:', job);
      return;
    }
    setSelectedJob(job);
    setShowJobModal(true);
  };

  const handleSaveJob = (e, job) => {
    if (e) {
      e.stopPropagation();
    }
    
    if (!job || !job.id) {
      console.error('Invalid job data:', job);
      return;
    }
    
    try {
      // Get existing saved jobs from localStorage
      const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      
      // Check if the job is already saved
      const isJobAlreadySaved = savedJobs.some(savedJob => savedJob.id === job.id);
      
      if (isJobAlreadySaved) {
        addNotification(`This job is already in your saved list.`, 'info');
        return;
      }
      
      // Add the job to saved jobs
      savedJobs.push(job);
      
      // Save back to localStorage
      localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
      
      // Show success message
      addNotification(`Job saved: ${job.position} at ${job.company}`);
    } catch (err) {
      console.error('Error saving job:', err);
      addNotification('Failed to save job. Please try again.', 'error');
    }
  };

  const handleCompanyDetailsClick = (company) => {
    setSelectedCompany(company);
    setShowCompanyModal(true);
  };

  const closeCompanyModal = () => {
    setShowCompanyModal(false);
    setSelectedCompany(null);
  };

  const handleCompanyApply = (company) => {
    setApplyTarget(company);
    setShowApplyModal(true);
  };

  const handleJobApply = (job) => {
    setApplyTarget(job);
    setShowApplyModal(true);
  };

  const handleConfirmApply = () => {
    if (applyTarget) {
      const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
      if (!appliedJobs.some(job => job.id === applyTarget.id)) {
        // Add user info to the job object before saving
        const userFromStorage = JSON.parse(localStorage.getItem('user'));
        const jobToSave = { 
          ...applyTarget, 
          appliedBy: userFromStorage?.id, // Add user ID
          appliedDate: new Date().toISOString() // Add application date
        };
        appliedJobs.push(jobToSave);
        localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));
        addNotification(`Application for ${applyTarget.position} submitted!`, 'success');
      } else {
        addNotification('You have already applied for this job.', 'info');
      }
      // Redirect to external form after a short delay
      setTimeout(() => {
        window.open('https://docs.google.com/forms/d/e/1FAIpQLScC2ScWfKYxHV45HOsqYsOQu5fIRAlYz7sb2jRPG7Ju12ovJA/viewform?usp=header', '_blank');
      }, 200);
    }
    setShowApplyModal(false);
    setApplyTarget(null);
  };

  const handleCloseApplyModal = () => {
    setShowApplyModal(false);
    setApplyTarget(null);
  };

  const closeJobModal = () => {
    setShowJobModal(false);
    setSelectedJob(null);
  };

  if (isLoading) {
    return (
      <div className="browse-page">
        <Navbar />
        <div className="navbar-spacer"></div>
        <div className="loading">Loading jobs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="browse-page">
        <Navbar />
        <div className="navbar-spacer"></div>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="browse-page">
      <Navbar />
      <div className="navbar-spacer"></div>
      <style>
        {`
          .browse-page {
            min-height: 100vh;
            background: #f8fafc;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }

          .navbar-spacer {
            height: 80px;
            width: 100%;
          }

          .loading, .error-message {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: calc(100vh - 80px);
            font-size: 1.2rem;
            color: #4B5563;
            text-align: center;
            padding: 20px;
          }

          .error-message {
            color: #DC2626;
            background-color: #FEE2E2;
            border-radius: 8px;
            margin: 20px;
            padding: 20px;
            max-width: 600px;
            margin: 20px auto;
          }

          .browse-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 24px;
          }

          .search-results-header {
            font-size: 2rem;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 32px;
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .search-count {
            color: #6e46ba;
            font-weight: 600;
            background-color: #f3f0ff;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 1rem;
          }

          .jobs-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 24px;
            margin-bottom: 48px;
          }

          .job-card {
            background: white;
            border-radius: 16px;
            padding: 28px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            position: relative;
            text-decoration: none;
            color: inherit;
            display: block;
            transition: all 0.3s ease;
            border: 1px solid #f1f5f9;
            min-height: 450px;
            overflow: hidden;
            cursor: pointer;
          }

          .job-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
            border-color: #e2e8f0;
          }

          .job-date {
            position: absolute;
            top: 24px;
            right: 24px;
            font-size: 0.8rem;
            font-weight: 500;
            color: #64748b;
            background-color: #f8fafc;
            padding: 4px 12px;
            border-radius: 12px;
          }

          .bookmark-btn {
            position: absolute;
            top: 24px;
            right: 24px;
            background: #f1f5f9;
            border: none;
            color: #64748b;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            transition: all 0.2s ease;
            font-size: 16px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            z-index: 2;
          }

          .bookmark-btn:hover {
            background: #e2e8f0;
            color: #6e46ba;
            transform: scale(1.05);
          }

          .company-header {
            display: flex;
            align-items: center;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid #f1f5f9;
            margin-top: 8px;
            padding-top: 8px;
          }

          .company-logo {
            width: 60px;
            height: 60px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 16px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
            background: white;
            padding: 6px;
            border: 1px solid #f1f5f9;
          }

          .google-logo, .microsoft-logo, .hirex-logo {
            background: transparent;
            overflow: hidden;
          }

          .company-info {
            display: flex;
            flex-direction: column;
          }

          .company-name {
            font-size: 1.1rem;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 4px;
            max-width: 180px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .company-location {
            font-size: 0.9rem;
            color: #64748b;
            display: flex;
            align-items: center;
          }

          .company-location::before {
            content: '📍';
            margin-right: 4px;
            font-size: 0.8rem;
          }

          .job-title {
            font-size: 1.3rem;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 16px;
            line-height: 1.4;
          }

          .job-description {
            font-size: 0.95rem;
            line-height: 1.6;
            color: #475569;
            margin-bottom: 24px;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .job-meta {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 84px;
          }

          .meta-tag{
            color: #ffffff;
          }
          .meta-row {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
          }

          .meta-tag {
            padding: 8px 16px;
            border-radius: 24px;
            font-size: 0.85rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            width: fit-content;
          }

          .positions-tag {
            color: #334155;
            background: #f1f5f9;
          }

          .positions-tag::before {
            content: '👥';
            margin-right: 6px;
          }

          .time-tag {
            background: #8B5CF6;
            color: #FFFFFF !important;
            padding: 6px 14px;
            font-weight: 600;
            font-size: 0.9rem;
            border-radius: 20px;
          }

          .time-tag::before {
            content: '';
            margin-right: 0;
            display: none;
          }

          .salary-tag {
            background: #e0f2fe;
            color: #0369a1;
          }

          .salary-tag::before {
            content: '💰';
            margin-right: 6px;
          }

          .action-buttons {
            display: flex;
            gap: 12px;
            position: absolute;
            bottom: 28px;
            left: 28px;
            right: 28px;
          }

          .action-button {
            padding: 12px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            outline: none;
            flex: 1;
            text-align: center;
          }

          .details-button {
            background: white;
            color: #8B5CF6;
            border: 1px solid #8B5CF6;
          }

          .details-button:hover {
            background: #f5f3ff;
          }

          .save-button {
            background: #8B5CF6;
            color: white;
            border: none;
          }

          .save-button:hover {
            background: #7C3AED;
          }

          /* For the one-day-ago jobs at the bottom */
          .older-jobs {
            margin-top: 50px;
            padding-top: 30px;
            border-top: 1px solid #e2e8f0;
          }

          .days-ago {
            display: inline-block;
            font-size: 0.9rem;
            color: #64748b;
            margin-bottom: 24px;
            padding: 8px 16px;
            background: #f8fafc;
            border-radius: 24px;
            font-weight: 500;
          }

          /* For small screens */
          @media (max-width: 768px) {
            .jobs-grid {
              grid-template-columns: 1fr;
            }
            
            .search-results-header {
              font-size: 1.5rem;
              flex-direction: column;
              align-items: flex-start;
              gap: 8px;
            }
            
            .search-count {
              font-size: 0.9rem;
            }
            
            .browse-content {
              padding: 24px 16px;
            }

            .action-buttons {
              bottom: 20px;
              left: 20px;
              right: 20px;
              gap: 8px;
            }

            .action-button {
              padding: 12px 16px;
              font-size: 0.85rem;
            }
          }

          .browse-user-companies-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 24px;
          }

          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }

          .modal-content {
            background: white;
            border-radius: 12px;
            padding: 32px;
            width: 90%;
            max-width: 600px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            position: relative;
            animation: slide-up 0.3s ease-out;
          }

          @keyframes slide-up {
            from {
              transform: translateY(20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          .modal-close {
            position: absolute;
            top: 16px;
            right: 16px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #6B7280;
          }

          .modal-header {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 24px;
          }

          .modal-company-logo {
            width: 48px;
            height: 48px;
            border-radius: 8px;
            background-color: #f3f4f6;
            color: #4b5563;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: 600;
          }

          .modal-company-name {
            font-size: 18px;
            font-weight: 600;
            color: #111827;
          }

          .modal-company-location {
            font-size: 14px;
            color: #6b7280;
          }

          .modal-job-title {
            font-size: 24px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 16px;
          }

          .modal-tags {
            display: flex;
            gap: 8px;
            margin-bottom: 24px;
          }

          .modal-tag {
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 12px;
            font-weight: 500;
            background-color: #e0e7ff;
            color: #4338ca;
          }
          
          .modal-tag.purple-tag {
            background-color: #e9d5ff;
            color: #86198f;
          }
          
          .modal-tag.lightblue-tag {
             background-color: #dbeafe;
             color: #2563eb;
          }
          
          .modal-section {
            margin-bottom: 20px;
          }

          .modal-section-title {
            font-size: 16px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
          }

          .modal-section p, .modal-section ul {
            font-size: 14px;
            color: #4b5563;
            line-height: 1.6;
          }
          
          .modal-section ul {
            padding-left: 20px;
            margin: 0;
          }

          .modal-footer {
            margin-top: 32px;
            display: flex;
            justify-content: flex-end;
          }
          
          .apply-now-button {
            padding: 12px 24px;
            border: none;
            background-color: #8B5CF6;
            color: white;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s;
          }

          .apply-now-button:hover {
            background-color: #7C3AED;
          }

          .company-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }

          .company-modal-container {
            background: white;
            border-radius: 12px;
            padding: 32px;
            width: 90%;
            max-width: 600px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            position: relative;
            animation: slide-up 0.3s ease-out;
          }

          @keyframes slide-up {
            from {
              transform: translateY(20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          .company-modal-close {
            position: absolute;
            top: 16px;
            right: 16px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #6B7280;
          }

          .company-modal-header {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 24px;
          }

          .company-modal-logo {
            width: 48px;
            height: 48px;
            border-radius: 8px;
            background-color: #f3f4f6;
            color: #4b5563;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: 600;
          }

          .company-modal-header-info {
            display: flex;
            flex-direction: column;
          }

          .company-modal-header-title {
            font-size: 18px;
            font-weight: 600;
            color: #111827;
          }

          .company-modal-header-location {
            font-size: 14px;
            color: #6b7280;
          }

          .company-modal-body {
            margin-top: 24px;
          }

          .company-modal-job-title {
            font-size: 24px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 16px;
          }

          .company-modal-tags {
            display: flex;
            gap: 8px;
            margin-bottom: 24px;
          }

          .company-modal-tag {
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 12px;
            font-weight: 500;
            background-color: #e0e7ff;
            color: #4338ca;
          }

          .company-modal-section {
            margin-bottom: 20px;
          }

          .company-modal-section-title {
            font-size: 16px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
          }

          .company-modal-section-content {
            font-size: 14px;
            color: #4b5563;
            line-height: 1.6;
          }

          .company-modal-footer {
            margin-top: 32px;
            display: flex;
            justify-content: flex-end;
          }

          .apply-now-btn {
            padding: 12px 24px;
            border: none;
            background-color: #8B5CF6;
            color: white;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s;
          }

          .apply-now-btn:hover {
            background-color: #7C3AED;
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
        `}
      </style>

      <div className="browse-content">
        <h1 className="search-results-header">
          Discover Opportunities <span className="search-count">{jobs.length} jobs available</span>
        </h1>

        <div className="jobs-grid">
          {jobs.slice(0, 3).map(job => (
            <div key={job.id} className="job-card" onClick={() => viewJobDetails(null, job)}>
              <div className="job-date">Today</div>
              
              <div className="company-header">
                <div className={`company-logo ${job.company.toLowerCase().replace(' ', '-')}-logo`}>
                  {job.company === 'Google' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px">
                      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                    </svg>
                  ) : job.company === 'Microsoft India' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px">
                      <path fill="#ff5722" d="M6 6H22V22H6z" transform="rotate(-180 14 14)"/>
                      <path fill="#4caf50" d="M26 6H42V22H26z" transform="rotate(-180 34 14)"/>
                      <path fill="#ffc107" d="M26 26H42V42H26z" transform="rotate(-180 34 34)"/>
                      <path fill="#03a9f4" d="M6 26H22V42H6z" transform="rotate(-180 14 34)"/>
                    </svg>
                  ) : (
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="24" cy="24" r="20" stroke="#8B5CF6" strokeWidth="2" fill="white"/>
                      <text x="24" y="29" fontSize="16" fontWeight="bold" fill="#8B5CF6" textAnchor="middle">{job.company[0]}</text>
                    </svg>
                  )}
                </div>
                <div className="company-info">
                  <div className="company-name">{job.company}</div>
                  <div className="company-location">{job.location}</div>
                </div>
              </div>
              
              <h2 className="job-title">{job.position}</h2>
              <p className="job-description">{job.description}</p>
              
              <div className="job-meta">
                <div className="meta-row">
                  <span className="meta-tag positions-tag ">{job.positions} Positions</span>
                  <span className="meta-tag time-tag">{job.type}</span>
                </div>
                <span className="meta-tag salary-tag">{job.salary}</span>
              </div>
              
              <div className="action-buttons">
                <button
                  className="action-button details-button"
                  onClick={e => {
                    e.stopPropagation();
                    const company = companies.find(c => c.id === job.companyId || c.id === Number(job.companyId));
                    if (company) {
                      handleCompanyDetailsClick(company);
                    } else {
                      viewJobDetails(e, job); // fallback to job details if company not found
                    }
                  }}
                >
                  Details
                </button>
                <button className="action-button save-button" onClick={(e) => handleSaveJob(e, job)}>
                  Save For Later
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {showJobModal && selectedJob && (
        <div className="modal-overlay" onClick={closeJobModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeJobModal}>&times;</button>
            <div className="modal-header">
              <div className="modal-company-logo">{selectedJob.company.charAt(0)}</div>
              <div>
                <div className="modal-company-name">{selectedJob.company}</div>
                <div className="modal-company-location">{selectedJob.location}</div>
              </div>
            </div>
            <div className="modal-job-title">{selectedJob.position}</div>
            <div className="modal-tags">
              <span className="modal-tag">{selectedJob.positions} Positions</span>
              <span className="modal-tag purple-tag">{selectedJob.type}</span>
              <span className="modal-tag lightblue-tag">{selectedJob.salary}</span>
            </div>
            <div className="modal-section">
              <div className="modal-section-title">Job Description</div>
              <p>{selectedJob.description}</p>
            </div>
            <div className="modal-section">
              <div className="modal-section-title">Requirements</div>
              <ul>
                {(Array.isArray(selectedJob.requirements) ? selectedJob.requirements : [selectedJob.requirements]).map((req, i) => <li key={i}>{req}</li>)}
              </ul>
            </div>
            <div className="modal-section">
              <div className="modal-section-title">Experience</div>
              <p>{selectedJob.experience}</p>
            </div>
            <div className="modal-footer">
              <button className="apply-now-button" onClick={() => handleJobApply(selectedJob)}>Apply Now</button>
            </div>
          </div>
        </div>
      )}

      {showCompanyModal && selectedCompany && (
        <div className="company-modal-overlay" onClick={closeCompanyModal}>
          <div className="company-modal-container" onClick={e => e.stopPropagation()}>
            <button className="company-modal-close" onClick={closeCompanyModal}>&times;</button>
            <div className="company-modal-header">
              <div className="company-modal-logo">
                {(() => {
                  if (selectedCompany.logo === 'google') {
                    return (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="56px" height="56px">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                      </svg>
                    );
                  } else if (selectedCompany.logo === 'microsoft') {
                    return (
                      <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 21 21">
                        <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                        <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                        <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                        <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                      </svg>
                    );
                  } else if (typeof selectedCompany.logo === 'string' && selectedCompany.logo.startsWith('http')) {
                    return <img src={selectedCompany.logo} alt={selectedCompany.name} style={{ width: 56, height: 56, borderRadius: '12px', background: '#f3f4f6' }} />;
                  } else {
                    return (
                      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="56" height="56" rx="12" fill="#f3f4f6"/>
                        <text x="28" y="36" fontSize="24" fontWeight="bold" fill="#8B5CF6" textAnchor="middle">{selectedCompany.name?.charAt(0)}</text>
                      </svg>
                    );
                  }
                })()}
              </div>
              <div className="company-modal-header-info">
                <div className="company-modal-header-title">{selectedCompany.name}</div>
                <div className="company-modal-header-location">{selectedCompany.location}</div>
              </div>
            </div>
            <div className="company-modal-body">
              <div className="company-modal-job-title">{selectedCompany.industry || 'Industry'}</div>
              <div className="company-modal-tags">
                <span className="company-modal-tag positions-tag">{selectedCompany.positions || 0} Positions</span>
                {selectedCompany.type && <span className="company-modal-tag type-tag">{selectedCompany.type}</span>}
                {selectedCompany.date && <span className="company-modal-tag date-tag">{selectedCompany.date}</span>}
              </div>
              <div className="company-modal-section">
                <div className="company-modal-section-title">Description</div>
                <div className="company-modal-section-content">{selectedCompany.description || 'No description available.'}</div>
              </div>
              {selectedCompany.requirements && selectedCompany.requirements.length > 0 && (
                <div className="company-modal-section">
                  <div className="company-modal-section-title">Requirements</div>
                  <ul className="company-modal-section-content">
                    {selectedCompany.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="company-modal-section">
                <div className="company-modal-section-title">Experience</div>
                <div className="company-modal-section-content">{selectedCompany.experience || 'Not specified'}</div>
              </div>
              <div className="company-modal-section company-modal-section-meta">
                {selectedCompany.website && <div><b>Website:</b> <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer">{selectedCompany.website}</a></div>}
                {selectedCompany.email && <div><b>Email:</b> {selectedCompany.email}</div>}
                {selectedCompany.address && <div><b>Address:</b> {selectedCompany.address}</div>}
                {selectedCompany.phone && <div><b>Phone:</b> {selectedCompany.phone}</div>}
              </div>
            </div>
            <div className="company-modal-footer">
              <button className="apply-now-btn" onClick={() => handleCompanyApply(selectedCompany)}>
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}

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

      <ConfirmApplyModal
        open={showApplyModal}
        onClose={handleCloseApplyModal}
        onConfirm={handleConfirmApply}
        message="Are you sure you want to apply?"
      />
    </div>
  );
};

export default Browse;