import React from "react";
import { FaArrowRight, FaArrowLeft, FaSearch } from "react-icons/fa";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import Navbar from "../components/auth/Navbar";

const Home = () => {
  return (
    <div className="home-container">
      <style>
        {`
          .home-container {
            font-family: Arial, sans-serif;
            background: #ffffff;
            min-height: 100vh;
            padding: 0;
            margin: 0;
          }

          .top-section {
            text-align: center;
            padding: 40px 20px 60px;
            background: white;
          }

          .badge {
            display: inline-block;
            font-size: 14px;
            color: #ff0000;
            margin-bottom: 20px;
          }

          h1 {
            font-size: 42px;
            color: #000;
            margin: 0 0 15px;
            font-weight: 600;
            line-height: 1.2;
          }

          .highlight {
            color: #7b2cbf;
          }

          .subtext {
            font-size: 16px;
            color: #666;
            margin: 20px auto;
            max-width: 600px;
            line-height: 1.6;
          }

          .search-container {
            max-width: 600px;
            margin: 30px auto;
            position: relative;
          }

          .search-box {
            display: flex;
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }

          .search-box input {
            flex: 1;
            padding: 15px 20px;
            font-size: 16px;
            border: none;
            outline: none;
          }

          .search-box button {
            background: #7b2cbf;
            color: white;
            border: none;
            padding: 0 25px;
            cursor: pointer;
            transition: background 0.3s;
          }

          .search-box button:hover {
            background: #6a24a6;
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
            color: #7b2cbf;
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
            background: #7b2cbf;
            color: white;
            border-color: #7b2cbf;
          }

          .job-section {
            padding: 40px 20px;
            max-width: 1200px;
            margin: 0 auto;
          }

          .section-title {
            text-align: center;
            margin-bottom: 40px;
          }

          .section-title h2 {
            font-size: 32px;
            color: #000;
            margin: 0;
          }

          .job-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
            padding: 20px;
          }

          .job-card {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 12px;
            padding: 25px;
            transition: all 0.3s;
          }

          .job-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          }

          .company-info {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
          }

          .company-logo {
            width: 50px;
            height: 50px;
            border-radius: 8px;
            margin-right: 15px;
            object-fit: contain;
          }

          .company-name {
            font-size: 18px;
            font-weight: 600;
            color: #333;
          }

          .company-location {
            font-size: 14px;
            color: #666;
          }

          .job-title {
            font-size: 20px;
            font-weight: 600;
            color: #000;
            margin: 10px 0;
          }

          .job-desc {
            font-size: 14px;
            color: #666;
            margin-bottom: 20px;
            line-height: 1.5;
          }

          .job-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 15px;
            border-top: 1px solid #e0e0e0;
            font-size: 14px;
            color: #666;
          }

          .positions {
            color: #7b2cbf;
            font-weight: 500;
          }

          .footer {
            background: #ffffff;
            border-top: 1px solid #eee;
            padding: 20px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
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
            background: #7b2cbf;
            border-color: #7b2cbf;
            color: white;
          }

          .logo-x {
            color: #ff0000;
            font-weight: bold;
          }
        `}
      </style>

      <Navbar />

      <div className="top-section">
        <p className="badge">No.1 Job Hunt Website</p>
        <h1>
          Search, Apply & <br /> Get Your <span className="highlight">Dream jobs</span>
        </h1>
        <p className="subtext">
          "Discover top job opportunities that match your skills and aspirations. Connect with leading companies and apply effortlessly. Your dream job is just a click away!"
        </p>

        <div className="search-container">
          <div className="search-box">
            <input type="text" placeholder="Find your dream jobs" />
            <button><FaSearch size={20} /></button>
          </div>
        </div>

        <div className="tags-container">
          <button className="nav-btn"><FaArrowLeft size={18} /></button>
          <button className="tag">Data Engineer</button>
          <button className="tag">Data Science</button>
          <button className="tag">Graphic designer</button>
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
              company: "Google",
              logo: "https://www.google.com/favicon.ico",
              title: "FullStack Developer",
              type: "Full Time",
              location: "India",
              salary: "45LPA",
              positions: 2,
              desc: "We're looking for a Senior Full-Stack Developer who can write clean, efficient, and scalable code..."
            },
            {
              company: "Microsoft India",
              logo: "https://www.microsoft.com/favicon.ico",
              title: "FullStack Developer",
              type: "Full Time",
              location: "India",
              salary: "24LPA",
              positions: 3,
              desc: "Seeking a Senior Full-Stack Developer skilled in building robust frontend and backend solutions..."
            },
            {
              company: "Amazon",
              logo: "https://www.amazon.com/favicon.ico",
              title: "Frontend Developer",
              type: "Full Time",
              location: "India",
              salary: "30LPA",
              positions: 2,
              desc: "Looking for a Frontend Developer with strong skills in React and TypeScript..."
            },
          ].map((job, idx) => (
            <div className="job-card" key={idx}>
              <div className="company-info">
                <img src={job.logo} alt={job.company} className="company-logo" />
                <div>
                  <div className="company-name">{job.company}</div>
                  <div className="company-location">{job.location}</div>
                </div>
              </div>
              <h3 className="job-title">{job.title}</h3>
              <p className="job-desc">{job.desc}</p>
              <div className="job-meta">
                <span className="positions">{job.positions} Positions</span>
                <span>{job.type}</span>
                <span>{job.salary}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="footer">
        <div className="footer-left">
          2024 Hire<span className="logo-x">X</span>. All rights reserved.
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
