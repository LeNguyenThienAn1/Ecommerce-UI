import { useState, useEffect, useCallback } from "react";
import { startConnection, stopConnection, connection } from "../../signalr/chatHub";
import ChatList from "../../components/chatmessage/ChatList";
import ChatWindow from "../../components/chatmessage/ChatWindow";
import { ChatApi } from "../../api/chatApi"; // ✅ Đảm bảo import đúng file API của bạn

export default function AdminChatPage() {
    const [isSignalRConnected, setIsSignalRConnected] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const currentUser = JSON.parse(localStorage.getItem("user"));
    const currentUserId = currentUser?.id;

    // ✅ Hàm tải danh sách hội thoại ban đầu
    const fetchConversations = useCallback(async () => {
        try {
            const res = await ChatApi.getConversations();
            setConversations(res.data || []);
        } catch (err) {
            console.error("❌ Lỗi khi tải danh sách cuộc hội thoại:", err);
            setConversations([]);
        }
    }, []);

    // ✅ Effect để kết nối SignalR và tải dữ liệu lần đầu
    useEffect(() => {
        const initializeChat = async () => {
            setIsLoading(true);
            try {
                await startConnection();
                if (connection?.state === "Connected") {
                    setIsSignalRConnected(true);
                    await fetchConversations();
                }
            } catch (error) {
                console.error("❌ Lỗi nghiêm trọng khi khởi tạo SignalR:", error);
            } finally {
                setIsLoading(false);
            }
        };
        initializeChat();
        return () => {
            stopConnection();
        };
    }, [fetchConversations]);

    // ✅ Effect để lắng nghe tin nhắn/hội thoại mới trong real-time
    useEffect(() => {
        if (isSignalRConnected && connection) {
            const handleReceiveMessage = (newMessage) => {
                setConversations(prev => {
                    const existingConvIndex = prev.findIndex(c => c.withUserId === newMessage.senderId);
                    // Nếu đã có hội thoại
                    if (existingConvIndex > -1) {
                        const updatedConv = { ...prev[existingConvIndex] };
                        updatedConv.lastMessage = {
                            message: newMessage.message,
                            timestamp: newMessage.timestamp,
                        };
                        if (selectedUser?.id !== newMessage.senderId) {
                            updatedConv.unreadCount = (updatedConv.unreadCount || 0) + 1;
                        }
                        const newConversations = [...prev];
                        newConversations.splice(existingConvIndex, 1);
                        return [updatedConv, ...newConversations];
                    } 
                    // Nếu là hội thoại mới
                    else {
                        const newConversation = {
                            withUserId: newMessage.senderId,
                            withUserName: newMessage.senderName, // Backend cần gửi kèm senderName
                            lastMessage: {
                                message: newMessage.message,
                                timestamp: newMessage.timestamp,
                            },
                            unreadCount: 1,
                        };
                        return [newConversation, ...prev];
                    }
                });
            };

            connection.on("ReceiveMessage", handleReceiveMessage);
            return () => {
                connection.off("ReceiveMessage", handleReceiveMessage);
            };
        }
    }, [isSignalRConnected, selectedUser]);

    // ✅ Hàm xử lý khi admin chọn một hội thoại
    const handleSelectUser = (conversation) => {
        const userForChat = {
            id: conversation.withUserId,
            fullName: conversation.withUserName,
        };
        setSelectedUser(userForChat);
        // Đánh dấu đã đọc ở UI ngay lập tức
        handleMarkAsRead(conversation.withUserId);
    };
    
    // ✅ Hàm cập nhật UI để xóa số tin nhắn chưa đọc
    const handleMarkAsRead = (userId) => {
        setConversations(prev =>
            prev.map(conv =>
                conv.withUserId === userId ? { ...conv, unreadCount: 0 } : conv
            )
        );
    };

    if (isLoading) return <div className="text-center p-10">Đang tải dữ liệu...</div>;
    if (!isSignalRConnected) return <div className="text-center p-10 text-red-500">Không thể kết nối tới dịch vụ chat.</div>;

    return (
        <div className="flex h-[80vh] bg-gray-50 border rounded-lg shadow-inner overflow-hidden">
            <ChatList
                conversations={conversations}
                onSelect={handleSelectUser}
                selectedUserId={selectedUser?.id}
            />
            <div className="flex-1 border-l border-gray-200">
                {selectedUser ? (
                    <ChatWindow
                        key={selectedUser.id} // Quan trọng: reset component khi đổi người chat
                        currentUserId={currentUserId}
                        receiver={selectedUser}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <p className="text-xl">Vui lòng chọn một cuộc hội thoại để bắt đầu.</p>
                    </div>
                )}
            </div>
        </div>
    );
}