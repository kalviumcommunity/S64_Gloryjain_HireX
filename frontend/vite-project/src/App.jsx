import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/login';
import Signup from './components/auth/signup';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Browse from './pages/Browse';
import JobDetails from './pages/JobDetails';
import Jobs from './pages/Jobs';
import StudentJobs from './pages/StudentJobs';
import NewJob from './pages/NewJob';
import Companies from './pages/Companies';
import NewCompany from './pages/NewCompany';
import CompanySetup from './pages/CompanySetup';
import JobApplicants from './pages/JobApplicants';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleBasedRoute from './components/auth/RoleBasedRoute';

function App() {
  // For debugging - log that the App component has rendered
  console.log("App component rendered");
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/job-details/:id" element={<JobDetails />} />
        
        {/* Protected routes that require login */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          
          {/* Jobs route - dynamically rendered based on user role */}
          <Route path="/jobs" element={
            <RoleSwitchedRoute 
              studentComponent={<StudentJobs />} 
              recruiterComponent={<Jobs />} 
            />
          } />
          
          {/* Recruiter-only routes */}
          <Route element={<RoleBasedRoute allowedRoles={['recruiter']} />}>
            <Route path="/new-job" element={<NewJob />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/new-company" element={<NewCompany />} />
            <Route path="/company-setup" element={<CompanySetup />} />
            <Route path="/job-applicants" element={<JobApplicants />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

// Component that renders different content based on user role
const RoleSwitchedRoute = ({ studentComponent, recruiterComponent }) => {
  const [userRole, setUserRole] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Get user from localStorage
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage) {
      const user = JSON.parse(userFromStorage);
      setUserRole(user.role);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Render component based on user role
  return userRole === 'student' ? studentComponent : recruiterComponent;
};

export default App;
