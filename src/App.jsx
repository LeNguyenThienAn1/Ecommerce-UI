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
import ProfilePage from "./pages/user/ProfilePage.jsx";
import OrderHistoryPage from "./pages/user/OrderHistoryPage.jsx";
import OrderSuccessPage from "./pages/user/OrderSuccessPage.jsx";

// 💬 Chat Pages
import UserChatPage from "./pages/user/UserChatPage.jsx";
import AdminChatPage from "./pages/admin/AdminChatPage.jsx";

// 🔐 Auth Pages
import LoginPage from "./pages/user/LoginPage.jsx";
import RegisterPage from "./pages/user/RegisterPage.jsx";

// ⚙️ Admin Pages
import DashboardOverview from "./pages/admin/DashboardOverview.jsx";
import ProductManager from "./pages/admin/ProductManager.jsx";
import CategoryManager from "./pages/admin/CategoryManager.jsx";
import BrandManager from "./pages/admin/BrandManager.jsx";
import OrderManager from "./pages/admin/OrderManager.jsx"; 

// 💬 Global Components
import ChatBot from "./components/chat/ChatBot.jsx";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* 🌐 USER AREA */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="products" element={<ProductPage />} />
              <Route path="products/:id" element={<ProductDetail />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="about" element={<About />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="orders" element={<OrderHistoryPage />} /> {/* ✅ Route added */}
              <Route path="order-success" element={<OrderSuccessPage />} />

              {/* 💬 User Chat */}
              <Route path="chat" element={<UserChatPage />} />
            </Route>

            {/* 🔑 AUTH AREA */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* 🧭 ADMIN AREA */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="products" element={<ProductManager />} />
              <Route path="categories" element={<CategoryManager />} />
              <Route path="brands" element={<BrandManager />} />

              {/* 📦 Order Management */}
              <Route path="orders" element={<OrderManager />} /> 

              {/* 💬 Admin Chat */}
              <Route path="chat" element={<AdminChatPage />} />
            </Route>
          </Routes>

          {/* 🤖 ChatBot hiển thị toàn cục */}
          <ChatBot />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
