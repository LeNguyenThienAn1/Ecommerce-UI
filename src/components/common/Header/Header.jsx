import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
// ✨ BỔ SUNG: Icon MessageSquare cho chat
import { ShoppingCart, User, Menu, X, Package, ShieldCheck, LogOut, UserCircle, MessageSquare } from 'lucide-react';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  // ✨ BỔ SUNG: State cho các menu
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // ✨ BỔ SUNG: Xử lý click ra ngoài để đóng menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false); // Đóng menu sau khi logout
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navLinks = (
    <>
      <Link to="/products" className="text-base font-bold text-white hover:text-yellow-300 transition-all">Products</Link>
      <Link to="/about" className="text-base font-bold text-white hover:text-yellow-300 transition-all">About</Link>
    </>
  );

  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 backdrop-blur-sm shadow-lg w-full z-50 sticky top-0">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* LEFT GROUP: Logo & nav */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-black text-white flex-shrink-0 hover:text-yellow-300 transition-colors" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
              TechStore
            </Link>
            <nav className="hidden md:flex space-x-6">{navLinks}</nav>
          </div>

          {/* RIGHT GROUP: Cart, User menu, Mobile menu */}
          <div className="flex items-center space-x-4">
            {/* 🛒 Giỏ hàng */}
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-white/10 transition-colors group">
              <ShoppingCart className="h-6 w-6 text-white group-hover:text-yellow-300 transition-colors" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* Divider */}
            <div className="h-8 w-px bg-white/40 hidden md:block"></div>

            {/* 👤 Menu cho người dùng (Desktop) */}
            <div className="hidden md:flex items-center">
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-all">
                    <UserCircle className="h-6 w-6 text-black"/>
                    <span className="text-base font-bold text-black">{user?.name || "User"}</span>
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 animate-fade-in-down">
                      <Link to="/profile" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <User size={16} /> Thông tin cá nhân
                      </Link>
                      <Link to="/orders" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Package size={16} /> Lịch sử đơn hàng
                      </Link>
                        {/* ✨ BỔ SUNG: Link Chat với Admin (Desktop) */}
                        <Link to="/chat" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <MessageSquare size={16} /> Chat với Admin
                      </Link>
                      {/* ✨ BỔ SUNG: Link trang Admin */}
                      {user?.role === 'Admin' && (
                        <Link to="/admin" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                           <ShieldCheck size={16} /> Trang quản trị
                        </Link>
                      )}
                      <div className="border-t my-1"></div>
                      <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        <LogOut size={16} /> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login" className="px-4 py-2 rounded-lg text-sm font-bold text-white hover:bg-white/10 transition-all">Login</Link>
                  <Link to="/register" className="px-4 py-2 rounded-lg text-sm font-bold text-blue-900 bg-yellow-400 hover:bg-yellow-300 transition-all shadow-md">Register</Link>
                </div>
              )}
            </div>

            {/* 🍔 Nút Hamburger (Mobile) */}
            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-white hover:bg-white/10">
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✨ BỔ SUNG: Panel menu cho Mobile */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden bg-blue-800/95 backdrop-blur-sm p-4 space-y-4 animate-fade-in-down">
          <nav className="flex flex-col space-y-2">{navLinks}</nav>
          <div className="border-t border-white/20 pt-4">
            {isAuthenticated ? (
               <div className="space-y-2">
                 <p className="px-4 py-2 text-black font-bold">Xin chào, {user?.name}</p>
                 <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-black hover:bg-white/10 rounded-md">Thông tin cá nhân</Link>
                 <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-black hover:bg-white/10 rounded-md">Lịch sử đơn hàng</Link>
                    {/* ✨ BỔ SUNG: Link Chat với Admin (Mobile) */}
                    <Link to="/chat" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-black hover:bg-white/10 rounded-md">Chat với Admin</Link>
                 {user?.role === 'Admin' && (
                   <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-white hover:bg-white/10 rounded-md">Trang quản trị</Link>
                 )}
                 <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-300 hover:bg-white/10 rounded-md">Đăng xuất</button>
               </div>
            ) : (
               <div className="flex flex-col space-y-2">
                  <Link to="/login" className="px-4 py-2 text-center rounded-lg font-bold text-white bg-white/10 hover:bg-white/20">Login</Link>
                  <Link to="/register" className="px-4 py-2 text-center rounded-lg font-bold text-blue-900 bg-yellow-400 hover:bg-yellow-300">Register</Link>
               </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;