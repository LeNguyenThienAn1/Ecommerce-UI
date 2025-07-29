import React from 'react';

const ProductList = () => {
  // Mock product data
  const products = [
    { id: 1, name: 'Product 1', price: '$10' },
    { id: 2, name: 'Product 2', price: '$20' },
    { id: 3, name: 'Product 3', price: '$30' },
  ];

  return (
    <div className="product-list">
      {products.map(product => (
        <div key={product.id} className="product-item">
          <h2>{product.name}</h2>
          <p>{product.price}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
