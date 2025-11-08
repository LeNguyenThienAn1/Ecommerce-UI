import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Users,
  Calendar,
  LogOut,
  ShieldCheck,
} from "lucide-react";

const ProfilePage = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Lấy thông tin user từ API
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !user.id) {
        setLoadingUser(false);
        return;
      }

      try {
        const res = await fetch(`https://localhost:7165/api/Users/${user.id}`);
        if (!res.ok) throw new Error("Không thể tải thông tin người dùng");
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingUser(false);
      }
    };

    if (isAuthenticated && user) fetchUserData();
    else setLoadingUser(false);
  }, [user, isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading || loadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
        <div className="absolute top-20 left-20 text-blue-200 text-6xl animate-pulse">❄️</div>
        <div className="absolute bottom-20 right-20 text-blue-300 text-5xl animate-pulse" style={{animationDelay: '1s'}}>❄️</div>
        
        <div className="text-center bg-white rounded-3xl p-12 shadow-2xl border-4 border-blue-200 relative">
          <div className="absolute -top-4 -right-4 text-4xl">🎄</div>
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-400 mx-auto"></div>
          <p className="mt-6 text-blue-700 font-bold text-lg">🎅 Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
        <div className="absolute top-10 left-10 text-blue-200 text-5xl animate-pulse">❄️</div>
        <div className="absolute top-10 right-10 text-blue-300 text-5xl animate-pulse" style={{animationDelay: '1s'}}>❄️</div>
        
        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md border-4 border-blue-200 relative">
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-5xl">🎅</div>
          <User className="w-12 h-12 text-blue-500 mx-auto mb-3 mt-4" />
          <h2 className="text-2xl font-bold text-blue-800 mb-2">Yêu cầu đăng nhập</h2>
          <p className="text-blue-600 mb-6">Vui lòng đăng nhập để xem thông tin của bạn.</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-8 py-3 rounded-full transition font-bold shadow-lg"
          >
            🎁 Đến trang đăng nhập
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="bg-red-50 border-4 border-red-300 rounded-3xl p-8 text-center max-w-md shadow-2xl relative">
          <div className="absolute -top-4 -right-4 text-3xl">⛄</div>
          <p className="text-xl font-bold text-red-800 mb-2">Lỗi tải dữ liệu</p>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full transition font-bold"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!userData)
    return (
      <div className="flex items-center justify-center min-h-screen text-blue-600 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        ❄️ Không có dữ liệu người dùng.
      </div>
    );

  const firstLetter = userData.name ? userData.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 relative overflow-hidden">
      {/* Snowflakes background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 text-blue-200 text-5xl animate-pulse">❄️</div>
        <div className="absolute top-40 right-20 text-blue-300 text-4xl animate-pulse" style={{animationDelay: '1s'}}>❄️</div>
        <div className="absolute bottom-40 left-1/4 text-blue-200 text-6xl animate-pulse" style={{animationDelay: '2s'}}>❄️</div>
        <div className="absolute bottom-20 right-1/3 text-blue-300 text-5xl animate-pulse" style={{animationDelay: '0.5s'}}>❄️</div>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-blue-200 relative z-10">
        {/* Christmas decorations */}
        <div className="absolute top-4 left-4 text-3xl z-20">🎄</div>
        <div className="absolute top-4 right-4 text-3xl z-20">🎁</div>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 px-8 py-10 flex items-center gap-6 relative">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-white to-red-500"></div>
          
          {userData.avatarUrl ? (
            <img
              src={userData.avatarUrl}
              alt="avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl relative z-10"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center text-blue-500 text-4xl font-bold shadow-xl border-4 border-white relative z-10">
              {firstLetter}
            </div>
          )}

          <div className="relative z-10">
            <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg flex items-center gap-2">
              🎅 {userData.name}
            </h1>
            <p className="text-blue-50 flex items-center gap-2 font-semibold text-lg drop-shadow-md">
              <Users className="w-5 h-5" />
              {userData.role || "Khách hàng"}
            </p>
            <div className="mt-3 flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-white/30 shadow-lg">
              <ShieldCheck
                className={`w-5 h-5 ${
                  userData.isActive ? "text-green-300" : "text-red-300"
                }`}
              />
              <span
                className={`text-sm font-bold ${
                  userData.isActive ? "text-white" : "text-red-200"
                }`}
              >
                {userData.isActive ? "✅ Đang hoạt động" : "❌ Bị vô hiệu hóa"}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6 relative">
          <div className="absolute bottom-10 right-10 text-5xl opacity-20 pointer-events-none">⛄</div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <InfoCard
              icon={<Mail className="w-5 h-5 text-blue-500" />}
              label="Email"
              value={userData.email || "Chưa cập nhật"}
              emoji="📧"
            />
            <InfoCard
              icon={<Phone className="w-5 h-5 text-blue-500" />}
              label="Số điện thoại"
              value={userData.phoneNumber}
              emoji="📱"
            />
            <InfoCard
              icon={<MapPin className="w-5 h-5 text-blue-500" />}
              label="Địa chỉ"
              value={userData.address || "Chưa cập nhật"}
              emoji="📍"
            />
            <InfoCard
              icon={<Calendar className="w-5 h-5 text-blue-500" />}
              label="Ngày tạo"
              value={formatDate(userData.createAt)}
              emoji="📅"
            />
            <InfoCard
              icon={<Calendar className="w-5 h-5 text-blue-500" />}
              label="Cập nhật lần cuối"
              value={formatDate(userData.updateAt)}
              emoji="🔄"
            />
          </div>

          <div className="flex justify-end mt-10 gap-3">
            <button
              onClick={() => navigate("/profile/edit")}
              className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl border-2 border-white/30"
            >
              ✏️ Chỉnh sửa
            </button>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl border-2 border-white/30"
            >
              <LogOut className="w-5 h-5" /> Đăng xuất
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

// Component con hiển thị từng dòng thông tin
const InfoCard = ({ icon, label, value, emoji }) => (
  <div className="flex items-start bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 hover:shadow-lg transition-all border-2 border-blue-200 relative overflow-hidden group">
    <div className="absolute top-2 right-2 text-xl opacity-50 group-hover:scale-110 transition-transform">
      {emoji}
    </div>
    <div className="w-12 h-12 bg-white border-2 border-blue-300 rounded-xl flex items-center justify-center mr-4 shadow-md group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div>
      <p className="text-xs text-blue-600 uppercase font-bold tracking-wider">{label}</p>
      <p className="text-base text-gray-900 font-semibold mt-1">{value}</p>
    </div>
  </div>
);

export default ProfilePage;