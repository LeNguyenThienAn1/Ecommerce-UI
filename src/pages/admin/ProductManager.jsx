import React, { useEffect, useState } from "react";

// Enum mapping
const CategoryOptions = [
  { value: 0, label: "None" },
  { value: 1, label: "TV" },
  { value: 2, label: "Phone" },
  { value: 3, label: "Laptop" },
  { value: 4, label: "Tablet" },
  { value: 5, label: "Accessory" },
  { value: 6, label: "Headphone" },
  { value: 7, label: "Camera" },
  { value: 8, label: "SmartWatch" },
];

const BrandOptions = [
  { value: 0, label: "None" },
  { value: 1, label: "Samsung" },
  { value: 2, label: "Apple" },
  { value: 3, label: "LG" },
  { value: 4, label: "Sony" },
  { value: 5, label: "Xiaomi" },
  { value: 6, label: "Asus" },
  { value: 7, label: "Acer" },
  { value: 8, label: "Dell" },
  { value: 9, label: "HP" },
  { value: 10, label: "Huawei" },
  { value: 11, label: "Oppo" },
  { value: 12, label: "Vivo" },
];

const ColorOptions = [
  { value: 0, label: "None" },
  { value: 1, label: "Blue" },
  { value: 2, label: "Green" },
  { value: 3, label: "Black" },
  { value: 4, label: "White" },
  { value: 5, label: "Yellow" },
  { value: 6, label: "Pink" },
  { value: 7, label: "Purple" },
  { value: 8, label: "Orange" },
  { value: 9, label: "Gray" },
  { value: 10, label: "Brown" },
  { value: 11, label: "Red" },
];

const CapacityOptions = [
  { value: 0, label: "None" },
  { value: 16, label: "16 GB" },
  { value: 32, label: "32 GB" },
  { value: 64, label: "64 GB" },
  { value: 128, label: "128 GB" },
  { value: 256, label: "256 GB" },
  { value: 512, label: "512 GB" },
  { value: 1024, label: "1 TB" },
  { value: 2048, label: "2 TB" },
];

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    stock: 0,
    isFeatured: false,
    featuredType: 0,
    salePercent: 0,
    category: 0,
    brand: 0,
    detail: {
      size: "",
      color: 0,
      capacity: 0,
      batteryCapacity: 0,
    },
  });

  // Load products
  const loadProducts = () => {
    fetch("https://localhost:7165/api/Admin/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Open form for Create
  const openCreateForm = () => {
    setEditingProduct(null);
    setFormData({
      id: "",
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      stock: 0,
      isFeatured: false,
      featuredType: 0,
      salePercent: 0,
      category: 0,
      brand: 0,
      detail: {
        size: "",
        color: 0,
        capacity: 0,
        batteryCapacity: 0,
      },
    });
    setShowForm(true);
  };

  // Open form for Edit
  const openEditForm = (product) => {
    setEditingProduct(product);
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description || "",
      price: product.price,
      imageUrl: product.imageUrl || "",
      stock: product.stock || 0,
      isFeatured: product.isFeatured || false,
      featuredType: product.featuredType || 0,
      salePercent: product.salePercent || 0,
      category: product.category || 0,
      brand: product.brand || 0,
      detail: {
        size: product.detail?.size || "",
        color: product.detail?.color || 0,
        capacity: product.detail?.capacity || 0,
        batteryCapacity: product.detail?.batteryCapacity || 0,
      },
    });
    setShowForm(true);
  };

  // Handle Save (Create or Update)
  const handleSave = () => {
    const payload = {
      ...(formData.id
        ? { id: formData.id }
        : { id: "00000000-0000-0000-0000-000000000000" }), // Guid.Empty khi create
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      imageUrl: formData.imageUrl,
      stock: Number(formData.stock),
      isFeatured: Boolean(formData.isFeatured),
      featuredType: Number(formData.featuredType),
      salePercent: Number(formData.salePercent),
      category: Number(formData.category),
      brand: Number(formData.brand),
      detail: {
        size: formData.detail.size,
        color: Number(formData.detail.color), // enum
        capacity: Number(formData.detail.capacity), // enum
        batteryCapacity: Number(formData.detail.batteryCapacity),
      },
    };

    fetch("https://localhost:7165/api/Admin/products/createupdate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Save failed");
      })
      .then(() => {
        loadProducts();
      })
      .catch((err) => alert(err.message))
      .finally(() => {
        setShowForm(false);
        setEditingProduct(null);
      });
  };

  // Handle delete
  const handleDelete = (id) => {
    fetch(`https://localhost:7165/api/Admin/products/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setProducts(products.filter((p) => p.id !== id));
      })
      .catch((err) => console.error(err));
  };

  // Helper để hiển thị tên enum
  const getCategoryName = (value) =>
    CategoryOptions.find((c) => c.value === value)?.label || "N/A";
  const getBrandName = (value) =>
    BrandOptions.find((b) => b.value === value)?.label || "N/A";

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Product Management</h2>
        <button
          className="bg-blue-600 text-black px-4 py-2 rounded hover:bg-blue-700"
          onClick={openCreateForm}
        >
          + Create Product
        </button>
      </div>

      <table className="w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Brand</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-3">{p.name}</td>
              <td className="p-3">{p.price}</td>
              <td className="p-3">{getCategoryName(p.category)}</td>
              <td className="p-3">{getBrandName(p.brand)}</td>
              <td className="p-3">
                <button
                  className="text-blue-600 hover:underline mr-2"
                  onClick={() => openEditForm(p)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center p-4 text-gray-500">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal Create/Edit Product */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 shadow max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">
              {editingProduct ? "Edit Product" : "Create Product"}
            </h3>

            <input
              type="text"
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border p-2 mb-3 rounded"
            />

            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border p-2 mb-3 rounded"
            />

            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full border p-2 mb-3 rounded"
            />

            <input
              type="text"
              placeholder="Image URL"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              className="w-full border p-2 mb-3 rounded"
            />

            <input
              type="number"
              placeholder="Stock"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
              className="w-full border p-2 mb-3 rounded"
            />

            <label className="flex items-center space-x-2 mb-3">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) =>
                  setFormData({ ...formData, isFeatured: e.target.checked })
                }
              />
              <span>Featured</span>
            </label>

            <input
              type="number"
              placeholder="Featured Type"
              value={formData.featuredType}
              onChange={(e) =>
                setFormData({ ...formData, featuredType: e.target.value })
              }
              className="w-full border p-2 mb-3 rounded"
            />

            <input
              type="number"
              placeholder="Sale Percent"
              value={formData.salePercent}
              onChange={(e) =>
                setFormData({ ...formData, salePercent: e.target.value })
              }
              className="w-full border p-2 mb-3 rounded"
            />

            {/* Category dropdown */}
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: Number(e.target.value) })
              }
              className="w-full border p-2 mb-3 rounded"
            >
              {CategoryOptions.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            {/* Brand dropdown */}
            <select
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: Number(e.target.value) })
              }
              className="w-full border p-2 mb-4 rounded"
            >
              {BrandOptions.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>

            {/* Product Detail */}
            <h4 className="font-semibold mt-4 mb-2">Product Detail</h4>

            <input
              type="text"
              placeholder="Size"
              value={formData.detail.size}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  detail: { ...formData.detail, size: e.target.value },
                })
              }
              className="w-full border p-2 mb-3 rounded"
            />

            {/* Color dropdown */}
            <select
              value={formData.detail.color}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  detail: { ...formData.detail, color: Number(e.target.value) },
                })
              }
              className="w-full border p-2 mb-3 rounded"
            >
              {ColorOptions.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            {/* Capacity dropdown */}
            <select
              value={formData.detail.capacity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  detail: { ...formData.detail, capacity: Number(e.target.value) },
                })
              }
              className="w-full border p-2 mb-3 rounded"
            >
              {CapacityOptions.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Battery Capacity"
              value={formData.detail.batteryCapacity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  detail: {
                    ...formData.detail,
                    batteryCapacity: e.target.value,
                  },
                })
              }
              className="w-full border p-2 mb-3 rounded"
            />

            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
