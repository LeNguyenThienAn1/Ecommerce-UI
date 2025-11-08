import { useState, useEffect } from "react";
import { startConnection, stopConnection, connection } from "../../signalr/chatHub";
import ChatWindow from "../../components/chatmessage/ChatWindow";

export default function UserChatPage() {
    // State để theo dõi trạng thái kết nối SignalR
    const [isSignalRConnected, setIsSignalRConnected] = useState(false);

    // Lấy thông tin người dùng hiện tại từ localStorage
    const currentUser = JSON.parse(localStorage.getItem("user"));

    // Thông tin của Admin
    const admin = {
        id: "cb0fbb0d-c008-4b4e-8fde-de97f33fdb91",
        fullName: "Bộ phận hỗ trợ",
    };

    // useEffect để quản lý vòng đời của kết nối SignalR
    useEffect(() => {
        // Hàm để khởi tạo kết nối
        const connect = async () => {
            try {
                console.log("🚀 Bắt đầu kết nối SignalR...");
                await startConnection();
                
                if (connection?.state === "Connected") {
                    console.log("✅ Kết nối SignalR thành công.");
                    setIsSignalRConnected(true);
                }
            } catch (error) {
                console.error("❌ Lỗi nghiêm trọng khi khởi tạo kết nối SignalR:", error);
            }
        };

        connect();

        // CLEANUP: Ngắt kết nối khi component unmount
        return () => {
            console.log("🛑 Ngắt kết nối SignalR khi rời khỏi trang.");
            stopConnection();
        };
    }, []);

    // Kiểm tra nếu không có người dùng đăng nhập
    if (!currentUser?.id) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center relative overflow-hidden">
                {/* Snowflakes */}
                <div className="absolute top-20 left-20 text-blue-200 text-5xl animate-pulse">❄️</div>
                <div className="absolute top-20 right-20 text-blue-300 text-5xl animate-pulse" style={{animationDelay: '1s'}}>❄️</div>
                
                <div className="bg-white p-12 rounded-3xl shadow-2xl border-4 border-blue-200 text-center max-w-md relative">
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-5xl">🎅</div>
                    <div className="text-6xl mb-6 mt-4">💬</div>
                    <h2 className="text-2xl font-bold text-blue-800 mb-4">Yêu cầu đăng nhập</h2>
                    <p className="text-blue-600 text-lg mb-6">
                        Vui lòng đăng nhập để sử dụng chức năng chat với admin.
                    </p>
                    <button
                        onClick={() => window.location.href = '/login'}
                        className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg"
                    >
                        🎁 Đăng nhập ngay
                    </button>
                </div>

                <style>{`
                    @keyframes pulse {
                        0%, 100% { opacity: 0.4; transform: scale(1); }
                        50% { opacity: 1; transform: scale(1.1); }
                    }
                `}</style>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 px-4 relative overflow-hidden">
            {/* Snowflakes background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 left-10 text-blue-200 text-5xl animate-pulse">❄️</div>
                <div className="absolute top-40 right-20 text-blue-300 text-4xl animate-pulse" style={{animationDelay: '1s'}}>❄️</div>
                <div className="absolute bottom-40 left-1/4 text-blue-200 text-6xl animate-pulse" style={{animationDelay: '2s'}}>❄️</div>
                <div className="absolute bottom-20 right-1/3 text-blue-300 text-5xl animate-pulse" style={{animationDelay: '0.5s'}}>❄️</div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-4xl md:text-5xl font-black text-blue-800 mb-3 flex items-center justify-center gap-3">
                        🎄 Chat với Admin 💬
                    </h1>
                    <p className="text-blue-600 text-lg font-semibold">
                        Hỗ trợ 24/7 - Luôn sẵn sàng giúp đỡ bạn! 🎅
                    </p>
                </div>

                {/* Chat Container */}
                <div className="bg-white rounded-3xl shadow-2xl border-4 border-blue-200 overflow-hidden relative">
                    {/* Christmas decorations */}
                    <div className="absolute -top-2 -left-2 text-3xl z-10 pointer-events-none">🎄</div>
                    <div className="absolute -top-2 -right-2 text-3xl z-10 pointer-events-none">🎁</div>
                    
                    {/* Top decoration bar */}
                    <div className="bg-gradient-to-r from-red-500 via-white to-red-500 h-2"></div>
                    
                    {isSignalRConnected ? (
                        <div className="h-[calc(80vh-100px)]">
                            <ChatWindow 
                                currentUserId={currentUser.id} 
                                receiver={admin} 
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[calc(80vh-100px)] text-center p-8">
                            <div className="relative mb-6">
                                <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-400"></div>
                                <div className="absolute inset-0 flex items-center justify-center text-3xl">
                                    ⛄
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-blue-800 mb-3">
                                Đang kết nối...
                            </h3>
                            <p className="text-blue-600 text-lg font-semibold">
                                🎅 Vui lòng đợi trong giây lát
                            </p>
                            <div className="flex gap-3 mt-6 text-3xl">
                                <span className="animate-bounce">🎄</span>
                                <span className="animate-bounce" style={{animationDelay: '0.2s'}}>🎁</span>
                                <span className="animate-bounce" style={{animationDelay: '0.4s'}}>❄️</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Info Footer */}
                <div className="mt-6 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
                    <div className="flex flex-wrap items-center justify-center gap-6 text-blue-700 font-semibold">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">⏰</span>
                            <span>Hỗ trợ 24/7</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">⚡</span>
                            <span>Phản hồi nhanh chóng</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🎁</span>
                            <span>Tư vấn miễn phí</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.4; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.1); }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce {
                    animation: bounce 1s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}