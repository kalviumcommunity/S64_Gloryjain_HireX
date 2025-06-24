import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/auth/Navbar';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';
import ConfirmApplyModal from '../components/ConfirmApplyModal';

const StudentJobs = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyTarget, setApplyTarget] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  useEffect(() => {
    try {
      // Get user data from localStorage
      const userFromStorage = localStorage.getItem('user');
      if (userFromStorage) {
        const parsedUser = JSON.parse(userFromStorage);
        setUser(parsedUser);
        
        // If user is not a student, redirect to home
        if (parsedUser.role !== 'student') {
          navigate('/home');
          return;
        }
      } else {
        // If no user is logged in, redirect to login
        navigate('/login');
        return;
      }

      // Fetch jobs from localStorage
      const storedJobs = localStorage.getItem('jobs');
      if (storedJobs) {
        const parsedJobs = JSON.parse(storedJobs);
        // Filter out incomplete jobs and format the valid ones
        const validJobs = parsedJobs.filter(job => job.companyName && job.title);
        
        // Transform the jobs data to match the required format
        const formattedJobs = validJobs.map(job => ({
          id: job.id || Math.random().toString(36).substr(2, 9),
          company: job.companyName || 'Company Name Not Available',
          logo: (job.companyName || 'C')[0],
          location: job.location || 'Location Not Available',
          position: job.title || 'Position Not Available',
          description: job.description || 'No description available',
          postedDate: job.date || 'Date not available',
          positions: job.positions || 1,
          type: job.jobType || 'Not specified',
          salary: job.salary || 'Not specified',
          requirements: job.requirements || [],
          experience: job.experience || "Not specified"
        }));
        setJobs(formattedJobs);
      } else {
        setJobs([]);
      }
    } catch (err) {
      console.error('Error loading jobs:', err);
      setError('Failed to load jobs. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleDetailsClick = (job) => {
    if (!job || !job.id) {
      console.error('Invalid job data:', job);
      return;
    }

    try {
      // Set the selected job and show modal
      setSelectedJob({
        ...job,
        requirements: Array.isArray(job.requirements) ? job.requirements : [job.requirements],
        experience: job.experience || 'Not specified',
        description: job.description || 'No description available',
        location: job.location || 'Location not specified',
        company: job.company || 'Company not specified',
        position: job.position || 'Position not specified',
        salary: job.salary || 'Salary not specified',
        type: job.type || 'Type not specified',
        positions: job.positions || 1,
        postedDate: job.postedDate || 'Date not specified'
      });
      setShowModal(true);
    } catch (err) {
      console.error('Error showing job details:', err);
      alert('Failed to show job details. Please try again.');
    }
  };

  const handleSaveClick = (e, job) => {
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
      addNotification(`Job saved: ${job.position} at ${job.company}`, 'success');
    } catch (err) {
      console.error('Error saving job:', err);
      addNotification('Failed to save job. Please try again.', 'error');
    }
  };

  const handleLocationChange = (location) => {
    setSelectedLocation(location === selectedLocation ? null : location);
  };

  const handleIndustryChange = (industry) => {
    setSelectedIndustry(industry === selectedIndustry ? null : industry);
  };

  const handleSalaryChange = (salary) => {
    setSelectedSalary(salary === selectedSalary ? null : salary);
  };

  const handleApplyClick = (job) => {
    setApplyTarget(job);
    setShowApplyModal(true);
  };

  const handleConfirmApply = () => {
    setShowApplyModal(false);
    if (applyTarget) {
      // Add to applied jobs in localStorage
      const applications = JSON.parse(localStorage.getItem('applications') || '[]');
      const isAlreadyApplied = applications.some(app => app.id === applyTarget.id);

      if (!isAlreadyApplied) {
        applications.push({ ...applyTarget, studentId: user?.id, studentEmail: user?.email, appliedDate: new Date().toISOString() });
        localStorage.setItem('applications', JSON.stringify(applications));
        addNotification(`Application for ${applyTarget.position} submitted!`, 'success');
      } else {
        addNotification('You have already applied for this job.', 'info');
      }
      
      // Redirect to Google Form
      setTimeout(() => {
        window.open('https://docs.google.com/forms/d/e/1FAIpQLScC2ScWfKYxHV45HOsqYsOQu5fIRAlYz7sb2jRPG7Ju12ovJA/viewform?usp=header', '_blank');
      }, 200);
    }
    setApplyTarget(null);
  };

  const handleCloseApplyModal = () => {
    setShowApplyModal(false);
    setApplyTarget(null);
  };

  const parseSalary = (salaryString) => {
    if (!salaryString || typeof salaryString !== 'string') return 0;
    
    const s = salaryString.toLowerCase().replace(/,/g, '');
    let numbers = s.match(/\d+(\.\d+)?/g);

    if (!numbers) return 0;

    numbers = numbers.map(n => parseFloat(n));

    let multiplier = 1;
    if (s.includes('lakh') || s.includes('lpa')) {
      multiplier = 100000;
    } else if (s.includes('k')) {
      multiplier = 1000;
    }

    const finalNumbers = numbers.map(n => n * multiplier);

    if (finalNumbers.length > 1) {
      // It's a range, so return the average
      return (finalNumbers[0] + finalNumbers[1]) / 2;
    } else if (finalNumbers.length === 1) {
      // It's a single number
      return finalNumbers[0];
    }
    
    return 0;
  }

  // Filter jobs based on selected criteria
  const filteredJobs = jobs.filter(job => {
    // Search term filter
    const passesSearch = searchTerm ? 
      (job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
       job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
       job.description.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;

    // Location filter
    const passesLocation = selectedLocation ? 
      (job.location && job.location.toLowerCase().includes(selectedLocation.toLowerCase()))
      : true;

    // Industry filter
    const passesIndustry = selectedIndustry ?
      ((job.position && job.position.toLowerCase().includes(selectedIndustry.toLowerCase())) ||
       (job.type && job.type.toLowerCase().includes(selectedIndustry.toLowerCase())))
      : true;

    // Salary filter
    const passesSalary = selectedSalary ? (() => {
      const jobSalary = parseSalary(job.salary);
      if (jobSalary === 0) return false; // Don't match jobs with unparseable salaries unless no filter is set

      if (selectedSalary === '0 - 40k') return jobSalary <= 40000;
      if (selectedSalary === '40k - 1Lakh') return jobSalary > 40000 && jobSalary <= 100000;
      if (selectedSalary === '1Lakh - 5Lakh') return jobSalary > 100000 && jobSalary <= 500000;
      if (selectedSalary === '5 Lakh+') return jobSalary > 500000;
      return true;
    })() : true;
    
    return passesSearch && passesLocation && passesIndustry && passesSalary;
  });

  if (isLoading) {
    return (
      <div className="student-jobs-page">
        <Navbar />
        <div className="navbar-spacer"></div>
        <div className="loading">Loading jobs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-jobs-page">
        <Navbar />
        <div className="navbar-spacer"></div>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="student-jobs-page">
      <Navbar />
      <div className="navbar-spacer"></div>
      
      {/* Job Details Modal */}
      {showModal && selectedJob && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            
            <div className="modal-header">
              <div className="modal-company-logo">
                {selectedJob.logo}
              </div>
              <div className="modal-company-info">
                <h2>{selectedJob.company}</h2>
                <p>{selectedJob.location}</p>
              </div>
            </div>

            <div className="modal-body">
              <h1 className="modal-job-title">{selectedJob.position}</h1>
              
              <div className="modal-tags">
                <span className="tag positions">{selectedJob.positions} Positions</span>
                <span className="tag type">{selectedJob.type}</span>
                <span className="tag salary">{selectedJob.salary}</span>
              </div>

              <div className="modal-section">
                <h3>Job Description</h3>
                <p>{selectedJob.description}</p>
              </div>

              <div className="modal-section">
                <h3>Requirements</h3>
                <ul>
                  {selectedJob.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="modal-section">
                <h3>Experience</h3>
                <p>{selectedJob.experience}</p>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="modal-apply-button"
                onClick={() => handleApplyClick(selectedJob)}
              >
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
        job={applyTarget}
        message="Are you sure you want to apply?"
      />

      <div className="jobs-container">
        <div className="filters-section">
          <div style={{ marginBottom: '24px' }}>
            <input 
              type="text"
              placeholder="Filter by company, role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #E5E7EB',
                fontSize: '14px'
              }}
            />
          </div>

          <h2 className="filter-section-title">Filter Jobs</h2>
          
          <div className="filter-group">
            <h3 className="filter-group-title">Location</h3>
            <div className="filter-option" onClick={() => handleLocationChange('Delhi')}>
              <input 
                type="radio" 
                id="delhi" 
                name="location" 
                className="filter-checkbox"
                checked={selectedLocation === 'Delhi'}
                readOnly
              />
              <label htmlFor="delhi" className="filter-option-label">Delhi</label>
            </div>
            <div className="filter-option" onClick={() => handleLocationChange('Bangalore')}>
              <input 
                type="radio" 
                id="bangalore" 
                name="location" 
                className="filter-checkbox"
                checked={selectedLocation === 'Bangalore'}
                readOnly
              />
              <label htmlFor="bangalore" className="filter-option-label">Bangalore</label>
            </div>
            <div className="filter-option" onClick={() => handleLocationChange('Hyderabad')}>
              <input 
                type="radio" 
                id="hyderabad" 
                name="location" 
                className="filter-checkbox"
                checked={selectedLocation === 'Hyderabad'}
                readOnly
              />
              <label htmlFor="hyderabad" className="filter-option-label">Hyderabad</label>
            </div>
            <div className="filter-option" onClick={() => handleLocationChange('Pune')}>
              <input 
                type="radio" 
                id="pune" 
                name="location" 
                className="filter-checkbox"
                checked={selectedLocation === 'Pune'}
                readOnly
              />
              <label htmlFor="pune" className="filter-option-label">Pune</label>
            </div>
            <div className="filter-option" onClick={() => handleLocationChange('Chennai')}>
              <input 
                type="radio" 
                id="chennai" 
                name="location" 
                className="filter-checkbox"
                checked={selectedLocation === 'Chennai'}
                readOnly
              />
              <label htmlFor="chennai" className="filter-option-label">Chennai</label>
            </div>
            <div className="filter-option" onClick={() => handleLocationChange('Mumbai')}>
              <input 
                type="radio" 
                id="mumbai" 
                name="location" 
                className="filter-checkbox"
                checked={selectedLocation === 'Mumbai'}
                readOnly
              />
              <label htmlFor="mumbai" className="filter-option-label">Mumbai</label>
            </div>
          </div>
          
          <div className="filter-group">
            <h3 className="filter-group-title">Industry</h3>
            <div className="filter-option" onClick={() => handleIndustryChange('Frontend Developer')}>
              <input 
                type="radio" 
                id="frontend" 
                name="industry" 
                className="filter-checkbox"
                checked={selectedIndustry === 'Frontend Developer'}
                readOnly
              />
              <label htmlFor="frontend" className="filter-option-label">Frontend Developer</label>
            </div>
            <div className="filter-option" onClick={() => handleIndustryChange('Backend Developer')}>
              <input 
                type="radio" 
                id="backend" 
                name="industry" 
                className="filter-checkbox"
                checked={selectedIndustry === 'Backend Developer'}
                readOnly
              />
              <label htmlFor="backend" className="filter-option-label">Backend Developer</label>
            </div>
            <div className="filter-option" onClick={() => handleIndustryChange('Data Science')}>
              <input 
                type="radio" 
                id="data-science" 
                name="industry" 
                className="filter-checkbox"
                checked={selectedIndustry === 'Data Science'}
                readOnly
              />
              <label htmlFor="data-science" className="filter-option-label">Data Science</label>
            </div>
            <div className="filter-option" onClick={() => handleIndustryChange('FullStack Developer')}>
              <input 
                type="radio" 
                id="fullstack" 
                name="industry" 
                className="filter-checkbox"
                checked={selectedIndustry === 'FullStack Developer'}
                readOnly
              />
              <label htmlFor="fullstack" className="filter-option-label">FullStack Developer</label>
            </div>
            <div className="filter-option" onClick={() => handleIndustryChange('Nextjs Developer')}>
              <input 
                type="radio" 
                id="nextjs" 
                name="industry" 
                className="filter-checkbox"
                checked={selectedIndustry === 'Nextjs Developer'}
                readOnly
              />
              <label htmlFor="nextjs" className="filter-option-label">Nextjs Developer</label>
            </div>
          </div>
          
          <div className="filter-group">
            <h3 className="filter-group-title">Salary</h3>
            <div className="filter-option" onClick={() => handleSalaryChange('0 - 40k')}>
              <input 
                type="radio" 
                id="0-40k" 
                name="salary" 
                className="filter-checkbox"
                checked={selectedSalary === '0 - 40k'}
                readOnly
              />
              <label htmlFor="0-40k" className="filter-option-label">0 - 40k</label>
            </div>
            <div className="filter-option" onClick={() => handleSalaryChange('40k - 1Lakh')}>
              <input 
                type="radio" 
                id="40k-1lakh" 
                name="salary" 
                className="filter-checkbox"
                checked={selectedSalary === '40k - 1Lakh'}
                readOnly
              />
              <label htmlFor="40k-1lakh" className="filter-option-label">40k to 1lakh</label>
            </div>
            <div className="filter-option" onClick={() => handleSalaryChange('1Lakh - 5Lakh')}>
              <input 
                type="radio" 
                id="1lakh-5lakh" 
                name="salary" 
                className="filter-checkbox"
                checked={selectedSalary === '1Lakh - 5Lakh'}
                readOnly
              />
              <label htmlFor="1lakh-5lakh" className="filter-option-label">1lakh to 5lakh</label>
            </div>
            <div className="filter-option" onClick={() => handleSalaryChange('5 Lakh+')}>
              <input
                type="radio"
                id="5lakh-plus"
                name="salary"
                className="filter-checkbox"
                checked={selectedSalary === '5 Lakh+'}
                readOnly
              />
              <label htmlFor="5lakh-plus" className="filter-option-label">5 Lakh+</label>
            </div>
          </div>
        </div>
        
        <div className="jobs-listing">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <div className="job-card" key={job.id}>
                <div className={`job-card-logo ${job.company.toLowerCase()}`}>
                  {job.logo}
                </div>
                
                <div className="job-card-content">
                  <div className="job-date">{job.postedDate}</div>
                  
                  <div className="job-card-header">
                    <div className="job-card-company">{job.company}</div>
                    <div className="job-card-location">{job.location}</div>
                  </div>
                  
                  <h3 className="job-card-title">{job.position}</h3>
                  <p className="job-card-description">{job.description}</p>
                  
                  <div className="tag-container">
                    <span className="tag positions">{job.positions} Positions</span>
                    <span className="tag type">{job.type}</span>
                    <span className="tag salary">{job.salary}</span>
                  </div>
                </div>
                
                <div className="job-card-actions">
                  <button
                    className="details-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDetailsClick(job);
                    }}
                  >
                    Details
                  </button>
                  <button
                    className="save-button"
                    onClick={(e) => handleSaveClick(e, job)}
                  >
                    Save For Later
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <img 
                src="https://i.imgur.com/qsT4Jk2.png" 
                alt="No jobs found" 
                className="empty-state-image" 
              />
              <h3 className="empty-state-title">No jobs match your filter criteria</h3>
              <p className="empty-state-text">Try adjusting your filters or browse all available jobs</p>
              <button 
                className="clear-filters-button" 
                onClick={() => {
                  setSelectedLocation(null);
                  setSelectedIndustry(null);
                  setSelectedSalary(null);
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <style>
        {`
          .student-jobs-page {
            min-height: 100vh;
            background-color: #f8f9fa;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          }

          .navbar-spacer {
            height: 70px;
          }

          .loading, .error-message {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: calc(100vh - 70px);
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

          .jobs-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 24px;
          }

          /* Filters Section */
          .filters-section {
            background-color: white;
            border-radius: 10px;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            height: fit-content;
          }

          .filter-section-title {
            font-size: 20px;
            font-weight: 700;
            color: #333;
            margin-bottom: 20px;
          }

          .filter-group {
            margin-bottom: 30px;
          }

          .filter-group-title {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin-bottom: 16px;
          }

          .filter-option {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
          }

          .filter-checkbox {
            width: 18px;
            height: 18px;
            margin-right: 12px;
            accent-color: #8B5CF6;
          }

          .filter-option-label {
            color: #4B5563;
            font-size: 16px;
            cursor: pointer;
          }

          /* Jobs Listing Section */
          .jobs-listing {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .job-card {
            background-color: white;
            border-radius: 10px;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            display: grid;
            grid-template-columns: 80px 1fr 180px;
            gap: 20px;
            transition: transform 0.2s, box-shadow 0.2s;
          }

          .job-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .job-card-logo {
            background-color: #f4f4f5;
            width: 60px;
            height: 60px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            color: #6366f1;
          }

          .job-card-logo.google {
            color: #1a73e8;
          }

          .job-card-logo.microsoft {
            color: #107c10;
          }

          .job-card-logo.amazon {
            color: #ff9900;
          }

          .job-card-content {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          .job-card-header {
            margin-bottom: 5px;
          }

          .job-card-company {
            font-size: 16px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
          }

          .job-card-location {
            font-size: 14px;
            color: #6B7280;
            margin-bottom: 12px;
          }

          .job-card-title {
            font-size: 20px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 12px;
          }

          .job-card-description {
            font-size: 15px;
            color: #4B5563;
            line-height: 1.6;
            margin-bottom: 16px;
          }

          .job-meta-container {
            margin-top: 16px;
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
          }

          .job-meta {
            display: flex;
            flex-direction: column;
          }

          .job-meta-label {
            font-size: 13px;
            color: #6B7280;
            margin-bottom: 4px;
          }

          .job-meta-value {
            font-size: 14px;
            font-weight: 600;
            color: #374151;
          }

          .job-card-actions {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 10px;
          }

          .job-card-actions .details-button, .job-card-actions .save-button {
            padding: 12px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            border: 1px solid transparent;
            text-align: center;
            transition: background-color 0.2s, transform 0.1s;
          }

          .job-card-actions .details-button {
            background-color: white;
            color: #8B5CF6;
            border-color: #8B5CF6;
          }

          .job-card-actions .save-button {
            background-color: #8B5CF6;
            color: white;
          }

          .tag-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 24px;
          }

          .tag {
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 13px;
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

          .job-date {
            font-size: 14px;
            color: #6B7280;
            text-align: right;
            margin-top: -10px;
          }

          .action-button {
            padding: 10px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            text-align: center;
            transition: background-color 0.2s, transform 0.1s;
          }

          .details-button:hover {
            background-color: #F9FAFB;
          }

          .save-button:hover {
            background-color: #7C3AED;
          }

          /* Empty state */
          .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            text-align: center;
          }

          .empty-state-image {
            width: 100%;
            max-width: 600px;
            margin-bottom: 20px;
          }

          .empty-state-title {
            font-size: 24px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 12px;
          }

          .empty-state-text {
            font-size: 16px;
            color: #6B7280;
            max-width: 500px;
            margin-bottom: 24px;
          }

          .clear-filters-button {
            padding: 10px 20px;
            background-color: #8B5CF6;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s;
          }

          .clear-filters-button:hover {
            background-color: #7C3AED;
          }

          /* Media Queries */
          @media (max-width: 1024px) {
            .jobs-container {
              grid-template-columns: 250px 1fr;
            }
          }

          @media (max-width: 768px) {
            .jobs-container {
              grid-template-columns: 1fr;
            }

            .job-card {
              grid-template-columns: 60px 1fr;
            }

            .job-card-actions {
              grid-column: 1 / span 2;
              flex-direction: row;
            }

            .action-button {
              flex: 1;
            }
          }

          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }

          .modal-content {
            background: white;
            border-radius: 12px;
            padding: 24px;
            width: 90%;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
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
            padding: 4px;
            line-height: 1;
          }

          .modal-close:hover {
            color: #374151;
          }

          .modal-header {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 24px;
          }

          .modal-company-logo {
            width: 64px;
            height: 64px;
            background-color: #f4f4f5;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            color: #6366f1;
          }

          .modal-company-info h2 {
            font-size: 20px;
            font-weight: 600;
            color: #111827;
            margin: 0;
          }

          .modal-company-info p {
            font-size: 16px;
            color: #6B7280;
            margin: 4px 0 0;
          }

          .modal-body {
            margin-bottom: 24px;
          }

          .modal-job-title {
            font-size: 24px;
            font-weight: 700;
            color: #111827;
            margin: 0 0 16px;
          }

          .modal-tags {
            display: flex;
            gap: 8px;
            margin-bottom: 24px;
          }

          .modal-section {
            margin-bottom: 24px;
          }

          .modal-section h3 {
            font-size: 18px;
            font-weight: 600;
            color: #111827;
            margin: 0 0 12px;
          }

          .modal-section p {
            font-size: 16px;
            color: #4B5563;
            line-height: 1.6;
            margin: 0;
          }

          .modal-section ul {
            margin: 0;
            padding-left: 20px;
          }

          .modal-section li {
            font-size: 16px;
            color: #4B5563;
            line-height: 1.6;
            margin-bottom: 8px;
          }

          .modal-footer {
            display: flex;
            justify-content: flex-end;
            padding-top: 16px;
            border-top: 1px solid #E5E7EB;
          }

          .modal-apply-button {
            background-color: #8B5CF6;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .modal-apply-button:hover {
            background-color: #7C3AED;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
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
    </div>
  );
};

export default StudentJobs; 