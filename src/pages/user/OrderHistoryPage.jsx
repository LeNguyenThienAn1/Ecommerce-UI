import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, ShoppingBag } from 'lucide-react';

const OrderHistoryPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Chỉ fetch khi đã xác thực và có user.id
    if (!isAuthenticated || !user?.id) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await fetch(`https://localhost:7165/api/Order/user/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Không thể tải lịch sử đơn hàng.');
        }
        
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user]);

  const renderStatusBadge = (status) => {
    const styles = {
      Created: "bg-blue-100 text-blue-800",
      SellerConfirmed: "bg-yellow-100 text-yellow-800",
      Shipping: "bg-indigo-100 text-indigo-800",
      Completed: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
      FailedShipping: "bg-gray-100 text-gray-800",
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || styles.FailedShipping}`}>
        {status}
      </span>
    );
  };
  
  // Các trạng thái giao diện
  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin w-8 h-8 text-blue-600" /></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center p-10">
        <p>Vui lòng đăng nhập để xem lịch sử đơn hàng.</p>
        <button onClick={() => navigate('/login')} className="text-blue-600 mt-2 font-semibold">
          Đến trang đăng nhập
        </button>
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-10 text-red-600 flex items-center justify-center gap-2"><AlertCircle /> {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto my-10 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Lịch Sử Đơn Hàng</h1>
      {orders.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg">
           <ShoppingBag className="mx-auto w-12 h-12 text-gray-400 mb-4" />
          <p className="text-gray-600">Bạn chưa có đơn hàng nào.</p>
          <Link to="/products" className="text-blue-600 mt-2 font-semibold inline-block">
            Bắt đầu mua sắm ngay!
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => {
            const total = order.details.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
            return (
              <div key={order.id} className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Mã đơn hàng</p>
                    <p className="font-mono text-lg font-semibold text-gray-800">{order.id}</p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    {renderStatusBadge(order.status)}
                  </div>
                </div>
                <div className="border-t pt-4 space-y-2">
                   <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ngày đặt:</span>
                    <span className="text-gray-800 font-medium">{new Date(order.orderDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Số sản phẩm:</span>
                    <span className="text-gray-800 font-medium">{order.details.length}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-700">Tổng cộng:</span>
                    <span className="text-green-600">{total.toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;