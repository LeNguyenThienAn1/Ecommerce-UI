import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCart();

  return (
    // Gradient background với glass effect
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 backdrop-blur-sm shadow-lg w-full z-50 sticky top-0">
      
      {/* Container nội dung chính */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        
        {/* Lớp Flexbox chính để dàn các cụm nội dung */}
        <div className="flex h-16 items-center justify-between">
          
          {/* CỤM BÊN TRÁI: Logo và các link điều hướng chính */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-black text-white drop-shadow-lg flex-shrink-0 hover:text-blue-200 transition-colors">
              TechStore
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link to="/products" className="text-sm font-bold text-white drop-shadow-md hover:text-blue-100 hover:bg-white/10 px-3 py-2 rounded-lg transition-all">
                Sản phẩm
              </Link>
              {/* Bạn có thể thêm các link khác ở đây, ví dụ: */}
              {/* <Link to="/categories" className="text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all">
                Danh mục
              </Link>
              <Link to="/deals" className="text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all">
                Khuyến mãi
              </Link> */}
            </nav>
          </div>

          {/* CỤM Ở GIỮA: Thanh tìm kiếm */}
          <div className="flex-1 flex justify-center px-4 lg:px-8">
            <div className="w-full max-w-lg">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full                 placeholder-white/90 text-white font-medium drop-shadow-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 text-sm focus:bg-white/20 transition-all"
              />
            </div>
          </div>

          {/* CỤM BÊN PHẢI: Giỏ hàng và menu người dùng */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-white/10 transition-colors group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white group-hover:text-blue-200 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-medium shadow-lg animate-pulse">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* Phân cách */}
            <div className="h-6 w-px bg-white/30"></div>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm font-bold text-white drop-shadow-md">Chào, {user?.name}</span>
                <button
                  onClick={logout}
                  className="text-sm font-bold text-white drop-shadow-md hover:text-blue-100 hover:bg-white/10 px-3 py-2 rounded-lg transition-all"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-4">
                <Link to="/login" className="px-4 py-2 rounded-lg text-sm font-bold text-white drop-shadow-md hover:text-blue-100 hover:bg-white/10 transition-all">
                  Đăng nhập
                </Link>
                <Link to="/register" className="px-4 py-2 rounded-lg text-sm font-bold text-white drop-shadow-md bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 transition-all shadow-lg">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subtle bottom border with gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </header>
  );
};

export default Header;