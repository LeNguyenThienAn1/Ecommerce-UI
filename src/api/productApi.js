// src/api/productApi.js
import axios from 'axios';

// Cấu hình một instance của axios với baseURL từ port bạn đã tìm thấy
const apiClient = axios.create({
  baseURL: 'https://localhost:7104/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Lấy danh sách tất cả sản phẩm (có thể có tham số phân trang, lọc)
 * Tương ứng với: GET /api/products
 */
export const getProducts = async () => {
  try {
    const response = await apiClient.get('/products');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sản phẩm:', error);
    throw error;
  }
};

/**
 * Lấy thông tin chi tiết của một sản phẩm bằng ID
 * Tương ứng với: GET /api/products/{id}
 */
export const getProductById = async (productId) => {
  try {
    const response = await apiClient.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy sản phẩm với ID ${productId}:`, error);
    throw error;
  }
};

/**
 * Tạo một sản phẩm mới (dành cho admin)
 * Tương ứng với: POST /api/products
 */
export const createProduct = async (productData) => {
  try {
    const response = await apiClient.post('/products', productData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo sản phẩm:', error);
    throw error;
  }
};

/**
 * Cập nhật thông tin một sản phẩm (dành cho admin)
 * Tương ứng với: PUT /api/products/{id}
 */
export const updateProduct = async (productId, productData) => {
  try {
    const response = await apiClient.put(`/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật sản phẩm với ID ${productId}:`, error);
    throw error;
  }
};

/**
 * Xóa một sản phẩm (dành cho admin)
 * Tương ứng với: DELETE /api/products/{id}
 */
export const deleteProduct = async (productId) => {
  try {
    await apiClient.delete(`/products/${productId}`);
  } catch (error) {
    console.error(`Lỗi khi xóa sản phẩm với ID ${productId}:`, error);
    throw error;
  }
};