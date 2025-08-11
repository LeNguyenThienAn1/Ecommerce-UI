import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import CartItem from './CartItem';

const Cart = () => {
  const { cart } = useContext(CartContext) || {};
  const safeCart = Array.isArray(cart) ? cart : [];

  const totalPrice = safeCart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🛒 Your Shopping Cart</h1>

      {safeCart.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">Your cart is empty</p>
          <a href="/products" className="text-blue-600 hover:underline mt-4 block">
            Continue Shopping
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {safeCart.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Right: Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">Free</span>
            </div>
            <div className="flex justify-between border-t pt-4 text-lg font-bold">
              <span>Total</span>
              <span className="text-green-600">${totalPrice.toFixed(2)}</span>
            </div>
            <button
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
