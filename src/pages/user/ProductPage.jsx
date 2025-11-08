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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 relative overflow-hidden">
      {/* Snowflakes decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 text-blue-200 text-4xl animate-pulse">❄</div>
        <div className="absolute top-20 right-20 text-blue-300 text-3xl animate-pulse" style={{animationDelay: '1s'}}>❄</div>
        <div className="absolute top-40 left-1/4 text-blue-200 text-2xl animate-pulse" style={{animationDelay: '2s'}}>❄</div>
        <div className="absolute top-60 right-1/3 text-blue-300 text-5xl animate-pulse" style={{animationDelay: '0.5s'}}>❄</div>
        <div className="absolute bottom-20 left-1/3 text-blue-200 text-3xl animate-pulse" style={{animationDelay: '1.5s'}}>❄</div>
        <div className="absolute bottom-40 right-1/4 text-blue-300 text-4xl animate-pulse" style={{animationDelay: '2.5s'}}>❄</div>
      </div>

      {/* Header with Christmas theme */}
      <div className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 text-white py-12 relative shadow-lg border-b-4 border-blue-500">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 text-6xl">🎄</div>
          <div className="absolute top-0 right-0 text-6xl">🎄</div>
          <div className="absolute bottom-0 left-1/4 text-4xl">⛄</div>
          <div className="absolute bottom-0 right-1/4 text-4xl">🎁</div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-2">
            <span className="text-5xl">🎅</span>
          </div>
          <h1 className="text-4xl font-bold text-center mb-2 drop-shadow-lg">
            🎄 Christmas Electronics Store 🎄
          </h1>
          <p className="text-center opacity-90 mb-6 text-lg font-medium">
            ✨ Magical Tech Gifts for the Holidays ✨
          </p>

          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
            <input
              placeholder="🔍 Search for Christmas gifts..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 rounded-full text-gray-800 bg-white focus:ring-4 focus:ring-blue-200 focus:outline-none shadow-xl border-2 border-blue-200"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex gap-6">
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6 border-4 border-blue-200 relative overflow-hidden">
              {/* Decoration corners */}
              <div className="absolute top-2 left-2 text-2xl">🎁</div>
              <div className="absolute top-2 right-2 text-2xl">🎁</div>
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <h2 className="font-bold text-lg text-blue-600 flex items-center gap-2">
                  ❄️ Filters
                </h2>
                <button
                  onClick={handleResetFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Reset
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-blue-700 flex items-center gap-2">
                  🎄 Category
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 hover:bg-blue-100 transition-colors"
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
                <label className="block text-sm font-semibold mb-2 text-blue-700 flex items-center gap-2">
                  ⭐ Brand
                </label>
                <select
                  value={brand}
                  onChange={(e) => {
                    setBrand(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 hover:bg-blue-100 transition-colors"
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
                <label className="block text-sm font-semibold mb-2 text-blue-700 flex items-center gap-2">
                  🎀 Sort by
                </label>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 hover:bg-blue-100 transition-colors"
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
                <label className="block text-sm font-semibold mb-2 text-blue-700 flex items-center gap-2">
                  👁️ View
                </label>
                <div className="flex border-2 border-blue-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`flex-1 p-2 flex items-center justify-center transition-colors ${
                      viewMode === "grid"
                        ? "bg-blue-400 text-white"
                        : "bg-white hover:bg-blue-50"
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex-1 p-2 flex items-center justify-center transition-colors ${
                      viewMode === "list"
                        ? "bg-blue-400 text-white"
                        : "bg-white hover:bg-blue-50"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Bottom decoration */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-2xl">⛄</div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="mb-4 text-sm text-blue-700 font-semibold bg-white px-4 py-2 rounded-full inline-block shadow-md border-2 border-blue-200">
              {totalCount > 0 && (
                <p>🎁 Showing {products.length} magical products</p>
              )}
            </div>

            {loading ? (
              <div className="text-center text-blue-600 py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-blue-400"></div>
                <p className="mt-4 font-semibold">🎄 Loading Christmas products...</p>
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
              <div className="text-center text-blue-600 py-20 bg-white rounded-2xl shadow-xl border-4 border-blue-200">
                <p className="text-4xl mb-4">🎅</p>
                <p className="text-xl font-bold">No products found</p>
                <p className="text-sm mt-2">Try adjusting your Christmas filters ✨</p>
              </div>
            )}
          </main>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default ProductPage;