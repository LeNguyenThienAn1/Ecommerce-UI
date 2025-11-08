import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "../services/cartService.js";
import { wishlistService } from "../services/wishlistService.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Heart } from "lucide-react";

const featuredTypeLabel = {
  0: "Normal",
  1: "Best Seller",
  2: "New",
  3: "Popular",
  4: "Sale",
};

const featuredTypeColor = {
  1: "bg-gradient-to-r from-blue-400 to-blue-500",
  2: "bg-gradient-to-r from-cyan-400 to-blue-400",
  3: "bg-gradient-to-r from-blue-500 to-blue-600",
  4: "bg-gradient-to-r from-red-500 to-red-600",
};

const ProductCard = ({ product, categoryName, brandName }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  // ✅ Kiểm tra sản phẩm có trong wishlist hay không
  useEffect(() => {
    const loadWishlist = async () => {
      if (!isAuthenticated) return;

      try {
        const data = await wishlistService.getWishlist();
        setIsFavorite(data.some((item) => item.id === product.id));
      } catch (error) {
        console.warn("Không thể tải wishlist:", error);
      }
    };
    loadWishlist();
  }, [isAuthenticated, product.id]);

  // ❤️ Toggle wishlist
  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      alert("🎅 Vui lòng đăng nhập để thêm sản phẩm vào yêu thích ❤️");
      return;
    }

    try {
      await wishlistService.toggleWishlist(product.id);
      setIsFavorite((prev) => !prev);
    } catch (err) {
      console.error("Lỗi toggle wishlist:", err);
      alert("❌ Không thể cập nhật danh sách yêu thích!");
    }
  };

  // 💰 Tính giá cuối cùng (sau giảm)
  const finalPrice =
    product.salePercent && product.salePercent > 0
      ? product.price * (1 - product.salePercent / 100)
      : product.price;

  // 🛒 Thêm vào giỏ hàng
  const handleAddToCart = () => {
    try {
      const productForCart = {
        ...product,
        price: finalPrice,
        originalPrice: product.price,
      };
      addToCart(productForCart);
      navigate("/cart");
    } catch (error) {
      console.error("Add to cart failed:", error);
      alert("❌ Không thể thêm sản phẩm vào giỏ hàng!");
    }
  };

  return (
    <div className="relative border-4 border-blue-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex flex-col bg-white overflow-hidden group">
      {/* Christmas decorations */}
      <div className="absolute -top-2 -right-2 text-3xl opacity-30 pointer-events-none group-hover:opacity-50 transition-opacity">
        ❄️
      </div>
      <div className="absolute -bottom-2 -left-2 text-2xl opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity">
        🎄
      </div>

      {/* 🏷 Gắn nhãn nổi bật */}
      {product.isFeatured && (
        <span
          className={`absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10 border-2 border-white/30 ${
            featuredTypeColor[product.featuredType] || "bg-gradient-to-r from-blue-400 to-blue-500"
          }`}
        >
          ✨ {featuredTypeLabel[product.featuredType] ?? "Hot"}
        </span>
      )}

      {/* ❤️ Nút yêu thích */}
      <button
        onClick={handleToggleWishlist}
        className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:scale-110 transition-transform border-2 border-blue-200"
        title={isFavorite ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
      >
        <Heart
          className={`w-6 h-6 transition-all ${
            isFavorite ? "text-red-500 fill-red-500" : "text-gray-400 hover:text-red-400"
          }`}
        />
      </button>

      {/* 🖼 Ảnh sản phẩm */}
      <Link to={`/products/${product.id}`} className="overflow-hidden rounded-xl border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
      </Link>

      {/* 📛 Tên sản phẩm */}
      <h3 className="text-lg font-bold mt-4 line-clamp-1 text-blue-800 group-hover:text-blue-600 transition-colors">
        {product.name}
      </h3>

      {/* 📄 Mô tả */}
      <p className="text-blue-600 text-sm line-clamp-2 flex-grow mt-1">
        {product.description}
      </p>

      {/* 💰 Giá */}
      <div className="mt-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-3 border-2 border-blue-100">
        {product.salePercent && product.salePercent > 0 ? (
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-red-600 font-bold text-xl">
                {finalPrice.toLocaleString()} đ
              </span>
              <span className="block line-through text-gray-400 text-sm">
                {product.price.toLocaleString()} đ
              </span>
            </div>
            <span className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold px-3 py-1 rounded-full text-sm shadow-md border-2 border-white/30">
              🎁 -{product.salePercent}%
            </span>
          </div>
        ) : (
          <p className="text-red-600 font-bold text-xl">
            {product.price.toLocaleString()} đ
          </p>
        )}
      </div>

      {/* 📦 Thông tin phụ */}
      <div className="text-sm text-blue-700 mt-3 space-y-2 bg-blue-50 rounded-xl p-3 border border-blue-200">
        <p className="flex items-center gap-2">
          <span className="font-bold">🏷️ Category:</span> 
          <span className="text-gray-700">{categoryName || "N/A"}</span>
        </p>
        <p className="flex items-center gap-2">
          <span className="font-bold">⭐ Brand:</span> 
          <span className="text-gray-700">{brandName || "N/A"}</span>
        </p>
        <p className="flex items-center gap-2">
          <span className="font-bold">📦 Stock:</span> 
          <span className={`font-semibold ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
            {product.stock}
          </span>
        </p>
      </div>

      {/* 🛒 Nút hành động */}
      <div className="flex items-center gap-2 mt-4">
        <Link
          to={`/products/${product.id}`}
          className="flex-1 text-center bg-white border-2 border-blue-400 text-blue-600 px-4 py-3 rounded-full hover:bg-blue-50 transition-all font-bold shadow-md hover:shadow-lg"
        >
          👁️ View
        </Link>
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-gradient-to-r from-blue-400 to-blue-500 text-white px-4 py-3 rounded-full hover:from-blue-500 hover:to-blue-600 transition-all font-bold shadow-lg hover:shadow-xl border-2 border-white/30"
        >
          🛒 Add
        </button>
      </div>
    </div>
  );
};

export default ProductCard;