import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight, FaArrowLeft, FaSearch, FaTimes } from "react-icons/fa";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import Navbar from "../components/auth/Navbar";

const Home = () => {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage) {
      setUser(JSON.parse(userFromStorage));
    }
  }, []);

  const handleDetailsClick = (job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const closeJobDetails = () => {
    setShowJobDetails(false);
  };

  const handleApplyNow = (job) => {
    // Check if user is logged in
    if (!user) {
      alert("Please log in to apply for jobs.");
      navigate("/login");
      return;
    }

    // Check if user is a student (only students can apply)
    if (user.role !== 'student') {
      alert("Only students can apply for jobs.");
      return;
    }

    // Get all jobs from localStorage
    const storedJobs = localStorage.getItem('jobs');
    if (storedJobs) {
      const jobs = JSON.parse(storedJobs);
      const jobToUpdate = jobs.find(j => j.id === job.id);
      
      if (jobToUpdate) {
        // Initialize applicants array if it doesn't exist
        if (!jobToUpdate.applicants) {
          jobToUpdate.applicants = [];
        }
        
        // Check if the user has already applied
        const alreadyApplied = jobToUpdate.applicants.some(
          applicant => applicant.email === user.email
        );
        
        if (alreadyApplied) {
          alert("You have already applied for this job.");
          return;
        }
        
        // Create applicant object
        const newApplicant = {
          id: Date.now().toString(), // Generate unique ID
          fullName: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          email: user.email,
          contact: user.phone || user.contact || "Not provided",
          resume: "Resume_" + user.name?.replace(/\s+/g, '_') || "Resume.pdf",
          date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
          status: "Pending" // Initial status is pending
        };
        
        // Add applicant to the job
        jobToUpdate.applicants.push(newApplicant);
        
        // Save back to localStorage
        localStorage.setItem('jobs', JSON.stringify(jobs));
        
        // Show success message and close modal
        alert(`Application submitted for ${job.title} at ${job.company}!`);
        setShowJobDetails(false);
      } else {
        // If job not found in localStorage, create a new array
        const newJobs = [
          ...jobs,
          {
            ...job,
            id: job.id || Date.now(), // Use job.id if exists, otherwise generate new ID
            applicants: [{
              id: Date.now().toString(),
              fullName: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
              email: user.email,
              contact: user.phone || user.contact || "Not provided",
              resume: "Resume_" + user.name?.replace(/\s+/g, '_') || "Resume.pdf",
              date: new Date().toISOString().split('T')[0],
              status: "Pending"
            }]
          }
        ];
        
        localStorage.setItem('jobs', JSON.stringify(newJobs));
        alert(`Application submitted for ${job.title} at ${job.company}!`);
        setShowJobDetails(false);
      }
    } else {
      // If no jobs in localStorage yet, create first entry
      const newJobs = [{
        ...job,
        id: job.id || Date.now(),
        applicants: [{
          id: Date.now().toString(),
          fullName: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          email: user.email,
          contact: user.phone || user.contact || "Not provided",
          resume: "Resume_" + user.name?.replace(/\s+/g, '_') || "Resume.pdf",
          date: new Date().toISOString().split('T')[0],
          status: "Pending"
        }]
      }];
      
      localStorage.setItem('jobs', JSON.stringify(newJobs));
      alert(`Application submitted for ${job.title} at ${job.company}!`);
      setShowJobDetails(false);
    }
  };

  const handleSaveClick = (e, job) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user) {
      alert("Please log in to save jobs.");
      navigate("/login");
      return;
    }
    
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
    alert(`Job saved: ${job.title || job.position} at ${job.company}!`);
  };

  return (
    <div className="home-container">
      <Navbar />
      <div className="navbar-spacer"></div>
      <style>
        {`
          .home-container {
            font-family: Arial, sans-serif;
            background: #ffffff;
            min-height: 100vh;
            padding: 0;
            margin: 0;
            position: relative;
          }

          .top-section {
            text-align: center;
            padding: 100px 20px 40px;
            background: white;
            position: relative;
          }

          .badge {
            display: inline-block;
            font-size: 14px;
            color: #cc4b37;
            margin-bottom: 30px;
            background-color: #faf0ee;
            padding: 4px 12px;
            border-radius: 16px;
            position: relative;
            z-index: 1;
          }

          h1 {
            font-size: 48px;
            color: #000;
            margin: 25px 0 15px;
            font-weight: 600;
            line-height: 1.2;
            position: relative;
          }

          .highlight {
            color: #6e46ba;
          }

          .subtext {
            font-size: 16px;
            color: #666;
            margin: 20px auto;
            max-width: 750px;
            line-height: 1.6;
          }

          .search-container {
            max-width: 750px;
            margin: 30px auto;
            position: relative;
          }

          .search-box {
            display: flex;
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 30px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }

          .search-box input {
            flex: 1;
            padding: 15px 25px;
            font-size: 16px;
            border: none;
            outline: none;
          }

          .search-box button {
            background: #6e46ba;
            color: white;
            border: none;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            margin: 5px;
            transition: background 0.3s;
          }

          .search-box button:hover {
            background: #5d3ba1;
          }

          .tags-container {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            margin-top: 30px;
          }

          .nav-btn {
            background: transparent;
            border: none;
            color: #666;
            cursor: pointer;
            padding: 8px;
            transition: color 0.3s;
          }

          .nav-btn:hover {
            color: #6e46ba;
          }

          .tag {
            background: white;
            color: #333;
            border: 1px solid #e0e0e0;
            padding: 8px 20px;
            border-radius: 25px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s;
          }

          .tag:hover {
            background: #6e46ba;
            color: white;
            border-color: #6e46ba;
          }

          .job-section {
            padding: 40px 20px;
            max-width: 1200px;
            margin: 0 auto;
          }

          .section-title {
            text-align: left;
            margin-bottom: 40px;
            margin-left: 20px;
          }

          .section-title h2 {
            font-size: 32px;
            color: #000;
            margin: 0;
          }

          .job-cards {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 25px;
            padding: 20px;
          }

          .job-card {
            background: white;
            border-radius: 12px;
            padding: 30px;
            transition: all 0.3s;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            display: flex;
            flex-direction: column;
            min-height: 220px;
            margin-bottom: 15px;
            position: relative;
          }

          .job-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 15px rgba(0,0,0,0.1);
          }

          .bookmark-btn {
            position: absolute;
            top: 30px;
            right: 30px;
            background: none;
            border: none;
            font-size: 24px;
            color: #666;
            cursor: pointer;
            width: 25px;
            height: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .job-date {
            position: absolute;
            top: 30px;
            left: 30px;
            font-size: 14px;
            color: #666;
            font-weight: 500;
          }

          .company-info {
            margin: 40px 0 20px;
            display: flex;
            align-items: center;
            gap: 15px;
          }

          .company-logo {
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            overflow: hidden;
            background-color: #f8f9fa;
          }

          .company-logo svg {
            width: 100%;
            height: 100%;
          }

          .company-details {
            display: flex;
            flex-direction: column;
          }

          .company-name {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin-bottom: 5px;
          }

          .company-location {
            font-size: 14px;
            color: #666;
          }

          .job-title {
            font-size: 22px;
            font-weight: 700;
            color: #000;
            margin: 0 0 15px 0;
          }

          .job-desc {
            margin: 0 0 20px 0;
            font-size: 14px;
            color: #666;
            line-height: 1.5;
            flex-grow: 1;
          }

          .job-meta {
            display: flex;
            gap: 20px;
            margin: 20px 0;
          }

          .positions {
            font-weight: 500;
            font-size: 14px;
          }

          .job-type {
            color: #cc4b37;
            font-weight: 500;
            font-size: 14px;
          }

          .job-salary {
            font-weight: 500;
            color: #0369A1;
            font-size: 14px;
          }

          .job-actions {
            display: flex;
            gap: 10px;
            margin-top: 15px;
          }

          .details-btn {
            padding: 10px 25px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s;
          }

          .details-btn:hover {
            background: #f5f5f5;
          }

          .save-btn {
            padding: 10px 25px;
            background: #6e46ba;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s;
          }

          .save-btn:hover {
            background: #5d3ba1;
          }

          .footer {
            background: #fff;
            border-top: 1px solid #eee;
            padding: 20px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 50px;
          }

          .footer-left {
            color: #666;
            font-size: 14px;
          }

          .footer-right {
            display: flex;
            gap: 15px;
          }

          .social-icon {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #eee;
            border-radius: 4px;
            color: #666;
            transition: all 0.3s;
          }

          .social-icon:hover {
            background: #6e46ba;
            border-color: #6e46ba;
            color: white;
          }

          .logo-hunt {
            color: #cc4b37;
            font-weight: bold;
          }

          /* News Section Styling */
          .news-section {
            padding: 60px 20px;
            background-color: #f8f9fa;
            margin-top: 40px;
          }

          .news-container {
            max-width: 1200px;
            margin: 0 auto;
          }

          .news-header {
            margin-bottom: 40px;
            text-align: center;
          }

          .news-header h2 {
            font-size: 32px;
            color: #000;
            margin-bottom: 15px;
          }

          .news-header p {
            color: #666;
            max-width: 700px;
            margin: 0 auto;
          }

          .news-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
          }

          .news-card {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            transition: all 0.3s;
          }

          .news-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 15px rgba(0,0,0,0.1);
          }

          .news-image {
            height: 200px;
            background-size: cover;
            background-position: center;
          }

          .news-content {
            padding: 25px;
          }

          .news-date {
            font-size: 14px;
            color: #6e46ba;
            margin-bottom: 10px;
            display: block;
          }

          .news-title {
            font-size: 20px;
            font-weight: 700;
            color: #000;
            margin-bottom: 15px;
          }

          .news-excerpt {
            color: #666;
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 20px;
          }

          .read-more {
            display: inline-flex;
            align-items: center;
            color: #6e46ba;
            font-weight: 500;
            font-size: 14px;
            gap: 5px;
            transition: all 0.3s;
          }

          .read-more:hover {
            gap: 8px;
          }

          /* Featured Companies Section */
          .companies-section {
            padding: 60px 20px;
          }

          .companies-container {
            max-width: 1200px;
            margin: 0 auto;
          }

          .companies-header {
            margin-bottom: 40px;
            text-align: center;
          }

          .companies-header h2 {
            font-size: 32px;
            color: #000;
            margin-bottom: 15px;
          }

          .companies-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 30px;
          }

          .company-card {
            background: white;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            transition: all 0.3s;
          }

          .company-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 15px rgba(0,0,0,0.1);
          }

          .company-logo-large {
            width: 80px;
            height: 80px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .company-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 10px;
          }

          .company-industry {
            font-size: 14px;
            color: #666;
            margin-bottom: 15px;
          }

          .open-positions {
            background-color: #f0f0f0;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
          }

          /* Resources Section */
          .resources-section {
            padding: 60px 20px;
            background-color: #f8f9fa;
          }

          .resources-container {
            max-width: 1200px;
            margin: 0 auto;
          }

          .resources-header {
            margin-bottom: 40px;
            text-align: center;
          }

          .resources-header h2 {
            font-size: 32px;
            color: #000;
            margin-bottom: 15px;
          }

          .resources-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
          }

          .resource-card {
            background: white;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            transition: all 0.3s;
          }

          .resource-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 15px rgba(0,0,0,0.1);
          }

          .resource-icon {
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f0f6ff;
            border-radius: 10px;
            margin-bottom: 20px;
            color: #6e46ba;
            font-size: 24px;
          }

          .resource-title {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 15px;
          }

          .resource-description {
            color: #666;
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 20px;
          }

          .resource-link {
            display: inline-flex;
            align-items: center;
            color: #6e46ba;
            font-weight: 500;
            font-size: 14px;
            gap: 5px;
          }

          /* Job Details Modal Styles */
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

          .modal-container {
            background-color: white;
            width: 90%;
            max-width: 800px;
            border-radius: 12px;
            padding: 30px;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
          }

          .modal-close {
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
          }

          .job-details-header {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
          }

          .job-details-title {
            font-size: 28px;
            font-weight: 700;
            color: #000;
            margin-bottom: 10px;
          }

          .job-details-company {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
          }

          .job-details-logo {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            background-color: #f8f9fa;
          }

          .job-details-company-info {
            display: flex;
            flex-direction: column;
          }

          .job-details-company-name {
            font-size: 20px;
            font-weight: 600;
            color: #333;
            margin-bottom: 5px;
          }

          .job-details-company-location {
            font-size: 16px;
            color: #666;
          }

          .job-details-meta {
            display: flex;
            gap: 20px;
            margin: 30px 0;
            flex-wrap: wrap;
          }

          .job-details-meta-item {
            display: flex;
            flex-direction: column;
          }

          .job-details-meta-label {
            font-size: 14px;
            color: #666;
            margin-bottom: 5px;
          }

          .job-details-meta-value {
            font-size: 16px;
            font-weight: 600;
            color: #333;
          }

          .job-details-description {
            margin: 20px 0;
            line-height: 1.6;
          }

          .job-details-description-title {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 15px;
          }

          .job-details-description-text {
            font-size: 16px;
            color: #444;
          }

          .job-details-requirements {
            margin: 30px 0;
          }

          .job-details-requirements-title {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 15px;
          }

          .job-details-requirements-list {
            padding-left: 20px;
          }

          .job-details-requirements-item {
            margin-bottom: 10px;
            font-size: 16px;
            color: #444;
          }

          .apply-now-btn {
            background-color: #6e46ba;
            color: white;
            border: none;
            padding: 12px 30px;
            font-size: 16px;
            font-weight: 600;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s;
            margin-top: 20px;
          }

          .apply-now-btn:hover {
            background-color: #5d3ba1;
          }
        `}
      </style>

      <div className="top-section">
        <p className="badge">No. 1 HireX Website</p>
        <h1>
          Search, Apply & <br /> Get Your <span className="highlight">Dream Jobs</span>
        </h1>
        <p className="subtext">
          Discover your dream career path with HireX. Connect with top employers, 
          explore thousands of opportunities, and take the next step in your professional journey today.
        </p>

        <div className="search-container">
          <div className="search-box">
            <input type="text" placeholder="Find your dream jobs" />
            <button><FaSearch size={20} /></button>
          </div>
        </div>

        <div className="tags-container">
          <button className="nav-btn"><FaArrowLeft size={18} /></button>
          <button className="tag">Frontend Developer</button>
          <button className="tag">Backend Developer</button>
          <button className="tag">Data Engineer</button>
          <button className="nav-btn"><FaArrowRight size={18} /></button>
        </div>
      </div>

      <div className="job-section">
        <div className="section-title">
          <h2>
            <span className="highlight">Latest and Top</span> Job Openings
          </h2>
        </div>

        <div className="job-cards">
          {[
            {
              id: 1,
              company: "Google",
              location: "India",
              title: "FullStack Developer",
              type: "Full Time",
              salary: "45LPA",
              positions: 2,
              desc: "I need senior Fullstack developer, who can able to write the efficient code, and deal with frontend and backend both",
              role: "FullStack Developer",
              experience: "3+ years",
              postedDate: "2024-06-14",
              requirements: [
                "Strong experience with React, Node.js, and modern JavaScript",
                "Experience with database design and management",
                "Knowledge of frontend frameworks and backend architecture",
                "Excellent problem-solving skills and attention to detail"
              ]
            },
            {
              id: 2,
              company: "Microsoft India",
              location: "India",
              title: "Fullstack Developer",
              type: "Full Time",
              salary: "23LPA",
              positions: 2,
              desc: "I need senior Fullstack developer, who can able to write the efficient code, and deal with frontend and backend both",
              role: "Fullstack Developer",
              experience: "2+ years",
              postedDate: "2024-06-13",
              requirements: [
                "Proficiency in JavaScript, TypeScript and C#",
                "Experience with ASP.NET and React/Angular",
                "Understanding of cloud services, preferably Azure",
                "Good knowledge of database systems and optimization"
              ]
            },
            {
              id: 3,
              company: "HireX",
              location: "India",
              title: "Fullstack Developer",
              type: "Full Time",
              salary: "34LPA",
              positions: 4,
              desc: "I need senior Fullstack developer, who can able to write the efficient code, and deal with frontend and backend both",
              role: "Senior Fullstack Developer",
              experience: "4+ years",
              postedDate: "2024-06-12",
              requirements: [
                "Extensive experience with full stack development",
                "Strong knowledge of JavaScript, React, and Node.js",
                "Experience with microservices architecture",
                "Ability to mentor junior developers"
              ]
            },
            {
              id: 4,
              company: "HireX",
              location: "India",
              title: "Backend Developer",
              type: "Full Time",
              salary: "12LPA",
              positions: 5,
              desc: "I need backend developer who can make professional ui web pages.",
              role: "Backend Developer",
              experience: "1+ year",
              postedDate: "2024-06-10",
              requirements: [
                "Strong knowledge of Node.js, Express or similar frameworks",
                "Experience with database systems like MongoDB, MySQL",
                "Understanding of RESTful APIs and microservices",
                "Knowledge of cloud deployment and serverless architecture"
              ]
            },
            {
              id: 5,
              company: "HireX",
              location: "India",
              title: "Frontend Developer",
              type: "Full Time",
              salary: "14LPA",
              positions: 12,
              desc: "I need Frontend developer who can make professional ui web pages.",
              role: "Frontend Developer",
              experience: "2+ years",
              postedDate: "2024-06-08",
              requirements: [
                "Strong proficiency in HTML, CSS, and JavaScript",
                "Experience with React or similar frontend frameworks",
                "Knowledge of responsive design principles",
                "Understanding of UI/UX best practices"
              ]
            }
          ].map((job, idx) => (
            <div className="job-card" key={idx}>
              <div className="job-date">{idx === 0 ? 'Today' : '1 days ago'}</div>
              <button className="bookmark-btn" onClick={(e) => handleSaveClick(e, job)}>
                <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 19L8 14L1 19V3C1 2.46957 1.21071 1.96086 1.58579 1.58579C1.96086 1.21071 2.46957 1 3 1H13C13.5304 1 14.0391 1.21071 14.4142 1.58579C14.7893 1.96086 15 2.46957 15 3V19Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <div className="company-info">
                <div className="company-logo">
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
                      <text x="24" y="29" fontSize="16" fontWeight="bold" fill="#8B5CF6" textAnchor="middle">H</text>
                    </svg>
                  )}
                </div>
                <div className="company-details">
                  <div className="company-name">{job.company}</div>
                  <div className="company-location">{job.location}</div>
                </div>
              </div>
              
              <h3 className="job-title">{job.title}</h3>
              <p className="job-desc">{job.desc}</p>
              
              <div className="job-meta">
                <span className="positions">{job.positions} Positions</span>
                <span className="job-type">{job.type}</span>
                <span className="job-salary">{job.salary}</span>
              </div>
              
              <div className="job-actions">
                <button 
                  className="details-btn" 
                  onClick={() => handleDetailsClick(job)}
                >
                  Details
                </button>
                <button className="save-btn" onClick={(e) => handleSaveClick(e, job)}>Save For Later</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Job Details Modal */}
      {showJobDetails && selectedJob && (
        <div className="modal-overlay" onClick={closeJobDetails}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeJobDetails}>
              <FaTimes />
            </button>
            
            <div className="job-details-title">{selectedJob.title}</div>
            
            <div className="job-details-company">
              <div className="job-details-logo">
                {selectedJob.company === 'Google' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                  </svg>
                ) : selectedJob.company === 'Microsoft India' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px">
                    <path fill="#ff5722" d="M6 6H22V22H6z" transform="rotate(-180 14 14)"/>
                    <path fill="#4caf50" d="M26 6H42V22H26z" transform="rotate(-180 34 14)"/>
                    <path fill="#ffc107" d="M26 26H42V42H26z" transform="rotate(-180 34 34)"/>
                    <path fill="#03a9f4" d="M6 26H22V42H6z" transform="rotate(-180 14 34)"/>
                  </svg>
                ) : (
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="20" stroke="#8B5CF6" strokeWidth="2" fill="white"/>
                    <text x="24" y="29" fontSize="16" fontWeight="bold" fill="#8B5CF6" textAnchor="middle">H</text>
                  </svg>
                )}
              </div>
              <div className="job-details-company-info">
                <div className="job-details-company-name">{selectedJob.company}</div>
                <div className="job-details-company-location">{selectedJob.location}</div>
              </div>
            </div>
            
            <div className="job-details-meta">
              <div className="job-details-meta-item">
                <span className="job-details-meta-label">Job Type</span>
                <span className="job-details-meta-value">{selectedJob.type}</span>
              </div>
              <div className="job-details-meta-item">
                <span className="job-details-meta-label">Salary</span>
                <span className="job-details-meta-value">{selectedJob.salary}</span>
              </div>
              <div className="job-details-meta-item">
                <span className="job-details-meta-label">Experience</span>
                <span className="job-details-meta-value">{selectedJob.experience}</span>
              </div>
              <div className="job-details-meta-item">
                <span className="job-details-meta-label">Posted</span>
                <span className="job-details-meta-value">{selectedJob.postedDate}</span>
              </div>
              <div className="job-details-meta-item">
                <span className="job-details-meta-label">Positions</span>
                <span className="job-details-meta-value">{selectedJob.positions}</span>
              </div>
            </div>
            
            <div className="job-details-description">
              <h3 className="job-details-description-title">Job Description</h3>
              <p className="job-details-description-text">{selectedJob.desc}</p>
            </div>
            
            <div className="job-details-requirements">
              <h3 className="job-details-requirements-title">Requirements</h3>
              <ul className="job-details-requirements-list">
                {selectedJob.requirements.map((req, index) => (
                  <li key={index} className="job-details-requirements-item">{req}</li>
                ))}
              </ul>
            </div>
            
            <button 
              className="apply-now-btn" 
              onClick={() => handleApplyNow(selectedJob)}
            >
              Apply Now
            </button>
          </div>
        </div>
      )}

      {/* News Section */}
      <section className="news-section">
        <div className="news-container">
          <div className="news-header">
            <h2>Latest Career <span className="highlight">News & Insights</span></h2>
            <p>Stay updated with the latest trends, opportunities, and insights in the job market</p>
          </div>
          
          <div className="news-grid">
            <div className="news-card">
              <div className="news-image" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80")' }}></div>
              <div className="news-content">
                <span className="news-date">June 12, 2024</span>
                <h3 className="news-title">Tech Industry Sees Surge in Remote Work Opportunities</h3>
                <p className="news-excerpt">The technology sector continues to lead the way in flexible work arrangements as more companies embrace remote-first policies...</p>
                <a href="#" className="read-more">
                  Read more <FaArrowRight size={12} />
                </a>
              </div>
            </div>
            
            <div className="news-card">
              <div className="news-image" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80")' }}></div>
              <div className="news-content">
                <span className="news-date">June 8, 2024</span>
                <h3 className="news-title">AI Skills Now Top Requirement for Data Science Roles</h3>
                <p className="news-excerpt">As artificial intelligence continues to transform industries, employers are increasingly seeking candidates with specialized AI skills...</p>
                <a href="#" className="read-more">
                  Read more <FaArrowRight size={12} />
                </a>
              </div>
            </div>
            
            <div className="news-card">
              <div className="news-image" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1579389083078-4e7018379f7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80")' }}></div>
              <div className="news-content">
                <span className="news-date">June 5, 2024</span>
                <h3 className="news-title">Study Shows Soft Skills Increasingly Valued by Employers</h3>
                <p className="news-excerpt">A recent survey of hiring managers reveals that communication, adaptability, and problem-solving skills are becoming as important as technical qualifications...</p>
                <a href="#" className="read-more">
                  Read more <FaArrowRight size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Companies Section */}
      <section className="companies-section">
        <div className="companies-container">
          <div className="companies-header">
            <h2>Featured <span className="highlight">Companies</span></h2>
          </div>
          
          <div className="companies-grid">
            <div className="company-card">
              <div className="company-logo-large">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="80px" height="80px">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                </svg>
              </div>
              <h3 className="company-title">Google</h3>
              <p className="company-industry">Technology</p>
              <span className="open-positions">24 Open Positions</span>
            </div>
            
            <div className="company-card">
              <div className="company-logo-large">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="80px" height="80px">
                  <path fill="#ff5722" d="M6 6H22V22H6z" transform="rotate(-180 14 14)"/>
                  <path fill="#4caf50" d="M26 6H42V22H26z" transform="rotate(-180 34 14)"/>
                  <path fill="#ffc107" d="M26 26H42V42H26z" transform="rotate(-180 34 34)"/>
                  <path fill="#03a9f4" d="M6 26H22V42H6z" transform="rotate(-180 14 34)"/>
                </svg>
              </div>
              <h3 className="company-title">Microsoft</h3>
              <p className="company-industry">Technology</p>
              <span className="open-positions">18 Open Positions</span>
            </div>
            
            <div className="company-card">
              <div className="company-logo-large">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M40 70C56.5685 70 70 56.5685 70 40C70 23.4315 56.5685 10 40 10C23.4315 10 10 23.4315 10 40C10 56.5685 23.4315 70 40 70Z" fill="#FF9900"/>
                  <path d="M34.3353 36.3917C34.3353 37.1917 34.4236 37.8417 34.5883 38.325C34.7648 38.8083 35.003 39.2917 35.3177 39.7583C35.4236 39.9083 35.4648 40.0583 35.4648 40.1917C35.4648 40.3583 35.3648 40.525 35.1648 40.6917L33.403 41.8583C33.2442 41.9667 33.0854 42.0167 32.9383 42.0167C32.7677 42.0167 32.6089 41.9417 32.4501 41.7917C32.1354 41.4333 31.8442 41.0583 31.5766 40.675C31.3177 40.2917 31.0766 39.8583 30.8442 39.375C29.053 41.5833 26.7736 42.6833 24.003 42.6833C21.9589 42.6833 20.3236 42.0583 19.0971 40.8167C17.8707 39.575 17.2619 37.9333 17.2619 35.9C17.2619 33.7667 17.9883 31.9917 19.453 30.5833C20.9177 29.175 22.8177 28.4667 25.1619 28.4667C25.9883 28.4667 26.8265 28.55 27.6883 28.7C28.5501 28.85 29.453 29.075 30.4029 29.3417V27.3083C30.4029 25.6583 30.0178 24.4917 29.2619 23.8167C28.4942 23.1417 27.2442 22.8083 25.5119 22.8083C24.7118 22.8083 23.8854 22.9 23.0471 23.0917C22.2089 23.2833 21.403 23.525 20.6237 23.825C20.2619 23.9667 19.9707 24.05 19.7766 24.0833C19.5942 24.1167 19.453 24.1333 19.3471 24.1333C19.003 24.1333 18.8324 23.8667 18.8324 23.325V22.1417C18.8324 21.725 18.8736 21.4167 18.9677 21.2417C19.0619 21.0583 19.2324 20.875 19.4913 20.7C20.2707 20.325 21.2177 20.0083 22.3236 19.75C23.4295 19.4833 24.6029 19.35 25.8412 19.35C28.6236 19.35 30.6883 20.0167 32.0353 21.3583C33.3706 22.6917 34.0412 24.6917 34.0412 27.3583V36.3917H34.3353ZM25.2795 39.3417C26.0707 39.3417 26.903 39.1917 27.7766 38.8833C28.6501 38.575 29.4177 38.0583 30.0589 37.3583C30.4236 36.9417 30.6883 36.475 30.8471 35.9417C31.003 35.4083 31.0942 34.7917 31.0942 34.075V32.2167C30.403 32.0167 29.6619 31.85 28.8825 31.725C28.103 31.6 27.3354 31.5417 26.5648 31.5417C25.1148 31.5417 24.0059 31.85 23.2383 32.4833C22.4707 33.1167 22.0912 34.025 22.0912 35.2167C22.0912 36.3417 22.3765 37.1917 22.9471 37.775C23.5059 38.375 24.2971 38.6667 25.2795 39.3417ZM44.7175 41.8917C44.2704 41.8917 43.9734 41.8083 43.7733 41.6333C43.5733 41.4667 43.3969 41.1 43.2498 40.6L38.2852 22.5C38.138 21.9833 38.0675 21.6417 38.0675 21.4333C38.0675 20.975 38.2557 20.7417 38.6439 20.7417H40.7939C41.2527 20.7417 41.5733 20.825 41.7498 21C41.9351 21.1667 42.0704 21.525 42.2174 22.025L46.0439 37.7083L49.6204 22.025C49.7439 21.5083 49.8792 21.1583 50.0645 21C50.2498 20.8417 50.5821 20.7417 51.0281 20.7417H52.7263C53.1851 20.7417 53.5056 20.8417 53.6939 21C53.8851 21.1583 54.0292 21.5167 54.1409 22.025L57.7645 37.9583L61.6734 22.025C61.8204 21.5083 61.9557 21.1583 62.1292 21C62.3145 20.8417 62.6263 20.7417 63.0851 20.7417H65.118C65.5062 20.7417 65.7027 20.9667 65.7027 21.4333C65.7027 21.5583 65.6851 21.6917 65.6439 21.8417C65.6027 21.9917 65.5498 22.175 65.4675 22.4L60.4086 40.6083C60.2615 41.1167 60.0851 41.4833 59.885 41.65C59.685 41.8167 59.3821 41.9 58.9674 41.9H57.1733C56.7146 41.9 56.394 41.8083 56.2057 41.6333C56.0174 41.4583 55.8733 41.1 55.7616 40.5833L52.1851 25.2333L48.6204 40.575C48.5086 41.0917 48.3645 41.45 48.1762 41.625C47.9879 41.8 47.6556 41.8917 47.1968 41.8917H44.7175Z" fill="white"/>
                </svg>
              </div>
              <h3 className="company-title">Amazon</h3>
              <p className="company-industry">E-commerce, Cloud</p>
              <span className="open-positions">42 Open Positions</span>
            </div>
            
            <div className="company-card">
              <div className="company-logo-large">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="40" cy="40" r="33" stroke="#8B5CF6" strokeWidth="3" fill="white"/>
                  <text x="40" y="48" fontSize="24" fontWeight="bold" fill="#8B5CF6" textAnchor="middle">H</text>
                </svg>
              </div>
              <h3 className="company-title">HireX</h3>
              <p className="company-industry">Recruitment</p>
              <span className="open-positions">15 Open Positions</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Career Resources Section */}
      <section className="resources-section">
        <div className="resources-container">
          <div className="resources-header">
            <h2>Career <span className="highlight">Resources</span></h2>
          </div>
          
          <div className="resources-grid">
            <div className="resource-card">
              <div className="resource-icon">📝</div>
              <h3 className="resource-title">Resume Building Guide</h3>
              <p className="resource-description">Learn how to create a standout resume that catches employers' attention and showcases your skills effectively.</p>
              <a href="#" className="resource-link">
                Learn more <FaArrowRight size={12} />
              </a>
            </div>
            
            <div className="resource-card">
              <div className="resource-icon">🎯</div>
              <h3 className="resource-title">Interview Preparation</h3>
              <p className="resource-description">Comprehensive guides and tips to help you ace your job interviews, from research to follow-up.</p>
              <a href="#" className="resource-link">
                Learn more <FaArrowRight size={12} />
              </a>
            </div>
            
            <div className="resource-card">
              <div className="resource-icon">💼</div>
              <h3 className="resource-title">Salary Negotiation</h3>
              <p className="resource-description">Expert advice on how to negotiate your salary and benefits package to maximize your compensation.</p>
              <a href="#" className="resource-link">
                Learn more <FaArrowRight size={12} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-left">
          2024 Hire<span className="logo-hunt">X</span>. All rights reserved.
        </div>
        <div className="footer-right">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaFacebookF size={16} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaTwitter size={16} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaLinkedinIn size={16} />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
