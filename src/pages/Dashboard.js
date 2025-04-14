import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Import styles
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  
  const handleLogout = async () => {
    setError('');
    
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      setError('Failed to log out');
      console.error('Logout error:', error);
    }
  };
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h2 className="dashboard-title">Dashboard</h2>
        
        {error && (
          <div className="dashboard-alert error" role="alert">
            <span>{error}</span>
          </div>
        )}
        
        <div className="dashboard-profile">
          <h3 className="dashboard-section-title">Profile</h3>
          <p className="dashboard-profile-info"><strong>Email:</strong> {currentUser.email}</p>
          <p className="dashboard-profile-info"><strong>Nickname:</strong> {currentUser.displayName}</p>
        </div>
        
        <button className="dashboard-logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Dashboard;