import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/user/HomePage.jsx';
import ProductPage from './pages/user/ProductPage.jsx';
import LoginPage from './pages/user/LoginPage.jsx';
import RegisterPage from './pages/user/RegisterPage.jsx';
import CartPage from './pages/user/CartPage.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Routes sử dụng MainLayout */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="products" element={<ProductPage />} />
              <Route path="cart" element={<CartPage />} />
            </Route>
            
            {/* Routes không sử dụng MainLayout (Login/Register) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;