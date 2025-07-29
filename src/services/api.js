import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // hoặc port bạn dùng
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
