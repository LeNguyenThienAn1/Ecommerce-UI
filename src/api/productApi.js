// src/api/productApi.js
import api from "./api";

export const getProducts = () => api.get("/api/Products");
export const searchProducts = (keyword) =>
  api.get(`/api/Products/search?keyword=${keyword}`);