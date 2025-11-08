import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🧩 Context Providers
// SỬA LỖI: Xóa đuôi file .jsx trong import
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// 🧱 Layouts
// SỬA LỖI: Xóa đuôi file .jsx trong import
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./pages/admin/AdminLayout";

// 🛍️ User Pages
// SỬA LỖI: Xóa đuôi file .jsx trong import
import HomePage from "./pages/user/HomePage";
import ProductPage from "./pages/user/ProductPage";
import ProductDetail from "./pages/user/ProductDetail";
import CartPage from "./pages/user/CartPage";
import About from "./pages/user/About";
import ProfilePage from "./pages/user/ProfilePage";
import OrderHistoryPage from "./pages/user/OrderHistoryPage";
import OrderSuccessPage from "./pages/user/OrderSuccessPage";
import WishlistPage from "./pages/user/WishlistPage";
// Import component EditProfilePage
import EditProfilePage from "./pages/user/EditProfilePage";

// 💬 Chat Pages
// SỬA LỖI: Xóa đuôi file .jsx trong import
import UserChatPage from "./pages/user/UserChatPage";
import AdminChatPage from "./pages/admin/AdminChatPage";

// 🔐 Auth Pages
// SỬA LỖI: Xóa đuôi file .jsx trong import
import LoginPage from "./pages/user/LoginPage";
import RegisterPage from "./pages/user/RegisterPage";

// ⚙️ Admin Pages
// SỬA LỖI: Xóa đuôi file .jsx trong import
import DashboardOverview from "./pages/admin/DashboardOverview";
import ProductManager from "./pages/admin/ProductManager";
import CategoryManager from "./pages/admin/CategoryManager";
import BrandManager from "./pages/admin/BrandManager";
import OrderManager from "./pages/admin/OrderManager";
import UserManager from "./pages/admin/UserManager";

// 💬 Global Components
// SỬA LỖI: Xóa đuôi file .jsx trong import
import ChatBot from "./components/chat/ChatBot";

function App() {
  return (
    <AuthProvider>
           {" "}
      <CartProvider>
               {" "}
        <Router>
                   {" "}
          <Routes>
                        {/* 🌐 USER AREA */}           {" "}
            <Route path="/" element={<MainLayout />}>
                            <Route index element={<HomePage />} />
                            <Route path="products" element={<ProductPage />} />
                           {" "}
              <Route path="products/:id" element={<ProductDetail />} />
                            <Route path="cart" element={<CartPage />} />
                            <Route path="about" element={<About />} />
                            <Route path="profile" element={<ProfilePage />} />
                            <Route path="/wishlist" element={<WishlistPage />} />
              {/* 🧑‍💻 ĐÃ SỬA: Thay đổi 'profile-edit' thành 'profile/edit' */}
              <Route path="profile/edit" element={<EditProfilePage />} />
                           {" "}
              <Route path="orders" element={<OrderHistoryPage />} />
              <Route path="order-success" element={<OrderSuccessPage />} />     
                      {/* 💬 User Chat */}
                            <Route path="chat" element={<UserChatPage />} />   
                     {" "}
            </Route>
                        {/* 🔑 AUTH AREA */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />   
                    {/* 🧭 ADMIN AREA */}           {" "}
            <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<DashboardOverview />} />
                           {" "}
              <Route path="products" element={<ProductManager />} />
                           {" "}
              <Route path="categories" element={<CategoryManager />} />
                            <Route path="brands" element={<BrandManager />} /> 
                          {/* 📦 Order Management */}
                            <Route path="orders" element={<OrderManager />} />
              <Route path="users" element={<UserManager />} />             {" "}
              {/* 💬 Admin Chat */}
                            <Route path="chat" element={<AdminChatPage />} />   
                     {" "}
            </Route>
                     {" "}
          </Routes>
                    {/* 🤖 ChatBot hiển thị toàn cục */}
                    <ChatBot />       {" "}
        </Router>
             {" "}
      </CartProvider>
         {" "}
    </AuthProvider>
  );
}

export default App;
