import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { addToCart } from "../../utils/cartService";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);

  // State cho detail option user chọn
  const [selectedDetail, setSelectedDetail] = useState({
    size: "",
    color: "",
    capacity: "",
    batteryCapacity: "",
  });

  useEffect(() => {
    // Fetch product theo id
    fetch(`https://localhost:7165/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch product");
        return res.json();
      })
      .then((data) => {
        setProduct(data);

        // Nếu có detail thì gán giá trị mặc định
        if (data.detail) {
          setSelectedDetail({
            size: data.detail.size || "",
            color: data.detail.color || "",
            capacity: data.detail.capacity || "",
            batteryCapacity: data.detail.batteryCapacity || "",
          });
        }

        // Lấy category
        if (data.category) {
          setCategory(data.category);
        } else if (data.categoryId) {
          fetch(`https://localhost:7165/api/categories`)
            .then((res) => {
              if (!res.ok) throw new Error("Failed to fetch categories");
              return res.json();
            })
            .then((categories) => {
              const cat = categories.find(c => c.categoryId === data.categoryId);
              setCategory(cat);
            })
            .catch((err) => console.error("Error fetching category:", err));
        }

        // Lấy brand
        if (data.brand) {
          setBrand(data.brand);
        } else if (data.brandId) {
          fetch(`https://localhost:7165/api/brands`)
            .then((res) => {
              if (!res.ok) throw new Error("Failed to fetch brands");
              return res.json();
            })
            .then((brands) => {
              const br = brands.find(b => b.brandId === data.brandId);
              setBrand(br);
            })
            .catch((err) => console.error("Error fetching brand:", err));
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return <p className="text-center text-red-500 mt-10">Product not found</p>;
  }

  // Handler khi chọn option
  const handleDetailChange = (field, value) => {
    setSelectedDetail((prev) => ({ ...prev, [field]: value }));
  };

  // Handler Add to Cart với 2 option
  const handleAddToCart = (goToCart = false) => {
    const productToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      ...selectedDetail,
    };

    addToCart(productToAdd, 1);

    if (goToCart) {
      // Chuyển ngay sang trang giỏ hàng
      navigate("/cart");
    } else {
      // Chỉ hiển thị thông báo
      alert("✅ Sản phẩm đã được thêm vào giỏ hàng!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow mt-6">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Quay lại trang chủ
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image */}
        <div>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-auto rounded-lg shadow"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
          <p className="text-gray-700 mb-4">{product.description}</p>

          {/* Price & Sale */}
          <div className="mb-4">
            {product.salePercent && product.salePercent > 0 ? (
              <div>
                <span className="text-2xl text-red-500 font-bold">
                  {(
                    product.price -
                    (product.price * product.salePercent) / 100
                  ).toLocaleString()}{" "}
                  đ
                </span>
                <span className="line-through text-gray-400 ml-3 text-lg">
                  {product.price.toLocaleString()} đ
                </span>
                <span className="ml-3 text-green-600 font-semibold">
                  -{product.salePercent}%
                </span>
              </div>
            ) : (
              <p className="text-2xl text-green-600 font-semibold">
                {product.price?.toLocaleString()} đ
              </p>
            )}
          </div>

          <p className="mb-2">
            <span className="font-semibold">Kho:</span> {product.stock}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Danh mục:</span>{" "}
            {category?.categoryName || "N/A"}
          </p>
          <p className="mb-4">
            <span className="font-semibold">Thương hiệu:</span>{" "}
            {brand?.brandName || "N/A"}
          </p>

          {/* --- Detail Options --- */}
          <div className="mt-4 space-y-3 border-t pt-4">
            <h3 className="font-semibold text-lg">Tùy chọn sản phẩm</h3>

            {/* Size */}
            <div>
              <label className="block font-medium mb-1">Size:</label>
              <select
                className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
                value={selectedDetail.size}
                onChange={(e) => handleDetailChange("size", e.target.value)}
              >
                <option value="">-- Chọn size --</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
                <option value="XL">XL</option>
              </select>
            </div>

            {/* Color */}
            <div>
              <label className="block font-medium mb-1">Màu sắc:</label>
              <select
                className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
                value={selectedDetail.color}
                onChange={(e) => handleDetailChange("color", e.target.value)}
              >
                <option value="">-- Chọn màu --</option>
                <option value="Blue">Xanh dương</option>
                <option value="Black">Đen</option>
                <option value="White">Trắng</option>
                <option value="Red">Đỏ</option>
                <option value="Green">Xanh lá</option>
              </select>
            </div>

            {/* Capacity */}
            <div>
              <label className="block font-medium mb-1">Dung lượng:</label>
              <select
                className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
                value={selectedDetail.capacity}
                onChange={(e) => handleDetailChange("capacity", e.target.value)}
              >
                <option value="">-- Chọn dung lượng --</option>
                <option value="16">16 GB</option>
                <option value="32">32 GB</option>
                <option value="64">64 GB</option>
                <option value="128">128 GB</option>
                <option value="256">256 GB</option>
              </select>
            </div>

            {/* Battery */}
            <div>
              <label className="block font-medium mb-1">Pin (mAh):</label>
              <input
                type="number"
                className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
                value={selectedDetail.batteryCapacity}
                onChange={(e) =>
                  handleDetailChange("batteryCapacity", e.target.value)
                }
                placeholder="Ví dụ: 5000"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-3">
            {/* HÀNH ĐỘNG PHỤ: ADD TO CART (Viền Xanh) */}
            <button
              className="flex-1 border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full hover:bg-blue-50 font-bold transition duration-200"
              onClick={() => handleAddToCart(false)}
            >
              🛒 Add To Cart
            </button>

            {/* HÀNH ĐỘNG CHÍNH: BUY NOW (Nền Cam) */}
            <button
              onClick={() => handleAddToCart(true)}
              className="flex-1 bg-orange-600 text-black px-8 py-3 rounded-full hover:bg-orange-700 font-extrabold shadow-xl tracking-wider transform hover:scale-105 transition duration-300 active:scale-95"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}