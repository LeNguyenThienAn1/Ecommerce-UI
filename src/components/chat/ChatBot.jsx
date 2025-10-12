import React, { useState } from "react";
import axios from "axios";
import { FiSend, FiMessageSquare, FiX } from "react-icons/fi";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Xin chào 👋, tôi có thể giúp gì cho bạn hôm nay?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("https://localhost:7165/api/Chat", {
        message: input,
      });

      const botMessage = {
        sender: "bot",
        text: response.data?.reply || "Xin lỗi, tôi không hiểu câu hỏi này."
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Có lỗi xảy ra, vui lòng thử lại." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 bg-blue-600 text-black p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <FiMessageSquare size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 bg-white shadow-2xl rounded-lg flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center bg-blue-600 text-white p-3 rounded-t-lg">
            <span>Chatbot hỗ trợ</span>
            <button onClick={toggleChat}>
              <FiX size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto max-h-96 space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg text-sm ${
                  msg.sender === "user"
                    ? "bg-blue-100 text-right ml-auto max-w-[80%]"
                    : "bg-gray-200 text-left mr-auto max-w-[80%]"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="text-gray-500 text-sm">Đang gõ...</div>
            )}
          </div>

          {/* Input */}
          <div className="flex p-2 border-t">
            <input
              type="text"
              className="flex-1 border rounded-lg p-2 text-sm focus:outline-none"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-blue-600 text-black p-2 rounded-lg hover:bg-blue-700 transition"
            >
              <FiSend size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
