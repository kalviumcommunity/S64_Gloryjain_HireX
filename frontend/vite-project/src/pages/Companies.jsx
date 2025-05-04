import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/auth/Navbar';
import { getAuthenticatedUser } from '../services/api';

const Companies = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  // Initialize companies from localStorage on component mount
  useEffect(() => {
    const storedCompanies = localStorage.getItem('companies');
    if (storedCompanies) {
      setCompanies(JSON.parse(storedCompanies));
    }
  }, []);

  // Check for new company data or updates from location state
  useEffect(() => {
    if (location.state?.newCompany) {
      // Only proceed if the newCompany contains actual valid data (at least a name)
      if (location.state.newCompany.name && location.state.newCompany.name.trim() !== '') {
        const newCompany = {
          ...location.state.newCompany,
          id: location.state.newCompany.id || Date.now(), // Use timestamp as a simple unique ID
          date: new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
        };
        
        // Check if it's an edit (update existing company) or new company
        if (location.state.isEdit && location.state.newCompany.id) {
          setCompanies(prevCompanies => {
            const updated = prevCompanies.map(company => 
              company.id === newCompany.id ? newCompany : company
            );
            localStorage.setItem('companies', JSON.stringify(updated));
            return updated;
          });
        } else {
          // Add new company
          setCompanies(prevCompanies => {
            const updated = [...prevCompanies, newCompany];
            localStorage.setItem('companies', JSON.stringify(updated));
            return updated;
          });
        }
      }
    }
  }, [location.state]);

  // Check for notification message from state
  useEffect(() => {
    if (location.state?.notification) {
      setNotification(location.state.notification);
      
      // Clear notification after 3 seconds
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Add event listener to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close if clicking outside the dropdown
      const dropdownElement = document.querySelector('.dropdown-menu');
      if (activeDropdown !== null && 
          dropdownElement && 
          !dropdownElement.contains(event.target) &&
          !event.target.closest('.actions-btn')) {
        setActiveDropdown(null);
      }
    };
    
    if (activeDropdown !== null) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [activeDropdown]);

  // Filter companies based on search term
  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Toggle dropdown menu
  const toggleDropdown = (e, companyId) => {
    e.stopPropagation(); // Prevent event bubbling
    e.preventDefault(); // Prevent default behavior
    
    if (activeDropdown === companyId) {
      setActiveDropdown(null);
    } else {
      // Get the button's position
      const rect = e.currentTarget.getBoundingClientRect();
      
      // Calculate dropdown position
      const newPosition = {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      };
      
      // Check if dropdown would go off screen to the right
      if (rect.left + 170 > window.innerWidth) {
        // Position to the left of the button instead
        newPosition.left = rect.right - 170 + window.scrollX;
      }
      
      setDropdownPosition(newPosition);
      setActiveDropdown(companyId);
    }
  };

  // Handle edit company
  const handleEditCompany = (e, company) => {
    e.stopPropagation(); // Prevent event bubbling
    setActiveDropdown(null); // Close dropdown
    navigate('/company-setup', { 
      state: { 
        companyName: company.name,
        editMode: true,
        companyData: company
      } 
    });
  };

  // Handle delete company
  const handleDeleteCompany = (e, companyId) => {
    e.stopPropagation(); // Prevent event bubbling
    setActiveDropdown(null); // Close dropdown
    setCompanies(prevCompanies => {
      const updated = prevCompanies.filter(company => company.id !== companyId);
      localStorage.setItem('companies', JSON.stringify(updated));
      return updated;
    });
  };

  // Render company logo based on company name or the first letter
  const renderLogo = (company) => {
    if (company.logo === 'google') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="40px" height="40px">
          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
          <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
          <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
          <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
        </svg>
      );
    } else if (company.logo === 'microsoft') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 21 21">
          <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
          <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
          <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
          <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
        </svg>
      );
    } else {
      return (
        <div className="default-company-logo">
          {company.name.charAt(0).toUpperCase()}
        </div>
      );
    }
  };

  return (
    <div className="companies-page">
      <Navbar />
      <div className="navbar-spacer"></div>
      
      <div className="companies-content">
        <div className="companies-header">
          <div className="search-filter">
            <input 
              type="text" 
              placeholder="Filter by name" 
              value={searchTerm}
              onChange={handleSearchChange}
              className="filter-input"
            />
          </div>
          <Link to="/new-company" className="new-company-btn">
            New Company
          </Link>
        </div>

        <div className="companies-table">
          <div className="table-header">
            <div className="logo-column">Logo</div>
            <div className="name-column">Name</div>
            <div className="date-column">Date</div>
            <div className="action-column">Action</div>
          </div>
          
          <div className="table-body">
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map(company => (
                <div key={company.id} className="table-row">
                  <div className="logo-column">
                    {renderLogo(company)}
                  </div>
                  <div className="name-column">{company.name}</div>
                  <div className="date-column">{company.date}</div>
                  <div className="action-column">
                    <div className="dropdown-container">
                      <button 
                        className="actions-btn" 
                        onClick={(e) => toggleDropdown(e, company.id)}
                        aria-label="Company actions"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="5" cy="12" r="1"></circle>
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="19" cy="12" r="1"></circle>
                        </svg>
                      </button>
                      {activeDropdown === company.id && (
                        <div className="dropdown-menu" style={dropdownPosition}>
                          <button 
                            className="dropdown-item"
                            onClick={(e) => handleEditCompany(e, company)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="edit-icon">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Edit
                          </button>
                          <button 
                            className="dropdown-item delete-item"
                            onClick={(e) => handleDeleteCompany(e, company.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="delete-icon">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">No companies found</div>
            )}
          </div>
        </div>
        
        <div className="companies-footer">
          <p>A list of your recent registered companies</p>
        </div>
        
        {notification && (
          <div className="notification-toast">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span>{notification}</span>
          </div>
        )}
      </div>
      
      <style jsx="true">{`
        .companies-page {
          min-height: 100vh;
          background: #f5f5f5;
        }
        
        .navbar-spacer {
          height: 60px;
        }
        
        .companies-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          position: relative;
        }
        
        .companies-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .filter-input {
          padding: 10px 16px;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          width: 240px;
          font-size: 14px;
        }
        
        .filter-input:focus {
          outline: none;
          border-color: #8B5CF6;
          box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
        }
        
        .new-company-btn {
          background-color: #111827;
          color: white;
          padding: 10px 20px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          border: none;
          cursor: pointer;
        }
        
        .new-company-btn:hover {
          background-color: #1f2937;
        }
        
        .companies-table {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-bottom: 100px;
        }
        
        .table-header {
          display: grid;
          grid-template-columns: 100px 1fr 150px 120px;
          padding: 16px;
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          font-weight: 500;
          color: #4b5563;
        }
        
        .table-row {
          display: grid;
          grid-template-columns: 100px 1fr 150px 120px;
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
          align-items: center;
        }
        
        .table-row:last-child {
          border-bottom: none;
        }
        
        .logo-column {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        
        .default-company-logo {
          width: 40px;
          height: 40px;
          background-color: #e5e7eb;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: #4b5563;
        }
        
        .name-column {
          font-weight: 500;
          color: #111827;
        }
        
        .date-column {
          color: #4b5563;
        }
        
        .action-column {
          display: flex;
          justify-content: center;
        }
        
        .dropdown-container {
          position: relative;
        }
        
        .actions-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          padding: 6px;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s ease;
        }
        
        .actions-btn:hover {
          color: #111827;
        }
        
        .dropdown-menu {
          position: fixed;
          width: 170px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 0;
          z-index: 1000;
          border: 1px solid #e5e7eb;
          overflow: visible;
        }
        
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          width: 100%;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          color: #4b5563;
          text-align: left;
          font-size: 14px;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .dropdown-item:last-child {
          border-bottom: none;
        }
        
        .dropdown-item:hover {
          background-color: #f9fafb;
        }
        
        .dropdown-item svg.edit-icon {
          color: #374151;
        }
        
        .delete-item {
          color: #dc2626;
        }
        
        .delete-item svg.delete-icon {
          color: #dc2626;
        }
        
        .no-results {
          padding: 20px;
          text-align: center;
          color: #6b7280;
        }
        
        .companies-footer {
          text-align: center;
          margin-top: 20px;
          color: #6b7280;
          font-size: 14px;
        }
        
        .notification-toast {
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
        
        .notification-toast svg {
          color: white;
        }
      `}</style>
    </div>
  );
};

export default Companies; 