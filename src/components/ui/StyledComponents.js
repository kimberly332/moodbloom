import React from 'react';
import { colors, typography, spacing, borders, shadows, transitions } from '../../styles/theme';

// Auth Container - Used for login, signup, forgot password
export const AuthContainer = ({ children }) => {
    const style = {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.md,
        background: `linear-gradient(135deg, ${colors.background.default} 0%, ${colors.background.paper} 100%)`,
    };

    return <div style={style}>{children}</div>;
};

// Auth Card - Card that holds auth forms
export const AuthCard = ({ children }) => {
    const style = {
        width: '100%',
        maxWidth: '480px',
        padding: spacing.xl,
        backgroundColor: colors.background.paper,
        borderRadius: borders.radius.large,
        boxShadow: shadows.large,
        overflow: 'hidden',
        animation: 'fadeIn 0.6s ease',
    };

    return <div style={style}>{children}</div>;
};

// Logo Container
export const LogoContainer = ({ children }) => {
    const style = {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: spacing.xl,
    };

    return <div style={style}>{children}</div>;
};

// Form Container
export const FormContainer = ({ children, onSubmit }) => {
    const style = {
        width: '100%',
    };

    return <form style={style} onSubmit={onSubmit}>{children}</form>;
};

// Form Group - Container for form elements
export const FormGroup = ({ children, marginBottom = spacing.md }) => {
    const style = {
        marginBottom,
    };

    return <div style={style}>{children}</div>;
};

// Form Label
export const FormLabel = ({ children, htmlFor, required }) => {
    const style = {
        display: 'block',
        marginBottom: spacing.xs,
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        color: colors.text.secondary,
    };

    return (
        <label style={style} htmlFor={htmlFor}>
            {children}
            {required && <span style={{ color: colors.error, marginLeft: spacing.xs }}>*</span>}
        </label>
    );
};

// Input Field
export const InputField = ({
    id,
    name,
    type = 'text',
    placeholder,
    value,
    onChange,
    autoComplete,
    required,
    error,
    icon
}) => {
    const inputStyle = {
        width: '100%',
        padding: `${spacing.sm} ${spacing.md}`,
        paddingLeft: icon ? spacing.xl : spacing.md,
        backgroundColor: colors.background.elevated,
        border: `${borders.width.thin} solid ${error ? colors.error : 'rgba(255, 255, 255, 0.1)'}`,
        borderRadius: borders.radius.medium,
        color: colors.text.primary,
        fontSize: typography.fontSize.md,
        transition: `all ${transitions.short} ease`,
    };

    const containerStyle = {
        position: 'relative',
    };

    const iconStyle = {
        position: 'absolute',
        left: spacing.sm,
        top: '50%',
        transform: 'translateY(-50%)',
        color: colors.text.secondary,
    };

    const errorStyle = {
        color: colors.error,
        fontSize: typography.fontSize.xs,
        marginTop: spacing.xs,
        fontWeight: typography.fontWeight.medium,
    };

    return (
        <div style={containerStyle}>
            {icon && <span style={iconStyle}>{icon}</span>}
            <input
                id={id}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                autoComplete={autoComplete}
                required={required}
                style={inputStyle}
            />
            {error && <div style={errorStyle}>{error}</div>}
        </div>
    );
};

// Button - Primary
export const PrimaryButton = ({
    children,
    type = 'button',
    onClick,
    disabled = false,
    fullWidth = false
}) => {
    const style = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${spacing.sm} ${spacing.lg}`,
        width: fullWidth ? '100%' : 'auto',
        background: colors.gradients.primary,
        color: colors.primary.contrastText,
        border: 'none',
        borderRadius: borders.radius.medium,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: typography.fontWeight.medium,
        fontSize: typography.fontSize.md,
        transition: `all ${transitions.short} ease`,
        boxShadow: shadows.small,
        opacity: disabled ? 0.6 : 1,
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={style}
        >
            {children}
        </button>
    );
};

// Secondary Button
export const SecondaryButton = ({
    children,
    type = 'button',
    onClick,
    disabled = false,
    fullWidth = false
}) => {
    const style = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${spacing.sm} ${spacing.lg}`,
        width: fullWidth ? '100%' : 'auto',
        background: 'transparent',
        color: colors.primary.light,
        border: `${borders.width.thin} solid ${colors.primary.light}`,
        borderRadius: borders.radius.medium,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: typography.fontWeight.medium,
        fontSize: typography.fontSize.md,
        transition: `all ${transitions.short} ease`,
        opacity: disabled ? 0.6 : 1,
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={style}
        >
            {children}
        </button>
    );
};

// Text Link
export const TextLink = ({ children, to, onClick }) => {
    const style = {
        color: colors.primary.light,
        textDecoration: 'none',
        transition: `color ${transitions.short} ease`,
        cursor: 'pointer',
    };

    if (to) {
        return <a href={to} style={style}>{children}</a>;
    }

    return <span onClick={onClick} style={style}>{children}</span>;
};

// Error Alert
export const ErrorAlert = ({ children }) => {
    const style = {
        backgroundColor: 'rgba(255, 82, 82, 0.1)',
        color: colors.error,
        border: `${borders.width.thin} solid ${colors.error}`,
        padding: `${spacing.sm} ${spacing.md}`,
        borderRadius: borders.radius.medium,
        fontSize: typography.fontSize.sm,
        marginBottom: spacing.md,
        display: 'flex',
        alignItems: 'center',
    };

    return <div style={style} role="alert">{children}</div>;
};

// Success Alert
export const SuccessAlert = ({ children }) => {
    const style = {
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        color: colors.success,
        border: `${borders.width.thin} solid ${colors.success}`,
        padding: `${spacing.sm} ${spacing.md}`,
        borderRadius: borders.radius.medium,
        fontSize: typography.fontSize.sm,
        marginBottom: spacing.md,
        display: 'flex',
        alignItems: 'center',
    };

    return <div style={style} role="alert">{children}</div>;
};

// Divider with text
export const DividerWithText = ({ children }) => {
    const containerStyle = {
        display: 'flex',
        alignItems: 'center',
        margin: `${spacing.md} 0`,
    };

    const lineStyle = {
        flex: 1,
        height: '1px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    };

    const textStyle = {
        padding: `0 ${spacing.sm}`,
        color: colors.text.secondary,
        fontSize: typography.fontSize.sm,
    };

    return (
        <div style={containerStyle}>
            <div style={lineStyle}></div>
            <span style={textStyle}>{children}</span>
            <div style={lineStyle}></div>
        </div>
    );
};

// Step indicator for multi-step forms
export const StepIndicator = ({ steps, currentStep }) => {
    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    };

    const dotStyle = (index) => ({
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: currentStep === index
            ? colors.primary.main
            : index < currentStep
                ? colors.primary.light
                : 'rgba(255, 255, 255, 0.2)',
        margin: `0 ${spacing.xs}`,
        transition: `all ${transitions.short} ease`,
    });

    return (
        <div style={containerStyle}>
            {Array.from({ length: steps }).map((_, index) => (
                <div key={index} style={dotStyle(index)} />
            ))}
        </div>
    );
};

// ProfileImageUpload - For avatar upload
export const ProfileImageUpload = ({ imageUrl, onUpload }) => {
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: spacing.lg,
    };

    const imageContainerStyle = {
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        backgroundColor: colors.background.elevated,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
        overflow: 'hidden',
        border: `${borders.width.thin} solid rgba(255, 255, 255, 0.1)`,
    };

    const imageStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    };

    const placeholderStyle = {
        width: '60px',
        height: '60px',
        color: colors.text.secondary,
    };

    const uploadButtonStyle = {
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
    };

    return (
        <div style={containerStyle}>
            <div style={imageContainerStyle}>
                {imageUrl ? (
                    <img src={imageUrl} alt="Profile" style={imageStyle} />
                ) : (
                    <svg style={placeholderStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                )}
            </div>
            <button type="button" style={uploadButtonStyle} onClick={onUpload}>
                {imageUrl ? 'Change profile photo' : 'Upload profile photo'}
            </button>
        </div>
    );
};

// Icons
export const Icons = {
    // User icon for login/signup
    User: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
    ),

    // Email icon
    Email: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
    ),

    // Lock icon for password
    Lock: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
    ),

    // Alert icon for error messages
    Alert: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
    ),

    // Check icon for success messages
    Check: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
    ),

    // Logo for MoodBloom
    Logo: ({ size = 40 }) => (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40 10C23.4315 10 10 23.4315 10 40C10 56.5685 23.4315 70 40 70C56.5685 70 70 56.5685 70 40C70 23.4315 56.5685 10 40 10Z" fill="#1E1E1E" stroke="#9D4EDD" strokeWidth="2" />
            <path d="M40 15C26.1929 15 15 26.1929 15 40C15 53.8071 26.1929 65 40 65C53.8071 65 65 53.8071 65 40C65 26.1929 53.8071 15 40 15Z" fill="#1E1E1E" />
            <path d="M48 30C48 34.4183 44.4183 38 40 38C35.5817 38 32 34.4183 32 30C32 25.5817 35.5817 22 40 22C44.4183 22 48 25.5817 48 30Z" fill="#9D4EDD" />
            <path d="M28 47C28 51.4183 24.4183 55 20 55C15.5817 55 12 51.4183 12 47C12 42.5817 15.5817 39 20 39C24.4183 39 28 42.5817 28 47Z" fill="#FFACC7" />
            <path d="M68 47C68 51.4183 64.4183 55 60 55C55.5817 55 52 51.4183 52 47C52 42.5817 55.5817 39 60 39C64.4183 39 68 42.5817 68 47Z" fill="#D6A4FF" />
        </svg>
    ),

    // Arrow icon for navigation
    Arrow: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
    )
}