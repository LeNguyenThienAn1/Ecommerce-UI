import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductDetail from '../components/product/ProductDetail';
import { getProductById } from '../services/productService';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProductById(id);
      setProduct(data);
    };

    fetchProduct();
  }, [id]);

  return (
    <div>
      <ProductDetail product={product} />
    </div>
  );
};

export default ProductDetailPage;
