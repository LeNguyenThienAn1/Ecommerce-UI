import { useEffect, useState } from "react";
import { WishlistApi } from "../api/WishlistApi";

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  const loadWishlist = async () => {
    try {
      const data = await WishlistApi.getAll();
      setWishlist(data);
    } catch (err) {
      console.error("❌ Lỗi load wishlist:", err);
    }
  };

  const toggleWishlist = async (productId) => {
    try {
      await WishlistApi.toggle(productId);
      loadWishlist(); // reload sau khi thêm / xóa
    } catch (err) {
      console.error("❌ Lỗi toggle wishlist:", err);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  return { wishlist, toggleWishlist };
};
