import { format, parseISO, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

/**
 * Format a date to display as a friendly string
 * @param {Date|string} date - The date to format
 * @param {string} formatString - Date format string (default: 'MMM d, yyyy')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatString = 'MMM d, yyyy') => {
  if (!date) return '';
  
  // If date is a string, parse it
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  return format(dateObj, formatString);
};

/**
 * Format a time to display as a friendly string
 * @param {Date|string} date - The date to format
 * @param {string} formatString - Time format string (default: 'h:mm a')
 * @returns {string} Formatted time string
 */
export const formatTime = (date, formatString = 'h:mm a') => {
  if (!date) return '';
  
  // If date is a string, parse it
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  return format(dateObj, formatString);
};

/**
 * Format a date and time to display as a friendly string
 * @param {Date|string} date - The date to format
 * @param {string} formatString - Date and time format string (default: 'MMM d, yyyy h:mm a')
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date, formatString = 'MMM d, yyyy h:mm a') => {
  if (!date) return '';
  
  // If date is a string, parse it
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  return format(dateObj, formatString);
};

/**
 * Get a relative time string (e.g., "2 hours ago", "just now")
 * @param {Date|string} date - The date to format
 * @returns {string} Relative time string
 */
export const getRelativeTimeString = (date) => {
  if (!date) return '';
  
  // If date is a string, parse it
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  const now = new Date();
  const diffDays = differenceInDays(now, dateObj);
  const diffHours = differenceInHours(now, dateObj);
  const diffMinutes = differenceInMinutes(now, dateObj);
  
  if (diffDays > 30) {
    return formatDate(dateObj);
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays > 1) {
    return `${diffDays} days ago`;
  } else if (diffHours >= 1) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffMinutes >= 1) {
    return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
  } else {
    return 'Just now';
  }
};

/**
 * Get the start and end dates for a specific time period
 * @param {string} period - The time period ('week', 'month', 'year')
 * @returns {Object} Object containing start and end dates
 */
export const getDateRangeForPeriod = (period) => {
  const now = new Date();
  const endDate = now;
  let startDate;
  
  switch (period) {
    case 'week':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      // Default to week
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
  }
  
  return { startDate, endDate };
};

/**
 * Check if a date is today
 * @param {Date|string} date - The date to check
 * @returns {boolean} True if the date is today, false otherwise
 */
export const isToday = (date) => {
  if (!date) return false;
  
  // If date is a string, parse it
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  const today = new Date();
  
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};

export default {
  formatDate,
  formatTime,
  formatDateTime,
  getRelativeTimeString,
  getDateRangeForPeriod,
  isToday
};