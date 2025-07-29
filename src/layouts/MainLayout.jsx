import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header/Header';
import Footer from '../components/common/Footer/Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;