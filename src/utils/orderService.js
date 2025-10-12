import axios from "axios";

const API_URL = "https://localhost:7165/api/Order"; // đổi theo URL backend của bạn

// Tạo đơn hàng
export const createOrder = async (orderDto, billInfo) => {
  const payload = {
    order: orderDto,
    bill: billInfo,
  };
  const res = await axios.post(API_URL, payload);
  return res.data;
};

// Lấy danh sách đơn hàng
export const getOrders = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

// Lấy chi tiết 1 đơn hàng
export const getOrderById = async (orderId) => {
  const res = await axios.get(`${API_URL}/${orderId}`);
  return res.data;
};

// Hủy đơn hàng
export const cancelOrder = async (orderId) => {
  const res = await axios.put(`${API_URL}/${orderId}/cancel`);
  return res.data;
};
