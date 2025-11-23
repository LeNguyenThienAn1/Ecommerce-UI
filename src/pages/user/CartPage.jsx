import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import {
  getCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../../services/cartService";
import { useAuth } from "../../context/AuthContext";
import { ShoppingBag, Plus, Minus, Trash2, CreditCard, Package, Gift, Sparkles } from "lucide-react";

export default function CartPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  const [billInfo, setBillInfo] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    paymentMethod: "COD",
    note: "",
  });

  // --- MoMo Success Confirmation ---
  const handleMomoSuccessConfirmation = useCallback(async (orderId, resultCode) => {
    const token = localStorage.getItem("accessToken");
    const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

    if (!user || !user.id || user.id === EMPTY_GUID) {
      alert("User information error. Please login again.");
      navigate("/login");
      return;
    }

    if (!token) {
      alert("Authentication error. Please login again.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("https://localhost:7165/api/Momo/confirm-frontend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId, resultCode, userId: user.id }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Payment confirmation error.");
      }

      // ✅ Clear cart after successful payment
      clearCart();
      setCart([]);

      alert("🎄 MoMo payment successful!");
      navigate(`/order-success/${orderId}`, { replace: true });

    } catch (error) {
      console.error("MoMo confirmation error:", error);
      alert(`❌ An error occurred: ${error.message}`);
      navigate("/cart", { replace: true });
    }
  }, [navigate, user]);

  // --- useEffect: MoMo callback ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const resultCode = parseInt(params.get("resultCode"), 10);
    const orderId = params.get("orderId");

    if (orderId && !isNaN(resultCode)) {
      if (resultCode === 0) handleMomoSuccessConfirmation(orderId, resultCode);
      else {
        alert(`❌ MoMo payment failed (${resultCode}).`);
        navigate("/cart", { replace: true });
      }
    }
  }, [navigate, handleMomoSuccessConfirmation]);

  // --- Load cart ---
  useEffect(() => {
    setCart(getCart());
    if (isAuthenticated && user) {
      setBillInfo((prev) => ({
        ...prev,
        name: user.name || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
      }));
    }
  }, [isAuthenticated, user]);

  // --- Input change ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillInfo((prev) => ({ ...prev, [name]: value }));
  };

  // --- Update cart ---
  const handleQuantityChange = (id, change) => {
    updateQuantity(id, change);
    setCart(getCart());
  };
  
  const handleRemove = (id) => {
    removeFromCart(id);
    setCart(getCart());
  };

  // --- Checkout ---
  const handleCheckout = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");
    const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

    if (!isAuthenticated || !user || !user.id || user.id === EMPTY_GUID || !token) {
      alert("⚠️ Invalid session. Please login again!");
      navigate("/login");
      return;
    }

    if (cart.length === 0) return alert("🎄 Your cart is empty!");
    if (!billInfo.name || !billInfo.address || !billInfo.phoneNumber)
      return alert("⚠️ Please fill in all required information!");

    setLoading(true);
    try {
      const orderPayload = {
        order: {
          productIds: cart.flatMap((item) => Array(item.quantity).fill(item.id)),
          boughtBy: user.id,
        },
        bill: { ...billInfo },
      };

      const orderResponse = await fetch("https://localhost:7165/api/Order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!orderResponse.ok)
        throw new Error("Cannot create order!");
      const orderResult = await orderResponse.json();
      const orderId = orderResult.orderId;

      const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

      // --- MoMo ---
      if (billInfo.paymentMethod === "MOMO") {
        const momoRes = await fetch("https://localhost:7165/api/Momo/create-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderId,
            amount: total.toString(),
            orderInfo: `Payment for order ${orderId}`,
          }),
        });
        const momoData = await momoRes.json();
        if (!momoRes.ok || !momoData.payUrl)
          throw new Error("Cannot initialize MoMo payment!");
        window.location.href = momoData.payUrl;
        return;
      }

      // --- Stripe ---
      if (billInfo.paymentMethod === "STRIPE") {
        const payload = {
          orderId,
          amount: Math.round(total),
          currency: "usd",
          successUrl: "http://localhost:5173/payment-success",
          cancelUrl: "http://localhost:5173/payment-cancel",
        };

        console.log("👉 Stripe payload:", payload);

        const stripeRes = await fetch("https://postal-uninternational-debra.ngrok-free.dev/api/Stripe/create-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const stripeData = await stripeRes.json();
        console.log("👉 Stripe response:", stripeData);

        if (stripeData?.checkoutUrl)
          window.location.href = stripeData.checkoutUrl;
        else
          throw new Error("Cannot get Stripe URL!");
      }

      // --- COD ---
      alert(`🎄 Order placed successfully!\nOrder ID: ${orderId}`);
      clearCart();
      setCart(getCart());
      navigate("/cart");
    } catch (err) {
      alert(`❌ Error: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // --- Display ---
  if (authLoading) return <div className="text-center mt-10 text-red-600">Loading...</div>;
  
  if (!isAuthenticated)
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-green-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-10 border-4 border-red-200 text-center max-w-md">
          <div className="text-6xl mb-4">🎅</div>
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
            Login Required
          </h2>
          <p className="text-gray-600 mb-6">You need to login to view your cart.</p>
          <button 
            onClick={() => navigate("/login")} 
            className="bg-gradient-to-r from-red-600 to-green-600 text-white px-8 py-3 rounded-full font-bold hover:from-red-700 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Login Now
          </button>
        </div>
      </div>
    );

  if (cart.length === 0)
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-green-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-10 border-4 border-green-200 text-center max-w-md">
          <div className="text-6xl mb-4">🎁</div>
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-600 to-red-600 bg-clip-text text-transparent">
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 mb-6">Start shopping and add some festive items!</p>
          <button 
            onClick={() => navigate("/")} 
            className="bg-gradient-to-r from-green-600 to-red-600 text-white px-8 py-3 rounded-full font-bold hover:from-green-700 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg"
          >
            ← Continue Shopping
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-green-50">
      {/* Christmas Header */}
      <div className="bg-gradient-to-r from-red-600 via-green-600 to-red-600 h-2"></div>
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="text-red-600" size={36} />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
            Your Shopping Cart
          </h1>
          <span className="text-3xl">🎄</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* --- Product List --- */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200 hover:shadow-2xl transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={item.imageUrl || "https://via.placeholder.com/80"}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg border-2 border-red-200"
                    />
                    <span className="absolute -top-2 -right-2 text-2xl">🎁</span>
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="font-bold text-lg text-gray-800">{item.name}</h2>
                    <p className="text-green-600 font-bold text-xl mt-1">
                      ${item.price.toLocaleString()}
                    </p>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 bg-gradient-to-r from-red-50 to-green-50 px-4 py-2 rounded-full border-2 border-green-200">
                    <button 
                      onClick={() => handleQuantityChange(item.id, -1)} 
                      className="w-8 h-8 bg-white border-2 border-red-400 text-red-600 rounded-full hover:bg-red-50 transition-all flex items-center justify-center font-bold"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-bold text-lg min-w-[30px] text-center">{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(item.id, 1)} 
                      className="w-8 h-8 bg-white border-2 border-green-400 text-green-600 rounded-full hover:bg-green-50 transition-all flex items-center justify-center font-bold"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  {/* Remove Button */}
                  <button 
                    onClick={() => handleRemove(item.id)} 
                    className="text-red-600 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-full"
                    title="Remove item"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* --- Checkout Panel --- */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-2xl p-6 border-4 border-red-200 sticky top-6">
              <div className="flex items-center gap-2 mb-6">
                <Package className="text-green-600" size={24} />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-red-600 bg-clip-text text-transparent">
                  Order Summary
                </h2>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-red-50 rounded-xl p-4 mb-6 border-2 border-green-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-semibold">Total Amount:</span>
                  <span className="font-bold text-2xl text-green-600">${total.toLocaleString()}</span>
                </div>
              </div>

              {!showCheckoutForm ? (
                <button
                  onClick={() => setShowCheckoutForm(true)}
                  className="w-full bg-gradient-to-r from-red-600 to-green-600 text-white py-4 rounded-full hover:from-red-700 hover:to-green-700 font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <CreditCard size={20} />
                  Proceed to Checkout
                </button>
              ) : (
                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                    <input 
                      name="name" 
                      value={billInfo.name} 
                      onChange={handleInputChange} 
                      required 
                      className="w-full border-2 border-green-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-red-300 transition-all" 
                      placeholder="Santa Claus"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Address *</label>
                    <textarea 
                      name="address" 
                      value={billInfo.address} 
                      onChange={handleInputChange} 
                      rows="2" 
                      required 
                      className="w-full border-2 border-green-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-red-300 transition-all" 
                      placeholder="North Pole, Arctic"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                    <input 
                      name="phoneNumber" 
                      value={billInfo.phoneNumber} 
                      onChange={handleInputChange} 
                      required 
                      className="w-full border-2 border-green-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-red-300 transition-all" 
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method *</label>
                    <select
                      name="paymentMethod"
                      value={billInfo.paymentMethod}
                      onChange={handleInputChange}
                      className="w-full border-2 border-green-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-red-300 transition-all"
                    >
                      <option value="COD">💵 Cash on Delivery (COD)</option>
                      <option value="MOMO">📱 MoMo Payment</option>
                      <option value="STRIPE">💳 Card Payment (Stripe)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Notes (Optional)</label>
                    <textarea 
                      name="note" 
                      value={billInfo.note} 
                      onChange={handleInputChange} 
                      rows="2" 
                      className="w-full border-2 border-green-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-red-300 transition-all" 
                      placeholder="Special delivery instructions..."
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setShowCheckoutForm(false)} 
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-300 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={loading} 
                      className="flex-1 bg-gradient-to-r from-green-600 to-red-600 text-white py-3 rounded-full font-bold hover:from-green-700 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Gift size={18} />
                          {billInfo.paymentMethod === "MOMO" ? "Pay with MoMo" :
                           billInfo.paymentMethod === "STRIPE" ? "Pay with Card" :
                           "Place Order"}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer decoration */}
      <div className="bg-gradient-to-r from-red-600 via-green-600 to-red-600 h-2 mt-10"></div>
    </div>
  );
}