import axios from 'axios';

const api = axios.create({
  // baseURL এ মূল ডোমেইন রাখুন, এন্ডপয়েন্টে /api/gear ব্যবহার করব
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://gear-up-beta.vercel.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;