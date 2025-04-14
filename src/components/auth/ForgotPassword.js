import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

// Import our theme styles
import { colors, typography, spacing, borders, shadows, transitions } from '../../styles/theme';

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
  
  // Styles
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
      animation: 'fadeIn 0.6s ease',
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
      marginBottom: '8px',
      background: 'linear-gradient(45deg, #9D4EDD 30%, #C77DFF 90%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontSize: typography.fontSize.xxl,
      fontWeight: typography.fontWeight.semiBold,
    },
    description: {
      textAlign: 'center', 
      marginBottom: '24px',
      color: colors.text.secondary,
      fontSize: typography.fontSize.md,
    },
    form: {
      width: '100%',
    },
    formGroup: {
      marginBottom: spacing.md,
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
    backLink: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: colors.text.secondary,
      fontSize: typography.fontSize.sm,
      transition: `color ${transitions.short} ease`,
      textDecoration: 'none',
    },
    backIcon: {
      marginRight: spacing.xs,
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
    successAlert: {
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      color: colors.success,
      border: `${borders.width.thin} solid ${colors.success}`,
      padding: `${spacing.sm} ${spacing.md}`,
      borderRadius: borders.radius.medium,
      fontSize: typography.fontSize.sm,
      marginBottom: spacing.md,
      display: 'flex',
      alignItems: 'center',
    },
    alertIcon: {
      marginRight: spacing.xs,
    },
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
        
        <h2 style={styles.title}>Reset your password</h2>
        
        <p style={styles.description}>
          Enter your email or username and we'll send you instructions to reset your password.
        </p>
        
        {error && (
          <div style={styles.errorAlert} role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={styles.alertIcon}>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        {message && (
          <div style={styles.successAlert} role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={styles.alertIcon}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>{message}</span>
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
                required
                placeholder="Enter your email or username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
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
            {loading ? 'Sending...' : 'Reset Password'}
          </button>
          
          <div style={{ textAlign: 'center' }}>
            <Link to="/login" style={styles.backLink}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={styles.backIcon}
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;