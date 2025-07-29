import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCart();

  return (
    // Lớp vỏ ngoài cùng, chịu trách nhiệm cho màu nền, shadow và đảm bảo full-width.
    <header className="bg-white shadow-sm w-full z-50 sticky top-0">
      
      {/* Container nội dung chính, cũng phải full-width để các item bên trong có thể dàn ra sát lề */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        
        {/* Lớp Flexbox chính để dàn các cụm nội dung */}
        <div className="flex h-16 items-center justify-between">
          
          {/* CỤM BÊN TRÁI: Logo và các link điều hướng chính */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-blue-600 flex-shrink-0">
              TechStore
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link to="/products" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                Sản phẩm
              </Link>
              {/* Bạn có thể thêm các link khác ở đây, ví dụ: */}
              {/* <Link to="/categories" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                Danh mục
              </Link>
              <Link to="/deals" className="text-sm font-medium text-gray-700 hover:text-blue-600">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* CỤM BÊN PHẢI: Giỏ hàng và menu người dùng */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {getTotalItems() > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* Phân cách */}
            <div className="h-6 w-px bg-gray-200"></div>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-800">Chào, {user?.name}</span>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-gray-600 hover:text-blue-600"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-4">
                <Link to="/login" className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                  Đăng nhập
                </Link>
                <Link to="/register" className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;