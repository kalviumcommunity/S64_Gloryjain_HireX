import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/auth/Navbar';

const StudentJobs = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [selectedSalary, setSelectedSalary] = useState(null);

  useEffect(() => {
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
  }, [navigate]);

  // Sample job data (in a real app, you'd fetch this from an API or localStorage)
  const jobs = [
    {
      id: 1,
      company: 'Google',
      logo: 'G',
      location: 'Bangalore',
      position: 'FullStack Developer',
      description: "We're looking for a Senior Full-Stack Developer who can write clean, efficient, and scalable code, and is proficient in handling both frontend and backend development seamlessly.",
      postedDate: 'Today',
      positions: 2,
      type: 'Full Time',
      salary: '45LPA',
      requirements: [
        "Strong experience with React, Node.js, and modern JavaScript",
        "Experience with database design and management",
        "Knowledge of frontend frameworks and backend architecture",
        "Excellent problem-solving skills and attention to detail"
      ],
      experience: "3+ years"
    },
    {
      id: 2,
      company: 'Microsoft India',
      logo: 'M',
      location: 'Delhi NCR',
      position: 'Frontend Developer',
      description: "Seeking a Senior Full-Stack Developer skilled in building robust frontend and backend solutions, with a strong focus on writing clean, efficient, and maintainable code.",
      postedDate: 'Today',
      positions: 2,
      type: 'Full Time',
      salary: '24LPA',
      requirements: [
        "Proficiency in JavaScript, TypeScript and C#",
        "Experience with ASP.NET and React/Angular",
        "Understanding of cloud services, preferably Azure",
        "Good knowledge of database systems and optimization"
      ],
      experience: "2+ years"
    },
    {
      id: 3,
      company: 'Amazon',
      logo: 'A',
      location: 'Hyderabad',
      position: 'Frontend Developer',
      description: "Looking for a Frontend Developer with strong skills in React and TypeScript to build responsive, user-focused interfaces for millions of users.",
      postedDate: 'Today',
      positions: 2,
      type: 'Full Time',
      salary: '30LPA',
      requirements: [
        "Strong proficiency in HTML, CSS, and JavaScript",
        "Experience with React or similar frontend frameworks",
        "Knowledge of responsive design principles",
        "Understanding of UI/UX best practices"
      ],
      experience: "2+ years"
    }
  ];
  
  const handleDetailsClick = (job) => {
    // Save the job data to localStorage so it can be accessed from the details page
    localStorage.setItem('selectedJobDetails', JSON.stringify(job));
    // Navigate to the job details page
    navigate(`/job-details/${job.id}`);
  };

  const handleSaveClick = (e, job) => {
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

  const handleLocationChange = (location) => {
    setSelectedLocation(location === selectedLocation ? null : location);
  };

  const handleIndustryChange = (industry) => {
    setSelectedIndustry(industry === selectedIndustry ? null : industry);
  };

  const handleSalaryChange = (salary) => {
    setSelectedSalary(salary === selectedSalary ? null : salary);
  };

  // Filter jobs based on selected criteria
  const filteredJobs = jobs.filter(job => {
    // Location filter
    if (selectedLocation && job.location !== selectedLocation) {
      return false;
    }
    
    // Industry/position filter
    if (selectedIndustry && !job.position.includes(selectedIndustry)) {
      return false;
    }
    
    // Salary filter - would need more complex logic in a real app
    // This is a simplified version
    if (selectedSalary) {
      if (selectedSalary === '0 - 40k' && !job.salary.includes('LPA')) {
        return false;
      }
      if (selectedSalary === '40k - 1Lakh' && parseInt(job.salary) < 12) {
        return false;
      }
      if (selectedSalary === '1Lakh - 5Lakh' && parseInt(job.salary) < 20) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <div className="student-jobs-page">
      <Navbar />
      <div className="navbar-spacer"></div>
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

          .details-button {
            border: 1px solid #E5E7EB;
            background-color: white;
            color: #374151;
          }

          .details-button:hover {
            background-color: #F9FAFB;
          }

          .save-button {
            background-color: #8B5CF6;
            color: white;
            border: none;
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
        `}
      </style>
      
      <div className="jobs-container">
        <div className="filters-section">
          <h2 className="filter-section-title">Filter Jobs</h2>
          
          <div className="filter-group">
            <h3 className="filter-group-title">Location</h3>
            <div className="filter-option">
              <input 
                type="radio" 
                id="delhi" 
                name="location" 
                className="filter-checkbox"
                checked={selectedLocation === 'Delhi NCR'}
                onChange={() => handleLocationChange('Delhi NCR')}
              />
              <label htmlFor="delhi" className="filter-option-label">Delhi NCR</label>
            </div>
            <div className="filter-option">
              <input 
                type="radio" 
                id="bangalore" 
                name="location" 
                className="filter-checkbox"
                checked={selectedLocation === 'Bangalore'}
                onChange={() => handleLocationChange('Bangalore')}
              />
              <label htmlFor="bangalore" className="filter-option-label">Bangalore</label>
            </div>
            <div className="filter-option">
              <input 
                type="radio" 
                id="hyderabad" 
                name="location" 
                className="filter-checkbox"
                checked={selectedLocation === 'Hyderabad'}
                onChange={() => handleLocationChange('Hyderabad')}
              />
              <label htmlFor="hyderabad" className="filter-option-label">Hyderabad</label>
            </div>
            <div className="filter-option">
              <input 
                type="radio" 
                id="pune" 
                name="location" 
                className="filter-checkbox"
                checked={selectedLocation === 'Pune'}
                onChange={() => handleLocationChange('Pune')}
              />
              <label htmlFor="pune" className="filter-option-label">Pune</label>
            </div>
            <div className="filter-option">
              <input 
                type="radio" 
                id="chennai" 
                name="location" 
                className="filter-checkbox"
                checked={selectedLocation === 'Chennai'}
                onChange={() => handleLocationChange('Chennai')}
              />
              <label htmlFor="chennai" className="filter-option-label">Chennai</label>
            </div>
            <div className="filter-option">
              <input 
                type="radio" 
                id="mumbai" 
                name="location" 
                className="filter-checkbox"
                checked={selectedLocation === 'Mumbai'}
                onChange={() => handleLocationChange('Mumbai')}
              />
              <label htmlFor="mumbai" className="filter-option-label">Mumbai</label>
            </div>
          </div>
          
          <div className="filter-group">
            <h3 className="filter-group-title">Industry</h3>
            <div className="filter-option">
              <input 
                type="radio" 
                id="frontend" 
                name="industry" 
                className="filter-checkbox"
                checked={selectedIndustry === 'Frontend Developer'}
                onChange={() => handleIndustryChange('Frontend Developer')}
              />
              <label htmlFor="frontend" className="filter-option-label">Frontend Developer</label>
            </div>
            <div className="filter-option">
              <input 
                type="radio" 
                id="backend" 
                name="industry" 
                className="filter-checkbox"
                checked={selectedIndustry === 'Backend Developer'}
                onChange={() => handleIndustryChange('Backend Developer')}
              />
              <label htmlFor="backend" className="filter-option-label">Backend Developer</label>
            </div>
            <div className="filter-option">
              <input 
                type="radio" 
                id="data-science" 
                name="industry" 
                className="filter-checkbox"
                checked={selectedIndustry === 'Data Science'}
                onChange={() => handleIndustryChange('Data Science')}
              />
              <label htmlFor="data-science" className="filter-option-label">Data Science</label>
            </div>
            <div className="filter-option">
              <input 
                type="radio" 
                id="fullstack" 
                name="industry" 
                className="filter-checkbox"
                checked={selectedIndustry === 'FullStack Developer'}
                onChange={() => handleIndustryChange('FullStack Developer')}
              />
              <label htmlFor="fullstack" className="filter-option-label">FullStack Developer</label>
            </div>
            <div className="filter-option">
              <input 
                type="radio" 
                id="nextjs" 
                name="industry" 
                className="filter-checkbox"
                checked={selectedIndustry === 'Nextjs Developer'}
                onChange={() => handleIndustryChange('Nextjs Developer')}
              />
              <label htmlFor="nextjs" className="filter-option-label">Nextjs Developer</label>
            </div>
          </div>
          
          <div className="filter-group">
            <h3 className="filter-group-title">Salary</h3>
            <div className="filter-option">
              <input 
                type="radio" 
                id="0-40k" 
                name="salary" 
                className="filter-checkbox"
                checked={selectedSalary === '0 - 40k'}
                onChange={() => handleSalaryChange('0 - 40k')}
              />
              <label htmlFor="0-40k" className="filter-option-label">0 - 40k</label>
            </div>
            <div className="filter-option">
              <input 
                type="radio" 
                id="40k-1lakh" 
                name="salary" 
                className="filter-checkbox"
                checked={selectedSalary === '40k - 1Lakh'}
                onChange={() => handleSalaryChange('40k - 1Lakh')}
              />
              <label htmlFor="40k-1lakh" className="filter-option-label">40k to 1lakh</label>
            </div>
            <div className="filter-option">
              <input 
                type="radio" 
                id="1lakh-5lakh" 
                name="salary" 
                className="filter-checkbox"
                checked={selectedSalary === '1Lakh - 5Lakh'}
                onChange={() => handleSalaryChange('1Lakh - 5Lakh')}
              />
              <label htmlFor="1lakh-5lakh" className="filter-option-label">1lakh to 5lakh</label>
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
                  <button className="action-button details-button" onClick={() => handleDetailsClick(job)}>
                    Details
                  </button>
                  <button className="action-button save-button" onClick={(e) => handleSaveClick(e, job)}>
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
    </div>
  );
};

export default StudentJobs; 