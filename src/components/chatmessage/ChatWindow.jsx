import { useEffect, useState, useCallback } from "react";
import { ChatApi } from "../../api/chatApi";
import { connection } from "../../signalr/chatHub"; // Import kết nối SignalR

export default function ChatWindow({ currentUserId, receiver }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    // 1. TẢI LỊCH SỬ TIN NHẮN (dùng useCallback để tối ưu)
    const loadMessages = useCallback(async () => {
        // Chỉ tải khi có thông tin người nhận
        if (!receiver?.id) {
            setMessages([]); // Nếu không có người nhận, xóa tin nhắn cũ
            return;
        }

        try {
            // Gọi hàm API đã được sửa đúng với endpoint
            const res = await ChatApi.getMessages(receiver.id);
            // Giả định API trả về một mảng tin nhắn có thuộc tính `id` duy nhất
            setMessages(res.data || []);
        } catch (err) {
            console.error("❌ Lỗi khi tải tin nhắn:", err);
            setMessages([]); // Set về mảng rỗng nếu có lỗi
        }
    }, [receiver?.id]); // Phụ thuộc vào ID của người nhận

    // useEffect để gọi hàm loadMessages khi người nhận thay đổi
    useEffect(() => {
        loadMessages();
    }, [loadMessages]);

    // 2. LẮNG NGHE TIN NHẮN REAL-TIME TỪ SIGNALR
    useEffect(() => {
        // Đảm bảo connection đã tồn tại
        if (!connection) {
            return;
        }

        // Hàm xử lý khi nhận được tin nhắn mới
        const receiveMessageHandler = (msg) => {
            // Kiểm tra tin nhắn có thuộc cuộc hội thoại hiện tại không
            const isRelevant =
                (msg.senderId === receiver?.id && msg.receiverId === currentUserId) ||
                (msg.senderId === currentUserId && msg.receiverId === receiver?.id);

            if (isRelevant) {
                // Chống trùng lặp: Chỉ thêm tin nhắn nếu nó chưa tồn tại trong state
                setMessages((prevMessages) => {
                    if (!prevMessages.some((m) => m.id === msg.id)) {
                        return [...prevMessages, msg];
                    }
                    return prevMessages; // Trả về state cũ nếu tin nhắn đã tồn tại
                });
            }
        };

        connection.on("ReceiveMessage", receiveMessageHandler);

        // CLEANUP: Gỡ bỏ listener khi component unmount hoặc receiver thay đổi
        return () => {
            connection.off("ReceiveMessage", receiveMessageHandler);
        };
    }, [receiver?.id, currentUserId]); // Phụ thuộc vào người nhận và người dùng hiện tại

    // 3. GỬI TIN NHẮN MỚI
    const handleSend = async () => {
        if (!newMessage.trim() || !receiver?.id) return;

        const messageData = {
            receiverId: receiver.id,
            message: newMessage.trim(),
        };

        try {
            // Gửi tin nhắn qua API
            await ChatApi.sendMessage(messageData);
            
            // Xóa nội dung trong ô input sau khi gửi thành công
            setNewMessage("");

            // LƯU Ý: Không cần tự thêm tin nhắn vào state ở đây nữa (Optimistic UI)
            // vì server sẽ gửi lại tin nhắn đó qua SignalR và useEffect ở trên sẽ bắt được nó.
            // Điều này giúp đảm bảo dữ liệu luôn đồng bộ với server và chống trùng lặp.

        } catch (err) {
            console.error("❌ Gửi tin nhắn thất bại:", err);
            // Có thể hiển thị thông báo lỗi cho người dùng ở đây
        }
    };

    return (
        <div className="flex flex-col h-full bg-white border border-gray-200 rounded-xl shadow-lg">
            {/* Header */}
            <div className="p-4 border-b font-semibold text-lg text-blue-600 bg-gray-50 rounded-t-xl">
                💬 Đang chat với: {receiver?.fullName || "Hỗ trợ"}
            </div>

            {/* Nội dung tin nhắn */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.map((msg) => (
                    <div
                        // ✅ SỬ DỤNG ID DUY NHẤT LÀM KEY
                        key={msg.id}
                        className={`flex ${
                            msg.senderId === currentUserId ? "justify-end" : "justify-start"
                        }`}
                    >
                        <div
                            className={`px-4 py-2 rounded-xl max-w-[70%] shadow-md text-sm break-words ${
                                msg.senderId === currentUserId
                                    ? "bg-blue-500 text-white rounded-br-none"
                                    : "bg-gray-200 text-gray-800 rounded-tl-none"
                            }`}
                        >
                            {msg.message || msg.content}
                            <p className="text-xs mt-1 opacity-80 text-right">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Ô nhập tin */}
            <div className="p-4 border-t flex gap-2 bg-white rounded-b-xl">
                <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault(); // Ngăn xuống dòng khi nhấn Enter
                            handleSend();
                        }
                    }}
                />
                <button
                    onClick={handleSend}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={!newMessage.trim()}
                >
                    Gửi
                </button>
            </div>
        </div>
    );
}