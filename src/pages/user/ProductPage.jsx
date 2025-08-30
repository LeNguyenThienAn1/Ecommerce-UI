import React, { useState, useEffect } from "react";
import { Search, Grid, List } from "lucide-react";
import ProductCard from "../../components/ProductCard"; // dùng chung với Home

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("name");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("https://localhost:7165/api/Products"),
          fetch("https://localhost:7165/api/Categories"),
        ]);

        const [prodData, catData] = await Promise.all([
          prodRes.json(),
          catRes.json(),
        ]);

        const normalizedCats = catData.map((c) => ({
          id: c.id ?? c.categoryId,
          name: c.name ?? c.categoryName,
        }));

        const normalizedProds = prodData.map((p) => ({
          ...p,
          categoryId: p.categoryId ?? p.category?.id,
          categoryName: p.categoryName ?? p.category?.name,
        }));

        setProducts(normalizedProds);
        setCategories(normalizedCats);
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filtered = products
    .filter(
      (p) =>
        (category === "all" || p.categoryId?.toString() === category) &&
        (p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.brand?.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return (b.rating || 0) - (a.rating || 0);
      return a.name.localeCompare(b.name);
    });

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading products...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 text-center">
        <h1 className="text-3xl font-bold">Electronics Store</h1>
        <p className="opacity-90">Discover the latest tech products</p>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="name">Sort by name</option>
          <option value="price-asc">Price: low → high</option>
          <option value="price-desc">Price: high → low</option>
          <option value="rating">Top rated</option>
        </select>

        <div className="flex border rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 ${
              viewMode === "grid" ? "bg-blue-600 text-white" : ""
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 ${
              viewMode === "list" ? "bg-blue-600 text-white" : ""
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Products */}
      <div className="container mx-auto px-4 pb-12">
        {filtered.length ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode} // truyền viewMode để card tự xử lý
              />
            ))}
          </div>
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
