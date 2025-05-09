import React from 'react';
import Navbar from '../components/auth/Navbar';
import { Link, useNavigate } from 'react-router-dom';

const Browse = () => {
  const navigate = useNavigate();
  
  // Sample job data with improved descriptions
  const jobs = [
    {
      id: 1,
      company: 'Google',
      logo: 'G',
      location: 'India',
      position: 'FullStack Developer',
      description: "I need senior Fullstack developer, who can able to write the efficient code, and deal with frontend and backend both",
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
      position: 'Fullstack Developer',
      description: "I need senior Fullstack developer, who can able to write the efficient code, and deal with frontend and backend both",
      postedDate: 'Today',
      positions: 2,
      type: 'Full Time',
      salary: '23LPA'
    },
    {
      id: 3,
      company: 'HireX',
      logo: 'H',
      location: 'India',
      position: 'Fullstack Developer',
      description: "I need senior Fullstack developer, who can able to write the efficient code, and deal with frontend and backend both",
      postedDate: 'Today',
      positions: 4,
      type: 'Full Time',
      salary: '34LPA'
    },
    {
      id: 4,
      company: 'HireX',
      logo: 'H',
      location: 'India',
      position: 'Backend Developer',
      description: "I need backend developer who can make professional ui web pages.",
      postedDate: '1 days ago',
      positions: 2,
      type: 'Full Time',
      salary: '12LPA'
    },
    {
      id: 5,
      company: 'HireX',
      logo: 'H',
      location: 'India',
      position: 'Frontend Developer',
      description: "I need Frontend developer who can make professional ui web pages.",
      postedDate: '1 days ago',
      positions: 2,
      type: 'Full Time',
      salary: '14LPA'
    }
  ];

  const viewJobDetails = (e, job) => {
    e.stopPropagation();
    
    // Save the job details to localStorage to access from the job details page
    localStorage.setItem('selectedJobDetails', JSON.stringify(job));
    
    // Navigate to job details page
    navigate(`/job-details/${job.id}`);
  };

  const handleSaveJob = (e, job) => {
    e.stopPropagation();
    
    // Get existing saved jobs from localStorage
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    
    // Check if the job is already saved
    const isJobAlreadySaved = savedJobs.some(savedJob => savedJob.id === job.id);
    
    if (isJobAlreadySaved) {
      alert(`This job is already in your saved list.`);
      return;
    }
    
    // Add the job to saved jobs
    savedJobs.push(job);
    
    // Save back to localStorage
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
    
    // Show success message
    alert(`Job saved: ${job.position} at ${job.company}`);
  };

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

          .browse-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 24px;
          }

          .search-results-header {
            font-size: 2rem;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .search-count {
            color: #6e46ba;
            font-weight: 600;
            background-color: #f3f0ff;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 1rem;
          }

          .jobs-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 24px;
          }

          .job-card {
            background: white;
            border-radius: 16px;
            padding: 28px;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
            position: relative;
            text-decoration: none;
            color: inherit;
            display: block;
            transition: all 0.3s ease;
            border: 1px solid #f1f5f9;
            margin-bottom: 24px;
            min-height: 450px;
            overflow: hidden;
            cursor: pointer;
          }

          .job-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 5px;
            height: 100%;
            background: #8B5CF6;
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .job-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 16px 30px rgba(0, 0, 0, 0.1);
            border-color: #e2e8f0;
          }

          .job-card:hover::before {
            opacity: 1;
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
            gap: 10px;
            margin-bottom: 84px;
          }

          .meta-tag{
            color: #ffffff;
          }
          .meta-row {
            display: flex;
            gap: 24px;
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
            box-shadow: none;
            border: none;
            text-shadow: none;
            letter-spacing: normal;
          }

          .time-tag::before {
            content: '';
            margin-right: 0;
            display: none;
          }

          .salary-tag {
            background: #e0f2fe;
            color: #0369a1;
            order: 3;
          }

          .salary-tag::before {
            content: '💰';
            margin-right: 6px;
          }

          .action-buttons {
            display: flex;
            gap: 16px;
            position: absolute;
            bottom: 28px;
            left: 28px;
            right: 28px;
          }

          .action-button {
            padding: 12px 20px;
            border-radius: 10px;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            outline: none;
            flex: 1;
            text-align: center;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }

          .details-button {
            background: #e2e8f0;
            color: #0f172a;
            border: 1px solid #cbd5e1;
          }

          .details-button:hover {
            background: #cbd5e1;
            border-color: #94a3b8;
            color: #0f172a;
            transform: translateY(-2px);
          }

          .save-button {
            background: #8B5CF6;
            color: white;
            border: 1px solid #8B5CF6;
          }

          .save-button:hover {
            background: #7C3AED;
            border-color: #7C3AED;
            box-shadow: 0 4px 12px rgba(110, 70, 186, 0.3);
            transform: translateY(-2px);
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
              font-size: 0.8rem;
            }
            
            .browse-content {
              padding: 24px 16px;
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
                <button className="action-button details-button" onClick={(e) => viewJobDetails(e, job)}>
                  Details
                </button>
                <button className="action-button save-button" onClick={(e) => handleSaveJob(e, job)}>
                  Save For Later
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="older-jobs">
          <span className="days-ago">1 day ago</span>
          <div className="jobs-grid">
            {jobs.slice(3).map(job => (
              <div key={job.id} className="job-card" onClick={() => viewJobDetails(null, job)}>
                <div className="job-date">1 day ago</div>
                
                <div className="company-header">
                  <div className={`company-logo ${job.company.toLowerCase().replace(' ', '-')}-logo`}>
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="24" cy="24" r="20" stroke="#8B5CF6" strokeWidth="2" fill="white"/>
                      <text x="24" y="29" fontSize="16" fontWeight="bold" fill="#8B5CF6" textAnchor="middle">{job.company[0]}</text>
                    </svg>
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
                    <span className="meta-tag positions-tag">{job.positions} Positions</span>
                    <span className="meta-tag time-tag">{job.type}</span>
                  </div>
                  <span className="meta-tag salary-tag">{job.salary}</span>
                </div>
                
                <div className="action-buttons">
                  <button className="action-button details-button" onClick={(e) => viewJobDetails(e, job)}>
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
      </div>
    </div>
  );
};

export default Browse; 