import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  
  const [identifier, setIdentifier] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setMessage('');
      setError('');
      setLoading(true);
      
      const input = identifier.trim().toLowerCase();
      
      // Check if the input is an email
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
      
      let emailToReset;
      
      if (isEmail) {
        emailToReset = input;
      } else {
        // Input is a username, find associated email
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", input));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          throw new Error("No user found with this username");
        }
        
        // Get user email from the document
        emailToReset = querySnapshot.docs[0].data().email;
      }
      
      // Send password reset email
      await resetPassword(emailToReset);
      
      setMessage('Check your email for password reset instructions');
    } catch (error) {
      console.error('Password reset error:', error);
      
      if (error.code === 'auth/user-not-found' || error.message === "No user found with this username") {
        setError('No account found with that email or username');
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <div>
        <h2>Reset your password</h2>
        <p>
          Enter your email or username and we'll send you instructions to reset your password.
        </p>
      </div>
      
      {error && (
        <div role="alert">
          <span>{error}</span>
        </div>
      )}
      
      {message && (
        <div role="alert">
          <span>{message}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="identifier">Email or Username</label>
          <input
            id="identifier"
            name="identifier"
            type="text"
            required
            placeholder="Email or Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Reset Password'}
          </button>
        </div>
        
        <div>
          <Link to="/login">
            Back to sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;