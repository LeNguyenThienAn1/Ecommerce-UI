import { useWishlist } from "../../hooks/useWishlist";
import ProductCard from "../../components/ProductCard";

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  if (!wishlist.length)
    return (
      <p className="text-center text-gray-500 mt-10">
        Chưa có sản phẩm yêu thích nào 💔
      </p>
    );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {wishlist.map((item) => (
        <ProductCard
          key={item.productId}
          product={{
            id: item.productId,
            name: item.productName,
            imageUrl: item.imageUrl,
            price: item.price,
            description: item.productDescription,
            salePercent: item.salePercent || 0,
            featuredType: item.featuredType || 0,
            isFeatured: (item.featuredType ?? 0) > 0,
          }}
          categoryName={item.categoryName || "Unknown"}
          brandName={item.brandName || "Unknown"}
        />
      ))}
    </div>
  );
}
