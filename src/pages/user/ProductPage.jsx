import React, { useState, useEffect } from "react";
import { Search, Grid, List, X, DollarSign, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [pageSize] = useState(8);

  // Price filter states
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [priceRange, setPriceRange] = useState("all");

  const [loading, setLoading] = useState(false);
  const [allFilteredProducts, setAllFilteredProducts] = useState([]);
  const totalPages = Math.ceil(totalCount / pageSize);

  // Price range presets (VND)
  const priceRanges = [
    { value: "all", label: "All Prices", min: null, max: null },
    { value: "under1m", label: "Under 1M₫", min: 0, max: 1000000 },
    { value: "1to5m", label: "1M₫ - 5M₫", min: 1000000, max: 5000000 },
    { value: "5to10m", label: "5M₫ - 10M₫", min: 5000000, max: 10000000 },
    { value: "10to20m", label: "10M₫ - 20M₫", min: 10000000, max: 20000000 },
    { value: "20to50m", label: "20M₫ - 50M₫", min: 20000000, max: 50000000 },
    { value: "over50m", label: "Over 50M₫", min: 50000000, max: null },
    { value: "custom", label: "Custom Range", min: null, max: null },
  ];

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

  // Handle price range preset selection
  const handlePriceRangeChange = (value) => {
    setPriceRange(value);
    const selected = priceRanges.find(r => r.value === value);
    if (selected && value !== "custom") {
      setMinPrice(selected.min !== null ? selected.min.toString() : "");
      setMaxPrice(selected.max !== null ? selected.max.toString() : "");
    }
    setPage(1);
  };

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const body = {
          searchTerm: search || "",
          sortBy: sort || "name",
          pageNumber: 1,
          pageSize: 10000,
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

        console.log("📦 Products API returned:", data.items?.length, "items");

        // Merge products by name
        const mergedProducts = Object.values(
          (data.items || []).reduce((acc, p) => {
            const key = p.name.trim().toLowerCase();
            if (!acc[key]) {
              acc[key] = { ...p, stock: p.stock || 1 };
            } else {
              acc[key].stock += p.stock || 1;
            }
            return acc;
          }, {})
        );

        // Apply client-side price filtering
        let filteredProducts = mergedProducts;
        const min = minPrice ? parseFloat(minPrice) : null;
        const max = maxPrice ? parseFloat(maxPrice) : null;

        if (min !== null || max !== null) {
          filteredProducts = mergedProducts.filter(p => {
            const price = p.price || 0;
            if (min !== null && max !== null) {
              return price >= min && price <= max;
            } else if (min !== null) {
              return price >= min;
            } else if (max !== null) {
              return price <= max;
            }
            return true;
          });
        }

        // Store all filtered products
        setAllFilteredProducts(filteredProducts);
        setTotalCount(filteredProducts.length);
        
        // Paginate the results
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
        
        setProducts(paginatedProducts);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };

    if (categories.length > 0 && brands.length > 0) {
      loadProducts();
    }
  }, [search, category, brand, sort, page, pageSize, categories, brands, minPrice, maxPrice]);

  const handleResetFilters = () => {
    setCategory("");
    setBrand("");
    setSort("name");
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setPriceRange("all");
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

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-green-50 relative overflow-hidden">
      {/* Snowflakes decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-10 text-red-200 text-4xl animate-pulse">❄️</div>
        <div className="absolute top-20 right-20 text-green-300 text-3xl animate-pulse" style={{animationDelay: '1s'}}>❄️</div>
        <div className="absolute top-40 left-1/4 text-red-200 text-2xl animate-pulse" style={{animationDelay: '2s'}}>❄️</div>
        <div className="absolute top-60 right-1/3 text-green-300 text-5xl animate-pulse" style={{animationDelay: '0.5s'}}>❄️</div>
        <div className="absolute bottom-20 left-1/3 text-red-200 text-3xl animate-pulse" style={{animationDelay: '1.5s'}}>❄️</div>
        <div className="absolute bottom-40 right-1/4 text-green-300 text-4xl animate-pulse" style={{animationDelay: '2.5s'}}>❄️</div>
      </div>

      {/* Header with Christmas theme */}
      <div className="bg-gradient-to-r from-red-600 via-green-600 to-red-600 text-white py-12 relative shadow-lg border-b-4 border-red-700">
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
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400 w-5 h-5" />
            <input
              placeholder="🔍 Search for Christmas gifts..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 rounded-full text-gray-800 bg-white focus:ring-4 focus:ring-red-300 focus:outline-none shadow-xl border-2 border-green-200"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex gap-6">
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6 border-4 border-red-200 relative overflow-hidden">
              {/* Decoration corners */}
              <div className="absolute top-2 left-2 text-2xl">🎁</div>
              <div className="absolute top-2 right-2 text-2xl">🎁</div>
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <h2 className="font-bold text-lg text-red-600 flex items-center gap-2">
                  ❄️ Filters
                </h2>
                <button
                  onClick={handleResetFilters}
                  className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 bg-red-50 px-3 py-1 rounded-full hover:bg-red-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Reset
                </button>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3 text-green-700 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Price Range
                </label>
                
                {/* Price Range Presets */}
                <div className="space-y-2 mb-4">
                  {priceRanges.map((range) => (
                    <label
                      key={range.value}
                      className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                        priceRange === range.value
                          ? 'bg-gradient-to-r from-red-100 to-green-100 border-2 border-red-400'
                          : 'bg-red-50 hover:bg-red-100 border-2 border-transparent'
                      }`}
                    >
                      <input
                        type="radio"
                        name="priceRange"
                        value={range.value}
                        checked={priceRange === range.value}
                        onChange={(e) => handlePriceRangeChange(e.target.value)}
                        className="mr-2 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm font-medium text-gray-700">{range.label}</span>
                    </label>
                  ))}
                </div>

                {/* Custom Price Inputs */}
                {priceRange === "custom" && (
                  <div className="space-y-3 pt-2 border-t-2 border-green-200">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-600">Min Price (₫)</label>
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => {
                          setMinPrice(e.target.value);
                          setPage(1);
                        }}
                        placeholder="0"
                        className="w-full px-3 py-2 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none bg-white"
                        min="0"
                        step="100000"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-600">Max Price (₫)</label>
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => {
                          setMaxPrice(e.target.value);
                          setPage(1);
                        }}
                        placeholder="∞"
                        className="w-full px-3 py-2 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none bg-white"
                        min="0"
                        step="100000"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-red-700 flex items-center gap-2">
                  🎄 Category
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border-2 border-red-200 rounded-xl focus:ring-2 focus:ring-red-400 focus:outline-none bg-red-50 hover:bg-red-100 transition-colors"
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
                <label className="block text-sm font-semibold mb-2 text-green-700 flex items-center gap-2">
                  ⭐ Brand
                </label>
                <select
                  value={brand}
                  onChange={(e) => {
                    setBrand(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:outline-none bg-green-50 hover:bg-green-100 transition-colors"
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
                <label className="block text-sm font-semibold mb-2 text-red-700 flex items-center gap-2">
                  🎀 Sort by
                </label>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border-2 border-red-200 rounded-xl focus:ring-2 focus:ring-red-400 focus:outline-none bg-red-50 hover:bg-red-100 transition-colors"
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
                <label className="block text-sm font-semibold mb-2 text-green-700 flex items-center gap-2">
                  👁️ View
                </label>
                <div className="flex border-2 border-green-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`flex-1 p-2 flex items-center justify-center transition-colors ${
                      viewMode === "grid"
                        ? "bg-gradient-to-r from-red-600 to-green-600 text-white"
                        : "bg-white hover:bg-red-50"
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex-1 p-2 flex items-center justify-center transition-colors ${
                      viewMode === "list"
                        ? "bg-gradient-to-r from-red-600 to-green-600 text-white"
                        : "bg-white hover:bg-red-50"
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
            <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
              <div className="text-sm text-red-700 font-semibold bg-white px-4 py-2 rounded-full shadow-md border-2 border-red-200">
                {totalCount > 0 && (
                  <p>🎁 Showing {products.length} of {totalCount} magical products</p>
                )}
              </div>
              
              {totalPages > 1 && (
                <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-md border-2 border-green-200 font-semibold">
                  📄 Page {page} of {totalPages}
                </div>
              )}
            </div>

            {loading ? (
              <div className="text-center text-red-600 py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-red-400"></div>
                <p className="mt-4 font-semibold">🎄 Loading Christmas products...</p>
              </div>
            ) : products.length ? (
              <>
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

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                        page === 1
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-red-600 to-green-600 text-white hover:shadow-lg hover:scale-105'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    
                    <div className="flex gap-2">
                      {getPageNumbers().map((pageNum, idx) => {
                        if (pageNum === '...') {
                          return (
                            <span key={`ellipsis-${idx}`} className="w-10 h-10 flex items-center justify-center text-gray-400 font-bold">
                              ...
                            </span>
                          );
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                              page === pageNum
                                ? 'bg-gradient-to-r from-red-600 to-green-600 text-white shadow-lg scale-110 ring-2 ring-red-300'
                                : 'bg-white text-gray-700 hover:bg-red-50 border-2 border-red-200 hover:border-red-400'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                        page === totalPages
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-red-600 to-green-600 text-white hover:shadow-lg hover:scale-105'
                      }`}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-red-600 py-20 bg-white rounded-2xl shadow-xl border-4 border-red-200">
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