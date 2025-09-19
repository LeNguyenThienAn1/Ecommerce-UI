import React, { useEffect, useState } from "react";
import { getCart, updateQuantity, removeFromCart } from "../../utils/cartService";
import { Link } from "react-router-dom";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(getCart()); // lấy cart từ localStorage khi load
  }, []);

  const handleQuantityChange = (id, change) => {
    updateQuantity(id, change);
    setCart(getCart()); // reload cart sau khi update
  };

  const handleRemove = (id) => {
    removeFromCart(id);
    setCart(getCart());
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-600">🛒 Giỏ hàng trống</p>
        <Link to="/" className="text-blue-600 hover:underline mt-3 inline-block">
          ← Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow mt-6">
      <h1 className="text-2xl font-bold mb-6">🛍️ Giỏ hàng của bạn</h1>

      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b pb-4"
          >
            {/* Hình ảnh sản phẩm */}
            <img
              src={item.image || "https://via.placeholder.com/80"}
              alt={item.name}
              className="w-20 h-20 object-cover rounded"
            />

            {/* Thông tin */}
            <div className="flex-1 ml-4">
              <h2 className="font-semibold">{item.name}</h2>
              <p className="text-gray-600">{item.price.toLocaleString()} đ</p>
              <p className="text-sm text-gray-500">
                Size: {item.size || "-"}, Màu: {item.color || "-"}
              </p>
              {item.capacity && (
                <p className="text-sm text-gray-500">Dung lượng: {item.capacity} GB</p>
              )}
              {item.batteryCapacity && (
                <p className="text-sm text-gray-500">
                  Pin: {item.batteryCapacity} mAh
                </p>
              )}
            </div>

            {/* Số lượng */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleQuantityChange(item.id, -1)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(item.id, 1)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                +
              </button>
            </div>

            {/* Xóa */}
            <button
              onClick={() => handleRemove(item.id)}
              className="ml-4 text-red-600 hover:underline"
            >
              Xóa
            </button>
          </div>
        ))}
      </div>

      {/* Tổng tiền */}
      <div className="text-right mt-6">
        <p className="text-xl font-semibold">
          Tổng cộng: <span className="text-green-600">{total.toLocaleString()} đ</span>
        </p>
        <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Thanh toán
        </button>
      </div>
    </div>
  );
}
