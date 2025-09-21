export const CONSTANTS = {
    // API endpoints
    API_BASE_URL: process.env.REACT_APP_API_URL,
    WS_BASE_URL: process.env.REACT_APP_WEBSOCKET_URL,
    
    // App settings
    MAX_PHOTOS: 6,
    MIN_PHOTOS: 2,
    MAX_BIO_LENGTH: 500,
    MIN_BIO_LENGTH: 20,
    MAX_INTERESTS: 10,
    MIN_INTERESTS: 3,
    MIN_AGE: 18,
    MAX_AGE: 100,
    MAX_DISTANCE_KM: 200,
    
    // Matching
    SWIPE_THRESHOLD: 100,
    CANDIDATES_PER_BATCH: 10,
    
    // Chat
    MESSAGE_PAGE_SIZE: 50,
    MAX_MESSAGE_LENGTH: 1000,
    TYPING_TIMEOUT: 3000,
    
    // Video
    MAX_VIDEO_DURATION: 30 * 60 * 1000, // 30 minutes
    VIDEO_QUALITY: {
      width: 1280,
      height: 720,
      frameRate: 30,
    },
    
    // Storage
    PHOTO_UPLOAD_MAX_SIZE: 5 * 1024 * 1024, // 5MB
    VIDEO_UPLOAD_MAX_SIZE: 50 * 1024 * 1024, // 50MB
    
    // Regex patterns
    PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    
    // Error messages
    ERRORS: {
      NETWORK: 'Network error. Please check your connection.',
      UNAUTHORIZED: 'You need to log in to access this feature.',
      SERVER: 'Something went wrong. Please try again later.',
      VALIDATION: 'Please check your input and try again.',
    },
  };