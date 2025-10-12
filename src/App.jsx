import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🧩 Context Providers
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";

// 🧱 Layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./pages/admin/AdminLayout";

// 🛍️ User Pages
import HomePage from "./pages/user/HomePage.jsx";
import ProductPage from "./pages/user/ProductPage.jsx";
import ProductDetail from "./pages/user/ProductDetail.jsx";
import CartPage from "./pages/user/CartPage.jsx";
import About from "./pages/user/About.jsx";
import ProfilePage from "./pages/user/ProfilePage.jsx"; // 🆕 Thêm import ProfilePage
import OrderHistoryPage from "./pages/user/OrderHistoryPage.jsx"; // 🆕 Thêm import OrderHistoryPage

// 🔐 Auth Pages
import LoginPage from "./pages/user/LoginPage.jsx";
import RegisterPage from "./pages/user/RegisterPage.jsx";

// ⚙️ Admin Pages
import DashboardOverview from "./pages/admin/DashboardOverview.jsx";
import ProductManager from "./pages/admin/ProductManager.jsx";
import CategoryManager from "./pages/admin/CategoryManager.jsx";
import BrandManager from "./pages/admin/BrandManager.jsx";

// 💬 Global Components
import ChatBot from "./components/chat/ChatBot.jsx";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* 🌐 USER AREA - dùng MainLayout */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="products" element={<ProductPage />} />
              <Route path="products/:id" element={<ProductDetail />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="about" element={<About />} />
              <Route path="profile" element={<ProfilePage />} /> {/* 🆕 Đường dẫn trang cá nhân */}
              <Route path="orders" element={<OrderHistoryPage />} /> {/* 🆕 Đường dẫn lịch sử đơn hàng */}
            </Route>

            {/* 🔑 AUTH AREA (không dùng MainLayout) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* 🧭 ADMIN AREA */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="products" element={<ProductManager />} />
              <Route path="categories" element={<CategoryManager />} />
              <Route path="brands" element={<BrandManager />} />
            </Route>
          </Routes>

          {/* 🤖 ChatBot global luôn hiển thị */}
          <ChatBot />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;