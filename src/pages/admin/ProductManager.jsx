import React, { useEffect, useState } from "react";

// ================== STATIC OPTIONS ==================
const SortOptions = [
  { value: "name", label: "Sort by Name" },
  { value: "price", label: "Sort by Price" },
  { value: "category", label: "Sort by Category" },
  { value: "brand", label: "Sort by Brand" },
];

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState({
    category: "",
    brand: "",
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
    categoryId: "",
    brandId: "",
    detail: {
      size: "",
      capacity: 0,
      batteryCapacity: 0,
    },
  });

  // ================== LOAD CATEGORIES & BRANDS ==================
  const loadCategories = async () => {
    try {
      const response = await fetch("https://localhost:7165/api/Admin/categories");
      const data = await response.json();
      setCategories(data || []);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const loadBrands = async () => {
    try {
      const response = await fetch("https://localhost:7165/api/Admin/brands");
      const data = await response.json();
      setBrands(data || []);
    } catch (err) {
      console.error("Error loading brands:", err);
    }
  };

  useEffect(() => {
    loadCategories();
    loadBrands();
  }, []);

  // ================== API CALL ==================
  const loadProducts = () => {
    const payload = {
      searchTerm: filters.searchTerm || "",
      sortBy: filters.sortBy || "name",
      pageNumber,
      pageSize,
      brandIds: filters.brand ? [filters.brand] : null,
      categoryIds: filters.category ? [filters.category] : null,
    };

    fetch("https://localhost:7165/api/Admin/products/paging", {
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
    if (categories.length > 0 && brands.length > 0) {
      loadProducts();
    }
  }, [pageNumber, filters, categories, brands]);

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
        categoryId: product.categoryId || product.category?.id || "",
        brandId: product.brandId || product.brand?.id || "",
        detail: {
          size: product.detail?.size || "",
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
        categoryId: categories[0]?.id || "",
        brandId: brands[0]?.id || "",
        detail: {
          size: "",
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
        : { id: "00000000-0000-0000-0000-000000000000" }),
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      imageUrl: formData.imageUrl,
      stock: Number(formData.stock),
      isFeatured: Boolean(formData.isFeatured),
      featuredType: Number(formData.featuredType),
      salePercent: Number(formData.salePercent),
      categoryId: formData.categoryId,
      brandId: formData.brandId,
      detail: {
        size: formData.detail.size,
        capacity: Number(formData.detail.capacity),
        batteryCapacity: Number(formData.detail.batteryCapacity),
      },
    };

    fetch("https://localhost:7165/api/Admin/products", {
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

  // Helper functions
  const getCategoryById = (id) => categories.find((c) => c.categoryId === id);
  const getBrandById = (id) => brands.find((b) => b.brandId === id);
  const getCategoryName = (id) => getCategoryById(id)?.categoryName || "N/A";
  const getBrandName = (id) => getBrandById(id)?.brandName || "N/A";

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
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.categoryId || c.id} value={c.categoryId || c.id}>
                {c.categoryName || c.name}
              </option>
            ))}
          </select>

          <select
            value={filters.brand}
            onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
            className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Brands</option>
            {brands.map((b) => (
              <option key={b.brandId || b.id} value={b.brandId || b.id}>
                {b.brandName || b.name}
              </option>
            ))}
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
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
            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Product List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Table for large screens */}
        <div className="hidden md:block">
          {Object.entries(
            products.reduce((acc, product) => {
              const key = product.name.trim().toLowerCase(); // gom theo tên
              if (!acc[key]) acc[key] = [];
              acc[key].push(product);
              return acc;
            }, {})
          ).map(([key, group]) => {
            const first = group[0];
            const categoryName = getCategoryName(first.categoryId);
            const brandName = getBrandName(first.brandId);

            return (
              <div key={key} className="border-b border-gray-200">
                {/* Header nhóm */}
                <div className="bg-gray-100 px-6 py-3 font-semibold text-gray-800 flex justify-between items-center">
                  <span>
                    {first.name} ({group.length} biến thể)
                  </span>
                  <span className="text-sm text-gray-600">
                    {categoryName} — {brandName}
                  </span>
                </div>

                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {group.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {p.imageUrl && (
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={p.imageUrl}
                              alt={p.name}
                              onError={(e) => (e.target.style.display = "none")}
                            />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${p.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.stock || 0}</td>
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
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
        
        {/* Cards for small screens */}
        <div className="md:hidden">
        {Object.entries(
            products.reduce((acc, product) => {
              const key = product.name.trim().toLowerCase(); // gom theo tên
              if (!acc[key]) acc[key] = [];
              acc[key].push(product);
              return acc;
            }, {})
          ).map(([key, group]) => {
            const first = group[0];
            const categoryName = getCategoryName(first.categoryId);
            const brandName = getBrandName(first.brandId);
            return (
            <div key={key} className="border-b border-gray-200">
              <div className="bg-gray-100 px-4 py-3 font-semibold text-gray-800 flex justify-between items-center">
                <span>
                  {first.name} ({group.length})
                </span>
                <span className="text-sm text-gray-600">
                  {categoryName}
                </span>
              </div>
              <div className="divide-y divide-gray-200">
              {group.map(p => (
                <div key={p.id} className="p-4">
                  <div className="flex items-center gap-4">
                    {p.imageUrl && (
                      <img
                        className="h-16 w-16 rounded-lg object-cover"
                        src={p.imageUrl}
                        alt={p.name}
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    )}
                    <div className="flex-1">
                      <div className="font-bold">${p.price}</div>
                      <div className="text-sm text-gray-500">Stock: {p.stock || 0}</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 text-sm"
                        onClick={() => handleOpenModal(p)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 text-sm"
                        onClick={() => handleDelete(p.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>
            )
          })}
        </div>
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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
                    Stock Quantity *
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
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((c) => (
                      <option key={c.categoryId} value={c.categoryId}>
                        {c.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand *
                  </label>
                  <select
                    value={formData.brandId}
                    onChange={(e) =>
                      setFormData({ ...formData, brandId: e.target.value })
                    }
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {brands.map((b) => (
                      <option key={b.brandId} value={b.brandId}>
                        {b.brandName}
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
                    <span className="text-sm font-medium text-gray-700">
                      Featured Product
                    </span>
                  </label>
                </div>
              </div>

              {/* Product Detail Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-md font-semibold text-gray-900 mb-4">
                  Product Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Size
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 6.1 inch, 13.3 inch"
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
                      Capacity (GB)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g., 128, 256, 512"
                      value={formData.detail.capacity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          detail: {
                            ...formData.detail,
                            capacity: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
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