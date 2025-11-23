import { useEffect, useState, useMemo } from "react";
import { OrderApi } from "../../api/orderApi";
import OrderTable from "../../components/orders/OrderTable";
import OrderDetailModal from "../../components/orders/OrderDetailModal";

export default function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // 📦 Lấy danh sách đơn hàng
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await OrderApi.getAll();
      // Sort orders by date, newest first
      const sortedOrders = res.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      setOrders(sortedOrders);
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

  // Memoize filtered and searched orders
  const displayedOrders = useMemo(() => {
    return orders
      .filter(order => {
        // Filter by status
        if (statusFilter === "All") return true;
        return order.status === parseInt(statusFilter);
      })
      .filter(order => {
        // Search by term
        const term = searchTerm.toLowerCase();
        if (!term) return true;
        return (
          order.id.toLowerCase().includes(term) ||
          (order.customerName && order.customerName.toLowerCase().includes(term))
        );
      });
  }, [orders, searchTerm, statusFilter]);

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
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4">Quản lý đơn hàng</h1>

      {/* Search and Filter UI */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center mb-4 bg-white p-4 rounded-lg shadow-sm gap-4">
        <input
          type="text"
          placeholder="Search by Order ID or Customer..."
          className="border p-2 rounded-md w-full md:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border p-2 rounded-md w-full md:w-auto"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="0">Created</option>
          <option value="1">Seller Confirmed</option>
          <option value="2">Preparing Shipment</option>
          <option value="5">Delivered Successfully</option>
          <option value="6">Paid</option>
          <option value="3">Rejected</option>
          <option value="4">Failed to Deliver</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-6">Đang tải dữ liệu...</div>
      ) : (
        <OrderTable
          orders={displayedOrders}
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
