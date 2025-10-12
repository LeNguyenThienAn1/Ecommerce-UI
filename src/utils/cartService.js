// src/utils/cartService.js

const CART_KEY = "shopping_cart";

/**
 * Lấy giỏ hàng từ localStorage
 */
export const getCart = () => {
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Error reading cart:", error);
    return [];
  }
};

/**
 * Lưu giỏ hàng vào localStorage
 */
const saveCart = (cart) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    // Trigger event để các component khác update
    window.dispatchEvent(new Event("cartUpdated"));
  } catch (error) {
    console.error("Error saving cart:", error);
  }
};

/**
 * Thêm sản phẩm vào giỏ hàng
 * @param {Object} product - Sản phẩm cần thêm (phải có id)
 * @param {number} quantity - Số lượng (mặc định 1)
 */
export const addToCart = (product, quantity = 1) => {
  const cart = getCart();
  
  // Tìm sản phẩm đã tồn tại (cùng id và detail giống nhau)
  const existingIndex = cart.findIndex((item) => {
    return (
      item.id === product.id &&
      item.size === product.size &&
      item.color === product.color &&
      item.capacity === product.capacity &&
      item.batteryCapacity === product.batteryCapacity
    );
  });

  if (existingIndex > -1) {
    // Nếu đã có thì tăng số lượng
    cart[existingIndex].quantity += quantity;
  } else {
    // Nếu chưa có thì thêm mới
    cart.push({
      ...product,
      quantity: quantity,
    });
  }

  saveCart(cart);
};

/**
 * Cập nhật số lượng sản phẩm
 * @param {string} id - ID sản phẩm
 * @param {number} change - Thay đổi số lượng (+1 hoặc -1)
 */
export const updateQuantity = (id, change) => {
  const cart = getCart();
  const item = cart.find((p) => p.id === id);
  
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(id);
    } else {
      saveCart(cart);
    }
  }
};

/**
 * Xóa sản phẩm khỏi giỏ hàng
 * @param {string} id - ID sản phẩm cần xóa
 */
export const removeFromCart = (id) => {
  const cart = getCart();
  const newCart = cart.filter((p) => p.id !== id);
  saveCart(newCart);
};

/**
 * Xóa toàn bộ giỏ hàng
 */
export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event("cartUpdated"));
};

/**
 * Đếm tổng số sản phẩm trong giỏ
 */
export const getCartCount = () => {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Tính tổng tiền giỏ hàng
 */
export const getCartTotal = () => {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

/**
 * Tạo đơn hàng (gọi API)
 * @param {Object} orderDto - Thông tin đơn hàng
 * @param {Object} billInfo - Thông tin người nhận
 */
export const createOrder = async (orderDto, billInfo) => {
  const request = {
    order: orderDto,
    bill: billInfo,
  };

  const response = await fetch("http://localhost:5000/api/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Lỗi khi tạo đơn hàng");
  }

  return await response.json();
};