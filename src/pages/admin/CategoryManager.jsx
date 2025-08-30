import React, { useEffect, useState } from "react";

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    enumCategory: "",
    name: "",
    description: "",
  });

  // Danh sách enum (có thể lấy từ API backend, tạm hardcode ở đây)
  const enumCategories = [
    "TV",
    "Phone",
    "Laptop",
    "Tablet",
    "Accessory",
    "Headphone",
    "Camera",
    "SmartWatch",
  ];

  // Load categories từ API
  const loadCategories = () => {
    fetch("https://localhost:7165/api/Admin/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Open Create Form
  const openCreateForm = () => {
    setEditingCategory(null);
    setFormData({
      id: "",
      enumCategory: "",
      name: "",
      description: "",
    });
    setShowForm(true);
  };

  // Open Edit Form
  const openEditForm = (category) => {
    setEditingCategory(category);
    setFormData({
      id: category.categoryId,
      enumCategory: category.enumCategory || "",
      name: category.categoryName,
      description: category.description || "",
    });
    setShowForm(true);
  };

  // Save (Create or Update)
  const handleSave = () => {
    const payload = {
      ...(formData.id ? { id: formData.id } : {}),
      enumCategory: formData.enumCategory,
      name: formData.name,
      description: formData.description,
    };

    fetch("https://localhost:7165/api/Admin/categories/createupdate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/plain",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((ok) => {
        if (ok === true) {
          loadCategories();
        } else {
          alert("Save failed!");
        }
      })
      .finally(() => {
        setShowForm(false);
        setEditingCategory(null);
      })
      .catch((err) => console.error(err));
  };

  // Delete category
  const handleDelete = (id) => {
    fetch(`https://localhost:7165/api/Admin/categories/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setCategories(categories.filter((c) => c.categoryId !== id));
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Category Management</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={openCreateForm}
        >
          + Create Category
        </button>
      </div>

      <table className="w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Enum</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.categoryId} className="border-t">
              <td className="p-3">{c.enumCategory}</td>
              <td className="p-3">{c.categoryName}</td>
              <td className="p-3">{c.description}</td>
              <td className="p-3">
                <button
                  className="text-blue-600 hover:underline mr-2"
                  onClick={() => openEditForm(c)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDelete(c.categoryId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-500">
                No categories found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 shadow">
            <h3 className="text-lg font-bold mb-4">
              {editingCategory ? "Edit Category" : "Create Category"}
            </h3>

            {/* Enum Category */}
            <select
              value={formData.enumCategory}
              onChange={(e) =>
                setFormData({ ...formData, enumCategory: e.target.value })
              }
              className="w-full border p-2 mb-3 rounded"
            >
              <option value="">-- Select Enum Category --</option>
              {enumCategories.map((ec) => (
                <option key={ec} value={ec}>
                  {ec}
                </option>
              ))}
            </select>

            {/* Custom Name */}
            <input
              type="text"
              placeholder="Custom Name (optional)"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border p-2 mb-3 rounded"
            />

            {/* Description */}
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
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
