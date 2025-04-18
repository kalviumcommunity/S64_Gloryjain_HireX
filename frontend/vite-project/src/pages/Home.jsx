import React from "react";
import { FaArrowRight, FaArrowLeft, FaSearch } from "react-icons/fa";
import Navbar from "../components/auth/Navbar"; // Import Navbar

const Home = () => {
  return (
    <div className="home-container">
      <style>
        {`
          .home-container {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: #f4f6f9;
            min-height: 100vh;
          }

          .top-section {
            text-align: center;
            padding: 40px 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            margin-bottom: 30px;
          }

          .badge {
            font-size: 16px;
            color: #007bff;
            text-transform: uppercase;
            margin-bottom: 10px;
          }

          h1 {
            font-size: 36px;
            color: #333;
          }

          .highlight {
            color: #28a745;
          }

          .subtext {
            font-size: 16px;
            color: #555;
            margin: 20px 0;
          }

          .search-box {
            display: flex;
            justify-content: center;
            margin-top: 20px;
          }

          .search-box input {
            padding: 12px;
            font-size: 16px;
            width: 80%;
            border-radius: 8px;
            border: 1px solid #ccc;
          }

          .search-box button {
            padding: 12px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            margin-left: 10px;
          }

          .search-box button:hover {
            background-color: #0056b3;
          }

          .tags-container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
          }

          .nav-btn {
            background: transparent;
            border: none;
            font-size: 20px;
            cursor: pointer;
          }

          .tag {
            background: #007bff;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 8px;
            margin: 0 10px;
            cursor: pointer;
          }

          .tag:hover {
            background: #0056b3;
          }

          .job-section {
            text-align: center;
            padding: 40px 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .job-cards {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
          }

          .job-card {
            background: #fff;
            padding: 20px;
            margin: 15px;
            width: 280px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            text-align: left;
            transition: transform 0.3s;
          }

          .job-card:hover {
            transform: translateY(-10px);
          }

          .job-card h3 {
            font-size: 20px;
            color: #333;
          }

          .job-card p {
            color: #777;
          }

          .job-card strong {
            font-size: 18px;
            color: #333;
          }

          .job-meta {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            font-size: 14px;
            color: #555;
          }

          .footer {
            text-align: center;
            padding: 20px;
            background: #007bff;
            color: white;
            margin-top: 40px;
          }

          .socials {
            margin-top: 10px;
          }

          .socials i {
            font-size: 24px;
            margin: 0 10px;
            cursor: pointer;
          }

          .socials i:hover {
            color: #28a745;
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

        <div className="search-box">
          <input type="text" placeholder="Find your dream jobs" />
          <button><FaSearch /></button>
        </div>

        <div className="tags-container">
          <button className="nav-btn"><FaArrowLeft /></button>
          <button className="tag">Data Engineer</button>
          <button className="tag">Data Science</button>
          <button className="tag">Graphic designer</button>
          <button className="nav-btn"><FaArrowRight /></button>
        </div>
      </div>

      <div className="job-section">
        <h2>
          <span className="highlight">Latest and Top</span> Job Openings
        </h2>
        <div className="job-cards">
          {[ 
            {
              company: "Google",
              title: "FullStack Developer",
              type: "Full Time",
              location: "India",
              salary: "45LPA",
              positions: 2,
              desc: "We're looking for a Senior Full-Stack Developer who can write clean, efficient, and scalable code..."
            },
            {
              company: "Microsoft India",
              title: "FullStack Developer",
              type: "Full Time",
              location: "India",
              salary: "24LPA",
              positions: 3,
              desc: "Seeking a Senior Full-Stack Developer skilled in building robust frontend and backend solutions..."
            },
            {
              company: "Amazon",
              title: "Frontend Developer",
              type: "Full Time",
              location: "India",
              salary: "30LPA",
              positions: 2,
              desc: "Looking for a Frontend Developer with strong skills in React and TypeScript..."
            },
          ].map((job, idx) => (
            <div className="job-card" key={idx}>
              <h3>{job.company}</h3>
              <p>{job.location}</p>
              <strong>{job.title}</strong>
              <p>{job.desc}</p>
              <div className="job-meta">
                <span>{job.positions} Positions</span>
                <span>{job.type}</span>
                <span>{job.salary}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="footer">
        <p>© 2024 Your Company. All rights reserved.</p>
        <div className="socials">
          <i className="fa fa-facebook"></i>
          <i className="fa fa-twitter"></i>
          <i className="fa fa-linkedin"></i>
        </div>
      </footer>
    </div>
  );
};

export default Home;
