import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import {
  AuthContainer,
  AuthCard,
  LogoContainer,
  FormContainer,
  FormGroup,
  FormLabel,
  InputField,
  PrimaryButton,
  SecondaryButton,
  ErrorAlert,
  DividerWithText,
  TextLink,
  Icons
} from '../ui/StyledComponents';

const StyledLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const auth = getAuth();
  
  const [formData, setFormData] = useState({
    identifier: '', // Can be email or username
    password: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  
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
      
      // Shake animation for error
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setLoading(false);
    }
  };
  
  const cardStyle = {
    animation: shake ? 'shake 0.6s cubic-bezier(.36,.07,.19,.97) both' : 'none',
  };
  
  // Add shake animation to document
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes shake {
        10%, 90% {
          transform: translate3d(-1px, 0, 0);
        }
        
        20%, 80% {
          transform: translate3d(2px, 0, 0);
        }
        
        30%, 50%, 70% {
          transform: translate3d(-4px, 0, 0);
        }
        
        40%, 60% {
          transform: translate3d(4px, 0, 0);
        }
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);
  
  return (
    <AuthContainer>
      <AuthCard style={cardStyle}>
        <LogoContainer>
          <Icons.Logo size={64} />
        </LogoContainer>
        
        <h2 style={{ 
          textAlign: 'center',
          marginBottom: '24px',
          background: 'linear-gradient(45deg, #9D4EDD 30%, #C77DFF 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Welcome back to MoodBloom
        </h2>
        
        {error && (
          <ErrorAlert>
            <Icons.Alert style={{ marginRight: '8px' }} />
            <span>{error}</span>
          </ErrorAlert>
        )}
        
        <FormContainer onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel htmlFor="identifier" required>Email or Username</FormLabel>
            <InputField
              id="identifier"
              name="identifier"
              type="text"
              autoComplete="email"
              required
              placeholder="Your email or username"
              value={formData.identifier}
              onChange={handleChange}
              icon={<Icons.Email />}
            />
          </FormGroup>
          
          <FormGroup>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <FormLabel htmlFor="password" required>Password</FormLabel>
              <Link to="/forgot-password" style={{ 
                fontSize: '14px',
                color: 'var(--color-text-secondary)'
              }}>
                Forgot password?
              </Link>
            </div>
            <InputField
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Your password"
              value={formData.password}
              onChange={handleChange}
              icon={<Icons.Lock />}
            />
          </FormGroup>
          
          <FormGroup marginBottom="32px">
            <PrimaryButton
              type="submit"
              disabled={loading}
              fullWidth
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </PrimaryButton>
          </FormGroup>
          
          <DividerWithText>New to MoodBloom?</DividerWithText>
          
          <FormGroup>
            <Link to="/signup" style={{ textDecoration: 'none' }}>
              <SecondaryButton fullWidth>
                Create an account
              </SecondaryButton>
            </Link>
          </FormGroup>
        </FormContainer>
      </AuthCard>
    </AuthContainer>
  );
};

export default StyledLogin;