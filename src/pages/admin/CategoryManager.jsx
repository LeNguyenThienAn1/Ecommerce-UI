import React, { useEffect, useState } from "react";

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
  });

  // 🔹 Load categories từ API
  const loadCategories = async () => {
    try {
      const res = await fetch("https://localhost:7165/api/Admin/categories");
      if (!res.ok) throw new Error("Failed to load categories");
      const data = await res.json();
      setCategories(data || []);
    } catch (error) {
      console.error("❌ Error loading categories:", error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // 🔹 Open create form
  const openCreateForm = () => {
    setEditingCategory(null);
    setFormData({ id: "", name: "", description: "" });
    setShowForm(true);
  };

  // 🔹 Open edit form
  const openEditForm = (category) => {
    setEditingCategory(category);
    setFormData({
      id: category.categoryId,
      name: category.categoryName,
      description: category.description || "",
    });
    setShowForm(true);
  };

  // 🔹 Save (Create or Update)
  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Please enter category name!");
      return;
    }

    const payload = {
      ...(formData.id ? { id: formData.id } : {}),
      name: formData.name,
      description: formData.description,
    };

    try {
      const res = await fetch(
        "https://localhost:7165/api/Admin/categories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const ok = await res.json();

      if (ok === true) {
        loadCategories();
        setShowForm(false);
        setEditingCategory(null);
      } else {
        alert("❌ Save failed!");
      }
    } catch (error) {
      console.error("❌ Error saving category:", error);
    }
  };

  // 🔹 Delete category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      await fetch(`https://localhost:7165/api/Admin/categories/${id}`, {
        method: "DELETE",
      });
      setCategories(categories.filter((c) => c.categoryId !== id));
    } catch (error) {
      console.error("❌ Error deleting category:", error);
    }
  };

  // ==================== UI ====================
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
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.categoryId} className="border-t">
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
              <td colSpan="3" className="text-center p-4 text-gray-500">
                No categories found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow">
            <h3 className="text-lg font-bold mb-4">
              {editingCategory ? "Edit Category" : "Create Category"}
            </h3>

            {/* Name */}
            <input
              type="text"
              placeholder="Category name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border p-2 mb-3 rounded"
            />

            {/* Description */}
            <textarea
              placeholder="Description (optional)"
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
