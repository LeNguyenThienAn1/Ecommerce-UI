import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function ProductDetail() {
  const { id } = useParams(); // get id from URL
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // State cho detail option user chọn
  const [selectedDetail, setSelectedDetail] = useState({
    size: "",
    color: "",
    capacity: "",
    batteryCapacity: "",
  });

  useEffect(() => {
    // Fetch product by id
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
        if (data.category && data.category.name) {
          setCategory(data.category);
        } else if (data.categoryId) {
          fetch(`https://localhost:7165/api/categories/${data.categoryId}`)
            .then((res) => {
              if (!res.ok) throw new Error("Failed to fetch category");
              return res.json();
            })
            .then((cat) => setCategory(cat))
            .catch((err) => console.error("Error fetching category:", err));
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (!product) {
    return <p className="text-center text-red-500">Product not found</p>;
  }

  // Handler khi chọn option
  const handleDetailChange = (field, value) => {
    setSelectedDetail((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow mt-6">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Home
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

          <p className="text-2xl text-green-600 font-semibold mb-4">
            {product.price?.toLocaleString()} đ
          </p>

          <p className="mb-2">
            <span className="font-semibold">Stock:</span> {product.stock}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Category:</span>{" "}
            {category?.name || "Uncategorized"}
          </p>

          {/* --- Detail Options --- */}
          <div className="mt-4 space-y-3">
            {/* Size */}
            <div>
              <label className="block font-semibold mb-1">Size:</label>
              <select
                className="border rounded px-3 py-2 w-full"
                value={selectedDetail.size}
                onChange={(e) => handleDetailChange("size", e.target.value)}
              >
                <option value="">Select size</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>

            {/* Color */}
            <div>
              <label className="block font-semibold mb-1">Color:</label>
              <select
                className="border rounded px-3 py-2 w-full"
                value={selectedDetail.color}
                onChange={(e) => handleDetailChange("color", e.target.value)}
              >
                <option value="">Select color</option>
                <option value="Blue">Blue</option>
                <option value="Black">Black</option>
                <option value="White">White</option>
                <option value="Red">Red</option>
              </select>
            </div>

            {/* Capacity */}
            <div>
              <label className="block font-semibold mb-1">Capacity:</label>
              <select
                className="border rounded px-3 py-2 w-full"
                value={selectedDetail.capacity}
                onChange={(e) => handleDetailChange("capacity", e.target.value)}
              >
                <option value="">Select capacity</option>
                <option value="16">16 GB</option>
                <option value="32">32 GB</option>
                <option value="64">64 GB</option>
                <option value="128">128 GB</option>
              </select>
            </div>

            {/* Battery */}
            <div>
              <label className="block font-semibold mb-1">
                Battery Capacity:
              </label>
              <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={selectedDetail.batteryCapacity}
                onChange={(e) =>
                  handleDetailChange("batteryCapacity", e.target.value)
                }
              />
            </div>
          </div>

          <button className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
