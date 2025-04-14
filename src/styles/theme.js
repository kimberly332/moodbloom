// Theme configuration for MoodBloom
// A modern dark theme with feminine touches

// Color palette
export const colors = {
    // Primary colors
    primary: {
      light: '#D6A4FF', // Light purple
      main: '#9D4EDD',  // Medium purple
      dark: '#6A0DAD',  // Dark purple
      contrastText: '#FFFFFF'
    },
    
    // Secondary colors
    secondary: {
      light: '#FFD6E0', // Light pink
      main: '#FFACC7', // Medium pink
      dark: '#FF85A1', // Dark pink
      contrastText: '#2D2D2D'
    },
    
    // Background colors
    background: {
      default: '#121212', // Main background
      paper: '#1E1E1E',   // Card/paper background
      elevated: '#252525' // Elevated surfaces
    },
    
    // Text colors
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
      disabled: '#666666',
      hint: '#888888'
    },
    
    // Feedback colors
    success: '#4CAF50',
    error: '#FF5252',
    warning: '#FFC107',
    info: '#64B5F6',
    
    // Gradients
    gradients: {
      primary: 'linear-gradient(45deg, #9D4EDD 30%, #C77DFF 90%)',
      secondary: 'linear-gradient(45deg, #FF85A1 30%, #FFACC7 90%)'
    }
  };
  
  // Typography
  export const typography = {
    fontFamily: "'Poppins', 'Roboto', sans-serif",
    fontSize: {
      xs: '0.75rem',   // 12px
      sm: '0.875rem',  // 14px
      md: '1rem',      // 16px
      lg: '1.125rem',  // 18px
      xl: '1.25rem',   // 20px
      xxl: '1.5rem',   // 24px
      xxxl: '2rem'     // 32px
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 700
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      loose: 1.8
    }
  };
  
  // Spacing
  export const spacing = {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    xxl: '2.5rem',  // 40px
    xxxl: '3rem'    // 48px
  };
  
  // Borders
  export const borders = {
    radius: {
      small: '4px',
      medium: '8px',
      large: '12px',
      circle: '50%'
    },
    width: {
      thin: '1px',
      medium: '2px',
      thick: '4px'
    }
  };
  
  // Shadows
  export const shadows = {
    small: '0 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.12)',
    large: '0 8px 16px rgba(0, 0, 0, 0.14)',
    inset: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
  };
  
  // Breakpoints for responsive design
  export const breakpoints = {
    xs: '480px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px'
  };
  
  // Z-index levels
  export const zIndex = {
    base: 0,
    elevated: 10,
    sticky: 100,
    dropdown: 200,
    modal: 300,
    toast: 400
  };
  
  // Animation durations
  export const transitions = {
    short: '0.2s',
    medium: '0.3s',
    long: '0.5s'
  };
  
  // Export default theme object
  const theme = {
    colors,
    typography,
    spacing,
    borders,
    shadows,
    breakpoints,
    zIndex,
    transitions
  };
  
  export default theme;