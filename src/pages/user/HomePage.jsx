import React, { useState, useEffect } from "react";
import { getBrands, getCategories } from "../../api/ProductApi.js"; // chỉ giữ brands & categories
import ProductCard from "../../components/ProductCard.jsx";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const pageSize = 8;
  const pageNumber = 1;

  useEffect(() => {
    // ✅ Gọi API lấy sản phẩm phân trang bằng fetch
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://localhost:7165/api/Products/Paging", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            searchTerm: "",
            sortBy: "name",
            pageNumber,
            pageSize,
            brand: [],
            category: [],
          }),
        });

        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();
        setProducts(data.items || []);
        setTotalCount(data.totalCount || 0);
      } catch (error) {
        console.error("Error while fetching products:", error);
      }
    };

    // ✅ Gọi API lấy brand & category qua ProductApi.js
    const fetchBrandsAndCategories = async () => {
      try {
        const [brandsRes, categoriesRes] = await Promise.all([
          getBrands(),
          getCategories(),
        ]);
        setBrands(brandsRes.data || []);
        setCategories(categoriesRes.data || []);
      } catch (err) {
        console.error("Error fetching brands or categories:", err);
      }
    };

    fetchProducts();
    fetchBrandsAndCategories();
  }, [pageNumber, pageSize]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        🛒 Welcome to the Home Page
      </h1>

      {/* Danh sách Brand */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Brands</h2>
        {brands.length === 0 ? (
          <p className="text-gray-500">No brands available</p>
        ) : (
          <ul className="flex flex-wrap gap-3">
            {brands.map((brand) => (
              <li
                key={brand.id}
                className="px-4 py-2 bg-gray-100 rounded-lg shadow hover:bg-gray-200 cursor-pointer"
              >
                {brand.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Danh sách Category */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Categories</h2>
        {categories.length === 0 ? (
          <p className="text-gray-500">No categories available</p>
        ) : (
          <ul className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="px-4 py-2 bg-gray-100 rounded-lg shadow hover:bg-gray-200 cursor-pointer"
              >
                {cat.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Danh sách sản phẩm */}
      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products available</p>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <p className="text-center text-gray-600 mt-4">
            Showing {products.length} of {totalCount} products
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
