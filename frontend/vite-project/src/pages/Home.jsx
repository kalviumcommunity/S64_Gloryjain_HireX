import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight, FaArrowLeft, FaSearch, FaTimes, FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import Navbar from "../components/auth/Navbar";
import ConfirmApplyModal from '../components/ConfirmApplyModal';

const Home = () => {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const tagBarRef = useRef(null);
  const jobCardsRef = useRef(null);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
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

  const jobTags = [
    "Frontend Developer",
    "Backend Developer",
    "Data Engineer",
    "FullStack Developer",
    "Software Engineer",
    "System Analyst",
    "QA Engineer",
    "DevOps Engineer",
    "Product Manager",
    "UI/UX Designer"
  ];

  useEffect(() => {
    // Get user data from localStorage
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage) {
      setUser(JSON.parse(userFromStorage));
    }
    // Get companies from localStorage
    const storedCompanies = localStorage.getItem('companies');
    let parsedCompanies = [];
    if (storedCompanies) {
      parsedCompanies = JSON.parse(storedCompanies);
      setCompanies(parsedCompanies);
    }
    // Get jobs from localStorage
    const storedJobs = localStorage.getItem('jobs');
    if (storedJobs) {
      const parsedJobs = JSON.parse(storedJobs);
      // Filter out incomplete jobs and format the valid ones
      const userJobs = parsedJobs.filter(job => job.companyName && job.title);
      
      // Format jobs for display, attach logo from company if available
      const formattedJobs = userJobs.map(job => {
        let logo = (job.companyName || 'C')[0];
        if (job.companyId && parsedCompanies.length > 0) {
          const company = parsedCompanies.find(c => c.id === job.companyId || c.id === Number(job.companyId));
          if (company && company.logo) {
            logo = company.logo;
          }
        }
        return {
          id: job.id || Math.random().toString(36).substr(2, 9),
          company: job.companyName || 'Company Name Not Available',
          logo,
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
        };
      });
      setJobs(formattedJobs);
    } else {
      setJobs([]);
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
    setApplyTarget(job);
    setShowApplyModal(true);
  };

  const handleSaveClick = (e, job) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user) {
      addNotification("Please log in to save jobs.", 'info');
      navigate("/login");
      return;
    }
    
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
    addNotification(`Job saved: ${job.title || job.position} at ${job.company}!`, 'success');
  };

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(job => {
    const term = searchTerm.toLowerCase();
    return (
      job.position.toLowerCase().includes(term) ||
      job.company.toLowerCase().includes(term) ||
      job.description.toLowerCase().includes(term)
    );
  });

  const handleTagClick = (tag) => {
    setSelectedTag(tag === selectedTag ? "" : tag);
    setSearchTerm(tag === selectedTag ? "" : tag);
  };

  const scrollTags = (direction) => {
    if (tagBarRef.current) {
      const tagWidth = 200; // Match the tag minWidth/maxWidth
      tagBarRef.current.scrollBy({
        left: direction === "left" ? -tagWidth * 3 : tagWidth * 3,
        behavior: "smooth"
      });
    }
  };

  const scrollJobCards = (direction) => {
    if (jobCardsRef.current) {
      const cardWidth = 340; // Approximate width of one job card + gap
      jobCardsRef.current.scrollBy({
        left: direction === 'left' ? -cardWidth * 3 : cardWidth * 3,
        behavior: 'smooth'
      });
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
    addNotification(`Applied to ${company.name}`, 'success');
    setShowCompanyModal(false);
  };

  const handleConfirmApply = () => {
    setShowApplyModal(false);
    if (applyTarget && applyTarget.name) {
      addNotification(`Applied to ${applyTarget.name}`, 'success');
    }
    setTimeout(() => {
      window.open('https://docs.google.com/forms/d/e/1FAIpQLScC2ScWfKYxHV45HOsqYsOQu5fIRAlYz7sb2jRPG7Ju12ovJA/viewform?usp=header', '_blank');
    }, 200);
    setShowCompanyModal(false);
    setApplyTarget(null);
  };

  const handleCloseApplyModal = () => {
    setShowApplyModal(false);
    setApplyTarget(null);
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

          /* New Job Details Modal Styles */
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(8px);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .job-details-modal {
            font-family: 'Inter', sans-serif;
            background: #fff;
            max-width: 700px;
            width: 95%;
            padding: 32px;
            border-radius: 16px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            border: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            flex-direction: column;
            gap: 28px;
            z-index: 2100;
            position: relative;
          }
          
          .modal-close {
            position: absolute;
            top: 16px;
            right: 16px;
            background: none;
            border: none;
            font-size: 22px;
            color: #64748b;
            cursor: pointer;
            z-index: 2;
            transition: color 0.2s;
          }

          .job-details-header {
            display: flex;
            align-items: flex-start;
            gap: 16px;
          }

          .job-details-logo {
            width: 56px;
            height: 56px;
            min-width: 56px;
            border-radius: 10px;
          }
          
          .job-details-logo text {
            fill: #475569;
            font-weight: 600;
          }

          .company-info-block .job-details-company-name {
            font-size: 1.1rem;
            font-weight: 600;
            color: #1e293b;
          }

          .company-info-block .job-details-company-desc {
            font-size: 0.95rem;
            color: #64748b;
            margin-top: 4px;
          }

          .job-details-main {
            display: flex;
            flex-direction: column;
            gap: 24px;
          }

          .job-details-title {
            font-size: 2rem;
            font-weight: 700;
            color: #0f172a;
          }

          .job-details-meta {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }
          
          .meta-tag {
            border-radius: 9999px;
            font-size: 0.8rem;
            font-weight: 500;
            padding: 6px 14px;
          }

          .meta-tag.positions-tag {
            background-color: #e0f2fe;
            color: #0c4a6e;
          }
          
          .meta-tag.time-tag {
            background-color: #ede9fe;
            color: #5b21b6;
          }
          
          .meta-tag.salary-tag {
            background-color: #dcfce7;
            color: #166534;
          }

          .job-details-body {
            display: flex;
            flex-direction: column;
            gap: 24px;
          }
          
          .job-details-section-title {
            font-size: 1rem;
            font-weight: 600;
            color: #334155;
            margin-bottom: 12px;
          }

          .job-details-section-content, .job-details-req-list {
            font-size: 0.95rem;
            color: #475569;
            line-height: 1.7;
          }

          .job-details-req-list {
            padding-left: 20px;
          }

          .job-details-req-list li {
            margin-bottom: 8px;
          }

          .job-details-footer {
            display: flex;
            justify-content: flex-end;
            padding-top: 16px;
            border-top: 1px solid #f1f5f9;
          }

          .apply-now-btn {
            background: #8B5CF6;
            color: white;
            border: none;
            padding: 12px 24px;
            font-size: 0.95rem;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .apply-now-btn:hover {
            background: #7C3AED;
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(124, 58, 237, 0.2), 0 4px 6px -4px rgba(124, 58, 237, 0.1);
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

          /* Company Details Modal Styles */
          .company-modal-card {
            font-family: 'Inter', Arial, sans-serif;
            background: #fff;
            max-width: 700px;
            width: 95%;
            padding: 40px 36px 32px 36px;
            border-radius: 18px;
            box-shadow: 0 8px 32px rgba(15,23,42,0.12);
            border: none;
            display: flex;
            flex-direction: column;
            gap: 28px;
            z-index: 2100;
            position: relative;
            margin: 0 auto;
          }
          .company-modal-header {
            display: flex;
            align-items: flex-start;
            gap: 18px;
            margin-bottom: 8px;
          }
          .company-modal-logo {
            width: 56px;
            height: 56px;
            min-width: 56px;
            border-radius: 12px;
            background: #f4f4f5;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .company-modal-header-info {
            display: flex;
            flex-direction: column;
            gap: 2px;
            margin-top: 2px;
          }
          .company-modal-header-title {
            font-size: 1.25rem;
            font-weight: 700;
            color: #18181b;
            margin-bottom: 2px;
          }
          .company-modal-header-location {
            font-size: 1rem;
            color: #71717a;
          }
          .company-modal-body {
            display: flex;
            flex-direction: column;
            gap: 18px;
            margin-bottom: 0;
          }
          .company-modal-job-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #18181b;
            margin-bottom: 10px;
          }
          .company-modal-tags {
            display: flex;
            gap: 10px;
            margin-bottom: 18px;
          }
          .company-modal-tag {
            border-radius: 9999px;
            font-size: 0.95rem;
            font-weight: 500;
            padding: 6px 16px;
            background: #f1f5f9;
            color: #6366f1;
          }
          .company-modal-tag.positions-tag {
            background: #e0f2fe;
            color: #2563eb;
          }
          .company-modal-section {
            margin-bottom: 0;
          }
          .company-modal-section-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #18181b;
            margin-bottom: 8px;
          }
          .company-modal-section-content {
            font-size: 1rem;
            color: #52525b;
            line-height: 1.7;
            margin-bottom: 0;
          }
          .company-modal-section-content ul, .company-modal-section-content li {
            margin: 0;
            padding: 0 0 0 18px;
            list-style: disc;
          }
          .company-modal-footer {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            border-top: 1px solid #f1f5f9;
            margin-top: 32px;
            padding-top: 18px;
          }
          .apply-now-btn {
            background: #a78bfa;
            color: #fff;
            border: none;
            padding: 14px 36px;
            font-size: 1.1rem;
            font-weight: 600;
            border-radius: 10px;
            cursor: pointer;
            transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
            box-shadow: 0 2px 8px rgba(139,92,246,0.08);
          }
          .apply-now-btn:hover {
            background: #8b5cf6;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(139,92,246,0.18);
          }
        `}
      </style>

      <div className="top-section">
        <p className="badge">No.1 Job Hunt Website</p>
        <h1>
          Search, Apply & <br /> Get Your <span className="highlight">Dream Jobs</span>
        </h1>
        <p className="subtext">
          Discover your dream career path with HireX. Connect with top employers, 
          explore thousands of opportunities, and take the next step in your professional journey today.
        </p>

        <div className="search-container">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Find your dream jobs" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <button><FaSearch size={20} /></button>
          </div>
        </div>

        <div className="tags-container" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '30px' }}>
          <button className="nav-btn" onClick={() => scrollTags('left')}><FaArrowLeft size={18} /></button>
          <div
            ref={tagBarRef}
            style={{
              display: 'flex',
              gap: '15px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              width: '630px', // 3 tags * 200px + 2 gaps * 15px
              maxWidth: '100%',
              whiteSpace: 'nowrap',
              scrollSnapType: 'x mandatory',
            }}
          >
            {jobTags.map(tag => (
              <button
                key={tag}
                className="tag"
                style={{
                  background: selectedTag === tag ? '#6e46ba' : 'white',
                  color: selectedTag === tag ? 'white' : '#333',
                  borderColor: selectedTag === tag ? '#6e46ba' : '#e0e0e0',
                  fontWeight: selectedTag === tag ? 600 : 400,
                  minWidth: '180px',
                  maxWidth: '200px',
                  flex: '0 0 200px',
                  scrollSnapAlign: 'start',
                }}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
          <button className="nav-btn" onClick={() => scrollTags('right')}><FaArrowRight size={18} /></button>
        </div>
      </div>

      <div className="job-section" style={{ marginTop: '80px' }}>
        {searchTerm === '' && (
          <div className="section-title">
            <h2>
              <span className="highlight">Latest and Top</span> Job Openings
            </h2>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          <button className="nav-btn" onClick={() => scrollJobCards('left')} style={{ zIndex: 2, marginRight: 10 }}><FaArrowLeft size={22} /></button>
          <div
            className="job-cards"
            ref={jobCardsRef}
            style={{
              display: 'flex',
              gap: '25px',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              width: '1080px', // 3 cards * 340px (card+gap)
              maxWidth: '100%',
              padding: '20px 0',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job, idx) => (
                <div
                  className="job-card"
                  key={job.id}
                  style={{
                    minWidth: '340px',
                    maxWidth: '340px',
                    flex: '0 0 340px',
                    scrollSnapAlign: 'start',
                  }}
                >
                  <div className="job-date">{job.postedDate}</div>
                  <div className="company-info">
                    <div className="company-logo">
                      {/* Show logo image or SVG if available, else fallback to initial letter */}
                      {(() => {
                        const logo = job.logo;
                        if (typeof logo === 'string' && logo.startsWith('http')) {
                          // If logo is a URL
                          return <img src={logo} alt={job.company} style={{ width: 48, height: 48, borderRadius: '50%' }} />;
                        } else if (logo === 'google') {
                          return (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px">
                              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                            </svg>
                          );
                        } else if (logo === 'microsoft') {
                          return (
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 21 21">
                              <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                              <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                              <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                              <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                            </svg>
                          );
                        } else {
                          // Fallback to initial letter
                          return (
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="24" cy="24" r="20" stroke="#8B5CF6" strokeWidth="2" fill="white"/>
                              <text x="24" y="29" fontSize="16" fontWeight="bold" fill="#8B5CF6" textAnchor="middle">{logo}</text>
                            </svg>
                          );
                        }
                      })()}
                    </div>
                    <div className="company-details">
                      <div className="company-name">{job.company}</div>
                      <div className="company-location">{job.location}</div>
                    </div>
                  </div>
                  <h3 className="job-title">{job.position}</h3>
                  <p className="job-desc">{job.description}</p>
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
                    <button className="save-btn" onClick={(e) => handleSaveClick(e, job)}>
                      Save for Later
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                minWidth: '340px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#888',
                fontSize: '18px',
                height: '220px',
                textAlign: 'center',
              }}>
                No jobs available.
              </div>
            )}
          </div>
          <button className="nav-btn" onClick={() => scrollJobCards('right')} style={{ zIndex: 2, marginLeft: 10 }}><FaArrowRight size={22} /></button>
        </div>
        {searchTerm !== '' && (
          <div className="section-title">
            <h2>
              <span className="highlight">Latest and Top</span> Job Openings
            </h2>
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      {showJobDetails && selectedJob && (
        <div className="modal-overlay" onClick={closeJobDetails}>
          <div className="job-details-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeJobDetails}>
              <FaTimes />
            </button>
            
            <div className="job-details-header">
              <div className="job-details-logo">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="48" height="48" rx="10" fill="#f1f5f9"/>
                  <text x="24" y="32" fontSize="20" fontWeight="bold" textAnchor="middle">{selectedJob.company[0]}</text>
                </svg>
              </div>
              <div className="company-info-block">
                <div className="job-details-company-name">{selectedJob.company}</div>
                <div className="job-details-company-desc">{companies.find(c => c.id === selectedJob.companyId)?.description || 'Leading innovator in the tech industry.'}</div>
              </div>
            </div>

            <div className='job-details-main'>
              <h1 className="job-details-title">{selectedJob.position}</h1>

              <div className="job-details-meta">
                <span className="meta-tag positions-tag">{selectedJob.positions} Positions</span>
                <span className="meta-tag time-tag">{selectedJob.type}</span>
                {selectedJob.salary && <span className="meta-tag salary-tag">{selectedJob.salary}</span>}
              </div>

              <div className="job-details-body">
                <div className="job-details-section">
                  <h2 className="job-details-section-title">Job Description</h2>
                  <p className="job-details-section-content">{selectedJob.description}</p>
                </div>

                <div className="job-details-section">
                  <h2 className="job-details-section-title">Requirements</h2>
                  <ul className="job-details-req-list">
                    {Array.isArray(selectedJob.requirements) && selectedJob.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="job-details-section">
                  <h2 className="job-details-section-title">Experience</h2>
                  <p className="job-details-section-content">{selectedJob.experience || 'Not specified'}</p>
                </div>
              </div>
            </div>
            
            <div className="job-details-footer">
              <button className="apply-now-btn" onClick={() => handleApplyNow(selectedJob)}>
                Apply Now
              </button>
            </div>
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
                <span className="news-date">April 05, 2023</span>
                <h3 className="news-title">Who's Thriving in Remote Work</h3>
                <p className="news-excerpt">New research shows that remote work isn't a one-size-fits-all solution. Discover who benefits most and how to make it work for your team.</p>
                <a 
                  href="https://hbr.org/2023/04/the-surprising-truth-about-whos-thriving-in-remote-work" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="read-more"
                >
                  Read more <FaArrowRight size={12} />
                </a>
              </div>
            </div>
            
            <div className="news-card">
              <div className="news-image" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80")' }}></div>
              <div className="news-content">
                <span className="news-date">January 20, 2024</span>
                <h3 className="news-title">What Are AI Skills and How to Get Them</h3>
                <p className="news-excerpt">Artificial intelligence is changing the job market. Learn about the most in-demand AI skills and how you can start building them today.</p>
                <a 
                  href="https://www.coursera.org/articles/ai-skills" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="read-more"
                >
                  Read more <FaArrowRight size={12} />
                </a>
              </div>
            </div>
            
            <div className="news-card">
              <div className="news-image" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1579389083078-4e7018379f7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80")' }}></div>
              <div className="news-content">
                <span className="news-date">February 15, 2024</span>
                <h3 className="news-title">Top 10 Soft Skills for the Workplace</h3>
                <p className="news-excerpt">Beyond technical abilities, employers are looking for crucial soft skills. See the top 10 skills that can help you succeed in any role.</p>
                <a 
                  href="https://www.indeed.com/career-advice/resumes-cover-letters/soft-skills" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="read-more"
                >
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
            {companies.length > 0 ? (
              companies.map(company => (
                <div className="company-card" key={company.id}>
                  <div className="company-logo-large">
                    {/* Render logo as before */}
                    {(() => {
                      if (company.logo === 'google') {
                        return (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="80px" height="80px">
                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                          </svg>
                        );
                      } else if (company.logo === 'microsoft') {
                        return (
                          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 21 21">
                            <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                            <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                            <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                            <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                          </svg>
                        );
                      } else if (typeof company.logo === 'string' && company.logo.startsWith('http')) {
                        return <img src={company.logo} alt={company.name} style={{ width: 80, height: 80, borderRadius: '50%' }} />;
                      } else {
                        return (
                          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="40" cy="40" r="33" stroke="#8B5CF6" strokeWidth="3" fill="white"/>
                            <text x="40" y="48" fontSize="24" fontWeight="bold" fill="#8B5CF6" textAnchor="middle">{company.name.charAt(0)}</text>
                          </svg>
                        );
                      }
                    })()}
                  </div>
                  <h3 className="company-title">{company.name}</h3>
                  <p className="company-industry">{company.industry || 'Industry'}</p>
                  <span className="open-positions">{company.openPositions || 'N/A'} Open Positions</span>
                  <button className="action-button details-button" style={{ marginTop: 16 }} onClick={() => handleCompanyDetailsClick(company)}>Details</button>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#888', padding: '40px 0', fontSize: '18px', width: '100%' }}>
                No companies available.
              </div>
            )}
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
              <Link to="/career-resource/resume-building" className="resource-link">
                Learn more <FaArrowRight size={12} />
              </Link>
            </div>
            
            <div className="resource-card">
              <div className="resource-icon">🎯</div>
              <h3 className="resource-title">Interview Preparation</h3>
              <p className="resource-description">Comprehensive guides and tips to help you ace your job interviews, from research to follow-up.</p>
              <Link to="/career-resource/interview-preparation" className="resource-link">
                Learn more <FaArrowRight size={12} />
              </Link>
            </div>
            
            <div className="resource-card">
              <div className="resource-icon">💼</div>
              <h3 className="resource-title">Salary Negotiation</h3>
              <p className="resource-description">Expert advice on how to negotiate your salary and benefits package to maximize your compensation.</p>
              <Link to="/career-resource/salary-negotiation" className="resource-link">
                Learn more <FaArrowRight size={12} />
              </Link>
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

      {/* Company Details Modal */}
      {showCompanyModal && selectedCompany && (
        <div className="modal-overlay" onClick={closeCompanyModal}>
          <div className="company-modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeCompanyModal} style={{ alignSelf: 'flex-end' }}>
              <FaTimes />
            </button>
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
                <span className="company-modal-tag positions-tag">{selectedCompany.openPositions || 0} Positions</span>
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
              <button className="apply-now-btn" onClick={() => { setApplyTarget(selectedCompany); setShowApplyModal(true); }}>
                Apply Now
              </button>
            </div>
            {showApplyModal && showCompanyModal && (
              <ConfirmApplyModal
                open={showApplyModal}
                onClose={handleCloseApplyModal}
                onConfirm={handleConfirmApply}
                message="Are you sure you want to apply?"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
