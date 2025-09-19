// src/api/productApi.js
import api from "./api";

export const getProducts = () => api.get("/api/Products/Paging");
export const getBrands = () => api.get("/api/Products/brands");
export const getCategories = () => api.get("/api/Products/categories");
export const searchProducts = (keyword) =>
  api.get(`/api/Products/search?keyword=${keyword}`);