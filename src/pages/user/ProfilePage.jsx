import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Phone, KeyRound, LogOut, Mail, MapPin, Users, Calendar } from 'lucide-react';

const ProfilePage = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState(null);

  // Fetch thông tin user từ API
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !user.id) {
        setLoadingUser(false);
        return;
      }

      try {
        const response = await fetch(`https://localhost:7165/api/Users/${user.id}`, {
          method: 'GET',
          headers: {
            'accept': '*/*'
          }
        });

        if (!response.ok) {
          throw new Error('Không thể tải thông tin người dùng');
        }

        const data = await response.json();
        setUserData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching user data:', err);
      } finally {
        setLoadingUser(false);
      }
    };

    if (isAuthenticated && user) {
      fetchUserData();
    } else {
      setLoadingUser(false);
    }
  }, [user, isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Nếu context đang tải thông tin user
  if (loading || loadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-lg text-gray-600 font-medium">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  // Nếu người dùng chưa đăng nhập
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-white shadow-xl rounded-2xl p-10 max-w-md">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Yêu cầu đăng nhập</h2>
          <p className="text-gray-600 mb-6">Vui lòng đăng nhập để xem thông tin cá nhân của bạn.</p>
          <button 
            onClick={() => navigate('/login')} 
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 font-medium"
          >
            Đến trang đăng nhập
          </button>
        </div>
      </div>
    );
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md bg-red-50 border-2 border-red-300 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-xl font-bold text-red-800 mb-3">Đã xảy ra lỗi</h3>
          <p className="text-red-700 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all transform hover:scale-105 font-medium"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Thông Tin Cá Nhân</h1>
                <p className="text-blue-100">Xem và quản lý thông tin tài khoản của bạn</p>
              </div>
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                <User className="w-12 h-12 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {userData ? (
          <>
            {/* Main Info Card */}
            <div className="bg-white shadow-xl rounded-2xl p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <User className="w-6 h-6 mr-3 text-blue-600" />
                Thông tin cơ bản
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-md transition">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <KeyRound className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600 font-medium mb-1">ID người dùng</p>
                    <p className="text-lg font-bold text-gray-900 truncate">{userData.id}</p>
                  </div>
                </div>

                <div className="flex items-start p-5 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl hover:shadow-md transition">
                  <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600 font-medium mb-1">Họ và tên</p>
                    <p className="text-lg font-bold text-gray-900">{userData.name}</p>
                  </div>
                </div>

                <div className="flex items-start p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-md transition">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600 font-medium mb-1">Email</p>
                    <p className="text-lg font-bold text-gray-900">
                      {userData.email || <span className="text-gray-400 italic font-normal">Chưa cập nhật</span>}
                    </p>
                  </div>
                </div>

                <div className="flex items-start p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-md transition">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600 font-medium mb-1">Số điện thoại</p>
                    <p className="text-lg font-bold text-gray-900">{userData.phoneNumber}</p>
                  </div>
                </div>

                <div className="flex items-start p-5 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl hover:shadow-md transition md:col-span-2">
                  <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600 font-medium mb-1">Địa chỉ</p>
                    <p className="text-lg font-bold text-gray-900">
                      {userData.address || <span className="text-gray-400 italic font-normal">Chưa cập nhật</span>}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="bg-white shadow-xl rounded-2xl p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Users className="w-6 h-6 mr-3 text-blue-600" />
                Thông tin bổ sung
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-5 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl text-center hover:shadow-md transition">
                  <div className="w-14 h-14 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-sm text-gray-600 font-medium mb-2">Vai trò</p>
                  <p className="text-xl font-bold text-gray-900 capitalize">{userData.role}</p>
                </div>

                <div className="p-5 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl text-center hover:shadow-md transition">
                  <div className="w-14 h-14 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-sm text-gray-600 font-medium mb-2">Ngày tạo</p>
                  <p className="text-sm font-bold text-gray-900">{formatDate(userData.createAt)}</p>
                </div>

                <div className="p-5 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl text-center hover:shadow-md transition">
                  <div className="w-14 h-14 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-sm text-gray-600 font-medium mb-2">Cập nhật lần cuối</p>
                  <p className="text-sm font-bold text-gray-900">{formatDate(userData.updateAt)}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/profile/edit')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 font-bold text-lg shadow-lg"
              >
                ✏️ Chỉnh sửa thông tin
              </button>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105 font-bold text-lg shadow-lg flex items-center justify-center gap-3"
              >
                <LogOut className="w-6 h-6" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </>
        ) : (
          <div className="bg-white shadow-xl rounded-2xl p-12 text-center">
            <p className="text-xl text-gray-600">Không thể tải thông tin người dùng.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;