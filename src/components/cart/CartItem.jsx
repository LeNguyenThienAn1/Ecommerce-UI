import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useContext(CartContext);

  return (
    <div className="flex items-center border-b pb-4">
      <img src={item.image} alt={item.name} className="w-24 h-24 object-cover mr-4" />
      <div className="flex-grow">
        <h3 className="font-bold">{item.name}</h3>
        <p>${item.price.toFixed(2)}</p>
        <div className="flex items-center mt-2">
          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 border rounded">-</button>
          <span className="px-4">{item.quantity}</span>
          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 border rounded">+</button>
        </div>
      </div>
      <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">Remove</button>
    </div>
  );
};

export default CartItem;