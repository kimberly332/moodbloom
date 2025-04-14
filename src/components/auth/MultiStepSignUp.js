import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Import our theme styles
import { colors, typography, spacing, borders, shadows, transitions } from '../../styles/theme';

const MultiStepSignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  // Form data state
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    nickname: '',
    password: '',
    confirmPassword: '',
    profileImage: null
  });
  
  // Step state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  // Error and loading states
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Field validation state
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  
  // Password validation states
  const [passwordMeetsMinLength, setPasswordMeetsMinLength] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  
  // Check password requirements when passwords change
  useEffect(() => {
    // Check if password meets minimum length
    setPasswordMeetsMinLength(formData.password.length >= 6);
    
    // Check if passwords match
    setPasswordsMatch(formData.password === formData.confirmPassword && formData.password !== '');
  }, [formData.password, formData.confirmPassword]);
  
  // Add animations
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes slideUp {
        from {
          transform: translateY(10px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      
      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
        100% {
          transform: scale(1);
        }
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear field errors when typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Email validation
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFieldErrors(prev => ({
        ...prev,
        email: 'Please enter a valid email address'
      }));
      return false;
    }
    return true;
  };
  
  // Username validation
  const validateUsername = async () => {
    if (formData.username.length < 3) {
      setFieldErrors(prev => ({
        ...prev,
        username: 'Username must be at least 3 characters'
      }));
      return false;
    }
    
    // Here you would check if username is already taken
    // This is a placeholder - actual implementation would connect to your backend
    try {
      // Simulate API call to check username availability
      const isAvailable = true; // Replace with actual API call
      
      if (!isAvailable) {
        setFieldErrors(prev => ({
          ...prev,
          username: 'This username is already taken'
        }));
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  };
  
  // Password validation
  const validatePassword = () => {
    if (formData.password.length < 6) {
      setFieldErrors(prev => ({
        ...prev,
        password: 'Password must be at least 6 characters'
      }));
      return false;
    }
    return true;
  };
  
  // Confirm password validation
  const validateConfirmPassword = () => {
    if (formData.password !== formData.confirmPassword) {
      setFieldErrors(prev => ({
        ...prev,
        confirmPassword: 'Passwords do not match'
      }));
      return false;
    }
    return true;
  };
  
  // Handle profile image upload
  const handleImageUpload = () => {
    // In a real implementation, you would use an input type="file" and handle the file selection
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // For demo purposes, we're just storing the file object
        // In a real app, you would upload to storage and get a URL
        setFormData(prev => ({
          ...prev,
          profileImage: URL.createObjectURL(file)
        }));
      }
    };
    fileInput.click();
  };
  
  // Move to the next step
  const handleNextStep = async () => {
    setError('');
    
    // Validate current step
    if (currentStep === 1) {
      const isEmailValid = validateEmail();
      if (!isEmailValid) return;
    } 
    else if (currentStep === 2) {
      const isUsernameValid = await validateUsername();
      const isPasswordValid = validatePassword();
      const isConfirmPasswordValid = validateConfirmPassword();
      
      if (!isUsernameValid || !isPasswordValid || !isConfirmPasswordValid) {
        return;
      }
    }
    // No validation needed for steps 3 and 4 as they're optional
    
    // Proceed to next step
    setCurrentStep(prev => prev + 1);
  };
  
  // Move to the previous step
  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      
      await signup(
        formData.email, 
        formData.password, 
        formData.username, 
        formData.nickname || formData.username
      );
      
      // In a real implementation, you would also upload the profile image
      // to your storage service and update the user profile
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        setError('Email is already in use');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else {
        setError('Failed to create an account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Get step title
  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "What's your email?";
      case 2: return "Create your account";
      case 3: return "What should we call you?";
      case 4: return "Add a profile picture";
      default: return "Join MoodBloom";
    }
  };
  
  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Email
        return (
          <div style={styles.stepContainer} key="step1">
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="email">
                Email address<span style={styles.requiredStar}>*</span>
              </label>
              <div style={styles.inputContainer}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={styles.icon}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    ...(fieldErrors.email ? styles.inputError : {})
                  }}
                />
              </div>
              {fieldErrors.email ? (
                <div style={styles.errorMessage}>{fieldErrors.email}</div>
              ) : (
                <div style={styles.helperText}>We'll use this for account verification</div>
              )}
            </div>
            
            <div style={{...styles.formGroup, marginBottom: '32px', marginTop: '32px'}}>
              <button 
                type="button" 
                onClick={handleNextStep}
                style={styles.primaryButton}
                disabled={!formData.email}
              >
                Continue
              </button>
            </div>
            
            <div style={styles.divider}>
              <div style={styles.dividerLine}></div>
              <span style={styles.dividerText}>Already have an account?</span>
              <div style={styles.dividerLine}></div>
            </div>
            
            <div style={styles.formGroup}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <button type="button" style={{...styles.secondaryButton, width: '100%'}}>
                  Sign in
                </button>
              </Link>
            </div>
          </div>
        );
        
      case 2: // Username and Password
        return (
          <div style={styles.stepContainer} key="step2">
            {/* Username field */}
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="username">
                Username<span style={styles.requiredStar}>*</span>
              </label>
              <div style={styles.inputContainer}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={styles.icon}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    ...(fieldErrors.username ? styles.inputError : {})
                  }}
                />
              </div>
              {fieldErrors.username ? (
                <div style={styles.errorMessage}>{fieldErrors.username}</div>
              ) : (
                <div style={styles.helperText}>This will be your unique identifier</div>
              )}
            </div>
            
            {/* Password */}
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="password">
                Password<span style={styles.requiredStar}>*</span>
              </label>
              <div style={styles.inputContainer}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={styles.icon}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    ...(fieldErrors.password ? styles.inputError : {})
                  }}
                />
              </div>
              {fieldErrors.password && (
                <div style={styles.errorMessage}>{fieldErrors.password}</div>
              )}
            </div>
            
            {/* Confirm Password */}
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="confirmPassword">
                Confirm password<span style={styles.requiredStar}>*</span>
              </label>
              <div style={styles.inputContainer}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={styles.icon}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    ...(fieldErrors.confirmPassword ? styles.inputError : {})
                  }}
                />
              </div>
              {fieldErrors.confirmPassword && (
                <div style={styles.errorMessage}>{fieldErrors.confirmPassword}</div>
              )}
            </div>
            
            {/* Password requirements */}
            <div style={styles.passwordRequirements}>
              <ul style={styles.requirementsList}>
                <li style={{...styles.requirementItem, color: passwordMeetsMinLength ? colors.success : colors.text.secondary}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: spacing.xs}}>
                    {passwordMeetsMinLength ? (
                      <path d="M20 6L9 17l-5-5" />
                    ) : (
                      <circle cx="12" cy="12" r="10" />
                    )}
                  </svg>
                  At least 6 characters long
                </li>
                <li style={{...styles.requirementItem, color: passwordsMatch ? colors.success : colors.text.secondary}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: spacing.xs}}>
                    {passwordsMatch ? (
                      <path d="M20 6L9 17l-5-5" />
                    ) : (
                      <circle cx="12" cy="12" r="10" />
                    )}
                  </svg>
                  Passwords match
                </li>
              </ul>
            </div>
            
            {/* Navigation buttons */}
            <div style={{...styles.formGroup, marginBottom: '32px', marginTop: '32px'}}>
              <div style={styles.buttonGroup}>
                <button 
                  type="button" 
                  onClick={handlePrevStep}
                  style={styles.secondaryButton}
                >
                  Back
                </button>
                
                <button 
                  type="button" 
                  onClick={handleNextStep}
                  style={{...styles.primaryButton, flex: 1}}
                  disabled={!formData.username || !passwordMeetsMinLength || !passwordsMatch}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        );
        
      case 3: // Nickname
        return (
          <div style={styles.stepContainer} key="step3">
            <div style={styles.formSection}>
              <p style={styles.stepDescription}>This is how other users will see you in MoodBloom.</p>
              
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="nickname">Display name</label>
                <div style={styles.inputContainer}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={styles.icon}>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <input
                    id="nickname"
                    name="nickname"
                    type="text"
                    autoComplete="nickname"
                    placeholder="What should we call you?"
                    value={formData.nickname}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.helperText}>
                  {formData.nickname ? '' : `We'll use "${formData.username}" if you leave this blank`}
                </div>
              </div>
            </div>
            
            <div style={{...styles.formGroup, marginBottom: '32px', marginTop: '32px'}}>
              <div style={styles.buttonGroup}>
                <button 
                  type="button" 
                  onClick={handlePrevStep}
                  style={styles.secondaryButton}
                >
                  Back
                </button>
                
                <button 
                  type="button" 
                  onClick={handleNextStep}
                  style={{...styles.primaryButton, flex: 1}}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        );
        
      case 4: // Profile Image
        return (
          <div style={styles.stepContainer} key="step4">
            <div style={styles.formSection}>
              <p style={styles.stepDescription}>Add a profile picture to personalize your account. You can change it anytime.</p>
              
              <div style={styles.profileImageContainer}>
                <div style={styles.imageContainer}>
                  {formData.profileImage ? (
                    <img src={formData.profileImage} alt="Profile" style={styles.profileImage} />
                  ) : (
                    <svg style={styles.placeholderIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  )}
                </div>
                <button type="button" style={styles.uploadButton} onClick={handleImageUpload}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: spacing.xs}}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  {formData.profileImage ? 'Change profile photo' : 'Upload profile photo'}
                </button>
              </div>
            </div>
            
            <div style={{...styles.formGroup, marginBottom: '32px', marginTop: '32px'}}>
              <div style={styles.buttonGroup}>
                <button 
                  type="button" 
                  onClick={handlePrevStep}
                  style={styles.secondaryButton}
                >
                  Back
                </button>
                
                <button 
                  type="submit" 
                  disabled={loading}
                  style={{
                    ...styles.primaryButton, 
                    flex: 1,
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </div>
              
              <div style={styles.skipLink}>
                <button 
                  type="submit"
                  disabled={loading}
                  style={styles.textButton}
                >
                  Skip this step
                </button>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
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
      marginBottom: spacing.md,
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
    stepTitle: {
      textAlign: 'center',
      marginBottom: '16px',
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.text.primary,
    },
    stepDescription: {
      textAlign: 'center',
      marginBottom: '24px',
      fontSize: typography.fontSize.md,
      color: colors.text.secondary,
    },
    form: {
      width: '100%',
    },
    stepContainer: {
      animation: 'slideUp 0.5s ease',
      minHeight: '350px', // Set a minimum height to prevent layout shifts
    },
    stepIndicatorContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: spacing.lg,
    },
    stepDot: (index) => ({
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: currentStep === index + 1
        ? colors.primary.main 
        : (index + 1) < currentStep
          ? colors.primary.light 
          : 'rgba(255, 255, 255, 0.2)',
      margin: `0 ${spacing.xs}`,
      transition: `all ${transitions.short} ease`,
    }),
    formGroup: {
      marginBottom: spacing.md,
    },
    formSection: {
      marginBottom: spacing.lg,
    },
    label: {
      display: 'block',
      marginBottom: spacing.xs,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      color: colors.text.secondary,
    },
    requiredStar: {
      color: colors.error,
      marginLeft: spacing.xs,
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
    inputError: {
      borderColor: colors.error,
    },
    icon: {
      position: 'absolute',
      left: spacing.sm,
      top: '50%',
      transform: 'translateY(-50%)',
      color: colors.text.secondary,
    },
    errorMessage: {
      color: colors.error,
      fontSize: typography.fontSize.xs,
      marginTop: spacing.xs,
      fontWeight: typography.fontWeight.medium,
    },
    helperText: {
      fontSize: typography.fontSize.xs,
      color: colors.text.secondary,
      marginTop: spacing.xs,
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
    },
    primaryButton: {
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
    },
    secondaryButton: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
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
    textButton: {
      background: 'transparent',
      border: 'none',
      color: colors.text.secondary,
      fontSize: typography.fontSize.sm,
      cursor: 'pointer',
      padding: spacing.xs,
      transition: `color ${transitions.short} ease`,
    },
    skipLink: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: spacing.md,
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
    },
    profileImageContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: spacing.xl,
    },
    imageContainer: {
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      backgroundColor: colors.background.elevated,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.md,
      overflow: 'hidden',
      border: `${borders.width.thin} solid rgba(255, 255, 255, 0.1)`,
      boxShadow: shadows.medium,
      transition: `all ${transitions.medium} ease`,
    },
    profileImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    placeholderIcon: {
      width: '60px',
      height: '60px',
      color: colors.text.secondary,
    },
    uploadButton: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(157, 78, 221, 0.1)',
      color: colors.primary.light,
      border: `${borders.width.thin} solid ${colors.primary.light}`,
      borderRadius: borders.radius.medium,
      padding: `${spacing.xs} ${spacing.md}`,
      cursor: 'pointer',
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      transition: `all ${transitions.short} ease`,
    },
    passwordRequirements: {
      marginTop: spacing.xs,
    },
    requirementsList: {
      listStyleType: 'none',
      padding: 0,
      margin: `${spacing.xs} 0 ${spacing.md} 0`,
      fontSize: typography.fontSize.xs,
    },
    requirementItem: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: spacing.xs,
      transition: `color ${transitions.short} ease`,
    },
    optionalLabel: {
      fontSize: typography.fontSize.sm,
      fontStyle: 'italic',
      color: colors.text.secondary,
      marginBottom: spacing.md,
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
        
        <h2 style={styles.stepTitle}>{getStepTitle()}</h2>
        
        <div style={styles.stepIndicatorContainer}>
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} style={styles.stepDot(index)} />
          ))}
        </div>
        
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
          {renderStepContent()}
        </form>
      </div>
    </div>
  );
};

export default MultiStepSignUp;