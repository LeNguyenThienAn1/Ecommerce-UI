import React, { useState, useEffect } from "react";
import { Search, ChevronRight, TrendingUp, Tag, Zap, Shield, Truck, Star, Heart, ShoppingCart, Eye, ChevronLeft, Award, Sparkles, Flame, TrendingDown } from "lucide-react";
import ProductCard from "../../components/ProductCard"; // Import your ProductCard component

const FeaturedSection = ({ title, subtitle, icon: Icon, products, gradient, iconColor, onProductClick }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="mb-16 relative">
      <div className="absolute -top-4 -right-4 text-6xl opacity-20 pointer-events-none">❄️</div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className={`p-3 bg-gradient-to-r ${gradient} rounded-2xl shadow-lg`}>
            <Icon className="text-white" size={32} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-red-800">{title}</h2>
            <p className="text-green-600 mt-1">{subtitle}</p>
          </div>
        </div>
        <button className="text-red-600 hover:text-green-600 font-semibold flex items-center gap-2 group bg-red-50 px-6 py-3 rounded-full hover:bg-green-50 transition-all border-2 border-red-200">
          View All
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} onClick={onProductClick} />
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const FEATURED_TYPES = {
    NORMAL: "Normal",
    BEST_SELLER: "BestSeller",
    NEW: "New",
    POPULAR: "Popular",
    SALE: "Sale"
  };

  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1200&q=80",
      title: "🎄 Christmas Electronics",
      subtitle: "Perfect Gifts for Tech Lovers",
      discount: "🎁 Up to 40% OFF"
    },
    {
      image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1200&q=80",
      title: "🎅 Holiday Special",
      subtitle: "Premium Audio Experience",
      discount: "⛄ Limited Edition"
    },
    {
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80",
      title: "❄️ Winter Collection",
      subtitle: "Smart Devices for Everyone",
      discount: "🎄 New Arrival"
    },
    {
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80",
      title: "🎁 Gift Guide 2024",
      subtitle: "Find the Perfect Present",
      discount: "🎅 Save Big"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Fetch Brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch("https://localhost:7165/api/Brand");
        if (!res.ok) throw new Error("Failed to fetch brands");
        const data = await res.json();
        setBrands(data || []);
      } catch (error) {
        console.error("Error fetching brands:", error);
        setBrands([]);
      }
    };
    fetchBrands();
  }, []);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://localhost:7165/api/Categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("https://localhost:7165/api/FeaturedProduct");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        
        // Remove duplicate products (same name + brand)
        const uniqueProducts = [];
        const seenProducts = new Set();
        
        for (const product of data) {
          const key = `${product.name}-${product.brandName}`;
          if (!seenProducts.has(key)) {
            seenProducts.add(key);
            uniqueProducts.push(product);
          }
        }
        
        let filteredProducts = uniqueProducts;
        
        // Filter by search term
        if (searchTerm) {
          filteredProducts = filteredProducts.filter(product =>
            product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        // Filter by brand
        if (selectedBrand) {
          filteredProducts = filteredProducts.filter(product => 
            product.brandName === selectedBrand
          );
        }
        
        // Filter by category
        if (selectedCategory) {
          filteredProducts = filteredProducts.filter(product => 
            product.categoryName === selectedCategory
          );
        }
        
        setAllProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setAllProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchTerm, selectedBrand, selectedCategory]);

  const getProductsByType = (type) => {
    return allProducts.filter(product => product.featuredType === type);
  };

  const bestSellerProducts = getProductsByType(FEATURED_TYPES.BEST_SELLER);
  const newProducts = getProductsByType(FEATURED_TYPES.NEW);
  const popularProducts = getProductsByType(FEATURED_TYPES.POPULAR);
  const saleProducts = getProductsByType(FEATURED_TYPES.SALE);

  const handleProductClick = (product) => {
    // Navigate to product detail page
    window.location.href = `/product/${product.id}`;
  };

  const features = [
    { icon: Truck, title: "Free Delivery", desc: "Orders over $50", color: "from-red-400 to-red-500", emoji: "🎁" },
    { icon: Shield, title: "Secure Payment", desc: "100% protected", color: "from-green-400 to-green-500", emoji: "🔒" },
    { icon: Zap, title: "Fast Shipping", desc: "2-3 days delivery", color: "from-red-500 to-green-500", emoji: "⚡" },
    { icon: Tag, title: "Best Prices", desc: "Price match guarantee", color: "from-green-500 to-red-500", emoji: "🎄" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 relative overflow-hidden">
      {/* Snowflakes background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 text-red-200 text-5xl animate-pulse">❄️</div>
        <div className="absolute top-40 right-20 text-green-300 text-4xl animate-pulse" style={{animationDelay: '1s'}}>❄️</div>
        <div className="absolute top-60 left-1/4 text-red-200 text-3xl animate-pulse" style={{animationDelay: '2s'}}>❄️</div>
        <div className="absolute bottom-40 right-1/3 text-green-300 text-6xl animate-pulse" style={{animationDelay: '0.5s'}}>❄️</div>
        <div className="absolute bottom-60 left-1/3 text-red-200 text-4xl animate-pulse" style={{animationDelay: '1.5s'}}>❄️</div>
      </div>

      {/* Hero Slider Section */}
      <div className="relative h-[600px] overflow-hidden bg-gradient-to-br from-red-600 via-green-600 to-red-600">
        <div className="absolute top-0 left-0 right-0 flex justify-center gap-12 text-6xl z-10 pt-4 opacity-30">
          <span>🎄</span>
          <span>🎅</span>
          <span>⛄</span>
          <span>🎁</span>
        </div>

        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentSlide 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-110'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/70 via-green-900/50 to-transparent z-10"></div>
            <img 
              src={slide.image} 
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="max-w-7xl mx-auto px-6 w-full">
                <div className={`max-w-2xl transition-all duration-1000 delay-300 ${
                  index === currentSlide 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 -translate-x-10'
                }`}>
                  <div className="inline-block mb-4 animate-pulse">
                    <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      {slide.discount}
                    </span>
                  </div>
                  <h1 className="text-7xl font-black mb-4 text-white leading-tight drop-shadow-2xl">
                    {slide.title}
                  </h1>
                  <p className="text-3xl text-green-100 mb-8 font-light drop-shadow-lg">
                    {slide.subtitle}
                  </p>
                  <div className="flex gap-4">
                    <button className="bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 text-white px-10 py-4 rounded-full font-bold shadow-2xl hover:shadow-red-400/50 transition-all text-lg">
                      🎁 Shop Now
                    </button>
                    <button className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-10 py-4 rounded-full font-bold border-2 border-white/40 transition-all text-lg">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button 
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-white/30 hover:bg-white/50 backdrop-blur-md text-white p-4 rounded-full transition-all group shadow-lg border-2 border-white/40"
        >
          <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-white/30 hover:bg-white/50 backdrop-blur-md text-white p-4 rounded-full transition-all group shadow-lg border-2 border-white/40"
        >
          <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all rounded-full border-2 border-white/50 ${
                index === currentSlide 
                  ? 'bg-white w-12 h-3' 
                  : 'bg-white/40 w-3 h-3 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-red-50 to-transparent"></div>
      </div>

      {/* Search Bar Section */}
      <div className="relative -mt-8 z-40">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-2xl p-3 border-4 border-red-200">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
                <input
                  type="text"
                  placeholder="Search for Christmas gifts, gadgets, and more..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-16 pr-6 py-4 text-gray-800 text-lg focus:outline-none rounded-2xl bg-red-50"
                />
              </div>
              <button className="bg-gradient-to-r from-red-600 to-green-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all hover:from-red-700 hover:to-green-700">
                <Search size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Brands Section */}
      {brands.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🏷️</span>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
              Shop by Brand
            </h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            <button
              onClick={() => setSelectedBrand(null)}
              className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all border-2 ${
                selectedBrand === null
                  ? 'bg-gradient-to-r from-red-600 to-green-600 text-white border-transparent shadow-lg'
                  : 'bg-white text-gray-700 border-red-200 hover:border-red-400'
              }`}
            >
              All Brands
            </button>
            {brands.map((brand) => (
              <button
                key={brand.brandId}
                onClick={() => setSelectedBrand(brand.brandName)}
                className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all border-2 flex items-center gap-2 ${
                  selectedBrand === brand.brandName
                    ? 'bg-gradient-to-r from-red-600 to-green-600 text-white border-transparent shadow-lg'
                    : 'bg-white text-gray-700 border-red-200 hover:border-red-400'
                }`}
              >
                {brand.logoUrl && (
                  <img src={brand.logoUrl} alt={brand.brandName} className="w-5 h-5 rounded" />
                )}
                {brand.brandName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Categories Section */}
      {categories.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 pb-12 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">📦</span>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-red-600 bg-clip-text text-transparent">
              Shop by Category
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`p-6 rounded-2xl font-semibold transition-all border-4 text-center ${
                selectedCategory === null
                  ? 'bg-gradient-to-br from-green-600 to-red-600 text-white border-transparent shadow-xl'
                  : 'bg-white text-gray-700 border-green-200 hover:border-green-400'
              }`}
            >
              <div className="text-3xl mb-2">🎁</div>
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.categoryId}
                onClick={() => setSelectedCategory(category.categoryName)}
                className={`p-6 rounded-2xl font-semibold transition-all border-4 text-center ${
                  selectedCategory === category.categoryName
                    ? 'bg-gradient-to-br from-green-600 to-red-600 text-white border-transparent shadow-xl'
                    : 'bg-white text-gray-700 border-green-200 hover:border-green-400'
                }`}
              >
                <div className="text-3xl mb-2">📱</div>
                {category.categoryName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-all border-4 border-red-200 group relative overflow-hidden">
              <div className="absolute top-2 right-2 text-2xl opacity-50">{feature.emoji}</div>
              <div className={`inline-flex p-5 rounded-2xl bg-gradient-to-r ${feature.color} mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                <feature.icon className="text-white" size={32} />
              </div>
              <h3 className="font-bold text-red-800 mb-2 text-lg">{feature.title}</h3>
              <p className="text-sm text-green-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products Sections */}
      <div className="max-w-7xl mx-auto px-6 pb-16 relative z-10">
        {isLoading ? (
          <div className="text-center py-32 bg-white rounded-3xl shadow-xl border-4 border-red-200 relative overflow-hidden">
            <div className="absolute top-4 left-4 text-4xl">🎄</div>
            <div className="absolute top-4 right-4 text-4xl">🎄</div>
            <div className="animate-spin inline-block w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full mb-4"></div>
            <h3 className="text-2xl font-bold text-red-800 mb-2">🎅 Loading Christmas Products...</h3>
            <p className="text-green-600">Please wait a moment</p>
          </div>
        ) : allProducts.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-3xl shadow-xl border-4 border-red-200">
            <div className="text-7xl mb-6">⛄</div>
            <h3 className="text-2xl font-bold text-red-800 mb-2">No products found</h3>
            <p className="text-green-600">Try adjusting your filters or check back later</p>
          </div>
        ) : (
          <>
            <FeaturedSection
              title="🏆 Best Sellers"
              subtitle="Top rated by customers • Most purchased"
              icon={Award}
              products={bestSellerProducts}
              gradient="from-red-600 to-green-600"
              onProductClick={handleProductClick}
            />

            <FeaturedSection
              title="✨ New Arrivals"
              subtitle="Fresh products • Just landed"
              icon={Sparkles}
              products={newProducts}
              gradient="from-green-600 to-red-600"
              onProductClick={handleProductClick}
            />

            <FeaturedSection
              title="🔥 Popular Products"
              subtitle="Trending now • Most viewed"
              icon={Flame}
              products={popularProducts}
              gradient="from-red-500 to-green-500"
              onProductClick={handleProductClick}
            />

            <FeaturedSection
              title="🎁 Special Sale"
              subtitle="Limited time offers • Huge discounts"
              icon={TrendingDown}
              products={saleProducts}
              gradient="from-green-600 to-red-600"
              onProductClick={handleProductClick}
            />
          </>
        )}
      </div>

      {/* Newsletter Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-600 via-green-600 to-red-600 mt-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>
        
        <div className="absolute top-10 left-10 text-6xl animate-pulse">🎄</div>
        <div className="absolute top-10 right-10 text-6xl animate-pulse" style={{animationDelay: '1s'}}>🎄</div>
        <div className="absolute bottom-10 left-1/4 text-5xl animate-pulse" style={{animationDelay: '0.5s'}}>⛄</div>
        <div className="absolute bottom-10 right-1/4 text-5xl animate-pulse" style={{animationDelay: '1.5s'}}>🎁</div>

        <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="inline-block p-4 bg-white/30 backdrop-blur-sm rounded-3xl mb-6 border-2 border-white/40">
            <span className="text-6xl">🎅</span>
          </div>
          <h2 className="text-5xl font-black mb-6 text-white drop-shadow-lg">🎄 Get VIP Christmas Access</h2>
          <p className="text-xl text-red-50 mb-10 drop-shadow-md">
            Join 50,000+ smart shoppers and get <span className="font-bold text-white bg-red-500 px-3 py-1 rounded-full">🎁 20% off</span> your first order
          </p>
          <div className="max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 bg-white/20 backdrop-blur-md p-2 rounded-2xl border-2 border-white/30 shadow-xl">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-xl text-gray-800 bg-white focus:outline-none focus:ring-4 focus:ring-red-200"
              />
              <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all whitespace-nowrap">
                🎁 Subscribe Now
              </button>
            </div>
          </div>
          <p className="text-red-100 text-sm mt-6 flex items-center justify-center gap-2">
            <span>🔒</span> Your data is 100% secure. Unsubscribe anytime.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default HomePage;