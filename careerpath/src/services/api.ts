import axios from 'axios';

let API_URL = import.meta.env.VITE_API_URL || 'https://api.usefixam.com/api';
if (API_URL && !API_URL.endsWith('/api') && !API_URL.endsWith('/api/')) {
  API_URL = API_URL.replace(/\/$/, '') + '/api';
}

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Necessary to send/receive secure cookies
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('careerpath_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to catch auth errors globally (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized logic if needed
    }
    return Promise.reject(error);
  }
);

export const careerpathApi = {
  onboardSkills: (data: { selectedSkills: string[] }) => api.post('/v1/careerpath/onboard', data),
  enroll: (data: { categoryKey: string }) => api.post('/v1/careerpath/enroll', data),
  completeModule: (data: { categoryKey: string, moduleId: string, examScore: number }) => api.post('/v1/careerpath/module/complete', data),
  generateCertificate: (data: { categoryKey: string }) => api.post('/v1/careerpath/certificate', data),
  getUserDashboard: () => api.get('/v1/careerpath/dashboard'),
  toggleBookmark: (categoryKey: string) => api.post(`/v1/careerpath/bookmark/${categoryKey}`),
};
