import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../../services/cartService"; // Giả định service này tồn tại
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

  // --- Xử lý Xác nhận MoMo từ Frontend ---
  const handleMomoSuccessConfirmation = useCallback(async (orderId, resultCode) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Token không tìm thấy. Không thể xác nhận MoMo.");
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
        body: JSON.stringify({ orderId, resultCode }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Lỗi khi xác nhận thanh toán với Backend.");
      }

      alert("✅ Thanh toán MoMo thành công và đơn hàng đã được xác nhận!");
      clearCart();
      
      const params = new URLSearchParams(window.location.search);
      params.delete("resultCode");
      params.delete("orderId");
      window.history.replaceState({}, document.title, window.location.pathname);

      setTimeout(() => {
        setCart(getCart());
        navigate(`/order-success/${orderId}`, { replace: true });
      }, 0); 
    } catch (error) {
      console.error("Lỗi xác nhận MoMo:", error);
      alert(`❌ Có lỗi xảy ra trong quá trình xác nhận: ${error.message}.`);
      const params = new URLSearchParams(window.location.search);
      params.delete("resultCode");
      params.delete("orderId");
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate("/cart", { replace: true });
    }
  }, [navigate]);

  // --- useEffect: Xử lý MoMo callback từ URL ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const resultCodeString = params.get("resultCode");
    const orderId = params.get("orderId");

    if (resultCodeString && orderId) {
      const resultCode = parseInt(resultCodeString, 10);
      if (resultCode === 0) {
        handleMomoSuccessConfirmation(orderId, resultCode);
      } else {
        alert(`❌ Thanh toán MoMo thất bại! Mã lỗi: ${resultCode}. Vui lòng thử lại.`);
        const cleanParams = new URLSearchParams(window.location.search);
        cleanParams.delete("resultCode");
        cleanParams.delete("orderId");
        window.history.replaceState({}, document.title, `${window.location.pathname}?${cleanParams.toString()}`);
        navigate("/cart", { replace: true });
      }
    }
  }, [navigate, handleMomoSuccessConfirmation]); 

  // Load cart và điền thông tin user
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (id, change) => {
    updateQuantity(id, change);
    setCart(getCart());
  };

  const handleRemove = (id) => {
    removeFromCart(id);
    setCart(getCart());
  };

  // --- 💰 Thanh toán ---
  const handleCheckout = async (e) => {
    e.preventDefault();
    
    // ✅ SỬA LỖI: Thêm bước kiểm tra user ID chặt chẽ hơn
    const token = localStorage.getItem("accessToken");
    const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

    if (!isAuthenticated || !user || !user.id || user.id === EMPTY_GUID || !token) {
        alert("⚠️ Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại để đặt hàng!");
        navigate("/login");
        return;
    }

    if (cart.length === 0) {
      alert("🛒 Giỏ hàng trống!");
      return;
    }
    if (!billInfo.name || !billInfo.address || !billInfo.phoneNumber) {
      alert("⚠️ Vui lòng điền đủ thông tin bắt buộc!");
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        order: {
          productIds: cart.flatMap((item) => Array(item.quantity).fill(item.id)),
          boughtBy: user.id, // ID giờ đã được đảm bảo là hợp lệ
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

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({}));
        throw new Error(errorData.title || errorData.message || "Không thể tạo đơn hàng!");
      }

      const orderResult = await orderResponse.json();
      const orderId = orderResult.orderId;

      if (billInfo.paymentMethod === "MOMO") {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const momoResponse = await fetch("https://localhost:7165/api/Momo/create-payment", {
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
          }
        );

        if (!momoResponse.ok) {
          const errorData = await momoResponse.json().catch(() => ({}));
          throw new Error(errorData.message || "Không thể khởi tạo thanh toán MoMo");
        }

        const momoResult = await momoResponse.json();
        if (momoResult.payUrl) {
          window.location.href = momoResult.payUrl;
        } else {
          throw new Error("Phản hồi MoMo không có PayUrl.");
        }
        return; 
      }

      alert(`✅ Đặt hàng thành công!\nMã đơn: ${orderId}`);
      clearCart();
      setCart(getCart());
      navigate(`/order-success/${orderId}`);
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      alert(`❌ Có lỗi xảy ra khi đặt hàng: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (authLoading) return <div className="text-center mt-10">Đang tải thông tin...</div>;

  if (!isAuthenticated) return (
    <div className="text-center mt-10">
        <p className="text-gray-600 text-lg">Bạn cần đăng nhập để xem giỏ hàng.</p>
        <button
            onClick={() => navigate("/login")}
            className="text-blue-600 bg-blue-100 px-4 py-2 rounded-lg hover:underline mt-3"
        >
            Đến trang đăng nhập
        </button>
    </div>
  );

  if (cart.length === 0) return (
    <div className="text-center mt-10">
        <p className="text-gray-600 text-lg">🛒 Giỏ hàng của bạn đang trống</p>
        <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:underline mt-3"
        >
            ← Tiếp tục mua sắm
        </button>
    </div>
 );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🛍️ Giỏ hàng của bạn</h1>
      {/* ... Phần JSX còn lại không thay đổi ... */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ====== Cột trái: Sản phẩm ====== */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border-b pb-4 last:border-b-0"
              >
                <img
                  src={item.imageUrl || "https://via.placeholder.com/80"}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h2 className="font-semibold text-lg">{item.name}</h2>
                  <p className="text-green-600 font-medium">
                    {item.price.toLocaleString()} đ
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(item.id, -1)}
                    className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.id, 1)}
                    className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* ====== Cột phải: Thanh toán ====== */}
        <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                <h2 className="text-xl font-bold mb-4">Thông tin đơn hàng</h2>
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Tạm tính:</span>
                        <span className="font-semibold">{total.toLocaleString()} đ</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between text-lg">
                        <span className="font-bold">Tổng cộng:</span>
                        <span className="font-bold text-green-600">{total.toLocaleString()} đ</span>
                    </div>
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
                        {/* Form Inputs */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Họ và tên *</label>
                            <input type="text" name="name" value={billInfo.name} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Địa chỉ *</label>
                            <textarea name="address" value={billInfo.address} onChange={handleInputChange} rows="2" required className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Số điện thoại *</label>
                            <input type="tel" name="phoneNumber" value={billInfo.phoneNumber} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Phương thức thanh toán *</label>
                            <select name="paymentMethod" value={billInfo.paymentMethod} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg">
                                <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                                <option value="MOMO">Thanh toán bằng MoMo</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Ghi chú</label>
                            <textarea name="note" value={billInfo.note} onChange={handleInputChange} rows="2" className="w-full px-3 py-2 border rounded-lg" placeholder="Ghi chú cho người bán..." />
                        </div>
                        <div className="flex gap-2">
                            <button type="button" onClick={() => setShowCheckoutForm(false)} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold">
                                Hủy
                            </button>
                            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50">
                                {loading ? "Đang xử lý..." : billInfo.paymentMethod === "MOMO" ? "Thanh toán MoMo" : "Đặt hàng"}
                            </button>
                        </div>
                    </form>
                )}
                <button
                    onClick={() => navigate("/")}
                    className="block w-full text-center text-blue-600 hover:underline mt-4"
                >
                    ← Tiếp tục mua sắm
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
