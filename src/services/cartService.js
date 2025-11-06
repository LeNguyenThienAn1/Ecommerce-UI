// src/services/cartService.js

const CART_KEY = "shopping_cart";
const API_BASE = "https://localhost:7165/api/Order";

// 🧠 Lấy giỏ hàng cục bộ
const getLocalCart = () => {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

// 💾 Lưu giỏ hàng cục bộ
const saveLocalCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

// ➕ Thêm sản phẩm vào giỏ hàng
// product: Đối tượng sản phẩm đã được tính toán giá giảm (vd: product.price là giá sau giảm)
export const addToCart = (product) => {
  const cart = getLocalCart();
  const existing = cart.find((p) => p.id === product.id);

  if (existing) {
    // ✅ Cập nhật số lượng
    existing.quantity += 1;
    
    // ✅ SỬA ĐỔI: Cập nhật lại giá (và giá gốc nếu có) từ đối tượng sản phẩm mới
    // Điều này đảm bảo giỏ hàng luôn sử dụng giá mới nhất (giá đã giảm)
    existing.price = product.price; 
    existing.originalPrice = product.originalPrice; // Giả định bạn truyền giá gốc vào đây
  } else {
    // Thêm sản phẩm mới với các thuộc tính đã được chuẩn bị (bao gồm giá đã giảm)
    cart.push({ ...product, quantity: 1 });
  }
  saveLocalCart(cart);
};

// 📦 Lấy toàn bộ giỏ hàng
export const getCart = () => {
  return getLocalCart();
};

// 🔼🔽 Cập nhật số lượng
export const updateQuantity = (productId, change) => {
  const cart = getLocalCart();
  const item = cart.find((p) => p.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) removeFromCart(productId);
    else saveLocalCart(cart);
  }
};

// ❌ Xóa sản phẩm khỏi giỏ
export const removeFromCart = (productId) => {
  const cart = getLocalCart().filter((p) => p.id !== productId);
  saveLocalCart(cart);
};

// 🧹 Xóa toàn bộ giỏ hàng
export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
};

// 🧾 Tạo order khi thanh toán
export const createOrder = async (orderData) => {
  // orderData gồm: userId, items[], address, note,...
  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) throw new Error("Tạo đơn hàng thất bại");
    const data = await res.json();

    // Sau khi tạo đơn thành công => xóa cart
    clearCart();
    return data;
  } catch (err) {
    console.error("Error creating order:", err);
    throw err;
  }
};

// 📜 Lấy danh sách đơn hàng của user
export const getOrdersByUser = async (userId) => {
  try {
    const res = await fetch(`${API_BASE}/user/${userId}`);
    if (!res.ok) throw new Error("Không thể lấy danh sách đơn hàng");
    return await res.json();
  } catch (err) {
    console.error("Error fetching orders:", err);
    return [];
  }
};

// 📄 Lấy chi tiết đơn hàng
export const getOrderById = async (orderId) => {
  try {
    const res = await fetch(`${API_BASE}/${orderId}`);
    if (!res.ok) throw new Error("Không thể lấy chi tiết đơn hàng");
    return await res.json();
  } catch (err) {
    console.error("Error fetching order:", err);
    return null;
  }
};