import { useEffect, useState } from "react";
import { OrderApi } from "../../api/orderApi";
import OrderTable from "../../components/orders/OrderTable";
import OrderDetailModal from "../../components/orders/OrderDetailModal";

export default function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [loading, setLoading] = useState(false);

  // 📦 Lấy danh sách đơn hàng
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await OrderApi.getAll();
      setOrders(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách đơn hàng:", err);
      alert("Không thể tải danh sách đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔍 Xem chi tiết đơn hàng
  const handleViewDetails = async (orderId) => {
    setSelectedOrder(null);
    setIsLoadingDetail(true);
    try {
      const res = await OrderApi.getById(orderId);
      setSelectedOrder(res.data);
    } catch (err) {
      console.error(`❌ Lỗi khi tải chi tiết đơn hàng #${orderId}:`, err);
      alert("Không thể tải chi tiết đơn hàng!");
    } finally {
      setIsLoadingDetail(false);
    }
  };

  /**
   * ✅ Cập nhật trạng thái đơn hàng
   */
  const handleUpdateStatus = async (id, newStatus) => {
    if (!window.confirm(`Xác nhận đổi trạng thái đơn hàng sang "${newStatus}"?`)) return;
    try {
      await OrderApi.updateStatus(id, newStatus);
      alert("✅ Cập nhật trạng thái thành công!");
      await fetchOrders(); // Làm mới danh sách
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật trạng thái đơn hàng:", err);
      alert("❌ Cập nhật trạng thái thất bại!");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý đơn hàng</h1>

      {loading ? (
        <div className="text-center py-6">Đang tải dữ liệu...</div>
      ) : (
        <OrderTable
          orders={orders}
          onView={handleViewDetails}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {(selectedOrder || isLoadingDetail) && (
        <OrderDetailModal
          order={selectedOrder}
          isLoading={isLoadingDetail}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
