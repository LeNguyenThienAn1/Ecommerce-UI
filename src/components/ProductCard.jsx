import React from "react";
import { Link } from "react-router-dom";

const featuredTypeLabel = {
  0: "Normal",
  1: "Best Seller",
  2: "New",
  3: "Popular",
  4: "Sale",
};

const featuredTypeColor = {
  1: "bg-yellow-500", // Best Seller
  2: "bg-green-500",  // New
  3: "bg-blue-500",   // Popular
  4: "bg-red-600",    // Sale
};

const ProductCard = ({ product }) => {
  return (
    <div className="relative border rounded-2xl shadow hover:shadow-lg transition p-4 flex flex-col bg-white">
      {/* Badge Featured */}
      {product.isFeatured && (
        <span
          className={`absolute top-2 left-2 text-white text-xs font-bold px-3 py-1 rounded-full shadow ${
            featuredTypeColor[product.featuredType] || "bg-purple-500"
          }`}
        >
          {featuredTypeLabel[product.featuredType] ?? "Hot"}
        </span>
      )}

      {/* Product Image */}
      <Link to={`/products/${product.id}`} className="overflow-hidden rounded-xl">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover transform hover:scale-105 transition"
        />
      </Link>

      {/* Product Info */}
      <h3 className="text-lg font-semibold mt-3 line-clamp-1 text-gray-800">
        {product.name}
      </h3>
      <p className="text-gray-600 text-sm line-clamp-2 flex-grow">
        {product.description}
      </p>

      {/* Price & Sale */}
      <div className="mt-2">
        {product.salePercent && product.salePercent > 0 ? (
          <div>
            <span className="text-red-500 font-bold text-lg">
              {(
                product.price -
                (product.price * product.salePercent) / 100
              ).toLocaleString()}{" "}
              đ
            </span>
            <span className="line-through text-gray-400 ml-2">
              {product.price.toLocaleString()} đ
            </span>
            <span className="ml-2 text-green-600 font-semibold">
              -{product.salePercent}%
            </span>
          </div>
        ) : (
          <p className="text-red-500 font-bold text-lg">
            {product.price.toLocaleString()} đ
          </p>
        )}
      </div>

      {/* Extra info */}
      <div className="text-sm text-gray-600 mt-2 space-y-1">
        <p>
          <span className="font-medium">Category:</span>{" "}
          {product.categoryName ?? "Unknown"}
        </p>
        <p>
          <span className="font-medium">Stock:</span>{" "}
          {product.stock}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-4">
        <Link to={`/products/${product.id}`} className="text-blue-600 hover:underline">
          View details
        </Link>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
