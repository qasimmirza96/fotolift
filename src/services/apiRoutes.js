// API Base URL - Update this with your backend URL
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.fotolift.com/api';

// API Routes Configuration
export const API_ROUTES = {
  // Auth routes
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  
  // User routes
  USERS: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    DELETE_ACCOUNT: '/user/account',
    UPLOAD_AVATAR: '/user/avatar',
    CREDITS: '/user/credits',
  },
  
  // Photos routes
  PHOTOS: {
    LIST: '/photos',
    UPLOAD: '/photos',
    GET_BY_ID: (id) => `/photos/${id}`,
    UPDATE: (id) => `/photos/${id}`,
    DELETE: (id) => `/photos/${id}`,
  },
  
  // Albums routes
  ALBUMS: {
    LIST: '/albums',
    CREATE: '/albums',
    GET_BY_ID: (id) => `/albums/${id}`,
    UPDATE: (id) => `/albums/${id}`,
    DELETE: (id) => `/albums/${id}`,
  },
  
  // Credits routes
  CREDITS: {
    GET: '/user/credits',
    DEDUCT: '/credits/deduct',
    HISTORY: '/credits/history',
  },
  
  // Subscription routes
  SUBSCRIPTIONS: {
    PLANS: '/subscriptions/plans',
    CREATE: '/subscriptions/create',
    CURRENT: '/subscriptions/current',
    CANCEL: '/subscriptions/cancel',
    UPDATE: '/subscriptions/update',
  },
  
  // Usage routes
  USAGE: {
    HISTORY: '/usage/history',
    STATS: '/usage/stats',
  },
};

console.log('📋 API Routes loaded:', Object.keys(API_ROUTES));