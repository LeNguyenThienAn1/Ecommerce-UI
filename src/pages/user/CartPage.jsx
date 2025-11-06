import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../../services/cartService";
import { useAuth } from "../../context/AuthContext";

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

 // --- Xác nhận thanh toán MoMo ---
const handleMomoSuccessConfirmation = useCallback(async (orderId, resultCode) => {
  const token = localStorage.getItem("accessToken");
  const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

  if (!user || !user.id || user.id === EMPTY_GUID) {
    alert("Lỗi thông tin người dùng. Vui lòng đăng nhập lại.");
    navigate("/login");
    return;
  }

  if (!token) {
    alert("Lỗi xác thực. Vui lòng đăng nhập lại.");
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
      throw new Error(data.message || "Lỗi khi xác nhận thanh toán.");
    }

    // ✅ Xóa giỏ hàng ngay khi backend xác nhận thanh toán thành công
    clearCart();
    setCart([]);

    alert("✅ Thanh toán MoMo thành công!");
    navigate(`/order-success/${orderId}`, { replace: true });

  } catch (error) {
    console.error("Lỗi xác nhận MoMo:", error);
    alert(`❌ Có lỗi xảy ra: ${error.message}`);
    navigate("/cart", { replace: true });
  }
}, [navigate, user]);


  // --- useEffect: callback MoMo ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const resultCode = parseInt(params.get("resultCode"), 10);
    const orderId = params.get("orderId");

    if (orderId && !isNaN(resultCode)) {
      if (resultCode === 0) handleMomoSuccessConfirmation(orderId, resultCode);
      else {
        alert(`❌ Thanh toán MoMo thất bại (${resultCode}).`);
        navigate("/cart", { replace: true });
      }
    }
  }, [navigate, handleMomoSuccessConfirmation]);

  // --- Load giỏ hàng ---
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

  // --- Thay đổi input ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillInfo((prev) => ({ ...prev, [name]: value }));
  };

  // --- Cập nhật giỏ hàng ---
  const handleQuantityChange = (id, change) => {
    updateQuantity(id, change);
    setCart(getCart());
  };
  const handleRemove = (id) => {
    removeFromCart(id);
    setCart(getCart());
  };

  // --- Thanh toán ---
  const handleCheckout = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");
    const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

    if (!isAuthenticated || !user || !user.id || user.id === EMPTY_GUID || !token) {
      alert("⚠️ Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại!");
      navigate("/login");
      return;
    }

    if (cart.length === 0) return alert("🛒 Giỏ hàng trống!");
    if (!billInfo.name || !billInfo.address || !billInfo.phoneNumber)
      return alert("⚠️ Vui lòng điền đủ thông tin!");

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
        throw new Error("Không thể tạo đơn hàng!");
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
            orderInfo: `Thanh toán đơn hàng ${orderId}`,
          }),
        });
        const momoData = await momoRes.json();
        if (!momoRes.ok || !momoData.payUrl)
          throw new Error("Không thể khởi tạo thanh toán MoMo!");
        window.location.href = momoData.payUrl;
        return;
      }

      // --- Stripe ---
      if (billInfo.paymentMethod === "STRIPE") {
  const payload = {
  orderId,
  amount: Math.round(total), // ⚠️ Cent nếu USD
  currency: "usd",
successUrl: "http://localhost:5173/payment-success",
  cancelUrl: "http://localhost:5173/payment-cancel",



};

console.log("👉 Stripe payload gửi lên:", payload);

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
  throw new Error("Không nhận được URL Stripe!");

}


      // --- COD ---
      alert(`✅ Đặt hàng thành công!\nMã đơn: ${orderId}`);
      clearCart();
      setCart(getCart());
      navigate(`/order-success/${orderId}`);
    } catch (err) {
      alert(`❌ Lỗi: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // --- Hiển thị ---
  if (authLoading) return <div className="text-center mt-10">Đang tải...</div>;
  if (!isAuthenticated)
    return (
      <div className="text-center mt-10">
        <p>Bạn cần đăng nhập để xem giỏ hàng.</p>
        <button onClick={() => navigate("/login")} className="bg-blue-500 text-white px-4 py-2 rounded mt-3">
          Đăng nhập
        </button>
      </div>
    );

  if (cart.length === 0)
    return (
      <div className="text-center mt-10">
        <p>🛒 Giỏ hàng trống</p>
        <button onClick={() => navigate("/")} className="text-blue-600 hover:underline mt-3">
          ← Tiếp tục mua sắm
        </button>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🛍️ Giỏ hàng của bạn</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- Danh sách sản phẩm --- */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-b-0">
              <img
                src={item.imageUrl || "https://via.placeholder.com/80"}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h2 className="font-semibold text-lg">{item.name}</h2>
                <p className="text-green-600 font-medium text-lg">{item.price.toLocaleString()} đ</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleQuantityChange(item.id, -1)} className="w-8 h-8 bg-gray-200 rounded">-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.id, 1)} className="w-8 h-8 bg-gray-200 rounded">+</button>
              </div>
              <button onClick={() => handleRemove(item.id)} className="text-red-600 hover:text-red-700">Xóa</button>
            </div>
          ))}
        </div>

        {/* --- Thanh toán --- */}
        <div className="bg-white rounded-lg shadow p-6 sticky top-6">
          <h2 className="text-xl font-bold mb-4">Thông tin đơn hàng</h2>
          <div className="flex justify-between mb-4">
            <span>Tổng cộng:</span>
            <span className="font-bold text-green-600">{total.toLocaleString()} đ</span>
          </div>

          {!showCheckoutForm ? (
            <button
              onClick={() => setShowCheckoutForm(true)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Tiến hành thanh toán
            </button>
          ) : (
            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label>Họ và tên *</label>
                <input name="name" value={billInfo.name} onChange={handleInputChange} required className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label>Địa chỉ *</label>
                <textarea name="address" value={billInfo.address} onChange={handleInputChange} rows="2" required className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label>Số điện thoại *</label>
                <input name="phoneNumber" value={billInfo.phoneNumber} onChange={handleInputChange} required className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label>Phương thức thanh toán *</label>
                <select
                  name="paymentMethod"
                  value={billInfo.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                  <option value="MOMO">Thanh toán bằng MoMo</option>
                  <option value="STRIPE">Thanh toán bằng thẻ (Stripe)</option>
                </select>
              </div>
              <div>
                <label>Ghi chú</label>
                <textarea name="note" value={billInfo.note} onChange={handleInputChange} rows="2" className="w-full border px-3 py-2 rounded" />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowCheckoutForm(false)} className="flex-1 bg-gray-200 py-3 rounded">
                  Hủy
                </button>
                <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-3 rounded hover:bg-blue-700">
                  {loading ? "Đang xử lý..." :
                    billInfo.paymentMethod === "MOMO" ? "Thanh toán MoMo" :
                    billInfo.paymentMethod === "STRIPE" ? "Thanh toán thẻ" :
                    "Đặt hàng"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
