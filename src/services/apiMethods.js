import apiClient from './apiClient';
import { API_ROUTES } from './apiRoutes';

// Generic API methods with logging
export const apiMethods = {
  // GET method
  get: async (url, params = {}) => {
    console.log('📥 GET Request:', { url, params });
    try {
      const response = await apiClient.get(url, { params });
      console.log('✅ GET Success:', { url, data: response.data });
      return response.data;
    } catch (error) {
      console.error('❌ GET Error:', { url, error: error.message });
      throw error;
    }
  },

  // POST method
  post: async (url, data = {}) => {
    console.log('📤 POST Request:', { url, data });
    try {
      const response = await apiClient.post(url, data);
      console.log('✅ POST Success:', { url, data: response.data });
      return response.data;
    } catch (error) {
      console.error('❌ POST Error:', { url, error: error.message });
      throw error;
    }
  },

  // PUT method
  put: async (url, data = {}) => {
    console.log('🔄 PUT Request:', { url, data });
    try {
      const response = await apiClient.put(url, data);
      console.log('✅ PUT Success:', { url, data: response.data });
      return response.data;
    } catch (error) {
      console.error('❌ PUT Error:', { url, error: error.message });
      throw error;
    }
  },

  // PATCH method
  patch: async (url, data = {}) => {
    console.log('🔧 PATCH Request:', { url, data });
    try {
      const response = await apiClient.patch(url, data);
      console.log('✅ PATCH Success:', { url, data: response.data });
      return response.data;
    } catch (error) {
      console.error('❌ PATCH Error:', { url, error: error.message });
      throw error;
    }
  },

  // DELETE method
  delete: async (url) => {
    console.log('🗑️ DELETE Request:', { url });
    try {
      const response = await apiClient.delete(url);
      console.log('✅ DELETE Success:', { url, data: response.data });
      return response.data;
    } catch (error) {
      console.error('❌ DELETE Error:', { url, error: error.message });
      throw error;
    }
  },
};

// Specific API calls using routes
export const authAPI = {
  login: (credentials) => apiMethods.post(API_ROUTES.AUTH.LOGIN, credentials),
  register: (userData) => apiMethods.post(API_ROUTES.AUTH.REGISTER, userData),
  logout: () => apiMethods.post(API_ROUTES.AUTH.LOGOUT),
  refresh: (token) => apiMethods.post(API_ROUTES.AUTH.REFRESH, { token }),
};

export const userAPI = {
  getProfile: () => apiMethods.get(API_ROUTES.USERS.PROFILE),
  updateProfile: (data) => apiMethods.put(API_ROUTES.USERS.UPDATE_PROFILE, data),
  deleteAccount: () => apiMethods.delete(API_ROUTES.USERS.DELETE_ACCOUNT),
  uploadAvatar: (formData) => apiMethods.post(API_ROUTES.USERS.UPLOAD_AVATAR, formData),
};

export const photoAPI = {
  getPhotos: (params) => apiMethods.get(API_ROUTES.PHOTOS.LIST, params),
  uploadPhoto: (formData) => apiMethods.post(API_ROUTES.PHOTOS.UPLOAD, formData),
  getPhoto: (id) => apiMethods.get(API_ROUTES.PHOTOS.GET_BY_ID(id)),
  updatePhoto: (id, data) => apiMethods.put(API_ROUTES.PHOTOS.UPDATE(id), data),
  deletePhoto: (id) => apiMethods.delete(API_ROUTES.PHOTOS.DELETE(id)),
};

console.log('🔧 API Methods initialized:', Object.keys(apiMethods));