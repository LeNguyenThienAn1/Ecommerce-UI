import axios from "axios";

// ⚠️ KHUYẾN NGHỊ: Sử dụng biến môi trường cho API_URL
// const BASE_API_URL = import.meta.env.VITE_API_BASE_URL || "https://api.yourdomain.com/api";
// Tạm thời sử dụng địa chỉ mock cho môi trường phát triển
const BASE_API_URL = "https://localhost:7165/api";

// 1. Tạo một instance Axios
const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authService = {
  // -----------------------
  // 🔑 AUTH OPERATIONS
  // -----------------------

  login: async ({ phoneNumber, password }) => {
    try {
      const res = await api.post("/Auth/login", { phoneNumber, password });

      // ✅ Tự động lấy cả user hoặc User
      const user = res.data.user || res.data.User || null;

      // ✅ Nếu backend trả "Id" thay vì "id", normalize lại
      if (user && user.Id && !user.id) {
        user.id = user.Id;
      }

      // ✅ Lưu trữ token + thông tin user
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      return res.data;
    } catch (error) {
      // Ném lỗi ra ngoài để component có thể hiển thị
      throw error.response?.data || new Error("Đăng nhập thất bại.");
    }
  },

  register: async ({ phoneNumber, password, name }) => {
    try {
      const res = await api.post("/Auth/register", { phoneNumber, password, name });
      return res.data;
    } catch (error) {
      throw error.response?.data || new Error("Đăng ký thất bại.");
    }
  },

  logout: async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    // Nếu có refreshToken, gọi API để hủy token trên server
    if (refreshToken) {
      try {
        await api.post("/Auth/logout", { refreshToken });
      } catch (err) {
        // Cảnh báo nhưng vẫn tiếp tục xóa dữ liệu local
        console.warn(
          "Logout API failed (Server-side token revocation failed):",
          err.response?.data || err.message
        );
      }
    }

    // Luôn xóa dữ liệu local cuối cùng
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },

  // -----------------------
  // 🔄 TOKEN MANAGEMENT
  // -----------------------

  refreshToken: async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;

    try {
      const res = await api.post("/Auth/refresh-token", { refreshToken });

      // ✅ Lưu lại token mới
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      // ✅ Nếu response có user thì cập nhật lại luôn
      const user = res.data.user || res.data.User;
      if (user) {
        if (user.Id && !user.id) user.id = user.Id;
        localStorage.setItem("user", JSON.stringify(user));
      }

      return res.data;
    } catch (error) {
      console.error("Token refresh failed. Logging out user.", error.response?.data || error.message);
      // Nếu Refresh Token thất bại, thực hiện logout
      authService.logout();
      return null;
    }
  },

  // 🆕 Kiểm tra tính hợp lệ của token hiện tại
  verifyToken: async () => {
    const accessToken = localStorage.getItem("accessToken");
    const user = authService.getCurrentUser();

    if (!accessToken || !user) return null;

    try {
      // Giả định có một endpoint xác thực Access Token
      await api.get("/Auth/verify-token", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // Nếu thành công, trả về thông tin user hiện tại
      return user;
    } catch (error) {
      // Nếu token hết hạn hoặc không hợp lệ, thử làm mới
      const newTokens = await authService.refreshToken();
      if (newTokens) {
        return authService.getCurrentUser();
      }
      return null;
    }
  },

  // -----------------------
  // ℹ️ LOCAL DATA
  // -----------------------

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  getAccessToken: () => {
    return localStorage.getItem("accessToken");
  },
};
