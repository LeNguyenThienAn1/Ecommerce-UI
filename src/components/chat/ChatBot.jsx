import React, { useState } from "react";
import { Send, MessageSquare, X } from "lucide-react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello 👋, how can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Call chat API (without token or userId)
      const res = await fetch("https://localhost:7165/api/Chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
        }),
      });

      const data = await res.json();

      const botMessage = {
        sender: "bot",
        text: data.botMessage || "Sorry, I didn't understand your request.",
        products: data.products || [],
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "⚠️ An error occurred, please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', zIndex: 999999 }}>
      {/* Floating Button - Christmas */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 999999,
            boxShadow: '0 0 30px rgba(103, 232, 249, 0.5), 0 0 60px rgba(103, 232, 249, 0.3)'
          }}
          className="bg-gradient-to-br from-cyan-400 to-blue-300 text-white p-4 rounded-full shadow-2xl hover:shadow-cyan-300/50 hover:scale-110 transition-all duration-300 border-4 border-white animate-pulse"
        >
          <div className="relative">
            <MessageSquare size={24} />
            <span className="absolute -top-1 -right-1 text-xs">🎄</span>
          </div>
        </button>
      )}

      {/* Chat Window - Christmas Theme */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 999999,
            width: '320px',
            boxShadow: '0 0 40px rgba(103, 232, 249, 0.4), 0 20px 60px rgba(0, 0, 0, 0.15)'
          }}
          className="bg-gradient-to-b from-cyan-50 via-blue-50 to-white shadow-2xl rounded-2xl flex flex-col border-4 border-cyan-200 overflow-hidden"
        >
          {/* Snowflakes decoration */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            <div className="absolute top-2 left-4 text-cyan-200 text-xl animate-pulse">❄️</div>
            <div className="absolute top-8 right-8 text-blue-200 text-sm animate-pulse">❄️</div>
            <div className="absolute top-16 left-12 text-cyan-100 text-xs animate-pulse">❄️</div>
            <div className="absolute top-12 right-16 text-blue-100 text-lg animate-pulse">❄️</div>
          </div>

          {/* Header - Christmas style */}
          <div className="relative bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 text-white p-4 rounded-t-2xl border-b-4 border-white/30">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-2xl animate-bounce">🎅</span>
                <div>
                  <span className="font-bold text-lg drop-shadow-lg">Christmas Assistant</span>
                  <p className="text-xs text-cyan-50 flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
              <button 
                onClick={toggleChat}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-full backdrop-blur-sm transition-all duration-200 hover:rotate-90"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Decorative lights */}
            <div className="absolute bottom-0 left-0 w-full flex justify-around pb-1">
              <span className="text-yellow-300 text-xs animate-pulse">💡</span>
              <span className="text-red-300 text-xs animate-pulse">💡</span>
              <span className="text-green-300 text-xs animate-pulse">💡</span>
              <span className="text-blue-300 text-xs animate-pulse">💡</span>
              <span className="text-yellow-300 text-xs animate-pulse">💡</span>
            </div>
          </div>

          {/* Messages - Winter wonderland */}
          <div className="flex-1 p-4 overflow-y-auto max-h-96 space-y-3 relative">
            {messages.map((msg, index) => (
              <div key={index}>
                <div
                  className={`p-3 rounded-2xl text-sm whitespace-pre-line shadow-md transition-all duration-300 hover:shadow-lg ${
                    msg.sender === "user"
                      ? "bg-gradient-to-br from-cyan-100 to-blue-100 text-right ml-auto max-w-[80%] border-2 border-cyan-200"
                      : "bg-gradient-to-br from-white to-cyan-50 text-left mr-auto max-w-[80%] border-2 border-blue-100"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <span className="inline-block mr-1 text-base">🤖</span>
                  )}
                  {msg.text}
                  {msg.sender === "user" && (
                    <span className="inline-block ml-1 text-base">👤</span>
                  )}
                </div>

                {/* Product list if available */}
                {msg.products && msg.products.length > 0 && (
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {msg.products.map((p, i) => (
                      <div
                        key={i}
                        className="border-2 border-cyan-200 rounded-xl p-3 text-sm bg-gradient-to-br from-white to-cyan-50 flex gap-3 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                      >
                        {p.imageUrl && (
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-12 h-12 object-cover rounded-lg border-2 border-cyan-100"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-gray-800 flex items-center gap-1">
                            🎁 {p.name}
                          </p>
                          <p className="text-cyan-600 text-sm font-bold">
                            {p.price?.toLocaleString()}₫
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-cyan-600 text-sm italic">
                <span className="inline-block animate-bounce">⛄</span>
                Typing...
                <span className="inline-block animate-pulse">❄️</span>
              </div>
            )}
          </div>

          {/* Input - Christmas theme */}
          <div className="flex p-3 border-t-2 border-cyan-100 bg-gradient-to-r from-cyan-50 to-blue-50 gap-2">
            <input
              type="text"
              className="flex-1 border-2 border-cyan-200 rounded-xl p-3 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 bg-white transition-all"
              placeholder="Type a message... 🎄"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-gradient-to-br from-cyan-400 to-blue-400 text-white p-3 rounded-xl hover:from-cyan-500 hover:to-blue-500 transition-all duration-200 shadow-lg hover:shadow-cyan-300/50 hover:scale-105"
            >
              <Send size={18} />
            </button>
          </div>

          {/* Footer decoration */}
          <div className="bg-gradient-to-r from-cyan-100 via-blue-100 to-cyan-100 p-2 text-center">
            <p className="text-xs text-cyan-700 flex items-center justify-center gap-2">
              <span>🎄</span>
              <span className="font-medium">Merry Christmas!</span>
              <span>🎅</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;