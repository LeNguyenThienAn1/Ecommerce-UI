// TRONG ChatApi.js

import axios from "axios";

// Định nghĩa URL gốc của API
const API_BASE_URL = "https://localhost:7165/api";

// Tạo một axios instance riêng
const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Sử dụng interceptor để tự động gắn token
axiosClient.interceptors.request.use(
    (config) => {
        // ✅ Đọc token từ key "accessToken"
        const token = localStorage.getItem("accessToken");

        console.log(`[Axios Interceptor] Đang đính kèm token: ${token ? 'Đã tìm thấy' : 'Không tìm thấy'}`);

        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Định nghĩa các phương thức API
export const ChatApi = {
    // ----------------------------------------------------
    // 1. LẤY DỮ LIỆU
    // ----------------------------------------------------

    /**
     * Lấy danh sách các cuộc hội thoại đã có.
     * GET /api/RealTimeChat/conversations
     */
    getConversations: () => {
        return axiosClient.get("/RealTimeChat/conversations");
    },

    /**
     * Lấy lịch sử tin nhắn với một người dùng cụ thể.
     * GET /api/RealTimeChat/conversation/{withUserId}
     */
    getMessages: (withUserId) => {
        return axiosClient.get(`/RealTimeChat/conversation/${withUserId}`);
    },

    /**
     * Lấy số lượng tin nhắn chưa đọc.
     * GET /api/RealTimeChat/unread-count
     */
    getUnreadCount: () => {
        return axiosClient.get("/RealTimeChat/unread-count");
    },

    // ----------------------------------------------------
    // 2. GỬI VÀ CẬP NHẬT TRẠNG THÁI
    // ----------------------------------------------------

    /**
     * Gửi một tin nhắn mới.
     * POST /api/RealTimeChat/send
     * @param {object} messageData - { receiverId: string, message: string }
     */
    sendMessage: (messageData) => {
        return axiosClient.post("/RealTimeChat/send", messageData);
    },

    /**
     * Đánh dấu một tin nhắn cụ thể là đã đọc.
     * POST /api/RealTimeChat/mark-read/{messageId}
     * @param {string} messageId - ID của tin nhắn cần đánh dấu đã đọc.
     */
    markMessageAsRead: (messageId) => {
        // Lưu ý: Endpoint này không cần truyền body
        return axiosClient.post(`/RealTimeChat/mark-read/${messageId}`);
    },

    /**
     * Đánh dấu toàn bộ tin nhắn trong cuộc hội thoại với {withUserId} là đã đọc.
     * POST /api/RealTimeChat/mark-conversation-read/{withUserId}
     * @param {string} withUserId - ID của người dùng đang chat cùng.
     */
    markConversationAsRead: (withUserId) => {
        // Lưu ý: Endpoint này không cần truyền body
        return axiosClient.post(`/RealTimeChat/mark-conversation-read/${withUserId}`);
    },
};