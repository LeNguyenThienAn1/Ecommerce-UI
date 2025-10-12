import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCart,
  updateQuantity,
  removeFromCart,
  clearCart
} from "../../services/cartService";
import { useAuth } from "../../context/AuthContext";

export default function CartPage() {
  // Lấy thông tin user và trạng thái xác thực từ Context
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  // 🧾 State cho thông tin trên hóa đơn (form)
  const [billInfo, setBillInfo] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    paymentMethod: "COD", // Mặc định là COD
    note: ""
  });

  // 🛒 Tải giỏ hàng từ localStorage khi component được render
  useEffect(() => {
    setCart(getCart());
  }, []);

  // Tự động điền thông tin người dùng vào form nếu đã đăng nhập
  useEffect(() => {
    if (isAuthenticated && user) {
      setBillInfo(prev => ({
        ...prev,
        name: user.name || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "" // Thêm cả địa chỉ nếu có
      }));
    }
  }, [isAuthenticated, user]);

  // --- CÁC HÀM XỬ LÝ GIỎ HÀNG ---

  const handleQuantityChange = (id, change) => {
    updateQuantity(id, change);
    setCart(getCart());
  };

  const handleRemove = (id) => {
    removeFromCart(id);
    setCart(getCart());
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillInfo((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // --- HÀM THANH TOÁN QUAN TRỌNG NHẤT ---

  const handleCheckout = async (e) => {
    e.preventDefault();

    // 1. Kiểm tra các điều kiện cần thiết
    const token = localStorage.getItem("accessToken");
    if (!isAuthenticated || !user || !user.id || !token) {
      alert("⚠️ Vui lòng đăng nhập để đặt hàng!");
      navigate('/login');
      return;
    }
    if (cart.length === 0) {
      alert("🛒 Giỏ hàng của bạn đang trống!");
      return;
    }
    if (!billInfo.name || !billInfo.address || !billInfo.phoneNumber) {
      alert("⚠️ Vui lòng điền đầy đủ các trường thông tin bắt buộc (*)");
      return;
    }

    setLoading(true);

    try {
      // ✅ 2. TẠO REQUEST BODY KHỚP VỚI YÊU CẦU CỦA BACKEND
      // Cấu trúc này đã hoàn toàn chính xác
      const requestBody = {
        order: {
          productIds: cart.flatMap((item) => Array(item.quantity).fill(item.id)),
          boughtBy: user.id // Lấy ID từ user object trong AuthContext
        },
        bill: {
          name: billInfo.name,
          address: billInfo.address,
          phoneNumber: billInfo.phoneNumber,
          paymentMethod: billInfo.paymentMethod,
          note: billInfo.note
        }
      };

      // 3. Gửi request lên server
      const response = await fetch("https://localhost:7165/api/Order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Không thể tạo đơn hàng!" }));
        throw new Error(errorData.title || errorData.message || "Lỗi không xác định");
      }

      const result = await response.json();
      alert(`✅ Đặt hàng thành công!\nMã đơn hàng của bạn là: ${result.orderId}`);

      // 4. Dọn dẹp và chuyển hướng
      clearCart();
      navigate(`/order-success/${result.orderId}`);

    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      alert(`❌ Có lỗi xảy ra khi đặt hàng: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- TÍNH TOÁN VÀ RENDER ---

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (authLoading) {
    return <div className="text-center mt-10">Đang tải thông tin người dùng...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-600 text-lg">Bạn cần đăng nhập để xem giỏ hàng.</p>
        <button onClick={() => navigate('/login')} className="text-blue-600 bg-blue-100 px-4 py-2 rounded-lg hover:underline mt-3">
          Đến trang đăng nhập
        </button>
      </div>
    );
  }
  
  if (cart.length === 0) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-600 text-lg">🛒 Giỏ hàng của bạn đang trống</p>
        <button onClick={() => navigate("/")} className="text-blue-600 hover:underline mt-3">
          ← Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🛍️ Giỏ hàng của bạn</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ==== Cột trái: Danh sách sản phẩm ==== */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-b-0">
                <img src={item.imageUrl || "https://via.placeholder.com/80"} alt={item.name} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <h2 className="font-semibold text-lg">{item.name}</h2>
                  <p className="text-green-600 font-medium">{item.price.toLocaleString()} đ</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleQuantityChange(item.id, -1)} className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded">-</button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.id, 1)} className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded">+</button>
                </div>
                <button onClick={() => handleRemove(item.id)} className="text-red-600 hover:text-red-700 font-medium">Xóa</button>
              </div>
            ))}
          </div>
        </div>

        {/* ==== Cột phải: Thông tin thanh toán ==== */}
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
              <button onClick={() => setShowCheckoutForm(true)} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold">
                Tiến hành thanh toán
              </button>
            ) : (
              <form onSubmit={handleCheckout} className="space-y-4">
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
                  <label className="block text-sm font-medium mb-1">Ghi chú</label>
                  <textarea name="note" value={billInfo.note} onChange={handleInputChange} rows="2" className="w-full px-3 py-2 border rounded-lg" placeholder="Ghi chú cho người bán..." />
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowCheckoutForm(false)} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold">Hủy</button>
                  <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50">
                    {loading ? "Đang xử lý..." : "Đặt hàng"}
                  </button>
                </div>
              </form>
            )}
            <button onClick={() => navigate("/")} className="block w-full text-center text-blue-600 hover:underline mt-4">
              ← Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}