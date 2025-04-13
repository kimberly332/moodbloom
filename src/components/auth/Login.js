import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const auth = getAuth();
  
  const [formData, setFormData] = useState({
    identifier: '', // Can be email or username
    password: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      
      const identifier = formData.identifier.trim().toLowerCase();
      const password = formData.password;
      
      // Check if the identifier is an email
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
      
      if (isEmail) {
        // Login with email
        await login(identifier, password);
      } else {
        // Login with username
        // Find user document by username
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", identifier));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          throw new Error("No user found with this username");
        }
        
        // Get user email from the document
        const userDoc = querySnapshot.docs[0];
        const userEmail = userDoc.data().email;
        
        // Login with email
        await signInWithEmailAndPassword(auth, userEmail, password);
      }
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.message === "No user found with this username") {
        setError('Invalid login credentials');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many failed login attempts. Please try again later or reset your password.');
      } else {
        setError('Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h2>Sign in to MoodBloom</h2>
      
      {error && (
        <div role="alert">
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div>
          <div>
            <label htmlFor="identifier">Email or Username</label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              autoComplete="email"
              required
              placeholder="Email or Username"
              value={formData.identifier}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div>
          <Link to="/forgot-password">
            Forgot your password?
          </Link>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
        
        <div>
          <span>Don't have an account? </span>
          <Link to="/signup">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;