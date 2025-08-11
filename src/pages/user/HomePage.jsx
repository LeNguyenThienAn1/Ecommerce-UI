import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, ArrowRight, Zap, Shield, Truck } from 'lucide-react';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const heroSlides = [
    {
      title: "iPhone 15 Pro Max",
      subtitle: "Titanium. So strong. So light. So Pro.",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=600&fit=crop",
      gradient: "from-blue-600 via-purple-600 to-pink-600"
    },
    {
      title: "MacBook Pro M3",
      subtitle: "Mind-blowing. Head-turning. Eye-catching.",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop",
      gradient: "from-gray-800 via-gray-600 to-gray-400"
    },
    {
      title: "Gaming Setup",
      subtitle: "Level up your gaming experience",
      image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop",
      gradient: "from-green-600 via-blue-600 to-purple-600"
    }
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "iPhone 15 Pro",
      price: "$999",
      originalPrice: "$1199",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
      rating: 4.8,
      reviews: 1234,
      badge: "Best Seller",
      description: "The ultimate iPhone with titanium design"
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra",
      price: "$1099",
      originalPrice: "$1299",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
      rating: 4.9,
      reviews: 892,
      badge: "New",
      description: "AI-powered photography redefined"
    },
    {
      id: 3,
      name: "MacBook Air M3",
      price: "$1099",
      originalPrice: "$1299",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
      rating: 4.7,
      reviews: 2156,
      badge: "Popular",
      description: "Supercharged by Apple Silicon"
    },
    {
      id: 4,
      name: "Sony WH-1000XM5",
      price: "$349",
      originalPrice: "$399",
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop",
      rating: 4.6,
      reviews: 3421,
      badge: "Sale",
      description: "Industry-leading noise cancellation"
    }
  ];

  const categories = [
    {
      name: "Smartphones",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop",
      count: "250+ products",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      name: "Laptops",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop",
      count: "180+ products",
      gradient: "from-gray-600 to-gray-800"
    },
    {
      name: "Accessories",
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=200&fit=crop",
      count: "500+ products",
      gradient: "from-green-500 to-teal-600"
    },
    {
      name: "Gaming",
      image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=300&h=200&fit=crop",
      count: "120+ products",
      gradient: "from-red-500 to-pink-600"
    },
    {
      name: "Audio",
      image: "https://images.unsplash.com/photo-1558756520-22cfe5d382ca?w=300&h=200&fit=crop",
      count: "90+ products",
      gradient: "from-yellow-500 to-orange-600"
    },
    {
      name: "Smart Home",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
      count: "75+ products",
      gradient: "from-indigo-500 to-purple-600"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        size={14}
        className={i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ${
                index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-80`}></div>
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
       
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center max-w-4xl mx-auto px-6">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/80">
              {heroSlides[currentSlide].subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/90 transition-all hover:scale-105">
                Shop Now
              </button>
              <button className="bg-white text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/90 transition-all hover:scale-105">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-900/50">
        <div className="px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <Zap className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-400">Free shipping on orders over $50</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <Shield className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Warranty</h3>
              <p className="text-gray-400">2-year warranty on all products</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <Truck className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Support</h3>
              <p className="text-gray-400">24/7 customer support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Featured Products</h2>
            <p className="text-xl text-gray-400">Discover our most popular tech innovations</p>
          </div>
         
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group relative bg-gray-900/50 rounded-3xl p-6 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all hover:scale-105"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {product.badge && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-purple-600 text-xs px-3 py-1 rounded-full font-semibold z-10">
                    {product.badge}
                  </div>
                )}
               
                <div className="relative mb-6 overflow-hidden rounded-2xl">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover transition-transform group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity ${
                    hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                  }`}></div>
                </div>
               
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <p className="text-gray-400 text-sm">{product.description}</p>
                 
                  <div className="flex items-center space-x-2">
                    <div className="flex">{renderStars(product.rating)}</div>
                    <span className="text-sm text-gray-400">({product.reviews})</span>
                  </div>
                 
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-blue-400">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                      )}
                    </div>
                    <button className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-full hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-gray-900/30">
        <div className="px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Shop by Category</h2>
            <p className="text-xl text-gray-400">Find exactly what you're looking for</p>
          </div>
         
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div
                key={index}
                className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer hover:scale-105 transition-all"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-70`}></div>
                <div className="absolute inset-0 bg-black/30"></div>
               
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-white/80 mb-4">{category.count}</p>
                  <div className="flex items-center text-white group-hover:translate-x-2 transition-transform">
                    <span className="mr-2">Shop Now</span>
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20">
        <div className="text-center px-6">
          <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-3xl p-12 backdrop-blur-sm border border-white/10">
            <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl text-gray-400 mb-8">Get the latest tech news and exclusive deals</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm focus:outline-none focus:border-blue-400 transition-colors"
              />
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;