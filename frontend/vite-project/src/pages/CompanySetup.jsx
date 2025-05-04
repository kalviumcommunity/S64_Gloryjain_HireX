import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/auth/Navbar';

const CompanySetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  
  // Check if in edit mode
  const isEditMode = location.state?.editMode === true;
  const companyData = location.state?.companyData || null;
  const initialCompanyName = isEditMode ? companyData.name : (location.state?.companyName || '');
  
  const [formData, setFormData] = useState({
    companyName: initialCompanyName,
    description: isEditMode ? companyData.description || '' : '',
    website: isEditMode ? companyData.website || '' : '',
    location: isEditMode ? companyData.location || '' : '',
    logo: null
  });
  
  const [successMessage, setSuccessMessage] = useState('');
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      logo: e.target.files[0]
    });
  };
  
  const handleChooseFile = () => {
    fileInputRef.current.click();
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate that there's at least a company name
    if (!formData.companyName || formData.companyName.trim() === '') {
      setSuccessMessage('Please provide a company name');
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }
    
    // Create company data object from form
    const newCompanyData = {
      id: isEditMode ? companyData?.id : null,
      name: formData.companyName,
      description: formData.description,
      website: formData.website,
      location: formData.location,
      logo: null // Would normally handle file upload and store the URL/path
    };
    
    // Navigate to companies page with success notification and new company data
    navigate('/companies', { 
      state: { 
        notification: isEditMode 
          ? 'Company information updated.' 
          : 'Company registered successfully.',
        newCompany: newCompanyData,
        isEdit: isEditMode
      } 
    });
  };
  
  const handleBack = () => {
    // Navigate directly to companies page without sending any company data
    navigate('/companies');
  };
  
  return (
    <div className="company-setup-page">
      <Navbar />
      <div className="navbar-spacer"></div>
      
      <div className="company-setup-container">
        <div className="company-setup-header">
          <button onClick={handleBack} className="back-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
          <h1 className="setup-title">
            {isEditMode ? 'Edit Company' : 'Company Setup'}
          </h1>
        </div>
        
        <div className="company-setup-form-container">
          <form onSubmit={handleSubmit} className="company-setup-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="companyName">Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="logo">Logo</label>
              <div className="file-input-container">
                <button type="button" className="file-button" onClick={handleChooseFile}>Choose File</button>
                <span className="file-name">{formData.logo ? formData.logo.name : 'No file chosen'}</span>
                <input
                  type="file"
                  id="logo"
                  name="logo"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden-file-input"
                  ref={fileInputRef}
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={() => navigate('/companies')}>
                Cancel
              </button>
              <button type="submit" className="update-button">
                {isEditMode ? 'Update Company' : 'Create Company'}
              </button>
            </div>
          </form>
        </div>
        
        {successMessage && (
          <div className="message-toast">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            {successMessage}
          </div>
        )}
      </div>
      
      <style jsx="true">{`
        .company-setup-page {
          min-height: 100vh;
          background: #f5f7fb;
        }
        
        .navbar-spacer {
          height: 60px;
        }
        
        .company-setup-container {
          max-width: 800px;
          margin: 20px auto;
          padding: 0 20px;
          position: relative;
        }
        
        .company-setup-header {
          display: flex;
          align-items: center;
          margin-bottom: 30px;
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
          text-decoration: none;
        }
        
        .back-button svg {
          width: 20px;
          height: 20px;
          color: #6b7280;
        }
        
        .setup-title {
          font-size: 28px;
          font-weight: 600;
          margin-left: 12px;
          color: #111827;
        }
        
        .company-setup-form-container {
          background: white;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #111827;
        }
        
        .form-group input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .file-input-container {
          display: flex;
          align-items: center;
        }
        
        .file-button {
          padding: 8px 12px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
        }
        
        .file-name {
          margin-left: 10px;
          font-size: 14px;
          color: #6b7280;
        }
        
        .hidden-file-input {
          display: none;
        }
        
        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }
        
        .cancel-button {
          padding: 10px 16px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          color: #4b5563;
          cursor: pointer;
        }
        
        .cancel-button:hover {
          background: #f9fafb;
        }
        
        .update-button {
          padding: 10px 16px;
          background-color: #111827;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }
        
        .update-button:hover {
          background: #1f2937;
        }
        
        .success-message {
          position: fixed;
          bottom: 20px;
          right: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          background: #2E7D32;
          color: white;
          border-radius: 6px;
          padding: 12px 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }
        
        .message-toast {
          position: fixed;
          bottom: 20px;
          right: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          background: #111827;
          color: white;
          border-radius: 6px;
          padding: 12px 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }
      `}</style>
    </div>
  );
};

export default CompanySetup; 