import * as signalR from "@microsoft/signalr";
import { authService } from "../services/authService";

/**
 * Biến toàn cục để lưu trữ kết nối SignalR.
 * Việc sử dụng biến global/export như thế này giúp dễ dàng truy cập từ các component khác.
 */
export let connection;

/**
 * Bắt đầu kết nối SignalR.
 * Hàm này sẽ tự động lấy token từ authService.
 */
export const startConnection = async () => {
    const token = authService.getAccessToken();
    // 1. Kiểm tra Token: Nếu không có token, không cố gắng kết nối để tránh lỗi 401.
    if (!token) {
        console.error("❌ Token không tìm thấy. Bỏ qua kết nối SignalR.");
        return;
    }
    
    // 2. Xử lý Kết nối cũ: Nếu kết nối đã tồn tại và đang hoạt động, dừng nó trước khi tạo mới.
    // Điều này giúp tránh rò rỉ bộ nhớ hoặc trùng lặp kết nối.
    if (connection && connection.state === signalR.HubConnectionState.Connected) {
        try {
            await connection.stop();
            console.log("🛑 Đã dừng kết nối SignalR cũ.");
        } catch (stopErr) {
            console.error("Lỗi khi dừng kết nối cũ:", stopErr);
        }
    }

    // 3. Khởi tạo Hub Connection
    connection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7165/chathub", {
            // Cập nhật: accessTokenFactory sẽ luôn lấy token mới nhất từ authService
            // mỗi khi SignalR cần (kể cả khi kết nối lại).
            accessTokenFactory: () => authService.getAccessToken(),
        })
        .withAutomaticReconnect({
            // Cấu hình thử kết nối lại tự động
            nextRetryDelayInMilliseconds: retryContext => {
                // Thử lại trong vòng 1 phút
                if (retryContext.elapsedMilliseconds < 60000) { 
                    return 2000; // Thử lại sau 2 giây
                } else {
                    return null; // Dừng thử lại sau 1 phút nếu không thành công
                }
            }
        })
        .build();

    // 4. Bắt đầu Kết nối
    try {
        await connection.start();
        console.log("✅ SignalR kết nối thành công.");
    } catch (err) {
        console.error("❌ Lỗi kết nối SignalR (Kiểm tra lỗi 401/CORS Server):", err);
        // Nếu lỗi 401 xảy ra ở đây, hãy kiểm tra:
        // a) Token có hết hạn không?
        // b) Cấu hình [Authorize] và middleware (UseAuthentication/UseAuthorization) trên Server đã đúng chưa?
    }
};

/**
 * Hàm dừng kết nối SignalR (Quan trọng cho Cleanup trong useEffect).
 */
export const stopConnection = async () => {
    if (connection) {
        try {
            await connection.stop();
            console.log("🛑 SignalR connection stopped.");
        } catch (err) {
            console.error("Lỗi khi dừng kết nối:", err);
        }
    }
};
