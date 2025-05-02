import React from 'react';
import Navbar from '../components/auth/Navbar';

const Browse = () => {
  // Sample job data - this will be replaced with real data later
  const jobs = [
    {
      id: 1,
      company: 'Google',
      location: 'India',
      position: 'FullStack Developer',
      description: 'I need senior Fullstack developer, who can able to write the efficient code. and deal with frontend and backend both',
      postedDate: 'Today',
      positions: 2,
      type: 'Full Time',
      salary: '45LPA'
    },
    {
      id: 2,
      company: 'Microsoft India',
      location: 'India',
      position: 'Fullstack Developer',
      description: 'I need senior Fullstack developer, who can able to write the efficient code. and deal with frontend and backend both',
      postedDate: '1 days ago',
      positions: 2,
      type: 'Full Time',
      salary: '23LPA'
    }
  ];

  return (
    <div className="browse-page">
      <style>
        {`
          .browse-page {
            min-height: 100vh;
            background: #f5f5f5;
          }

          .browse-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
          }

          .page-title {
            font-size: 24px;
            font-weight: 600;
            color: #333;
            margin-bottom: 24px;
          }

          .jobs-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 24px;
          }

          .job-card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s;
          }

          .job-card:hover {
            transform: translateY(-4px);
          }

          .company-info {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
          }

          .company-logo {
            width: 48px;
            height: 48px;
            border-radius: 8px;
            background: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            color: #666;
          }

          .company-details {
            flex: 1;
          }

          .company-name {
            font-weight: 600;
            color: #333;
            margin-bottom: 4px;
          }

          .company-location {
            font-size: 14px;
            color: #666;
          }

          .job-position {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin-bottom: 12px;
          }

          .job-description {
            color: #666;
            margin-bottom: 16px;
            font-size: 14px;
            line-height: 1.5;
          }

          .job-meta {
            display: flex;
            gap: 16px;
            margin-bottom: 20px;
          }

          .meta-item {
            font-size: 14px;
            color: #666;
          }

          .card-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .save-button {
            padding: 8px 16px;
            background: #7b2cbf;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s;
          }

          .save-button:hover {
            background: #6a24a6;
          }

          .posted-date {
            font-size: 14px;
            color: #666;
          }

          .bookmark-icon {
            padding: 8px;
            background: transparent;
            border: none;
            cursor: pointer;
            color: #666;
          }
        `}
      </style>

      <Navbar />
      
      <div className="browse-content">
        <h1 className="page-title">Browse All Jobs</h1>
        
        <div className="jobs-grid">
          {jobs.map(job => (
            <div key={job.id} className="job-card">
              <div className="company-info">
                <div className="company-logo">
                  {job.company.charAt(0)}
                </div>
                <div className="company-details">
                  <div className="company-name">{job.company}</div>
                  <div className="company-location">{job.location}</div>
                </div>
              </div>

              <h2 className="job-position">{job.position}</h2>
              <p className="job-description">{job.description}</p>

              <div className="job-meta">
                <span className="meta-item">{job.positions} positons</span>
                <span className="meta-item">{job.type}</span>
                <span className="meta-item">{job.salary}</span>
              </div>

              <div className="card-actions">
                <button className="save-button">Save For Later</button>
                <span className="posted-date">{job.postedDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Browse; 