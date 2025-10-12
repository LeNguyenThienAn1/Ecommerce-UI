  // import React from "react";
  // import { Link, useNavigate } from "react-router-dom";
  // import { addToCart } from "../services/cartService"; // ✅ import

  // const featuredTypeLabel = {
  //   0: "Normal",
  //   1: "Best Seller",
  //   2: "New",
  //   3: "Popular",
  //   4: "Sale",
  // };

  // const featuredTypeColor = {
  //   1: "bg-yellow-500",
  //   2: "bg-green-500",
  //   3: "bg-blue-500",
  //   4: "bg-red-600",
  // };

  // const ProductCard = ({ product, categoryName, brandName }) => {
  //   const navigate = useNavigate();

  //   const handleAddToCart = () => {
  //     addToCart(product);
  //     alert("✅ Sản phẩm đã được thêm vào giỏ hàng!");
  //     navigate("/cart");
  //   };

  //   return (
  //     <div className="relative border rounded-2xl shadow hover:shadow-lg transition p-4 flex flex-col bg-white">
  //       {product.isFeatured && (
  //         <span
  //           className={`absolute top-2 left-2 text-white text-xs font-bold px-3 py-1 rounded-full shadow ${
  //             featuredTypeColor[product.featuredType] || "bg-purple-500"
  //           }`}
  //         >
  //           {featuredTypeLabel[product.featuredType] ?? "Hot"}
  //         </span>
  //       )}

  //       <Link to={`/products/${product.id}`} className="overflow-hidden rounded-xl">
  //         <img
  //           src={product.imageUrl}
  //           alt={product.name}
  //           className="w-full h-48 object-cover transform hover:scale-105 transition"
  //         />
  //       </Link>

  //       <h3 className="text-lg font-semibold mt-3 line-clamp-1 text-gray-800">
  //         {product.name}
  //       </h3>
  //       <p className="text-gray-600 text-sm line-clamp-2 flex-grow">
  //         {product.description}
  //       </p>

  //       <div className="mt-2">
  //         {product.salePercent > 0 ? (
  //           <div>
  //             <span className="text-red-500 font-bold text-lg">
  //               {(product.price - (product.price * product.salePercent) / 100).toLocaleString()} đ
  //             </span>
  //             <span className="line-through text-gray-400 ml-2">
  //               {product.price.toLocaleString()} đ
  //             </span>
  //             <span className="ml-2 text-green-600 font-semibold">
  //               -{product.salePercent}%
  //             </span>
  //           </div>
  //         ) : (
  //           <p className="text-red-500 font-bold text-lg">
  //             {product.price.toLocaleString()} đ
  //           </p>
  //         )}
  //       </div>

  //       <div className="text-sm text-gray-600 mt-2 space-y-1">
  //         <p><span className="font-medium">Category:</span> {categoryName || "N/A"}</p>
  //         <p><span className="font-medium">Brand:</span> {brandName || "N/A"}</p>
  //         <p><span className="font-medium">Stock:</span> {product.stock}</p>
  //       </div>

  //       <div className="flex items-center justify-between mt-4">
  //         <Link to={`/products/${product.id}`} className="text-blue-600 hover:underline">
  //           View details
  //         </Link>
  //         <button
  //           onClick={handleAddToCart}
  //           className="bg-orange-500 text-black px-4 py-2 rounded-lg hover:bg-orange-600 transition"
  //         >
  //           Add to Cart
  //         </button>
  //       </div>
  //     </div>
  //   );
  // };

  // export default ProductCard;
