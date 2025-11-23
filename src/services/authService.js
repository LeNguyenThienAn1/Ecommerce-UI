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

// Biến cờ để theo dõi trạng thái làm mới token (Ngăn ngừa nhiều request refresh token cùng lúc)
let isRefreshing = false;
// Queue để lưu trữ các request bị lỗi 401 khi đang đợi refresh token
let failedQueue = [];

// Hàm xử lý các request đang chờ
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      // Nếu có token mới, retry request với token mới
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// =========================================================
// INTERCEPTOR 1: Gắn token vào mỗi Request (Request Interceptor)
// =========================================================
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =========================================================
// INTERCEPTOR 2: Xử lý lỗi 401 và Tự động làm mới Token (Response Interceptor)
// =========================================================
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi không phải 401, hoặc request là để đăng nhập/refresh token thì bỏ qua
    if (error.response?.status !== 401 || originalRequest.url.endsWith('/Auth/login') || originalRequest.url.endsWith('/Auth/refresh-token')) {
      return Promise.reject(error);
    }

    // Tránh lặp vô hạn khi token refresh thất bại
    if (originalRequest._retry) {
      authService.logout();
      return Promise.reject(error);
    }

    // 1. Xử lý hàng đợi
    if (isRefreshing) {
      // Nếu đang làm mới, đưa request vào hàng đợi
      return new Promise(function(resolve, reject) {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        // Thêm token mới vào header và thực hiện lại request
        originalRequest.headers['Authorization'] = 'Bearer ' + token;
        return api(originalRequest);
      }).catch(err => {
        return Promise.reject(err);
      });
    }

    // 2. Bắt đầu quá trình làm mới
    originalRequest._retry = true;
    isRefreshing = true;

    const refreshTokenValue = localStorage.getItem("refreshToken");

    if (refreshTokenValue) {
      try {
        const res = await authService.refreshTokenInternal(refreshTokenValue);
        isRefreshing = false;
        const newAccessToken = res.accessToken;
        processQueue(null, newAccessToken); // Xử lý các request đang chờ

        // Retry request gốc
        originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
        return api(originalRequest);
      } catch (err) {
        isRefreshing = false;
        processQueue(err, null); // Báo lỗi cho các request đang chờ
        authService.logout(); // Logout nếu refresh thất bại
        return Promise.reject(err);
      }
    } else {
      // Nếu không có refresh token, buộc logout
      isRefreshing = false;
      authService.logout();
      return Promise.reject(error);
    }
  }
);


export const authService = {
  // -----------------------
  // 🔑 AUTH OPERATIONS
  // -----------------------

  login: async ({ phoneNumber, password }) => {
    try {
      // Không sử dụng instance 'api' ở đây vì request này không cần Auth header
      const res = await axios.post(`${BASE_API_URL}/Auth/login`, { phoneNumber, password });

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
      // Không sử dụng instance 'api' ở đây
      const res = await axios.post(`${BASE_API_URL}/Auth/register`, { phoneNumber, password, name });
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
        // Sử dụng axios thông thường để tránh Interceptor lặp vô hạn
        await axios.post(`${BASE_API_URL}/Auth/logout`, { refreshToken });
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

  changePassword: async ({ userId, oldPassword, newPassword }) => {
    try {
      // Sử dụng 'api' vì request này cần xác thực
      const res = await api.post("/Auth/change-password", {
        userId,
        oldPassword,
        newPassword,
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || new Error("Đổi mật khẩu thất bại.");
    }
  },

  // -----------------------
  // 🔄 TOKEN MANAGEMENT
  // -----------------------
  
  // Hàm làm mới token (dành cho logic Interceptor nội bộ)
  refreshTokenInternal: async (refreshTokenValue) => {
    // Sử dụng axios thông thường để request này không bị bắt bởi Response Interceptor
    const res = await axios.post(`${BASE_API_URL}/Auth/refresh-token`, { refreshToken: refreshTokenValue });
    
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
  },

  // Hàm làm mới token (dành cho component gọi thủ công, hoặc AuthProvider)
  refreshToken: async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;

    try {
      const res = await authService.refreshTokenInternal(refreshToken);
      return res;
    } catch (error) {
      console.error("Token refresh failed. Logging out user.", error.response?.data || error.message);
      // Nếu Refresh Token thất bại, thực hiện logout
      authService.logout();
      return null;
    }
  },

  // 🆕 Kiểm tra tính hợp lệ của token hiện tại
  // Lưu ý: Chức năng này sẽ tự động được thay thế bởi Interceptor
  // khi các API call khác được thực hiện.
  verifyToken: async () => {
    const accessToken = localStorage.getItem("accessToken");
    const user = authService.getCurrentUser();

    if (!accessToken || !user) return null;

    try {
      // Giả định có một endpoint xác thực Access Token
      // Sử dụng api instance để tận dụng Interceptor (nếu token hết hạn)
      await api.get("/Auth/verify-token");
      // Nếu thành công, trả về thông tin user hiện tại
      return authService.getCurrentUser();
    } catch (error) {
      // Interceptor đã xử lý 401. Nếu vẫn lỗi, tức là lỗi khác.
      console.error("Token verification failed after refresh attempt.", error);
      authService.logout();
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

// Export instance api để các service khác sử dụng
export default api;