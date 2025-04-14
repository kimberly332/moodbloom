import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

// Import our theme styles
import { colors, typography, spacing, borders, shadows, transitions } from '../../styles/theme';

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
  
  // Add shake animation
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
  
  // Styles for the login page
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.md,
      background: `linear-gradient(135deg, ${colors.background.default} 0%, ${colors.background.paper} 100%)`,
    },
    card: {
      width: '100%',
      maxWidth: '480px',
      padding: spacing.xl,
      backgroundColor: colors.background.paper,
      borderRadius: borders.radius.large,
      boxShadow: shadows.large,
      animation: shake ? 'shake 0.6s cubic-bezier(.36,.07,.19,.97) both' : 'fadeIn 0.6s ease',
    },
    logoContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: spacing.xl,
    },
    logo: {
      width: '64px',
      height: '64px',
    },
    title: {
      textAlign: 'center',
      marginBottom: '24px',
      background: 'linear-gradient(45deg, #9D4EDD 30%, #C77DFF 90%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontSize: typography.fontSize.xxl,
      fontWeight: typography.fontWeight.semiBold,
    },
    form: {
      width: '100%',
    },
    formGroup: {
      marginBottom: spacing.md,
    },
    formHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    label: {
      display: 'block',
      marginBottom: spacing.xs,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      color: colors.text.secondary,
    },
    inputContainer: {
      position: 'relative',
    },
    input: {
      width: '100%',
      padding: `${spacing.sm} ${spacing.md}`,
      paddingLeft: spacing.xl,
      backgroundColor: colors.background.elevated,
      border: `${borders.width.thin} solid rgba(255, 255, 255, 0.1)`,
      borderRadius: borders.radius.medium,
      color: colors.text.primary,
      fontSize: typography.fontSize.md,
      transition: `all ${transitions.short} ease`,
    },
    icon: {
      position: 'absolute',
      left: spacing.sm,
      top: '50%',
      transform: 'translateY(-50%)',
      color: colors.text.secondary,
    },
    forgotPassword: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
      textDecoration: 'none',
      transition: `color ${transitions.short} ease`,
    },
    button: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      padding: `${spacing.sm} ${spacing.lg}`,
      background: colors.gradients.primary,
      color: colors.primary.contrastText,
      border: 'none',
      borderRadius: borders.radius.medium,
      cursor: 'pointer',
      fontWeight: typography.fontWeight.medium,
      fontSize: typography.fontSize.md,
      transition: `all ${transitions.short} ease`,
      boxShadow: shadows.small,
      marginBottom: spacing.lg,
    },
    secondaryButton: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      padding: `${spacing.sm} ${spacing.lg}`,
      background: 'transparent',
      color: colors.primary.light,
      border: `${borders.width.thin} solid ${colors.primary.light}`,
      borderRadius: borders.radius.medium,
      cursor: 'pointer',
      fontWeight: typography.fontWeight.medium,
      fontSize: typography.fontSize.md,
      transition: `all ${transitions.short} ease`,
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      margin: `${spacing.md} 0`,
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    dividerText: {
      padding: `0 ${spacing.sm}`,
      color: colors.text.secondary,
      fontSize: typography.fontSize.sm,
    },
    errorAlert: {
      backgroundColor: 'rgba(255, 82, 82, 0.1)',
      color: colors.error,
      border: `${borders.width.thin} solid ${colors.error}`,
      padding: `${spacing.sm} ${spacing.md}`,
      borderRadius: borders.radius.medium,
      fontSize: typography.fontSize.sm,
      marginBottom: spacing.md,
      display: 'flex',
      alignItems: 'center',
    },
    errorIcon: {
      marginRight: spacing.xs,
    }
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoContainer}>
          <svg width="64" height="64" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={styles.logo}>
            <path d="M40 10C23.4315 10 10 23.4315 10 40C10 56.5685 23.4315 70 40 70C56.5685 70 70 56.5685 70 40C70 23.4315 56.5685 10 40 10Z" fill="#1E1E1E" stroke="#9D4EDD" strokeWidth="2"/>
            <path d="M40 15C26.1929 15 15 26.1929 15 40C15 53.8071 26.1929 65 40 65C53.8071 65 65 53.8071 65 40C65 26.1929 53.8071 15 40 15Z" fill="#1E1E1E"/>
            <path d="M48 30C48 34.4183 44.4183 38 40 38C35.5817 38 32 34.4183 32 30C32 25.5817 35.5817 22 40 22C44.4183 22 48 25.5817 48 30Z" fill="#9D4EDD"/>
            <path d="M28 47C28 51.4183 24.4183 55 20 55C15.5817 55 12 51.4183 12 47C12 42.5817 15.5817 39 20 39C24.4183 39 28 42.5817 28 47Z" fill="#FFACC7"/>
            <path d="M68 47C68 51.4183 64.4183 55 60 55C55.5817 55 52 51.4183 52 47C52 42.5817 55.5817 39 60 39C64.4183 39 68 42.5817 68 47Z" fill="#D6A4FF"/>
          </svg>
        </div>
        
        <h2 style={styles.title}>Welcome back to MoodBloom</h2>
        
        {error && (
          <div style={styles.errorAlert} role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={styles.errorIcon}>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="identifier">Email or Username</label>
            <div style={styles.inputContainer}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={styles.icon}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="email"
                required
                placeholder="Your email or username"
                value={formData.identifier}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <div style={styles.formHeader}>
              <label style={styles.label} htmlFor="password">Password</label>
              <Link to="/forgot-password" style={styles.forgotPassword}>
                Forgot password?
              </Link>
            </div>
            <div style={styles.inputContainer}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={styles.icon}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Your password"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          
          <div style={styles.divider}>
            <div style={styles.dividerLine}></div>
            <span style={styles.dividerText}>New to MoodBloom?</span>
            <div style={styles.dividerLine}></div>
          </div>
          
          <Link to="/signup" style={{ textDecoration: 'none' }}>
            <button type="button" style={styles.secondaryButton}>
              Create an account
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;