import { useEffect, useState } from "react";
import { OrderApi } from "../../api/orderApi"; // Đảm bảo đường dẫn này đúng
import OrderTable from "../../components/orders/OrderTable";
import OrderDetailModal from "../../components/orders/OrderDetailModal";

export default function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false); // State mới để quản lý tải modal

  /**
   * Tải danh sách tóm tắt tất cả đơn hàng từ API.
   */
  const fetchOrders = async () => {
    try {
      const res = await OrderApi.getAll();
      setOrders(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách đơn hàng:", err);
      //
    }
  };

  // Tải danh sách đơn hàng khi component được render lần đầu
  useEffect(() => {
    fetchOrders();
  }, []);

  /**
   * Xử lý khi người dùng nhấn nút "Xem".
   * Gọi API để lấy thông tin chi tiết của một đơn hàng cụ thể.
   * @param {string} orderId - ID của đơn hàng cần xem.
   */
  const handleViewDetails = async (orderId) => {
    setSelectedOrder(null); // Xóa dữ liệu cũ (nếu có)
    setIsLoadingDetail(true);
    try {
      const res = await OrderApi.getById(orderId);
      setSelectedOrder(res.data); // Cập nhật state với dữ liệu chi tiết
    } catch (err) {
      console.error(`❌ Lỗi khi tải chi tiết đơn hàng #${orderId}:`, err);
    } finally {
      setIsLoadingDetail(false); // Luôn tắt trạng thái tải sau khi xong
    }
  };

  /**
   * Hàm trợ giúp để cập nhật trạng thái đơn hàng (Duyệt, Từ chối, Hủy).
   * @param {Function} apiCall - Hàm API cần gọi (vd: OrderApi.approve).
   * @param {string} id - ID của đơn hàng.
   */
  const updateOrderStatus = async (apiCall, id) => {
    try {
      await apiCall(id);
      fetchOrders(); // Tải lại danh sách để cập nhật giao diện
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật trạng thái đơn hàng:", err);
    }
  };

  // Các hàm xử lý sự kiện cho các nút, sử dụng hàm trợ giúp ở trên
  const handleApprove = (id) => updateOrderStatus(OrderApi.approve, id);
  const handleReject = (id) => updateOrderStatus(OrderApi.reject, id);
  const handleCancel = (id) => updateOrderStatus(OrderApi.cancel, id);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý đơn hàng</h1>
      <OrderTable
        orders={orders}
        onView={handleViewDetails} // Sử dụng hàm mới
        onApprove={handleApprove}
        onReject={handleReject}
        onCancel={handleCancel}
      />

      {/* Hiển thị Modal khi có một đơn hàng được chọn HOẶC đang trong quá trình tải.
        Điều này giúp modal không bị "nháy" khi người dùng click xem đơn hàng khác.
      */}
      {(selectedOrder || isLoadingDetail) && (
        <OrderDetailModal
          order={selectedOrder}
          isLoading={isLoadingDetail} // Truyền trạng thái loading
          onClose={() => setSelectedOrder(null)} // Hàm để đóng modal
        />
      )}
    </div>
  );
}