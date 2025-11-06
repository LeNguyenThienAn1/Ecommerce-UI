import React, { useState, useEffect } from "react";
import { Search, Grid, List, X } from "lucide-react";
import ProductCard from "../../components/ProductCard";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState("grid");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [sort, setSort] = useState("name");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(1000);

  const [loading, setLoading] = useState(false);
  const totalPages = Math.ceil(totalCount / pageSize);

  // Load categories & brands
  useEffect(() => {
    const loadCategoriesAndBrands = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          fetch("https://localhost:7165/api/Admin/categories"),
          fetch("https://localhost:7165/api/Admin/brands"),
        ]);

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData || []);
        }
        if (brandsRes.ok) {
          const brandsData = await brandsRes.json();
          setBrands(brandsData || []);
        }
      } catch (err) {
        console.error("Failed to load categories/brands:", err);
      }
    };
    loadCategoriesAndBrands();
  }, []);

  // Load products mỗi khi query thay đổi
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const body = {
          searchTerm: search || "",
          sortBy: sort || "name",
          pageNumber: page,
          pageSize: pageSize,
          brandIds: brand ? [brand] : [],
          categoryIds: category ? [category] : [],
        };

        const res = await fetch("https://localhost:7165/api/Products/Paging", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();

        console.log("📦 Products API trả về:", data.items?.length, "items");

        // ✅ Gộp chỉ theo tên sản phẩm
        const mergedProducts = Object.values(
          (data.items || []).reduce((acc, p) => {
            const key = p.name.trim().toLowerCase(); // chỉ merge theo name
            if (!acc[key]) {
              acc[key] = { ...p, stock: p.stock || 1 };
            } else {
              acc[key].stock += p.stock || 1;
            }
            return acc;
          }, {})
        );

        setProducts(mergedProducts);
        setTotalCount(data.totalCount || 0);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };

    if (categories.length > 0 && brands.length > 0) {
      loadProducts();
    }
  }, [search, category, brand, sort, page, pageSize, categories, brands]);

  const handleResetFilters = () => {
    setCategory("");
    setBrand("");
    setSort("name");
    setSearch("");
    setPage(1);
  };

  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.categoryId === categoryId);
    return cat?.categoryName || "N/A";
  };

  const getBrandName = (brandId) => {
    const br = brands.find((b) => b.brandId === brandId);
    return br?.brandName || "N/A";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-6">
            Electronics Store
          </h1>
          <p className="text-center opacity-90 mb-6">
            Discover the latest tech products
          </p>

          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              placeholder="Search for products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-800 bg-white focus:ring-2 focus:ring-purple-300 focus:outline-none shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg">Filters</h2>
                <button
                  onClick={handleResetFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Reset
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">All categories</option>
                  {categories.map((c) => (
                    <option key={c.categoryId} value={c.categoryId}>
                      {c.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Brand
                </label>
                <select
                  value={brand}
                  onChange={(e) => {
                    setBrand(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">All brands</option>
                  {brands.map((b) => (
                    <option key={b.brandId} value={b.brandId}>
                      {b.brandName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Sort by
                </label>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="name_desc">Name (Z-A)</option>
                  <option value="price">Price (Low to High)</option>
                  <option value="price_desc">Price (High to Low)</option>
                  <option value="createdat">Newest First</option>
                  <option value="createdat_desc">Oldest First</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  View
                </label>
                <div className="flex border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`flex-1 p-2 flex items-center justify-center transition-colors ${
                      viewMode === "grid"
                        ? "bg-blue-600 text-white"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex-1 p-2 flex items-center justify-center transition-colors ${
                      viewMode === "list"
                        ? "bg-blue-600 text-white"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="mb-4 text-sm text-gray-600">
              {totalCount > 0 && (
                <p>Showing {products.length} products</p>
              )}
            </div>

            {loading ? (
              <div className="text-center text-gray-500 py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4">Loading products...</p>
              </div>
            ) : products.length ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {products.map((product, idx) => (
                  <ProductCard
                    key={product.id ?? `product-${idx}`}
                    product={product}
                    viewMode={viewMode}
                    categoryName={getCategoryName(product.categoryId)}
                    brandName={getBrandName(product.brandId)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-20">
                <p className="text-xl">No products found</p>
                <p className="text-sm mt-2">Try adjusting your filters</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
