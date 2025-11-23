import React, { useState, useEffect, useContext } from 'react';
// Đã loại bỏ các icon không dùng đến (Key, ChevronDown, ChevronUp)
import { User, Phone, Mail, MapPin, ArrowLeft, Save, Camera, X } from 'lucide-react';

// =================================================================
// ⚠️ LƯU Ý: Giữ nguyên giả lập Context như cũ để bạn chạy thử
// =================================================================
const TEST_USER_ID = "f866537c-76e3-4a81-9d2b-7983749bfa49"; 
const AuthContext = React.createContext({ user: { id: TEST_USER_ID } }); 
const useAuth = () => useContext(AuthContext);
// =================================================================

const BASE_API_URL = 'https://localhost:7165/api';

const EditProfilePage = () => {
    const { user } = useAuth();
    const userId = user?.id; 
    
    // State cho thông tin hồ sơ
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

    // Fetch user data (GET Request)
    useEffect(() => {
        if (!userId) {
            setLoadingUser(false);
            setError('Bạn cần đăng nhập để chỉnh sửa hồ sơ.');
            return;
        }

        const fetchUserData = async () => {
            setError(null);
            try {
                const url = `${BASE_API_URL}/Users/${userId}`;
                console.log("Fetching user data from:", url);
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: { 'accept': '*/*' }
                });

                if (!response.ok) {
                    const status = response.status;
                    let message = `Lỗi ${status}: Không thể tải thông tin người dùng.`;
                    if (status === 404) {
                        message = `Lỗi 404 (GET): Không tìm thấy người dùng.`;
                    }
                    throw new Error(message);
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
            } catch (err) {
                console.error("Lỗi khi fetch user data:", err); 
                setError(err.message);
            } finally {
                setLoadingUser(false);
            }
        };

        fetchUserData();
    }, [userId]); 

    // Hàm xử lý thay đổi form hồ sơ
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setSuccess(false);

        if (name === 'avatarUrl') {
            setAvatarPreview(value);
        }
    };

    // Hàm xử lý submit form hồ sơ (PUT Request)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            setError('Không có ID người dùng để cập nhật.');
            return;
        }
        
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const url = `${BASE_API_URL}/Users/${userId}`; 
            console.log("Submitting update data to:", url);
            
            const response = await fetch(url, {
                method: 'PUT',
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
                const status = response.status;
                let message = `Cập nhật thất bại. Lỗi HTTP ${status}.`;
                try {
                    const errorData = await response.json();
                    message += (errorData.title || errorData.message || '');
                } catch (e) {
                    // Not JSON error
                }
                throw new Error(message);
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

    // =============================================================
    // RENDER
    // =============================================================

    if (!userId && !loadingUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white shadow-xl rounded-lg p-8 text-center border-l-4 border-red-500 max-w-sm w-full">
                    <p className="text-xl font-semibold text-red-600 mb-4">Lỗi Truy Cập</p>
                    <p className="text-gray-700">{error}</p>
                    <button
                        onClick={() => window.history.back()}
                        className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition"
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
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans antialiased">
            <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-xl p-6 sm:p-8 transform transition-all duration-300">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center text-gray-600 hover:text-blue-600 transition p-2 rounded-lg hover:bg-blue-50"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Quay lại
                    </button>
                </div>

                <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-8 border-b pb-4">Chỉnh Sửa Hồ Sơ</h1>
                
                {/* Đã xóa dòng hiển thị User ID ở đây */}

                {/* Đã xóa phần tính năng đổi mật khẩu ở đây */}

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-lg mb-6 shadow-sm">
                        <p className="font-bold">Lỗi!</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-lg mb-6 shadow-sm">
                        <p className="font-bold">Thành công!</p>
                        <p className="text-sm">✓ Cập nhật thông tin hồ sơ thành công.</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center mb-8 border-b pb-6">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-blue-200 shadow-lg">
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
                                    className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1.5 shadow-lg border-2 border-white hover:bg-red-700 transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <div className="mt-4 w-full">
                            <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700 mb-2">
                                URL Ảnh Đại Diện
                            </label>
                            <input
                                type="text"
                                name="avatarUrl"
                                id="avatarUrl"
                                value={formData.avatarUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/avatar.jpg"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm transition"
                            />
                            <p className="text-xs text-gray-500 mt-1">Dán liên kết hình ảnh từ internet vào đây</p>
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm transition"
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
                            disabled={true} // Giữ nguyên không cho chỉnh sửa
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed shadow-sm"
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none shadow-sm transition"
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm transition"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium shadow-md"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
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