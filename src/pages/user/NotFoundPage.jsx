import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-6">
      <AlertTriangle className="w-20 h-20 text-yellow-500 mb-4" />
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mt-2">Trang không tồn tại</h2>
      <p className="mt-4 text-gray-600">
        Rất tiếc, chúng tôi không thể tìm thấy trang bạn yêu cầu.
      </p>
      <Link 
        to="/" 
        className="mt-8 bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Quay về Trang Chủ
      </Link>
    </div>
  );
};

export default NotFoundPage;