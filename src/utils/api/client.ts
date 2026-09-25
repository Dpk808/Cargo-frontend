import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000',
  withCredentials: true, // this sends the HttpOnly cookie automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },  
  (error) => {
    if (error?.response?.status === 401) {
      window.location.replace('/auth/login');
    }

    return Promise.reject(error);
  },
);