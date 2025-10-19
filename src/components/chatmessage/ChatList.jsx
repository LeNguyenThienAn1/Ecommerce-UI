/**
 * Component hiển thị danh sách các cuộc hội thoại.
 * @param {Array} conversations - Danh sách các đối tượng cuộc hội thoại từ API.
 * @param {Function} onSelect - Hàm callback được gọi khi một cuộc hội thoại được chọn.
 * @param {string} selectedUserId - ID của người dùng đang được chọn để highlight.
 */
export default function ChatList({ conversations = [], onSelect, selectedUserId }) {
    const validConversations = Array.isArray(conversations) ? conversations : [];

    return (
        <div className="w-80 border-r border-gray-200 bg-white flex flex-col h-full">
            <h2 className="text-lg font-semibold p-4 border-b">💬 Danh sách hội thoại</h2>
            <div className="overflow-y-auto flex-1">
                {validConversations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 mt-4">Chưa có cuộc hội thoại nào.</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {validConversations.map((conv) => {
                            // ✅ Sử dụng các trường dữ liệu từ API của bạn
                            const userId = conv.withUserId;
                            const userName = conv.withUserName || 'Người dùng';
                            const lastMsg = conv.lastMessage?.message || '...';
                            const unreadCount = conv.unreadCount || 0;

                            return (
                                <button
                                    key={userId}
                                    onClick={() => onSelect(conv)}
                                    className={`w-full text-left p-4 flex items-center gap-3 transition-colors ${
                                        selectedUserId === userId
                                            ? "bg-blue-50 border-l-4 border-blue-500"
                                            : "border-l-4 border-transparent hover:bg-gray-50"
                                    }`}
                                >
                                    {/* Avatar */}
                                    <div className="w-12 h-12 rounded-full bg-blue-500 flex-shrink-0 text-white flex items-center justify-center font-bold text-lg">
                                        {userName.charAt(0).toUpperCase()}
                                    </div>
                                    {/* Info */}
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="font-semibold text-gray-800 truncate">{userName}</p>
                                            {unreadCount > 0 && (
                                                <span className="bg-blue-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 truncate">{lastMsg}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}