import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Import styles
import '../../styles/Auth.css';

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
          <div className="auth-step-content" key="step1">
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="email">
                Email address<span className="auth-required">*</span>
              </label>
              <div className="auth-input-container">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="auth-input-icon">
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
                  className={`auth-input ${fieldErrors.email ? 'auth-input-error' : ''}`}
                />
              </div>
              {fieldErrors.email ? (
                <div className="auth-error-message">{fieldErrors.email}</div>
              ) : (
                <div className="auth-helper-text">We'll use this for account verification</div>
              )}
            </div>
            
            <div className="auth-form-group auth-button-container">
              <button 
                type="button" 
                onClick={handleNextStep}
                className="auth-button"
                disabled={!formData.email}
              >
                Continue
              </button>
            </div>
            
            <div className="auth-divider">
              <div className="auth-divider-line"></div>
              <span className="auth-divider-text">Already have an account?</span>
              <div className="auth-divider-line"></div>
            </div>
            
            <div className="auth-form-group">
              <Link to="/login" className="auth-link-button">
                <button type="button" className="auth-secondary-button">
                  Sign in
                </button>
              </Link>
            </div>
          </div>
        );
        
      case 2: // Username and Password
        return (
          <div className="auth-step-content" key="step2">
            {/* Username field */}
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="username">
                Username<span className="auth-required">*</span>
              </label>
              <div className="auth-input-container">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="auth-input-icon">
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
                  className={`auth-input ${fieldErrors.username ? 'auth-input-error' : ''}`}
                />
              </div>
              {fieldErrors.username ? (
                <div className="auth-error-message">{fieldErrors.username}</div>
              ) : (
                <div className="auth-helper-text">This will be your unique identifier</div>
              )}
            </div>
            
            {/* Password */}
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="password">
                Password<span className="auth-required">*</span>
              </label>
              <div className="auth-input-container">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="auth-input-icon">
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
                  className={`auth-input ${fieldErrors.password ? 'auth-input-error' : ''}`}
                />
              </div>
              {fieldErrors.password && (
                <div className="auth-error-message">{fieldErrors.password}</div>
              )}
            </div>
            
            {/* Confirm Password */}
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="confirmPassword">
                Confirm password<span className="auth-required">*</span>
              </label>
              <div className="auth-input-container">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="auth-input-icon">
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
                  className={`auth-input ${fieldErrors.confirmPassword ? 'auth-input-error' : ''}`}
                />
              </div>
              {fieldErrors.confirmPassword && (
                <div className="auth-error-message">{fieldErrors.confirmPassword}</div>
              )}
            </div>
            
            {/* Password requirements */}
            <div className="auth-password-requirements">
              <ul className="auth-requirements-list">
                <li className={`auth-requirement-item ${passwordMeetsMinLength ? 'met' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="auth-requirement-icon">
                    {passwordMeetsMinLength ? (
                      <path d="M20 6L9 17l-5-5" />
                    ) : (
                      <circle cx="12" cy="12" r="10" />
                    )}
                  </svg>
                  At least 6 characters long
                </li>
                <li className={`auth-requirement-item ${passwordsMatch ? 'met' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="auth-requirement-icon">
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
            <div className="auth-form-group auth-button-container">
              <div className="auth-button-group">
                <button 
                  type="button" 
                  onClick={handlePrevStep}
                  className="auth-secondary-button"
                >
                  Back
                </button>
                
                <button 
                  type="button" 
                  onClick={handleNextStep}
                  className="auth-button"
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
          <div className="auth-step-content" key="step3">
            <div className="auth-form-section">
              <p className="auth-step-description">This is how other users will see you in MoodBloom.</p>
              
              <div className="auth-form-group">
                <label className="auth-label" htmlFor="nickname">Display name</label>
                <div className="auth-input-container">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="auth-input-icon">
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
                    className="auth-input"
                  />
                </div>
                {!formData.nickname && (
                  <div className="auth-helper-text">
                    We'll use "{formData.username}" if you leave this blank
                  </div>
                )}
              </div>
            </div>
            
            <div className="auth-form-group auth-button-container">
              <div className="auth-button-group">
                <button 
                  type="button" 
                  onClick={handlePrevStep}
                  className="auth-secondary-button"
                >
                  Back
                </button>
                
                <button 
                  type="button" 
                  onClick={handleNextStep}
                  className="auth-button"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        );
        
      case 4: // Profile Image
        return (
          <div className="auth-step-content" key="step4">
            <div className="auth-form-section">
              <p className="auth-step-description">Add a profile picture to personalize your account. You can change it anytime.</p>
              
              <div className="auth-profile-upload">
                <div className="auth-profile-image">
                  {formData.profileImage ? (
                    <img src={formData.profileImage} alt="Profile" />
                  ) : (
                    <svg className="auth-profile-placeholder" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  )}
                </div>
                <button type="button" className="auth-upload-button" onClick={handleImageUpload}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  {formData.profileImage ? 'Change profile photo' : 'Upload profile photo'}
                </button>
              </div>
            </div>
            
            <div className="auth-form-group auth-button-container">
              <div className="auth-button-group">
                <button 
                  type="button" 
                  onClick={handlePrevStep}
                  className="auth-secondary-button"
                >
                  Back
                </button>
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`auth-button ${loading ? 'loading' : ''}`}
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </div>
              
              <div className="auth-skip-link">
                <button 
                  type="submit"
                  disabled={loading}
                  className="auth-text-button"
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
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo-container">
          <svg width="64" height="64" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="auth-logo">
            <path d="M40 10C23.4315 10 10 23.4315 10 40C10 56.5685 23.4315 70 40 70C56.5685 70 70 56.5685 70 40C70 23.4315 56.5685 10 40 10Z" fill="#1E1E1E" stroke="#9D4EDD" strokeWidth="2"/>
            <path d="M40 15C26.1929 15 15 26.1929 15 40C15 53.8071 26.1929 65 40 65C53.8071 65 65 53.8071 65 40C65 26.1929 53.8071 15 40 15Z" fill="#1E1E1E"/>
            <path d="M48 30C48 34.4183 44.4183 38 40 38C35.5817 38 32 34.4183 32 30C32 25.5817 35.5817 22 40 22C44.4183 22 48 25.5817 48 30Z" fill="#9D4EDD"/>
            <path d="M28 47C28 51.4183 24.4183 55 20 55C15.5817 55 12 51.4183 12 47C12 42.5817 15.5817 39 20 39C24.4183 39 28 42.5817 28 47Z" fill="#FFACC7"/>
            <path d="M68 47C68 51.4183 64.4183 55 60 55C55.5817 55 52 51.4183 52 47C52 42.5817 55.5817 39 60 39C64.4183 39 68 42.5817 68 47Z" fill="#D6A4FF"/>
          </svg>
        </div>
        
        <h2 className="auth-title">{getStepTitle()}</h2>
        
        <div className="auth-step-container">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div 
              key={index} 
              className={`auth-step-dot ${
                currentStep === index + 1 
                  ? 'active' 
                  : index + 1 < currentStep 
                    ? 'completed' 
                    : 'inactive'
              }`} 
            />
          ))}
        </div>
        
        {error && (
          <div className="auth-error-alert" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="auth-error-icon">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {renderStepContent()}
        </form>
      </div>
    </div>
  );
};

export default MultiStepSignUp;