// frontend/src/services/api.js
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific error codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear auth state
          useAuthStore.getState().logout();
          toast.error('انتهت الجلسة، الرجاء تسجيل الدخول مرة أخرى');
          break;
        case 403:
          toast.error('ليس لديك صلاحية للوصول');
          break;
        case 404:
          toast.error('الصفحة غير موجودة');
          break;
        case 429:
          toast.error('طلبات كثيرة جداً، حاول بعد قليل');
          break;
        case 500:
          toast.error('خطأ في الخادم');
          break;
        default:
          toast.error(error.response.data?.message || 'حدث خطأ');
      }
    } else if (error.request) {
      toast.error('لا يمكن الاتصال بالخادم');
    } else {
      toast.error('خطأ في الطلب');
    }
    
    return Promise.reject(error);
  }
);

// Chat API
export const chatAPI = {
  sendMessage: (data) => api.post('/chat/message', data),
  getConversations: (page = 1) => api.get(`/chat/conversations?page=${page}`),
  getConversation: (id) => api.get(`/chat/conversation/${id}`),
  deleteConversation: (id) => api.delete(`/chat/conversation/${id}`),
  toggleStar: (id) => api.patch(`/chat/conversation/${id}/star`),
  shareConversation: (id) => api.post(`/chat/conversation/${id}/share`)
};

// Tools API
export const toolsAPI = {
  generateArticle: (data) => api.post('/tools/article', data),
  generateCode: (data) => api.post('/tools/code', data),
  translate: (data) => api.post('/tools/translate', data),
  summarize: (data) => api.post('/tools/summarize', data),
  analyzeData: (data) => api.post('/tools/analyze', data),
  generateIdeas: (data) => api.post('/tools/ideas', data),
  generateImage: (data) => api.post('/tools/image', data),
  textToSpeech: (data) => api.post('/tools/tts', data, { responseType: 'blob' }),
  speechToText: (data) => {
    const formData = new FormData();
    formData.append('audio', data);
    return api.post('/tools/stt', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

// User API
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  updateSettings: (data) => api.patch('/user/settings', data),
  getUsage: () => api.get('/user/usage'),
  getBilling: () => api.get('/user/billing')
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (page = 1) => api.get(`/admin/users?page=${page}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getLogs: () => api.get('/admin/logs')
};

export default api;
