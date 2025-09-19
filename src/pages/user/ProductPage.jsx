import React, { useState, useEffect } from "react";
import { Search, Grid, List, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../../components/ProductCard";

const categoriesEnum = [
  { id: 1, name: "TV" },
  { id: 2, name: "Phone" },
  { id: 3, name: "Laptop" },
  { id: 4, name: "Tablet" },
  { id: 5, name: "Accessory" },
  { id: 6, name: "Headphone" },
  { id: 7, name: "Camera" },
  { id: 8, name: "SmartWatch" },
];

const brandsEnum = [
  { id: 1, name: "Samsung" },
  { id: 2, name: "Apple" },
  { id: 3, name: "LG" },
  { id: 4, name: "Sony" },
  { id: 5, name: "Xiaomi" },
  { id: 6, name: "Asus" },
  { id: 7, name: "Acer" },
  { id: 8, name: "Dell" },
  { id: 9, name: "HP" },
  { id: 10, name: "Huawei" },
  { id: 11, name: "Oppo" },
  { id: 12, name: "Vivo" },
];

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState("grid");

  // Query params state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("0");
  const [brand, setBrand] = useState("0");
  const [sort, setSort] = useState("name");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);

  const [loading, setLoading] = useState(false);

  const totalPages = Math.ceil(totalCount / pageSize);

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
          brand: brand !== "0" ? [parseInt(brand)] : [],
          category: category !== "0" ? [parseInt(category)] : [],
        };

        const res = await fetch("https://localhost:7165/api/Products/Paging", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();

        setProducts(data.items || []);
        setTotalCount(data.totalCount || 0);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [search, category, brand, sort, page, pageSize]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 text-center">
        <h1 className="text-3xl font-bold">Electronics Store</h1>
        <p className="opacity-90">Discover the latest tech products</p>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category */}
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="0">All categories</option>
          {categoriesEnum.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Brand */}
        <select
          value={brand}
          onChange={(e) => {
            setBrand(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="0">All brands</option>
          {brandsEnum.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="name">Sort by name ↑</option>
          <option value="name_desc">Sort by name ↓</option>
          <option value="price">Price ↑</option>
          <option value="price_desc">Price ↓</option>
          <option value="createdat">Newest</option>
          <option value="createdat_desc">Oldest</option>
        </select>

        {/* View toggle */}
        <div className="flex border rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 ${viewMode === "grid" ? "bg-blue-600 text-white" : ""}`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 ${viewMode === "list" ? "bg-blue-600 text-white" : ""}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Products */}
      <div className="container mx-auto px-4 pb-12">
        {loading ? (
          <div className="text-center text-gray-500 py-12">
            Loading products...
          </div>
        ) : products.length ? (
          <>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {products.map((product, idx) => (
                <ProductCard
                  key={product.id ?? `product-${idx}`}
                  product={product}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border rounded-lg disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 border rounded-lg ${
                    page === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 border rounded-lg disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-12">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
