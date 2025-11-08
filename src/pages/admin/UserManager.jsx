import React, { useEffect, useState } from "react";

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    address: "",
    phoneNumber: "",
    avatarUrl: "",
    role: "Customer",
    isActive: true,
  });

  const API_BASE = "https://localhost:7165/api/Admin/users";

  // 🧭 Load all users
  const loadUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      alert("Error loading users!");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ➕ Open create form
  const openCreateForm = () => {
    setEditingUser(null);
    setFormData({
      id: "",
      name: "",
      email: "",
      address: "",
      phoneNumber: "",
      avatarUrl: "",
      role: "Customer",
      isActive: true,
    });
    setShowForm(true);
  };

  // ✏️ Open edit form
  const openEditForm = (user) => {
    setEditingUser(user);
    setFormData({
      id: user.id,
      name: user.name || "",
      email: user.email || "",
      address: user.address || "",
      phoneNumber: user.phoneNumber || "",
      avatarUrl: user.avatarUrl || "",
      role: user.role || "Customer",
      isActive: user.isActive ?? true,
    });
    setShowForm(true);
  };

  // 💾 Save (create or update)
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const payload = {
      id: formData.id || "00000000-0000-0000-0000-000000000000",
      name: formData.name.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      avatarUrl: formData.avatarUrl.trim(),
      role: formData.role,
      isActive: formData.isActive,
    };

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      await loadUsers();
      setShowForm(false);
      setEditingUser(null);
    } catch (err) {
      console.error(err);
      alert("Error saving user!");
    }
  };

  // // 🗑️ Delete
  // const handleDelete = async (id) => {
  //   if (!window.confirm("Are you sure you want to delete this user?")) return;
  //   const token = localStorage.getItem("token");

  //   try {
  //     const res = await fetch(`${API_BASE}/${id}`, {
  //       method: "DELETE",
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     if (!res.ok) throw new Error("Delete failed");
  //     setUsers((prev) => prev.filter((u) => u.id !== id));
  //   } catch (err) {
  //     console.error(err);
  //     alert("Error deleting user!");
  //   }
  // };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">👥 User Management</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          onClick={openCreateForm}
        >
          + Create User
        </button>
      </div>

      {/* Table */}
      <table className="w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Avatar</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center p-4 text-gray-500">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <img
                    src={
                      u.avatarUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        u.name || "User"
                      )}&background=random`
                    }
                    alt={u.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.phoneNumber || "—"}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      u.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    className="text-blue-600 hover:underline mr-3"
                    onClick={() => openEditForm(u)}
                  >
                    Edit
                  </button>
                  {/* <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(u.id)}
                  >
                    Delete
                  </button> */}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-lg font-bold mb-4">
              {editingUser ? "Edit User" : "Create User"}
            </h3>

            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border p-2 mb-3 rounded"
            />

            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border p-2 mb-3 rounded"
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              className="w-full border p-2 mb-3 rounded"
            />

            <input
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full border p-2 mb-3 rounded"
            />

            <input
              type="text"
              placeholder="Avatar URL (optional)"
              value={formData.avatarUrl}
              onChange={(e) =>
                setFormData({ ...formData, avatarUrl: e.target.value })
              }
              className="w-full border p-2 mb-3 rounded"
            />

            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full border p-2 mb-3 rounded"
            >
              <option value="Customer">Customer</option>
              <option value="Admin">Admin</option>
            </select>

            <label className="flex items-center mb-3">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="mr-2"
              />
              <span>Active</span>
            </label>

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
