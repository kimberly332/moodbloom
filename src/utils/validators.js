/**
 * Validate an email address
 * @param {string} email - The email to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidEmail = (email) => {
    if (!email) return false;
    
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validate a password based on common requirements
   * @param {string} password - The password to validate
   * @returns {Object} Validation results with overall validity and specific checks
   */
  export const validatePassword = (password) => {
    if (!password) {
      return {
        isValid: false,
        meetsMinLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false
      };
    }
    
    // Check specific requirements
    const meetsMinLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    // For this app, we'll consider a password valid if it meets minimum length
    // You can adjust this to require more checks as needed
    const isValid = meetsMinLength;
    
    return {
      isValid,
      meetsMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar
    };
  };
  
  /**
   * Check if two passwords match
   * @param {string} password - The password
   * @param {string} confirmPassword - The confirmation password
   * @returns {boolean} True if they match, false otherwise
   */
  export const passwordsMatch = (password, confirmPassword) => {
    return password === confirmPassword;
  };
  
  /**
   * Validate a username
   * @param {string} username - The username to validate
   * @returns {Object} Validation results
   */
  export const validateUsername = (username) => {
    if (!username) {
      return {
        isValid: false,
        message: 'Username is required'
      };
    }
    
    // Check length
    if (username.length < 3) {
      return {
        isValid: false,
        message: 'Username must be at least 3 characters'
      };
    }
    
    // Check for spaces
    if (/\s/.test(username)) {
      return {
        isValid: false,
        message: 'Username cannot contain spaces'
      };
    }
    
    // Check for special characters (allow letters, numbers, underscore, hyphen)
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return {
        isValid: false,
        message: 'Username can only contain letters, numbers, underscore (_) and hyphen (-)'
      };
    }
    
    return {
      isValid: true,
      message: ''
    };
  };
  
  /**
   * Validate a form field based on common requirements
   * @param {string} fieldName - The name of the field
   * @param {string} value - The value to validate
   * @param {Object} options - Validation options
   * @returns {Object} Validation results
   */
  export const validateFormField = (fieldName, value, options = {}) => {
    const {
      required = false,
      minLength = 0,
      maxLength = Infinity,
      pattern = null,
      customValidator = null
    } = options;
    
    // Check if required
    if (required && (!value || value.trim() === '')) {
      return {
        isValid: false,
        message: `${fieldName} is required`
      };
    }
    
    // Check min length
    if (minLength > 0 && value && value.length < minLength) {
      return {
        isValid: false,
        message: `${fieldName} must be at least ${minLength} characters`
      };
    }
    
    // Check max length
    if (maxLength < Infinity && value && value.length > maxLength) {
      return {
        isValid: false,
        message: `${fieldName} must be no more than ${maxLength} characters`
      };
    }
    
    // Check pattern
    if (pattern && value && !pattern.test(value)) {
      return {
        isValid: false,
        message: `${fieldName} has an invalid format`
      };
    }
    
    // Custom validator
    if (customValidator && value) {
      const customResult = customValidator(value);
      if (!customResult.isValid) {
        return customResult;
      }
    }
    
    return {
      isValid: true,
      message: ''
    };
  };
  
  export default {
    isValidEmail,
    validatePassword,
    passwordsMatch,
    validateUsername,
    validateFormField
  };