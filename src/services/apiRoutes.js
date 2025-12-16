// API Routes Configuration (Using JSONPlaceholder for testing)
export const API_ROUTES = {
  // Auth routes (mock)
  AUTH: {
    LOGIN: '/users/1',
    REGISTER: '/users',
    LOGOUT: '/users/1',
    REFRESH: '/users/1',
  },
  
  // User routes
  USERS: {
    PROFILE: '/users/1',
    UPDATE_PROFILE: '/users/1',
    DELETE_ACCOUNT: '/users/1',
    UPLOAD_AVATAR: '/users/1',
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
};

console.log('📋 API Routes loaded:', Object.keys(API_ROUTES));