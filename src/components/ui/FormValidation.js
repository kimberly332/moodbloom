import React, { useState, useEffect } from 'react';
import { colors, typography, spacing, borders, transitions } from '../../styles/theme';

// Input validation status types
export const ValidationStatus = {
  NONE: 'none',
  VALID: 'valid',
  INVALID: 'invalid',
  LOADING: 'loading'
};

// Live validation feedback component
export const LiveValidationInput = ({ 
  id, 
  name, 
  type = 'text', 
  placeholder, 
  value, 
  onChange,
  onBlur,
  autoComplete,
  required,
  icon,
  validationRules = [],
  asyncValidator,
  debounceTime = 500
}) => {
  const [status, setStatus] = useState(ValidationStatus.NONE);
  const [errorMessage, setErrorMessage] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [timer, setTimer] = useState(null);
  
  // Validation indicator icons
  const ValidationIcon = () => {
    // Not showing any indicator if the field is empty or not touched
    if (!value || !isTouched) return null;
    
    switch (status) {
      case ValidationStatus.VALID:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.success} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        );
      case ValidationStatus.INVALID:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.error} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        );
      case ValidationStatus.LOADING:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.primary.main} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'rotate 1s linear infinite' }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
          </svg>
        );
      default:
        return null;
    }
  };
  
  // Container styles
  const containerStyle = {
    position: 'relative',
    marginBottom: errorMessage ? spacing.md : 0,
  };
  
  // Input styles
  const inputStyle = {
    width: '100%',
    padding: `${spacing.sm} ${spacing.md}`,
    paddingLeft: icon ? spacing.xl : spacing.md,
    paddingRight: (status !== ValidationStatus.NONE && isTouched) ? spacing.xl : spacing.md,
    backgroundColor: colors.background.elevated,
    border: `${borders.width.thin} solid ${
      status === ValidationStatus.INVALID && isTouched ? colors.error :
      status === ValidationStatus.VALID && isTouched ? colors.success :
      'rgba(255, 255, 255, 0.1)'
    }`,
    borderRadius: borders.radius.medium,
    color: colors.text.primary,
    fontSize: typography.fontSize.md,
    transition: `all ${transitions.short} ease`,
  };
  
  // Icon container styles
  const iconContainerStyle = {
    position: 'absolute',
    left: spacing.sm,
    top: '50%',
    transform: 'translateY(-50%)',
    color: colors.text.secondary,
  };
  
  // Validation icon container styles
  const validationIconContainerStyle = {
    position: 'absolute',
    right: spacing.sm,
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  
  // Error message styles
  const errorMessageStyle = {
    color: colors.error,
    fontSize: typography.fontSize.xs,
    marginTop: spacing.xs,
    fontWeight: typography.fontWeight.medium,
  };
  
  // Helper function to validate the input
  const validateInput = async (inputValue) => {
    // Skip validation if empty and not required
    if (!inputValue && !required) {
      setStatus(ValidationStatus.NONE);
      setErrorMessage('');
      return;
    }
    
    // Validate against rules
    for (const rule of validationRules) {
      const isValid = rule.validate(inputValue);
      if (!isValid) {
        setStatus(ValidationStatus.INVALID);
        setErrorMessage(rule.message);
        return;
      }
    }
    
    // If there's an async validator (like checking username availability)
    if (asyncValidator && inputValue) {
      setStatus(ValidationStatus.LOADING);
      
      try {
        const { isValid, message } = await asyncValidator(inputValue);
        
        if (isValid) {
          setStatus(ValidationStatus.VALID);
          setErrorMessage('');
        } else {
          setStatus(ValidationStatus.INVALID);
          setErrorMessage(message);
        }
      } catch (error) {
        console.error('Validation error:', error);
        setStatus(ValidationStatus.INVALID);
        setErrorMessage('Validation failed. Please try again.');
      }
    } else {
      // If all rules pass and no async validator
      setStatus(ValidationStatus.VALID);
      setErrorMessage('');
    }
  };
  
  // Handle input change
  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(e);
    
    // Set typing state
    setIsTyping(true);
    
    // Clear previous timer
    if (timer) clearTimeout(timer);
    
    // Set new timer for debounce
    const newTimer = setTimeout(() => {
      setIsTyping(false);
      if (isTouched) {
        validateInput(newValue);
      }
    }, debounceTime);
    
    setTimer(newTimer);
  };
  
  // Handle input blur
  const handleBlur = (e) => {
    setIsTouched(true);
    if (onBlur) onBlur(e);
    
    // Clear any existing timer
    if (timer) clearTimeout(timer);
    
    // Validate immediately on blur
    validateInput(value);
  };
  
  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timer]);
  
  // Add keyframe animation for the loading spinner
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.innerHTML = `
      @keyframes rotate {
        from {
          transform: translateY(-50%) rotate(0deg);
        }
        to {
          transform: translateY(-50%) rotate(360deg);
        }
      }
    `;
    
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  return (
    <div style={containerStyle}>
      {icon && <div style={iconContainerStyle}>{icon}</div>}
      
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        autoComplete={autoComplete}
        required={required}
        style={inputStyle}
      />
      
      {isTouched && status !== ValidationStatus.NONE && (
        <div style={validationIconContainerStyle}>
          <ValidationIcon />
        </div>
      )}
      
      {isTouched && errorMessage && (
        <div style={errorMessageStyle}>{errorMessage}</div>
      )}
    </div>
  );
};

// Validation rules factory
export const ValidationRules = {
  required: (message = 'This field is required') => ({
    validate: value => !!value,
    message
  }),
  
  minLength: (length, message = `Must be at least ${length} characters`) => ({
    validate: value => !value || value.length >= length,
    message
  }),
  
  maxLength: (length, message = `Must be no more than ${length} characters`) => ({
    validate: value => !value || value.length <= length,
    message
  }),
  
  email: (message = 'Please enter a valid email address') => ({
    validate: value => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message
  }),
  
  pattern: (regex, message = 'Invalid format') => ({
    validate: value => !value || regex.test(value),
    message
  }),
  
  match: (getCompareValue, message = 'Values do not match') => ({
    validate: value => !value || value === getCompareValue(),
    message
  }),
  
  // Add more validation rules as needed
};

export default {
  ValidationStatus,
  LiveValidationInput,
  ValidationRules
};