import axios from "axios";
import { authService } from "./authService";

const BASE_API_URL = "https://localhost:7165/api";

export const wishlistService = {
  // Lấy danh sách sản phẩm yêu thích
  getWishlist: async () => {
    const token = authService.getAccessToken();
    const res = await axios.get(`${BASE_API_URL}/Wishlist`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  // Thêm hoặc xóa sản phẩm khỏi yêu thích
  toggleWishlist: async (productId) => {
    const token = authService.getAccessToken();
    const res = await axios.post(`${BASE_API_URL}/Wishlist/toggle/${productId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};
