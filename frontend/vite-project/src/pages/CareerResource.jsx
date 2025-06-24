import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheck } from 'react-icons/fa';
import Navbar from '../components/auth/Navbar';

const CareerResource = () => {
  const { resourceType } = useParams();
  const navigate = useNavigate();

  const resourceData = {
    'resume-building': {
      title: 'Resume Building Guide',
      icon: '📝',
      description: 'Create a compelling resume that stands out to employers',
      sections: [
        {
          title: 'Essential Resume Components',
          content: [
            'Professional Summary',
            'Work Experience',
            'Education',
            'Skills',
            'Achievements',
            'Certifications'
          ]
        },
        {
          title: 'Best Practices',
          content: [
            'Keep it concise and focused (1-2 pages)',
            'Use action verbs to describe achievements',
            'Quantify your accomplishments with numbers',
            'Tailor your resume for each job application',
            'Use a clean, professional format',
            'Proofread thoroughly for errors'
          ]
        },
        {
          title: 'Common Mistakes to Avoid',
          content: [
            'Including irrelevant information',
            'Using unprofessional email addresses',
            'Listing outdated or irrelevant skills',
            'Including personal information like age or photo',
            'Using inconsistent formatting',
            'Submitting without proofreading'
          ]
        }
      ]
    },
    'interview-preparation': {
      title: 'Interview Preparation Guide',
      icon: '🎯',
      description: 'Master the art of job interviews and land your dream role',
      sections: [
        {
          title: 'Before the Interview',
          content: [
            'Research the company thoroughly',
            'Review the job description',
            'Prepare your questions',
            'Plan your outfit and route',
            'Practice common interview questions',
            'Prepare your portfolio or work samples'
          ]
        },
        {
          title: 'During the Interview',
          content: [
            'Arrive 10-15 minutes early',
            'Maintain good body language',
            'Listen carefully to questions',
            'Provide specific examples',
            'Ask thoughtful questions',
            'Take notes if appropriate'
          ]
        },
        {
          title: 'After the Interview',
          content: [
            'Send a thank-you email',
            'Follow up if no response',
            'Reflect on your performance',
            'Update your application materials',
            'Keep the conversation going',
            'Stay professional on social media'
          ]
        }
      ]
    },
    'salary-negotiation': {
      title: 'Salary Negotiation Guide',
      icon: '💼',
      description: 'Learn how to negotiate your worth and maximize your compensation',
      sections: [
        {
          title: 'Preparation Steps',
          content: [
            'Research market rates for your role',
            'Know your minimum acceptable salary',
            'Document your achievements and value',
            'Practice your negotiation pitch',
            'Consider total compensation package',
            'Prepare for common objections'
          ]
        },
        {
          title: 'Negotiation Strategies',
          content: [
            'Let the employer make the first offer',
            'Use specific numbers, not ranges',
            'Focus on your value to the company',
            'Consider non-monetary benefits',
            'Be prepared to walk away',
            'Get everything in writing'
          ]
        },
        {
          title: 'Common Mistakes to Avoid',
          content: [
            'Accepting the first offer',
            'Discussing salary too early',
            'Focusing only on base salary',
            'Being too aggressive or too passive',
            'Not doing your research',
            'Accepting without considering benefits'
          ]
        }
      ]
    }
  };

  const resource = resourceData[resourceType];

  if (!resource) {
    return (
      <div className="career-resource-page">
        <Navbar />
        <div className="navbar-spacer"></div>
        <div className="error-message">Resource not found</div>
      </div>
    );
  }

  return (
    <div className="career-resource-page">
      <Navbar />
      <div className="navbar-spacer"></div>
      
      <div className="resource-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back to Resources
        </button>

        <div className="resource-header">
          <div className="resource-icon-large">{resource.icon}</div>
          <h1>{resource.title}</h1>
          <p className="resource-description">{resource.description}</p>
        </div>

        <div className="resource-content">
          {resource.sections.map((section, index) => (
            <div key={index} className="resource-section">
              <h2>{section.title}</h2>
              <ul>
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <FaCheck className="check-icon" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <style>
        {`
          .career-resource-page {
            min-height: 100vh;
            background-color: #f8f9fa;
            padding-bottom: 40px;
          }

          .navbar-spacer {
            height: 60px;
          }

          .resource-container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 40px 20px;
          }

          .back-button {
            display: flex;
            align-items: center;
            gap: 8px;
            background: none;
            border: none;
            color: #6e46ba;
            font-size: 16px;
            cursor: pointer;
            padding: 8px 16px;
            border-radius: 6px;
            transition: background-color 0.3s;
          }

          .back-button:hover {
            background-color: #f0f0f0;
          }

          .resource-header {
            text-align: center;
            margin: 40px 0;
          }

          .resource-icon-large {
            font-size: 64px;
            margin-bottom: 20px;
          }

          .resource-header h1 {
            font-size: 36px;
            color: #333;
            margin-bottom: 16px;
          }

          .resource-description {
            font-size: 18px;
            color: #666;
            max-width: 600px;
            margin: 0 auto;
          }

          .resource-content {
            display: grid;
            gap: 40px;
            margin-top: 60px;
          }

          .resource-section {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          }

          .resource-section h2 {
            font-size: 24px;
            color: #333;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #f0f0f0;
          }

          .resource-section ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .resource-section li {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 0;
            font-size: 16px;
            color: #444;
            border-bottom: 1px solid #f0f0f0;
          }

          .resource-section li:last-child {
            border-bottom: none;
          }

          .check-icon {
            color: #6e46ba;
            font-size: 14px;
          }

          .error-message {
            text-align: center;
            padding: 40px;
            font-size: 18px;
            color: #666;
          }
        `}
      </style>
    </div>
  );
};

export default CareerResource; 