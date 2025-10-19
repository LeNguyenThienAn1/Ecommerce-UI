export default function MessageBubble({ msg, currentUserId }) {
  const isMine = msg.senderId === currentUserId;

  return (
    // Sử dụng lại các class CSS từ ChatWindow để đảm bảo tính nhất quán
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-xl max-w-[70%] shadow-sm text-sm break-words ${
          isMine
            ? "bg-blue-500 text-white rounded-br-none" // ✅ Sửa: Dùng text-white cho dễ đọc
            : "bg-gray-200 text-gray-800 rounded-tl-none"
        }`}
      >
        {/* Hỗ trợ cả `msg.message` và `msg.content` */}
        <p>{msg.message || msg.content}</p>

        {/* Sử dụng lại định dạng thời gian và style từ ChatWindow */}
        <p className="text-xs mt-1 opacity-80 text-right">
          {new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}