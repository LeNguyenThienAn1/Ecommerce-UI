import axios from "axios";

const BASE_URL = "https://localhost:7165/api";

// ✅ Tự động gắn token từ localStorage
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const OrderApi = {
  // 📦 Dành cho user
  getAll: () => axios.get(`${BASE_URL}/Order`, authHeader()),
  getById: (id) => axios.get(`${BASE_URL}/Order/${id}`, authHeader()),
  getByUser: (userId) => axios.get(`${BASE_URL}/Order/user/${userId}`, authHeader()),
  approve: (id) => axios.put(`${BASE_URL}/Order/${id}/approve`, {}, authHeader()),
  reject: (id) => axios.put(`${BASE_URL}/Order/${id}/reject`, {}, authHeader()),
  cancel: (id) => axios.put(`${BASE_URL}/Order/${id}/cancel`, {}, authHeader()),

  // 🧑‍💼 Dành cho admin
  updateStatus: (id, newStatus) =>
    axios.put(
      `${BASE_URL}/Admin/orders/${id}/status`,
      { status: Number(newStatus) }, // có thể là số hoặc chuỗi nếu đã bật converter
      authHeader()
    ),
};
