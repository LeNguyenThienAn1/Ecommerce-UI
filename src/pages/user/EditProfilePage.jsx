import React, { useState, useEffect, useContext } from 'react';
import { User, Phone, Mail, MapPin, ArrowLeft, Save, Camera, X } from 'lucide-react';

// =================================================================
// ⚠️ LƯU Ý QUAN TRỌNG: Đây là component tự đóng gói cho mục đích chạy thử.
// Trong ứng dụng thực tế, AuthContext và useAuth PHẢI được định nghĩa 
// trong file AuthContext.jsx riêng biệt và được import vào đây.
// =================================================================

// Giả định Context để lấy thông tin người dùng (Thay thế bằng AuthContext thật của bạn)
const AuthContext = React.createContext({ user: { id: "f866537c-76e3-4a81-9d2b-7983749bfa49" } }); 
const useAuth = () => useContext(AuthContext);
// =================================================================

const EditProfilePage = () => {
    // 1. LẤY USER ID ĐỘNG TỪ CONTEXT
    const { user } = useAuth();
    const userId = user?.id; // Lấy ID của người dùng đang đăng nhập
    
    // Nếu chưa có userId, chúng ta không thể fetch data, nhưng chúng ta sẽ xử lý sau.
    
    const [userData, setUserData] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        phoneNumber: '',
        avatarUrl: ''
    });

    // Fetch user data
    useEffect(() => {
        if (!userId) {
            // Xử lý khi người dùng chưa đăng nhập hoặc không có ID
            setLoadingUser(false);
            setError('Bạn cần đăng nhập để chỉnh sửa hồ sơ.');
            return;
        }

        const fetchUserData = async () => {
            try {
                // SỬ DỤNG userId ĐỘNG
                const response = await fetch(`https://localhost:7165/api/Users/${userId}`, {
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
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    address: data.address || '',
                    phoneNumber: data.phoneNumber || '',
                    avatarUrl: data.avatarUrl || ''
                });
                setAvatarPreview(data.avatarUrl || null);
                setError(null);
            } catch (err) {
                // Log lỗi chi tiết ra console
                console.error("Lỗi khi fetch user data:", err); 
                setError(err.message);
            } finally {
                setLoadingUser(false);
            }
        };

        fetchUserData();
    }, [userId]); // Dependency: userId thay đổi thì fetch lại

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'avatarUrl') {
            setAvatarPreview(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            // SỬ DỤNG userId ĐỘNG
            const response = await fetch('https://localhost:7165/api/Users/update', {
    method: 'PUT', // ✅ ĐÚNG
    headers: {
        'Content-Type': 'application/json',
        'accept': '*/*'
    },
    body: JSON.stringify({
        id: userId,
        name: formData.name,
        email: formData.email,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        avatarUrl: formData.avatarUrl
    })
});


            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Không thể cập nhật thông tin');
            }

            setSuccess(true);
        } catch (err) {
            console.error("Lỗi khi submit user data:", err); 
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const clearAvatar = () => {
        setFormData(prev => ({ ...prev, avatarUrl: '' }));
        setAvatarPreview(null);
    };

    // Kiểm tra và hiển thị khi chưa đăng nhập
    if (!userId && !loadingUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white shadow-xl rounded-lg p-8 text-center border-l-4 border-red-500">
                    <p className="text-xl font-semibold text-red-600 mb-4">Lỗi Truy Cập</p>
                    <p className="text-gray-700">{error}</p>
                    <button
                        onClick={() => window.history.back()}
                        className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    if (loadingUser) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 font-inter">
            <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-lg p-8 transform transition-all duration-300">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center text-gray-600 hover:text-gray-800 transition p-2 rounded-lg hover:bg-gray-100"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Quay lại
                    </button>
                </div>

                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 border-b pb-3">Chỉnh Sửa Thông Tin</h1>

                {error && (
                    <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
                        ✓ Cập nhật thông tin thành công!
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-blue-100">
                                {avatarPreview ? (
                                    <img 
                                        src={avatarPreview} 
                                        alt="Avatar" 
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null; 
                                            e.target.src = "https://placehold.co/128x128/cccccc/333333?text=Lỗi+Ảnh";
                                        }}
                                    />
                                ) : (
                                    <Camera className="w-12 h-12 text-gray-400" />
                                )}
                            </div>
                            {avatarPreview && (
                                <button
                                    type="button"
                                    onClick={clearAvatar}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <div className="mt-4 w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                URL Avatar
                            </label>
                            <input
                                type="text"
                                name="avatarUrl"
                                value={formData.avatarUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/avatar.jpg"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">Nhập URL hình ảnh từ internet</p>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <User className="w-4 h-4 mr-2 text-blue-600" />
                            Họ và tên <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <Mail className="w-4 h-4 mr-2 text-blue-600" />
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="example@email.com"
                            disabled={true} // Thường không cho phép chỉnh sửa email
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50 text-gray-500 cursor-not-allowed shadow-sm"
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                            Địa chỉ
                        </label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Nhập địa chỉ của bạn"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none shadow-sm"
                        />
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <Phone className="w-4 h-4 mr-2 text-blue-600" />
                            Số điện thoại <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-8">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium shadow-md"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={saving || !formData.name || !formData.phoneNumber}
                            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-[1.01] disabled:bg-blue-400 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg"
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Lưu thay đổi
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfilePage;
