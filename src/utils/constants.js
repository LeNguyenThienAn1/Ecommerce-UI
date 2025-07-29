// API endpoints
export const API_BASE_URL = 'http://localhost:5000/api';

// Routes
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  ORDERS: '/orders'
};

// Product categories
export const CATEGORIES = {
  PHONES: 'phones',
  LAPTOPS: 'laptops',
  TABLETS: 'tablets',
  ACCESSORIES: 'accessories',
  AUDIO: 'audio'
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  CART: 'cart_items'
};