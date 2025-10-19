import axios from "axios";

const BASE_URL = "https://localhost:7165/api/Order";

export const OrderApi = {
  getAll: () => axios.get(BASE_URL),
  getById: (id) => axios.get(`${BASE_URL}/${id}`),
  getByUser: (userId) => axios.get(`${BASE_URL}/user/${userId}`),
  approve: (id) => axios.put(`${BASE_URL}/${id}/approve`),
  reject: (id) => axios.put(`${BASE_URL}/${id}/reject`),
  cancel: (id) => axios.put(`${BASE_URL}/${id}/cancel`),
};
