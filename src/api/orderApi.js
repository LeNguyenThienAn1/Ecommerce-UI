import axios from "axios";

const BASE_URL = "https://localhost:7165/api/Order";

// ✅ Hàm tiện ích để tự động gắn token vào header
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const OrderApi = {
  getAll: () => axios.get(BASE_URL, authHeader()),
  getById: (id) => axios.get(`${BASE_URL}/${id}`, authHeader()),
  getByUser: (userId) => axios.get(`${BASE_URL}/user/${userId}`, authHeader()),
  approve: (id) => axios.put(`${BASE_URL}/${id}/approve`, {}, authHeader()),
  reject: (id) => axios.put(`${BASE_URL}/${id}/reject`, {}, authHeader()),
  cancel: (id) => axios.put(`${BASE_URL}/${id}/cancel`, {}, authHeader()),
};
