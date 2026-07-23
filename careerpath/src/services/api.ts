import axios from 'axios';

let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
if (API_URL && !API_URL.endsWith('/api') && !API_URL.endsWith('/api/')) {
  API_URL = API_URL.replace(/\/$/, '') + '/api';
}

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Necessary to send/receive secure cookies
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
  onboardSkills: (data: { selectedSkills: string[] }) => api.post('/careerpath/onboard', data),
  enroll: (data: { categoryKey: string }) => api.post('/careerpath/enroll', data),
  completeModule: (data: { categoryKey: string, moduleId: string, examScore: number }) => api.post('/careerpath/module/complete', data),
  generateCertificate: (data: { categoryKey: string }) => api.post('/careerpath/certificate', data),
  getUserDashboard: () => api.get('/careerpath/dashboard'),
};
