import axios from "axios";
import { authService } from "../services/authService"; // ⚠️ nhớ import service quản lý token

const API_URL = "https://localhost:7165/api/Wishlist";

export const WishlistApi = {
  // 🔹 Lấy danh sách sản phẩm yêu thích
  getAll: async () => {
    const token = authService.getAccessToken(); // 👉 lấy token từ localStorage hoặc context
    const res = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },

  // 🔹 Thêm hoặc xóa sản phẩm yêu thích
  toggle: async (productId) => {
    const token = authService.getAccessToken();
    const res = await axios.post(
      `${API_URL}/toggle/${productId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  },
};
