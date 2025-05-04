import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/auth/Navbar';

const NewCompany = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('');
  
  const handleInputChange = (e) => {
    setCompanyName(e.target.value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to company setup with the company name
    navigate('/company-setup', { state: { companyName } });
  };
  
  return (
    <div className="new-company-page">
      <Navbar />
      <div className="navbar-spacer"></div>
      
      <div className="new-company-container">
        <div className="company-form-header">
          <button onClick={() => navigate('/companies')} className="back-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
        </div>
        <div className="company-form-container">
          <h1 className="form-title">Your Company Name</h1>
          <p className="form-subtitle">What would you like to give your company name? you can change this later.</p>
          
          <form onSubmit={handleSubmit} className="company-form">
            <div className="form-group">
              <label htmlFor="companyName">Company Name</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={companyName}
                onChange={handleInputChange}
                placeholder="JobHunt, Microsoft etc."
              />
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={() => navigate('/companies')}
              >
                Cancel
              </button>
              <button type="submit" className="continue-btn">
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <style jsx="true">{`
        .new-company-page {
          min-height: 100vh;
          background: #fff;
        }
        
        .new-company-container {
          max-width: 600px;
          margin: 80px auto 0;
          padding: 20px;
        }
        
        .company-form-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          font-size: 16px;
          font-weight: 500;
          color: #4b5563;
          cursor: pointer;
          padding: 0;
        }
        
        .company-form-container {
          background: white;
          padding: 20px 0;
        }
        
        .form-title {
          font-size: 24px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 8px;
        }
        
        .form-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 30px;
        }
        
        .company-form {
          margin-top: 20px;
        }
        
        .form-group {
          margin-bottom: 30px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          font-size: 14px;
          color: #111827;
        }
        
        .form-group input {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          font-size: 14px;
          color: #111827;
        }
        
        .form-group input:focus {
          outline: none;
          border-color: #8B5CF6;
          box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
        }
        
        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 40px;
        }
        
        .cancel-btn {
          padding: 8px 16px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          color: #4b5563;
          cursor: pointer;
        }
        
        .cancel-btn:hover {
          background: #f9fafb;
        }
        
        .continue-btn {
          padding: 8px 16px;
          background: #6b7280;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          color: white;
          cursor: pointer;
        }
        
        .continue-btn:hover {
          background: #4b5563;
        }
      `}</style>
    </div>
  );
};

export default NewCompany; 