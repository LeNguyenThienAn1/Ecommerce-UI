import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import CartItem from './CartItem';

const Cart = () => {
  const { cart } = useContext(CartContext);

  return (
    <div className="w-full">
      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          <div className="mt-8 pt-4 border-t flex justify-end items-center">
            <h3 className="text-xl font-bold">Total: ${cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</h3>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;