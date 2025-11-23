import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../../services/cartService";

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const [orderInfo, setOrderInfo] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const resultCode = params.get("resultCode");
    const orderId = params.get("orderId");
    const message = params.get("message");

    if (resultCode === "0") {
      clearCart();
      setOrderInfo({
        orderId,
        message: decodeURIComponent(message || "Payment successful!"),
      });
    } else {
      navigate("/cart");
    }
  }, [navigate]);

  const handleViewOrder = () => {
    navigate("/orders");
  };

  if (!orderInfo)
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-900 via-green-900 to-red-900 flex items-center justify-center">
        <div className="text-white text-2xl">Processing...</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 via-green-900 to-red-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Snowflakes Animation */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white opacity-70 animate-fall"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
              fontSize: `${10 + Math.random() * 10}px`,
            }}
          >
            ❄
          </div>
        ))}
      </div>

      <style>
        {`
          @keyframes fall {
            0% {
              transform: translateY(-100px) rotate(0deg);
            }
            100% {
              transform: translateY(100vh) rotate(360deg);
            }
          }
          .animate-fall {
            animation: fall linear infinite;
          }
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
          }
          .animate-bounce-slow {
            animation: bounce 2s ease-in-out infinite;
          }
        `}
      </style>

      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative z-10 border-8 border-red-600">
        {/* Christmas Decorations */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-6xl animate-bounce-slow">
          🎅
        </div>
        
        <div className="absolute top-4 left-4 text-3xl">🎄</div>
        <div className="absolute top-4 right-4 text-3xl">🎄</div>
        <div className="absolute bottom-4 left-8 text-2xl">🎁</div>
        <div className="absolute bottom-4 right-8 text-2xl">🎁</div>

        {/* Success Icon */}
        <div className="flex justify-center mb-6 mt-8">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-bounce-slow">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
          🎉 Order Successful! 🎉
        </h1>

        {/* Subtitle */}
        <p className="text-center text-gray-700 text-lg mb-8 font-medium">
          Thank you for shopping at <span className="text-red-600 font-bold">TechStore</span> 🎄✨
        </p>

        {/* Order Info Card */}
        <div className="bg-gradient-to-br from-red-50 to-green-50 rounded-2xl p-6 mb-8 border-2 border-red-200 shadow-inner">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1 font-semibold">Order ID:</p>
            <p className="text-2xl font-bold text-red-700">{orderInfo.orderId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1 font-semibold">Status:</p>
            <p className="text-lg text-green-700 font-medium">{orderInfo.message}</p>
          </div>
        </div>

        {/* Christmas Message */}
        <div className="bg-gradient-to-r from-red-100 to-green-100 rounded-xl p-4 mb-8 text-center border-2 border-dashed border-red-300">
          <p className="text-gray-700 font-medium">
            🎅 Wishing you a Merry Christmas and a Happy New Year! 🎄
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleViewOrder}
          className="w-full bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg transform transition hover:scale-105 hover:shadow-xl"
        >
          🎁 View Your Orders
        </button>

        {/* Back to Home Link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-red-600 hover:text-green-600 font-semibold underline transition"
          >
            ← Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}