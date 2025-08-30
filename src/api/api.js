// src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7165", // ✅ phải dùng HTTPS
});

export default api;
