import React, { useEffect, useState } from "react";
import { Package, ShoppingCart } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const resProducts = await fetch("https://localhost:7165/api/admin/Paging", {
          headers: { Accept: "text/plain" }
        });
        const textProducts = await resProducts.text();
        let productsData = [];
        try {
          const parsed = JSON.parse(textProducts);
          productsData = Array.isArray(parsed) ? parsed : parsed.$values || [];
        } catch (err) {
          console.error("Parse products error:", err, textProducts);
        }

        // Fetch categories
        const resCategories = await fetch("https://localhost:7165/api/admin/categories", {
          headers: { Accept: "text/plain" }
        });
        const textCategories = await resCategories.text();
        let categoriesData = [];
        try {
          const parsed = JSON.parse(textCategories);
          categoriesData = Array.isArray(parsed) ? parsed : parsed.$values || [];
        } catch (err) {
          console.error("Parse categories error:", err, textCategories);
        }

        setStats({
          products: productsData.length,
          categories: categoriesData.length,
        });
      } catch (error) {
        console.error("Error loading dashboard data", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow p-6 rounded-lg flex justify-between items-center">
          <div>
            <p className="text-gray-600">Total Products</p>
            <p className="text-2xl font-bold">{stats.products}</p>
          </div>
          <Package className="w-10 h-10 text-blue-600" />
        </div>
        <div className="bg-white shadow p-6 rounded-lg flex justify-between items-center">
          <div>
            <p className="text-gray-600">Total Categories</p>
            <p className="text-2xl font-bold">{stats.categories}</p>
          </div>
          <ShoppingCart className="w-10 h-10 text-green-600" />
        </div>
      </div>
    </div>
  );
}
