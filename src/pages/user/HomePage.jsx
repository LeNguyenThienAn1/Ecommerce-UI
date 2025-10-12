import React, { useState, useEffect } from "react";
import { Search, ChevronRight, TrendingUp, Tag, Zap, Shield, Truck, Star, Heart, ShoppingCart, Eye, ChevronLeft, Award, Sparkles, Flame, TrendingDown } from "lucide-react";
import ChatBot from "../../components/chat/ChatBot.jsx"; 

const ProductCard = ({ product }) => {
  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount 
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : product.price;

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl border border-gray-100">
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 aspect-square">
        <img 
          src={product.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80"} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {hasDiscount && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
            {product.discount}% OFF
          </div>
        )}
        {product.isNew && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
            NEW
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            <button className="bg-white text-gray-800 p-3 rounded-full hover:bg-purple-600 hover:text-white transition-all duration-300 shadow-lg">
              <Heart size={20} />
            </button>
            <button className="bg-white text-gray-800 p-3 rounded-full hover:bg-purple-600 hover:text-white transition-all duration-300 shadow-lg">
              <Eye size={20} />
            </button>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full hover:shadow-2xl transition-all duration-300 flex items-center gap-2 font-semibold">
              <ShoppingCart size={20} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider bg-purple-50 px-3 py-1 rounded-full">
            {product.brandName || "Electronics"}
          </span>
          <div className="flex items-center gap-1">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-gray-700">{product.rating || "4.5"}</span>
          </div>
        </div>
        
        <h3 className="font-bold text-gray-800 mb-3 line-clamp-2 h-12 text-lg group-hover:text-purple-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                ${discountedPrice}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through">${product.price}</span>
              )}
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-1">Free Shipping</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeaturedSection = ({ title, subtitle, icon: Icon, products, gradient, iconColor }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className={`p-3 bg-gradient-to-r ${gradient} rounded-2xl shadow-lg`}>
            <Icon className="text-white" size={32} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-gray-800">{title}</h2>
            <p className="text-gray-600 mt-1">{subtitle}</p>
          </div>
        </div>
        <button className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-2 group">
          View All
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // ProductFeaturedType enum mapping (matching API response)
  const FEATURED_TYPES = {
    NORMAL: "Normal",
    BEST_SELLER: "BestSeller",
    NEW: "New",
    POPULAR: "Popular",
    SALE: "Sale"
  };

  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80",
      title: "Premium Electronics",
      subtitle: "Elevate Your Tech Experience",
      discount: "Up to 40% OFF"
    },
    {
      image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&q=80",
      title: "Wireless Audio",
      subtitle: "Crystal Clear Sound Quality",
      discount: "Limited Edition"
    },
    {
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1200&q=80",
      title: "Smart Devices",
      subtitle: "Future of Technology",
      discount: "New Arrival"
    },
    {
      image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&q=80",
      title: "Gaming Gear",
      subtitle: "Level Up Your Game",
      discount: "Save Big"
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

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("https://localhost:7165/api/FeaturedProduct");

        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();
        
        let filteredProducts = data || [];
        if (searchTerm) {
          filteredProducts = filteredProducts.filter(product =>
            product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [searchTerm]);

  // Group products by featured type
  const getProductsByType = (type) => {
    return allProducts.filter(product => product.featuredType === type);
  };

  const bestSellerProducts = getProductsByType(FEATURED_TYPES.BEST_SELLER);
  const newProducts = getProductsByType(FEATURED_TYPES.NEW);
  const popularProducts = getProductsByType(FEATURED_TYPES.POPULAR);
  const saleProducts = getProductsByType(FEATURED_TYPES.SALE);

  const features = [
    { icon: Truck, title: "Free Delivery", desc: "Orders over $50", color: "from-violet-500 to-purple-500" },
    { icon: Shield, title: "Secure Payment", desc: "100% protected", color: "from-blue-500 to-cyan-500" },
    { icon: Zap, title: "Fast Shipping", desc: "2-3 days delivery", color: "from-amber-500 to-orange-500" },
    { icon: Tag, title: "Best Prices", desc: "Price match guarantee", color: "from-emerald-500 to-teal-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30">
      {/* Hero Slider Section */}
      <div className="relative h-[600px] overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentSlide 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-110'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10"></div>
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
                    <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      {slide.discount}
                    </span>
                  </div>
                  <h1 className="text-7xl font-black mb-4 text-white leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-3xl text-purple-200 mb-8 font-light">
                    {slide.subtitle}
                  </p>
                  <div className="flex gap-4">
                    <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-purple-500/50 transition-all text-lg">
                      Shop Now
                    </button>
                    <button className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-10 py-4 rounded-2xl font-bold border-2 border-white/30 transition-all text-lg">
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
          className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-md text-black p-4 rounded-full transition-all group"
        >
          <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-black/20 hover:bg-black/30 backdrop-blur-md text-black p-4 rounded-full transition-all group"
        >
          <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all rounded-full ${
                index === currentSlide 
                  ? 'bg-white w-12 h-3' 
                  : 'bg-white/40 w-3 h-3 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Search Bar Section */}
      <div className="relative -mt-8 z-40">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-2xl p-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search for electronics, gadgets, and more..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-6 py-4 text-gray-800 text-lg focus:outline-none rounded-2xl"
              />
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all">
                <Search size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-all border border-gray-100 group">
              <div className={`inline-flex p-5 rounded-2xl bg-gradient-to-r ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="text-white" size={32} />
              </div>
              <h3 className="font-bold text-gray-800 mb-2 text-lg">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products Sections */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        {isLoading ? (
          <div className="text-center py-32 bg-white rounded-3xl shadow-xl border border-gray-100">
            <div className="animate-spin inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mb-4"></div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Loading Products...</h3>
            <p className="text-gray-500">Please wait a moment</p>
          </div>
        ) : allProducts.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-3xl shadow-xl border border-gray-100">
            <div className="text-7xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or check back later</p>
          </div>
        ) : (
          <>
            <FeaturedSection
              title="Best Sellers"
              subtitle="Top rated by customers • Most purchased"
              icon={Award}
              products={bestSellerProducts}
              gradient="from-amber-500 to-orange-500"
            />

            <FeaturedSection
              title="New Arrivals"
              subtitle="Fresh products • Just landed"
              icon={Sparkles}
              products={newProducts}
              gradient="from-emerald-500 to-teal-500"
            />

            <FeaturedSection
              title="Popular Products"
              subtitle="Trending now • Most viewed"
              icon={Flame}
              products={popularProducts}
              gradient="from-rose-500 to-pink-500"
            />

            <FeaturedSection
              title="Special Sale"
              subtitle="Limited time offers • Huge discounts"
              icon={TrendingDown}
              products={saleProducts}
              gradient="from-purple-600 to-blue-600"
            />
          </>
        )}
      </div>

      {/* Newsletter Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600 mt-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
        
        <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="inline-block p-4 bg-white/20 backdrop-blur-sm rounded-3xl mb-6">
            <Tag className="text-amber-300" size={48} />
          </div>
          <h2 className="text-5xl font-black mb-6 text-white">Get VIP Access</h2>
          <p className="text-xl text-purple-100 mb-10">
            Join 50,000+ smart shoppers and get <span className="font-bold text-amber-300">20% off</span> your first order
          </p>
          <div className="max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-xl text-gray-800 bg-white focus:outline-none focus:ring-4 focus:ring-purple-300"
              />
              <button className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all whitespace-nowrap">
                Subscribe Now
              </button>
            </div>
          </div>
          <p className="text-purple-200 text-sm mt-6">🔒 Your data is 100% secure. Unsubscribe anytime.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;