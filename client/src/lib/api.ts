import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

const api = axios.create({ baseURL: API_URL });

// Request interceptor: attach token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: auto refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');
        const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        localStorage.setItem('accessToken', data.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(originalRequest);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        if (typeof window !== 'undefined') window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export function getImageUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${process.env.NEXT_PUBLIC_UPLOAD_URL || 'http://localhost:4000'}${url}`;
}

// API helper functions
export const authAPI = {
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  register: (data: { email: string; name: string; password: string; phone?: string }) => api.post('/auth/register', data),
  refresh: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
  logout: () => api.post('/auth/logout'),
};

export const userAPI = {
  getMe: () => api.get('/users/me'),
  updateMe: (data: any) => api.put('/users/me', data),
};

export const listingAPI = {
  getListings: (params?: any) => api.get('/listings', { params }),
  getListing: (id: string) => api.get(`/listings/${id}`),
  createListing: (data: any) => api.post('/listings', data),
  updateListing: (id: string, data: any) => api.put(`/listings/${id}`, data),
  deleteListing: (id: string) => api.delete(`/listings/${id}`),
  markSold: (id: string) => api.patch(`/listings/${id}/sold`),
  getMyListings: () => api.get('/listings/mine'),
  uploadImages: (id: string, formData: FormData) => api.post(`/listings/${id}/images`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export const favoriteAPI = {
  getFavorites: () => api.get('/favorites'),
  addFavorite: (listingId: string) => api.post(`/favorites/${listingId}`),
  removeFavorite: (listingId: string) => api.delete(`/favorites/${listingId}`),
};

export const chatAPI = {
  getConversations: () => api.get('/conversations'),
  createConversation: (data: { listingId: string; recipientId: string }) => api.post('/conversations', data),
  getMessages: (conversationId: string) => api.get(`/conversations/${conversationId}/messages`),
  sendMessage: (data: { conversationId: string; content: string }) => api.post('/messages', data),
};

export const reportAPI = {
  reportListing: (listingId: string, data: { reason: string; description?: string }) => api.post(`/listings/${listingId}/report`, data),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getPendingListings: () => api.get('/admin/listings/pending'),
  approveListing: (id: string) => api.patch(`/admin/listings/${id}/approve`),
  rejectListing: (id: string) => api.patch(`/admin/listings/${id}/reject`),
  getUsers: () => api.get('/admin/users'),
  toggleBan: (id: string) => api.patch(`/admin/users/${id}/ban`),
  getReports: () => api.get('/admin/reports'),
};
