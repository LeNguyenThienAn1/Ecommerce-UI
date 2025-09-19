// src/utils/cartService.js

// Lấy giỏ hàng từ localStorage
export const getCart = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

// Lưu giỏ hàng vào localStorage
const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Thêm sản phẩm vào giỏ
export const addToCart = (product, quantity = 1) => {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }

  saveCart(cart);
  return cart;
};

// Cập nhật số lượng
export const updateQuantity = (productId, quantity) => {
  const cart = getCart();
  const updated = cart.map((item) =>
    item.id === productId ? { ...item, quantity } : item
  );
  saveCart(updated);
  return updated;
};

// Xóa sản phẩm
export const removeFromCart = (productId) => {
  const cart = getCart();
  const updated = cart.filter((item) => item.id !== productId);
  saveCart(updated);
  return updated;
};
