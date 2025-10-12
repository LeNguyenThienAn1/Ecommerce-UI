import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Phone, KeyRound, LogOut } from 'lucide-react';

const ProfilePage = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Chuyển về trang đăng nhập sau khi logout
  };

  // Nếu context đang tải thông tin user (khi F5 trang)
  if (loading) {
    return <div className="text-center p-10">Đang tải...</div>;
  }

  // Nếu người dùng chưa đăng nhập, yêu cầu họ đăng nhập
  if (!isAuthenticated) {
    return (
      <div className="text-center p-10">
        <p>Vui lòng đăng nhập để xem thông tin cá nhân.</p>
        <button onClick={() => navigate('/login')} className="text-blue-600 mt-2 font-semibold">
          Đến trang đăng nhập
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto my-10 bg-white shadow-xl rounded-lg p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Thông Tin Cá Nhân</h1>
      
      {user ? (
        <div className="space-y-6">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <KeyRound className="w-6 h-6 text-gray-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">ID người dùng</p>
              <p className="text-lg font-medium text-gray-900">{user.id}</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <User className="w-6 h-6 text-gray-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Họ và tên</p>
              <p className="text-lg font-medium text-gray-900">{user.name}</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <Phone className="w-6 h-6 text-gray-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Số điện thoại</p>
              <p className="text-lg font-medium text-gray-900">{user.phoneNumber}</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-red-600 text-blackn py-3 rounded-lg hover:bg-red-700 transition-transform transform hover:scale-105"
          >
            <LogOut className="w-5 h-5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      ) : (
        <p>Không thể tải thông tin người dùng.</p>
      )}
    </div>
  );
};

export default ProfilePage;