import api from './api';

// Gọi API POST /api/product/get
export const getProduct = () => {
  return api.post('/product/get');
};
