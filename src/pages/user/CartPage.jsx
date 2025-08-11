import React, { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CreditCard, Truck, Shield } from 'lucide-react';

// Fake data cho giỏ hàng (sau này sẽ lấy từ CartContext)
const fakeCartData = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 29990000,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
    quantity: 1,
    color: "Natural Titanium",
    storage: "256GB",
    brand: "Apple"
  },
  {
    id: 2,
    name: "AirPods Pro 2",
    price: 5990000,
    image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=400&h=300&fit=crop",
    quantity: 2,
    color: "White",
    brand: "Apple"
  },
  {
    id: 3,
    name: "MacBook Air M2",
    price: 27990000,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    quantity: 1,
    color: "Space Gray",
    storage: "512GB SSD",
    ram: "16GB",
    brand: "Apple"
  }
];

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex gap-6">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-24 h-24 object-cover rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
            {item.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">{item.brand}</p>
          
          {/* Product Options */}
          <div className="flex flex-wrap gap-2 mb-3">
            {item.color && (
              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                Màu: {item.color}
              </span>
            )}
            {item.storage && (
              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                {item.storage}
              </span>
            )}
            {item.ram && (
              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                RAM: {item.ram}
              </span>
            )}
          </div>

          {/* Price and Quantity */}
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-blue-600">
              {formatPrice(item.price)}
            </div>
            
            <div className="flex items-center gap-3">
              {/* Quantity Controls */}
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="p-2 hover:bg-gray-50 rounded-r-lg"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => onRemove(item.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartSummary = ({ items, onCheckout }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50000000 ? 0 : 500000; // Free shipping over 50M VND
  const tax = subtotal * 0.1; // 10% VAT
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Tổng đơn hàng</h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Tạm tính:</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Phí vận chuyển:</span>
          <span className="font-medium">
            {shipping === 0 ? (
              <span className="text-green-600">Miễn phí</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">VAT (10%):</span>
          <span className="font-medium">{formatPrice(tax)}</span>
        </div>
        
        <hr className="border-gray-200" />
        
        <div className="flex justify-between text-lg">
          <span className="font-semibold">Tổng cộng:</span>
          <span className="font-bold text-blue-600">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Benefits */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Truck className="w-4 h-4 text-green-500" />
          <span>Giao hàng miễn phí cho đơn trên 50 triệu</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Shield className="w-4 h-4 text-blue-500" />
          <span>Bảo hành chính hãng</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <CreditCard className="w-4 h-4 text-purple-500" />
          <span>Thanh toán an toàn 100%</span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
      >
        <CreditCard className="w-5 h-5" />
        Thanh toán
      </button>
    </div>
  );
};

const EmptyCart = () => {
  return (
    <div className="text-center py-16">
      <div className="text-gray-400 mb-6">
        <ShoppingBag className="w-24 h-24 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-600 mb-2">
          Giỏ hàng trống
        </h2>
        <p className="text-gray-500 mb-8">
          Bạn chưa có sản phẩm nào trong giỏ hàng
        </p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          Tiếp tục mua sắm
        </button>
      </div>
    </div>
  );
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState(fakeCartData);

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const handleCheckout = () => {
    alert('Chức năng thanh toán đang được phát triển!');
    // TODO: Implement checkout logic
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng</h1>
              <p className="text-gray-600 mt-1">
                {cartItems.length > 0 ? `${totalItems} sản phẩm` : 'Không có sản phẩm nào'}
              </p>
            </div>
            
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
              <ArrowLeft className="w-5 h-5" />
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map(item => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <CartSummary 
                items={cartItems} 
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;