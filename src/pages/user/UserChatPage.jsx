import { useState, useEffect } from "react";
import { startConnection, stopConnection, connection } from "../../signalr/chatHub";
import ChatWindow from "../../components/chatmessage/ChatWindow";

export default function UserChatPage() {
    // State để theo dõi trạng thái kết nối SignalR
    const [isSignalRConnected, setIsSignalRConnected] = useState(false);

    // Lấy thông tin người dùng hiện tại từ localStorage
    // Sử dụng optional chaining (?.) để tránh lỗi nếu 'user' không tồn tại
    const currentUser = JSON.parse(localStorage.getItem("user"));

    // Thông tin của Admin (được định nghĩa cứng)
    // ✅ Tốt nhất là nên lấy thông tin này từ API nếu có thể,
    // nhưng dùng tạm như thế này vẫn ổn cho chức năng chat trực tiếp với admin.
    const admin = {
        id: "42249b12-795d-493e-bf52-9f07b5d0e209", // ID của Admin trong DB
        fullName: "Bộ phận hỗ trợ",
    };

    // useEffect để quản lý vòng đời của kết nối SignalR
    useEffect(() => {
        // 1. Hàm để khởi tạo kết nối
        const connect = async () => {
            try {
                console.log("🚀 Bắt đầu kết nối SignalR...");
                await startConnection();
                
                // 2. Sau khi kết nối, kiểm tra trạng thái và cập nhật state
                // (@microsoft/signalr.HubConnectionState.Connected có giá trị là "Connected")
                if (connection?.state === "Connected") {
                    console.log("✅ Kết nối SignalR thành công.");
                    setIsSignalRConnected(true);
                }
            } catch (error) {
                console.error("❌ Lỗi nghiêm trọng khi khởi tạo kết nối SignalR:", error);
            }
        };

        connect();

        // 3. CLEANUP: Hàm này sẽ được gọi khi component bị unmount (người dùng rời trang)
        // Rất quan trọng để tránh rò rỉ kết nối!
        return () => {
            console.log("🛑 Ngắt kết nối SignalR khi rời khỏi trang.");
            stopConnection();
        };
    }, []); // Mảng rỗng `[]` đảm bảo useEffect này chỉ chạy một lần khi component được mount

    // Kiểm tra nếu không có người dùng đăng nhập
    if (!currentUser?.id) {
        return (
            <div className="p-5 text-center text-red-500">
                Vui lòng đăng nhập để sử dụng chức năng chat.
            </div>
        );
    }
    
    return (
        <div className="p-5 h-[80vh]">
            {/* ✅ Conditional Rendering: Chỉ hiển thị cửa sổ chat KHI đã kết nối thành công */}
            {isSignalRConnected ? (
                <ChatWindow 
                    currentUserId={currentUser.id} 
                    receiver={admin} 
                />
            ) : (
                <div className="flex items-center justify-center h-full text-lg text-gray-500">
                    <p>Đang kết nối tới máy chủ chat, vui lòng đợi...</p>
                </div>
            )}
        </div>
    );
}