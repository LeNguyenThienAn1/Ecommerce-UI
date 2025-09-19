import { addToCart } from "../utils/cartService";

const ProductCard = ({ product }) => {
  const handleAddToCart = () => {
    addToCart(product, 1);
    alert("✅ Đã thêm vào giỏ hàng!");
  };

  // Giá sau khi giảm
  const finalPrice = product.salePercent
    ? product.price * (1 - product.salePercent / 100)
    : product.price;

  return (
    <div className="p-4 bg-white rounded-xl shadow hover:shadow-md transition">
      {/* Ảnh sản phẩm */}
      <img
        src={product.imageUrl || "/placeholder.png"}
        alt={product.name}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />

      {/* Tên sản phẩm */}
      <h3 className="text-lg font-bold line-clamp-1">{product.name}</h3>

      {/* Brand id (nếu muốn đổi thành tên thì map brandId -> brandName ở FE) */}
      <p className="text-gray-500 text-sm">Brand: {product.brand}</p>

      {/* Giá */}
      <div className="mt-2">
        {product.salePercent > 0 ? (
          <>
            <p className="text-red-600 font-bold">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(finalPrice)}
            </p>
            <p className="text-gray-400 line-through text-sm">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(product.price)}
            </p>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded ml-1">
              -{product.salePercent}%
            </span>
          </>
        ) : (
          <p className="text-blue-600 font-semibold">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(product.price)}
          </p>
        )}
      </div>

      {/* Nút thêm vào giỏ */}
      <button
        onClick={handleAddToCart}
        className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Add To Cart
      </button>
    </div>
  );
};

export default ProductCard;
