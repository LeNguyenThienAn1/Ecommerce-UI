import React, { useEffect, useState } from "react";

// ================== ENUM OPTIONS ==================
const CategoryOptions = [
  { value: 0, label: "All Categories" },
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
  { value: 0, label: "All Brands" },
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

const SortOptions = [
  { value: "name", label: "Sort by Name" },
  { value: "price", label: "Sort by Price" },
  { value: "category", label: "Sort by Category" },
  { value: "brand", label: "Sort by Brand" },
];

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState({
    category: 0,
    brand: 0,
    searchTerm: "",
    sortBy: "name",
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  // ================== FORM STATE ==================
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: 0,
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

  // ================== API CALL ==================
  const loadProducts = () => {
    const payload = {
      searchTerm: filters.searchTerm || "",
      sortBy: filters.sortBy || "name",
      pageNumber,
      pageSize,
      brand: filters.brand && filters.brand !== 0 ? [filters.brand] : [],
      category: filters.category && filters.category !== 0 ? [filters.category] : [],
    };

    fetch("https://localhost:7165/api/Admin/Paging", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.items || []);
        setTotalCount(data.totalCount || 0);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadProducts();
  }, [pageNumber, filters]);

  useEffect(() => {
    setPageNumber(1);
  }, [filters]);

  // ================== DELETE ==================
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    fetch(`https://localhost:7165/api/Admin/products/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setTotalCount((prev) => prev - 1);
      })
      .catch((err) => console.error(err));
  };

  // ================== CREATE / UPDATE ==================
  const handleOpenModal = (product = null) => {
    if (product) {
      setEditProduct(product);
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
        category: product.category,
        brand: product.brand,
        detail: {
          size: product.detail?.size || "",
          color: product.detail?.color || 0,
          capacity: product.detail?.capacity || 0,
          batteryCapacity: product.detail?.batteryCapacity || 0,
        },
      });
    } else {
      setEditProduct(null);
      setFormData({
        id: "",
        name: "",
        description: "",
        price: 0,
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
    }
    setShowModal(true);
  };

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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save product");
        return res.json();
      })
      .then(() => {
        setShowModal(false);
        loadProducts();
      })
      .catch((err) => console.error(err));
  };

  const getCategoryName = (value) =>
    CategoryOptions.find((c) => c.value === value)?.label || "N/A";
  const getBrandName = (value) =>
    BrandOptions.find((b) => b.value === value)?.label || "N/A";
  const getColorName = (value) =>
    ColorOptions.find((c) => c.value === value)?.label || "N/A";
  const getCapacityName = (value) =>
    CapacityOptions.find((c) => c.value === value)?.label || "N/A";

  // ================== RENDER ==================
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
        <button
          onClick={() => handleOpenModal(null)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Create Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: Number(e.target.value) })
            }
            className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {CategoryOptions.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <select
            value={filters.brand}
            onChange={(e) =>
              setFilters({ ...filters, brand: Number(e.target.value) })
            }
            className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {BrandOptions.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters({ ...filters, sortBy: e.target.value })
            }
            className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {SortOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search products..."
            value={filters.searchTerm}
            onChange={(e) =>
              setFilters({ ...filters, searchTerm: e.target.value })
            }
            className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Brand
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {p.imageUrl && (
                      <img
                        className="h-10 w-10 rounded-lg object-cover mr-3"
                        src={p.imageUrl}
                        alt={p.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {p.name}
                      </div>
                      {p.description && (
                        <div className="text-sm text-gray-500">
                          {p.description.length > 50
                            ? p.description.substring(0, 50) + "..."
                            : p.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${p.price}</div>
                  {p.salePercent > 0 && (
                    <div className="text-xs text-red-500">
                      {p.salePercent}% OFF
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getCategoryName(p.category)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getBrandName(p.brand)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {p.stock || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                    onClick={() => handleOpenModal(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-8 text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-700">
          Showing {(pageNumber - 1) * pageSize + 1} to{" "}
          {Math.min(pageNumber * pageSize, totalCount)} of {totalCount} results
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((prev) => prev - 1)}
          >
            Previous
          </button>
          <span className="px-3 py-2">
            Page {pageNumber} of {totalPages || 1}
          </span>
          <button
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            disabled={pageNumber >= totalPages}
            onClick={() => setPageNumber((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal Create / Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editProduct ? "Edit Product" : "Create Product"}
              </h3>
            </div>

            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: Number(e.target.value) })
                    }
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Product description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows="3"
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: Number(e.target.value) })
                    }
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: Number(e.target.value) })
                    }
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {CategoryOptions.slice(1).map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand *
                  </label>
                  <select
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: Number(e.target.value) })
                    }
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {BrandOptions.slice(1).map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sale Percent
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.salePercent}
                    onChange={(e) =>
                      setFormData({ ...formData, salePercent: Number(e.target.value) })
                    }
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Featured Type
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.featuredType}
                    onChange={(e) =>
                      setFormData({ ...formData, featuredType: Number(e.target.value) })
                    }
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) =>
                        setFormData({ ...formData, isFeatured: e.target.checked })
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Featured Product</span>
                  </label>
                </div>
              </div>

              {/* Product Detail Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Product Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Size
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 6.1 inch"
                      value={formData.detail.size}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          detail: { ...formData.detail, size: e.target.value },
                        })
                      }
                      className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <select
                      value={formData.detail.color}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          detail: { ...formData.detail, color: Number(e.target.value) },
                        })
                      }
                      className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {ColorOptions.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity
                    </label>
                    <select
                      value={formData.detail.capacity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          detail: { ...formData.detail, capacity: Number(e.target.value) },
                        })
                      }
                      className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {CapacityOptions.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Battery Capacity (mAh)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g., 4000"
                      value={formData.detail.batteryCapacity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          detail: {
                            ...formData.detail,
                            batteryCapacity: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editProduct ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}