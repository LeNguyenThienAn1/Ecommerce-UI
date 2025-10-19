import React from "react";

/**
 * Component hiển thị danh sách đơn hàng dưới dạng bảng.
 * @param {object[]} orders - Mảng các đối tượng đơn hàng.
 * @param {Function} onView - Hàm callback được gọi khi nhấn nút "Xem", truyền vào orderId.
 * @param {Function} onApprove - Hàm callback được gọi khi nhấn nút "Duyệt".
 * @param {Function} onReject - Hàm callback được gọi khi nhấn nút "Từ chối".
 * @param {Function} onCancel - Hàm callback được gọi khi nhấn nút "Hủy".
 */
export default function OrderTable({ orders, onView, onApprove, onReject, onCancel }) {
  /**
   * Định dạng màu sắc cho các trạng thái đơn hàng.
   * @param {string} status - Trạng thái của đơn hàng.
   * @returns {string} - Tên class CSS của Tailwind.
   */
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-gray-200 text-gray-800";
      case "Approved":
        return "bg-blue-200 text-blue-800";
      case "Completed":
        return "bg-green-200 text-green-800";
      case "Cancelled":
      case "Rejected":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded-lg shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 border text-left">Mã đơn</th>
            <th className="px-4 py-3 border text-left">Người dùng</th>
            <th className="px-4 py-3 border text-right">Tổng tiền</th>
            <th className="px-4 py-3 border text-center">Trạng thái</th>
            <th className="px-4 py-3 border text-left">Ngày tạo</th>
            <th className="px-4 py-3 border text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2 font-mono text-sm">{order.id}</td>
              <td className="px-4 py-2">{order.username || "Không rõ"}</td>
              <td className="px-4 py-2 text-right font-medium">
                {order.totalAmount?.toLocaleString()} ₫
              </td>
              <td className="px-4 py-2 text-center">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(order.status)}`}>
                  {order.status}
                </span>
              </td>
              <td className="px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
              <td className="px-4 py-2 space-x-2 text-center">
                {/* Nút xem chi tiết */}
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  // ✅ THAY ĐỔI QUAN TRỌNG: Truyền order.id thay vì cả object order
                  onClick={() => onView(order.id)}
                >
                  Xem
                </button>

                {/* Hiển thị các nút thao tác tùy theo trạng thái */}
                {order.status === "Pending" && (
                  <>
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                      onClick={() => onApprove(order.id)}
                    >
                      Duyệt
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      onClick={() => onReject(order.id)}
                    >
                      Từ chối
                    </button>
                  </>
                )}

                {order.status === "Approved" && (
                  <button
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                    onClick={() => onCancel(order.id)}
                  >
                    Hủy
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}