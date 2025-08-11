import React, { useState, useEffect } from 'react';
import { Star, ShoppingCart, Heart, Filter, Search, Grid, List } from 'lucide-react';

// Fake API data cho đồ điện tử
const fakeElectronicsData = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 29990000,
    originalPrice: 32990000,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
    rating: 4.8,
    reviews: 245,
    category: "Smartphone",
    brand: "Apple",
    inStock: true,
    discount: 9
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    price: 26990000,
    originalPrice: 28990000,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=300&fit=crop",
    rating: 4.7,
    reviews: 189,
    category: "Smartphone",
    brand: "Samsung",
    inStock: true,
    discount: 7
  },
  {
    id: 3,
    name: "MacBook Air M2",
    price: 27990000,
    originalPrice: 29990000,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    rating: 4.9,
    reviews: 156,
    category: "Laptop",
    brand: "Apple",
    inStock: true,
    discount: 7
  },
  {
    id: 4,
    name: "Sony WH-1000XM5",
    price: 6990000,
    originalPrice: 7990000,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop",
    rating: 4.6,
    reviews: 312,
    category: "Headphones",
    brand: "Sony",
    inStock: true,
    discount: 13
  },
  {
    id: 5,
    name: "iPad Pro 12.9 inch",
    price: 24990000,
    originalPrice: 26990000,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
    rating: 4.8,
    reviews: 98,
    category: "Tablet",
    brand: "Apple",
    inStock: false,
    discount: 7
  },
  {
    id: 6,
    name: "Dell XPS 13",
    price: 23990000,
    originalPrice: 25990000,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
    rating: 4.5,
    reviews: 87,
    category: "Laptop",
    brand: "Dell",
    inStock: true,
    discount: 8
  },
  {
    id: 7,
    name: "Nintendo Switch OLED",
    price: 8990000,
    originalPrice: 9990000,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop",
    rating: 4.7,
    reviews: 234,
    category: "Gaming",
    brand: "Nintendo",
    inStock: true,
    discount: 10
  },
  {
    id: 8,
    name: "AirPods Pro 2",
    price: 5990000,
    originalPrice: 6490000,
    image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=400&h=300&fit=crop",
    rating: 4.8,
    reviews: 445,
    category: "Headphones",
    brand: "Apple",
    inStock: true,
    discount: 8
  }
];

const ProductCard = ({ product, viewMode }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 flex gap-6">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-32 h-32 object-cover rounded-lg"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-gray-900 hover:text-blue-600 cursor-pointer">
              {product.name}
            </h3>
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`p-2 rounded-full transition-colors ${
                isWishlisted ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">{product.brand}</span> • {product.category}
          </p>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">{product.rating}</span>
            <span className="text-sm text-gray-500">({product.reviews} đánh giá)</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-blue-600">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-medium">
                    -{product.discount}%
                  </span>
                </>
              )}
            </div>
            
            <button 
              disabled={!product.inStock}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                product.inStock 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {product.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium">
            -{product.discount}%
          </div>
        )}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors ${
            isWishlisted ? 'text-red-500 bg-white/90' : 'text-gray-600 bg-white/90 hover:text-red-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 cursor-pointer">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium">{product.brand}</span> • {product.category}
        </p>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-700">{product.rating}</span>
          <span className="text-sm text-gray-500">({product.reviews})</span>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-blue-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
        
        <button 
          disabled={!product.inStock}
          className={`w-full py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            product.inStock 
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {product.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
        </button>
      </div>
    </div>
  );
};

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');

  // Simulate API call
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProducts(fakeElectronicsData);
      setFilteredProducts(fakeElectronicsData);
      setLoading(false);
    };
    
    fetchProducts();
  }, []);

  // Filter and search products
  useEffect(() => {
    let filtered = [...products];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Search by name
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
    
    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy]);

  const categories = ['all', ...new Set(products.map(p => p.category))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Cửa Hàng Điện Tử</h1>
          <p className="text-xl opacity-90">Khám phá những sản phẩm công nghệ mới nhất</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-4 items-center">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả danh mục</option>
                {categories.filter(cat => cat !== 'all').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Sắp xếp theo tên</option>
                <option value="price-asc">Giá: Thấp đến cao</option>
                <option value="price-desc">Giá: Cao đến thấp</option>
                <option value="rating">Đánh giá cao nhất</option>
              </select>

              {/* View Mode */}
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6">
          <p className="text-gray-600">
            Hiển thị <span className="font-semibold">{filteredProducts.length}</span> sản phẩm
            {searchTerm && (
              <span> cho "<span className="font-semibold">{searchTerm}</span>"</span>
            )}
          </p>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-6"
          }>
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Không tìm thấy sản phẩm nào
            </h3>
            <p className="text-gray-500">
              Hãy thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;