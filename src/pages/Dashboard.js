import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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
  
  const goToProfile = () => {
    navigate('/profile');
  };
  
  return (
    <div>
      <h2>Dashboard</h2>
      
      {error && (
        <div role="alert">
          <span>{error}</span>
        </div>
      )}
      
      <div>
        <h3>Profile</h3>
        <p><strong>Email:</strong> {currentUser.email}</p>
        <p><strong>Nickname:</strong> {currentUser.displayName}</p>
        
        <button onClick={goToProfile}>
          Edit Profile
        </button>
      </div>
      
      <button onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
};

export default Dashboard;