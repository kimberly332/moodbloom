// Animation utilities for MoodBloom

// Timing functions
export const easing = {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
  };
  
  // Animation durations
  export const duration = {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
    leavingScreen: 195
  };
  
  // CSS keyframes
  export const keyframes = {
    fadeIn: `
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `,
    
    fadeOut: `
      @keyframes fadeOut {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }
    `,
    
    slideInUp: `
      @keyframes slideInUp {
        from {
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `,
    
    slideInDown: `
      @keyframes slideInDown {
        from {
          transform: translateY(-20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `,
    
    slideInLeft: `
      @keyframes slideInLeft {
        from {
          transform: translateX(-20px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `,
    
    slideInRight: `
      @keyframes slideInRight {
        from {
          transform: translateX(20px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `,
    
    pulse: `
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
    `,
    
    shake: `
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
    `,
    
    bounce: `
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-10px);
        }
        60% {
          transform: translateY(-5px);
        }
      }
    `
  };
  
  // Animation CSS classes
  export const createAnimationStyles = () => {
    return Object.entries(keyframes).map(([name, keyframe]) => {
      return `
        ${keyframe}
        
        .animate-${name} {
          animation: ${name} ${duration.standard}ms ${easing.easeOut};
        }
        
        .animate-${name}-infinite {
          animation: ${name} ${duration.standard}ms ${easing.easeOut} infinite;
        }
      `;
    }).join('\n');
  };
  
  // Function to inject animation styles into the document
  export const injectAnimationStyles = () => {
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.innerHTML = createAnimationStyles();
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  };
  
  // React animation hook
  export const useAnimationStyles = () => {
    React.useEffect(() => {
      return injectAnimationStyles();
    }, []);
  };
  
  export default {
    easing,
    duration,
    keyframes,
    createAnimationStyles,
    injectAnimationStyles,
    useAnimationStyles
  };