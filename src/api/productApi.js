// src/api/productApi.js
import api from "./api";

export const getProducts = () => api.get("/api/Products/Paging");
export const getFeaturedProducts = () => api.get("/api/FeaturedProduct");
export const getBrands = () => api.get("/api/brands");
export const getCategories = () => api.get("/api/categories");
export const searchProducts = (keyword) =>
  api.get(`/api/Products/search?keyword=${keyword}`);