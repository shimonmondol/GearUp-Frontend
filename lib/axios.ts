import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://gear-up-beta.vercel.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 📌 Axios Request Interceptor: প্রতিটি রিকোয়েস্টে অটোমেটিক টোকেন পাঠাবে
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;