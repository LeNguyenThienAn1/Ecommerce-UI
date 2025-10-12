import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header/Header';
import Footer from '../components/common/Footer/Footer';

const MainLayout = () => {
  return (
    // ✨ THÊM "flex flex-col" VÀO ĐÂY
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Giờ đây "flex-1" sẽ hoạt động chính xác, đẩy Footer xuống cuối trang */}
      <main className="flex-1">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;