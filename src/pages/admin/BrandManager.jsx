import React, { useEffect, useState } from "react";

export default function BrandManager() {
  const [brands, setBrands] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    logoUrl: "",
  });

  const API_BASE = "https://localhost:7165/api/Admin/brands";

  // ✅ Load brand list + normalize field names
  const loadBrands = () => {
    fetch(API_BASE)
      .then((res) => res.json())
      .then((data) => {
        // Chuẩn hóa dữ liệu trả về từ API
        const normalized = data.map((b) => ({
          id: b.brandId,
          name: b.brandName,
          logoUrl: b.logoUrl,
        }));
        setBrands(normalized);
      })
      .catch((err) => console.error("Failed to load brands:", err));
  };

  useEffect(() => {
    loadBrands();
  }, []);

  // Mở form tạo mới
  const openCreateForm = () => {
    setEditingBrand(null);
    setFormData({ id: "", name: "", logoUrl: "" });
    setShowForm(true);
  };

  // Mở form sửa
  const openEditForm = (brand) => {
    setEditingBrand(brand);
    setFormData({
      id: brand.id,
      name: brand.name,
      logoUrl: brand.logoUrl || "",
    });
    setShowForm(true);
  };

  // ✅ Save (Create or Update)
  const handleSave = async () => {
    const payload = {
      id: formData.id || "00000000-0000-0000-0000-000000000000",
      name: formData.name.trim(),
      logoUrl: formData.logoUrl.trim(),
    };

    console.log("Payload gửi lên:", payload);

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const ok = await res.json().catch(() => false);
      if (ok === true) {
        await loadBrands();
        setShowForm(false);
        setEditingBrand(null);
      } else {
        alert("Save failed (API returned false).");
      }
    } catch (err) {
      console.error("Save failed:", err);
      alert("Error saving brand!");
    }
  };

  // Xóa brand
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;

    fetch(`${API_BASE}/${id}`, { method: "DELETE" })
      .then(() => setBrands((prev) => prev.filter((b) => b.id !== id)))
      .catch((err) => console.error("Delete failed:", err));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Brand Management</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={openCreateForm}
        >
          + Create Brand
        </button>
      </div>

      {/* Bảng hiển thị Brand */}
      <table className="w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Logo</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((b) => (
            <tr key={b.id} className="border-t hover:bg-gray-50">
              <td className="p-3 font-medium">{b.name}</td>
              <td className="p-3">
                {b.logoUrl ? (
                  <img
                    src={b.logoUrl}
                    alt={b.name}
                    className="h-10 w-auto object-contain"
                  />
                ) : (
                  <span className="text-gray-500 italic">No logo</span>
                )}
              </td>
              <td className="p-3">
                <button
                  className="text-blue-600 hover:underline mr-2"
                  onClick={() => openEditForm(b)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDelete(b.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {brands.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center p-4 text-gray-500">
                No brands found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-lg font-bold mb-4">
              {editingBrand ? "Edit Brand" : "Create Brand"}
            </h3>

            <input
              type="text"
              placeholder="Brand Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border p-2 mb-3 rounded"
            />

            <input
              type="text"
              placeholder="Logo URL"
              value={formData.logoUrl}
              onChange={(e) =>
                setFormData({ ...formData, logoUrl: e.target.value })
              }
              className="w-full border p-2 mb-3 rounded"
            />

            {formData.logoUrl && (
              <div className="mb-3 text-center">
                <img
                  src={formData.logoUrl}
                  alt="Preview"
                  className="h-16 mx-auto object-contain"
                />
              </div>
            )}

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
