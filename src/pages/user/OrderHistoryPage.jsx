import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  Loader2,
  AlertCircle,
  ShoppingBag,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  Gift,
} from "lucide-react";

const OrderHistoryPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `https://localhost:7165/api/Order/user/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch order history.");
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user]);

  // ================== STATUS ==================
  const renderStatusBadge = (status) => {
    let label = "";
    let style = "";
    let icon = <Clock className="w-4 h-4" />;
    let emoji = "⏳";

    switch (status) {
      case 0:
      case "Created":
        label = "Waiting for Confirmation";
        style = "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-2 border-blue-300";
        icon = <Clock className="w-4 h-4" />;
        emoji = "⏳";
        break;
      case 1:
      case "SellerConfirmed":
        label = "Confirmed by Seller";
        style = "bg-gradient-to-r from-blue-200 to-cyan-200 text-blue-800 border-2 border-blue-400";
        icon = <CheckCircle className="w-4 h-4" />;
        emoji = "✅";
        break;
      case 2:
      case "PrepareShipping":
        label = "Preparing Shipment";
        style = "bg-gradient-to-r from-cyan-100 to-blue-100 text-blue-700 border-2 border-cyan-300";
        icon = <Truck className="w-4 h-4" />;
        emoji = "📦";
        break;
      case 3:
      case "Rejected":
        label = "Rejected";
        style = "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-2 border-red-400";
        icon = <XCircle className="w-4 h-4" />;
        emoji = "❌";
        break;
      case 5:
      case "Successfully":
        label = "Delivered Successfully";
        style = "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-2 border-green-400";
        icon = <CheckCircle className="w-4 h-4" />;
        emoji = "🎉";
        break;
      default:
        label = "Unknown";
        style = "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 border-2 border-gray-300";
        emoji = "❓";
    }

    return (
      <span
        className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full ${style} shadow-md`}
      >
        <span className="text-lg">{emoji}</span>
        {icon} {label}
      </span>
    );
  };

  // ================== LOADING / ERROR ==================
  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-400"></div>
        <p className="mt-4 text-blue-700 font-bold">🎅 Loading orders...</p>
      </div>
    );

  if (!isAuthenticated)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
        <div className="absolute top-10 left-10 text-blue-200 text-5xl animate-pulse">❄️</div>
        <div className="absolute top-10 right-10 text-blue-300 text-5xl animate-pulse" style={{animationDelay: '1s'}}>❄️</div>
        
        <div className="text-center bg-white p-12 rounded-3xl shadow-2xl border-4 border-blue-200 max-w-md relative">
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-5xl">🎅</div>
          <ShoppingBag className="w-16 h-16 text-blue-500 mx-auto mb-4 mt-4" />
          <h2 className="text-2xl font-bold text-blue-800 mb-2">Please log in</h2>
          <p className="text-blue-600 mb-6">to view your order history</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg"
          >
            🎁 Go to login page
          </button>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="text-center p-10 bg-red-50 rounded-3xl border-4 border-red-300 shadow-2xl">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <p className="text-red-700 font-bold text-lg">{error}</p>
        </div>
      </div>
    );

  // ================== MAIN ==================
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 relative overflow-hidden">
      {/* Snowflakes background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 text-blue-200 text-5xl animate-pulse">❄️</div>
        <div className="absolute top-40 right-20 text-blue-300 text-4xl animate-pulse" style={{animationDelay: '1s'}}>❄️</div>
        <div className="absolute bottom-40 left-1/4 text-blue-200 text-6xl animate-pulse" style={{animationDelay: '2s'}}>❄️</div>
        <div className="absolute bottom-20 right-1/3 text-blue-300 text-5xl animate-pulse" style={{animationDelay: '0.5s'}}>❄️</div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-blue-800 mb-3 flex items-center justify-center gap-3">
            🎄 Order History 🎁
          </h1>
          <p className="text-blue-600 text-lg">Track your Christmas orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-3xl border-4 border-blue-200 shadow-2xl relative overflow-hidden">
            <div className="absolute top-4 left-4 text-3xl">🎄</div>
            <div className="absolute top-4 right-4 text-3xl">🎁</div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-4xl">⛄</div>
            
            <ShoppingBag className="mx-auto w-16 h-16 text-blue-400 mb-6" />
            <h3 className="text-2xl font-bold text-blue-800 mb-3">No orders yet!</h3>
            <p className="text-blue-600 mb-6">Start your Christmas shopping now!</p>
            <Link
              to="/products"
              className="inline-block bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg"
            >
              🎅 Start shopping now!
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const total =
                order.items?.reduce(
                  (sum, item) => sum + item.unitPrice * item.quantity,
                  0
                ) || 0;

              return (
                <div
                  key={order.id}
                  className="bg-white shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all border-4 border-blue-200 relative"
                >
                  {/* Christmas decoration */}
                  <div className="absolute -top-2 -right-2 text-3xl animate-pulse pointer-events-none">❄️</div>
                  
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-blue-50 to-cyan-50 p-5 border-b-2 border-blue-200 gap-4">
                    <div className="flex flex-col gap-3 w-full sm:w-auto">
                      {renderStatusBadge(order.status)}
                      <div className="flex items-center gap-2 text-sm text-blue-700 font-semibold">
                        <span className="text-lg">📅</span>
                        {order.orderDate
                          ? new Date(order.orderDate).toLocaleDateString("en-GB")
                          : "Unknown Date"}
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-100 to-green-200 px-6 py-3 rounded-full border-2 border-green-400 shadow-md">
                      <span className="text-green-800 font-bold text-xl flex items-center gap-2">
                        💰 {total.toLocaleString("en-US")} ₫
                      </span>
                    </div>
                  </div>

                  {/* Product List */}
                  <div className="p-6 space-y-4">
                    {order.items?.map((item) => {
                      const imageUrl =
                        item.imageUrl || item.product?.imageUrl || null;

                      return (
                        <div
                          key={item.id}
                          className="flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border-2 border-blue-200 hover:shadow-lg transition-all"
                        >
                          {/* Red Gift Box Image */}
                          <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-4 border-red-300 shadow-lg bg-gradient-to-br from-red-400 to-red-600 flex-shrink-0">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={item.productName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            ) : null}

                            {/* Red Gift Box fallback */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Gift className="w-12 h-12 text-white drop-shadow-lg" />
                            </div>
                            
                            {/* Ribbon decoration */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-full bg-yellow-300 opacity-80"></div>
                            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-2 bg-yellow-300 opacity-80"></div>
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 text-center sm:text-left">
                            <h3 className="font-bold text-blue-800 text-lg mb-2">
                              {item.productName}
                            </h3>
                            <p className="text-blue-600 text-sm font-semibold flex items-center justify-center sm:justify-start gap-2">
                              <span>📦 Quantity:</span> 
                              <span className="bg-blue-200 px-3 py-1 rounded-full">{item.quantity}</span>
                            </p>
                            <p className="text-blue-700 font-semibold mt-1">
                              💵 {item.unitPrice.toLocaleString("en-US")} ₫ / item
                            </p>
                          </div>

                          <div className="bg-gradient-to-r from-blue-200 to-cyan-200 px-6 py-3 rounded-full text-right font-bold text-blue-800 text-lg border-2 border-blue-400 shadow-md">
                            {(item.unitPrice * item.quantity).toLocaleString("en-US")} ₫
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 flex flex-col sm:flex-row justify-between text-sm border-t-2 border-blue-200">
                    <div className="flex items-center gap-2 text-blue-700 font-bold">
                      <span className="text-lg">💳</span>
                      <span className="font-bold text-blue-800">Payment Method:</span>{" "}
                      <span className="bg-blue-200 px-3 py-1 rounded-full">
                        {order.paymentMethod || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default OrderHistoryPage;