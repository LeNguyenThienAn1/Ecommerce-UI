import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
import { ShoppingCart, User, Menu, X, Package, ShieldCheck, LogOut, UserCircle, MessageSquare, Heart } from "lucide-react";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) setIsUserMenuOpen(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) setIsMobileMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navLinks = (
    <>
      <Link to="/products" className="text-base font-bold text-white hover:text-red-300 transition-all hover:scale-105 flex items-center gap-1">
        🎁 Products
      </Link>
      <Link to="/about" className="text-base font-bold text-white hover:text-red-300 transition-all hover:scale-105 flex items-center gap-1">
        ❄️ About
      </Link>
    </>
  );

  return (
    <header className="bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 backdrop-blur-sm shadow-xl w-full z-50 sticky top-0 border-b-4 border-white/30">
      {/* Christmas decoration strip */}
      <div className="bg-gradient-to-r from-red-500 via-white to-red-500 h-1"></div>
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Snowflakes decoration */}
        <div className="absolute top-0 left-10 text-white text-2xl animate-pulse pointer-events-none">❄️</div>
        <div className="absolute top-0 right-10 text-white text-2xl animate-pulse pointer-events-none" style={{animationDelay: '1s'}}>❄️</div>
        
        <div className="flex h-20 items-center justify-between">
          {/* LEFT GROUP: Logo & nav */}
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-3xl font-black text-white flex-shrink-0 hover:text-red-300 transition-all hover:scale-105 flex items-center gap-2 drop-shadow-lg" 
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
            >
              🎄 TechStore
            </Link>
            <nav className="hidden md:flex space-x-6">{navLinks}</nav>
          </div>

          {/* RIGHT GROUP */}
          <div className="flex items-center space-x-4">
            {/* 🛒 Giỏ hàng */}
            <Link 
              to="/cart" 
              className="relative p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all group backdrop-blur-sm border-2 border-white/30 shadow-lg"
            >
              <ShoppingCart className="h-6 w-6 text-white group-hover:text-red-300 transition-colors" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-xs w-6 h-6 flex items-center justify-center font-bold shadow-lg animate-pulse border-2 border-white">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            <div className="h-8 w-px bg-white/40 hidden md:block"></div>

            {/* 👤 Menu người dùng */}
            <div className="hidden md:flex items-center">
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
                    className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm border-2 border-white/30 shadow-lg"
                  >
                    <UserCircle className="h-6 w-6 text-white" />
                    <span className="text-base font-bold text-white drop-shadow-md">
                      🎅 {user?.name || "User"}
                    </span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl py-2 z-50 animate-fade-in-down border-4 border-blue-200">
                      <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-xl mb-2">
                        <p className="text-sm text-blue-600 font-semibold flex items-center gap-2">
                          🎄 Xin chào, {user?.name}!
                        </p>
                      </div>
                      
                      <Link 
                        to="/profile" 
                        onClick={() => setIsUserMenuOpen(false)} 
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors font-medium"
                      >
                        <User size={18} className="text-blue-500" /> Thông tin cá nhân
                      </Link>
                      
                      <Link 
                        to="/orders" 
                        onClick={() => setIsUserMenuOpen(false)} 
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors font-medium"
                      >
                        <Package size={18} className="text-blue-500" /> Lịch sử đơn hàng
                      </Link>

                      <Link 
                        to="/wishlist" 
                        onClick={() => setIsUserMenuOpen(false)} 
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors font-medium"
                      >
                        <Heart size={18} className="text-red-500" /> Danh sách yêu thích
                      </Link>

                      <Link 
                        to="/chat" 
                        onClick={() => setIsUserMenuOpen(false)} 
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors font-medium"
                      >
                        <MessageSquare size={18} className="text-blue-500" /> Chat với Admin
                      </Link>

                      {user?.role === "Admin" && (
                        <Link 
                          to="/admin" 
                          onClick={() => setIsUserMenuOpen(false)} 
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors font-medium"
                        >
                          <ShieldCheck size={18} className="text-blue-500" /> Trang quản trị
                        </Link>
                      )}
                      
                      <div className="border-t-2 border-blue-100 my-2"></div>
                      
                      <button 
                        onClick={handleLogout} 
                        className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium rounded-b-xl"
                      >
                        <LogOut size={18} /> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/login" 
                    className="px-5 py-2 rounded-full text-sm font-bold text-white hover:bg-white/20 transition-all backdrop-blur-sm border-2 border-white/30 shadow-lg"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-5 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all shadow-lg border-2 border-white/30"
                  >
                    🎁 Register
                  </Link>
                </div>
              )}
            </div>

            {/* 🍔 Mobile menu */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border-2 border-white/30 shadow-lg"
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 📱 MENU MOBILE */}
      {isMobileMenuOpen && (
        <div 
          ref={mobileMenuRef} 
          className="md:hidden bg-gradient-to-br from-blue-400 to-cyan-400 backdrop-blur-sm p-4 space-y-4 animate-fade-in-down border-t-2 border-white/30 shadow-xl"
        >
          <nav className="flex flex-col space-y-2">{navLinks}</nav>
          
          <div className="border-t-2 border-white/30 pt-4">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl border-2 border-white/30 mb-3">
                  <p className="text-white font-bold flex items-center gap-2">
                    🎅 Xin chào, {user?.name}
                  </p>
                </div>
                
                <Link 
                  to="/profile" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="flex items-center gap-2 px-4 py-3 text-white hover:bg-white/20 rounded-xl transition-all font-medium backdrop-blur-sm"
                >
                  <User size={18} /> Thông tin cá nhân
                </Link>
                
                <Link 
                  to="/orders" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="flex items-center gap-2 px-4 py-3 text-white hover:bg-white/20 rounded-xl transition-all font-medium backdrop-blur-sm"
                >
                  <Package size={18} /> Lịch sử đơn hàng
                </Link>

                <Link 
                  to="/wishlist" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="flex items-center gap-2 px-4 py-3 text-white hover:bg-white/20 rounded-xl transition-all font-medium backdrop-blur-sm"
                >
                  <Heart size={18} /> Danh sách yêu thích
                </Link>

                <Link 
                  to="/chat" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="flex items-center gap-2 px-4 py-3 text-white hover:bg-white/20 rounded-xl transition-all font-medium backdrop-blur-sm"
                >
                  <MessageSquare size={18} /> Chat với Admin
                </Link>

                {user?.role === "Admin" && (
                  <Link 
                    to="/admin" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="flex items-center gap-2 px-4 py-3 text-white hover:bg-white/20 rounded-xl transition-all font-medium backdrop-blur-sm"
                  >
                    <ShieldCheck size={18} /> Trang quản trị
                  </Link>
                )}
                
                <button 
                  onClick={handleLogout} 
                  className="w-full flex items-center gap-2 px-4 py-3 text-red-200 hover:bg-red-500/30 rounded-xl transition-all font-medium backdrop-blur-sm"
                >
                  <LogOut size={18} /> Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link 
                  to="/login" 
                  className="px-4 py-3 text-center rounded-xl font-bold text-white bg-white/20 hover:bg-white/30 border-2 border-white/30 backdrop-blur-sm shadow-lg"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-3 text-center rounded-xl font-bold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-2 border-white/30 shadow-lg"
                >
                  🎁 Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;