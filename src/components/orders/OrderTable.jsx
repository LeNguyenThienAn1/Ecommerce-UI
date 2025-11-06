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
   * Chuyển đổi mã trạng thái (số) thành chữ + màu tương ứng.
   * @param {number} status - Mã trạng thái đơn hàng.
   * @returns {object} - Gồm text hiển thị và class màu Tailwind.
   */
  const getStatusDisplay = (status) => {
    switch (status) {
      case 0:
        return { text: "Chờ xử lý", color: "bg-gray-200 text-gray-800" };
      case 1:
        return { text: "Đã duyệt", color: "bg-blue-200 text-blue-800" };
      case 2:
        return { text: "Hoàn tất", color: "bg-green-200 text-green-800" };
      case 3:
        return { text: "Đã hủy", color: "bg-red-200 text-red-800" };
      case 4:
        return { text: "Bị từ chối", color: "bg-red-300 text-red-900" };
      default:
        return { text: "Không rõ", color: "bg-gray-100 text-gray-600" };
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded-lg shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 border text-left">Mã đơn</th>
            <th className="px-4 py-3 border text-left">Khách hàng</th>
            <th className="px-4 py-3 border text-right">Tổng tiền</th>
            <th className="px-4 py-3 border text-center">Trạng thái</th>
            <th className="px-4 py-3 border text-left">Ngày tạo</th>
            <th className="px-4 py-3 border text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const status = getStatusDisplay(order.status);
            const total = order.items?.reduce(
              (sum, item) => sum + item.unitPrice * item.quantity,
              0
            );

            return (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 font-mono text-sm">{order.id}</td>
                <td className="px-4 py-2">{order.customerName || "Không rõ"}</td>
                <td className="px-4 py-2 text-right font-medium">
                  {total?.toLocaleString()} ₫
                </td>
                <td className="px-4 py-2 text-center">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}
                  >
                    {status.text}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {order.orderDate
                    ? new Date(order.orderDate).toLocaleString()
                    : "Không rõ"}
                </td>
                <td className="px-4 py-2 space-x-2 text-center">
                  {/* Nút xem chi tiết */}
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    onClick={() => onView(order.id)}
                  >
                    Xem
                  </button>

                  {/* Các nút thao tác tùy trạng thái */}
                  {order.status === 0 && (
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

                  {order.status === 1 && (
                    <button
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                      onClick={() => onCancel(order.id)}
                    >
                      Hủy
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
