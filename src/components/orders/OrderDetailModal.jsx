import React from "react";

/**
 * Component hiển thị chi tiết một đơn hàng trong một modal.
 * @param {object} order - Đối tượng chứa thông tin chi tiết đơn hàng.
 * @param {boolean} isLoading - Cờ cho biết dữ liệu đang được tải hay không.
 * @param {Function} onClose - Hàm callback để đóng modal.
 */
export default function OrderDetailModal({ order, isLoading, onClose }) {
  return (
    // Lớp phủ nền
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {/* Khung chứa nội dung modal */}
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl max-h-[90vh] flex flex-col">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-3">
          Chi tiết đơn hàng
        </h2>

        {/* Phần thân của modal, có thể cuộn nếu nội dung dài */}
        <div className="flex-grow overflow-y-auto pr-2">
          {isLoading ? (
            // Hiển thị khi đang tải dữ liệu
            <div className="flex items-center justify-center h-40">
              <p className="text-gray-500">Đang tải chi tiết...</p>
            </div>
          ) : (
            // Hiển thị khi đã có dữ liệu
            order && (
              <div className="space-y-2">
                <p>
                  <strong>ID:</strong> <span className="font-mono text-sm">{order.id}</span>
                </p>
                <p>
                  <strong>Người dùng:</strong> {order.userName}
                </p>
                <p>
                  <strong>Trạng thái:</strong> {order.status}
                </p>
                <p>
                  <strong>Tổng tiền:</strong>{" "}
                  <span className="font-bold text-lg text-red-600">
                    {order.totalAmount?.toLocaleString()} ₫
                  </span>
                </p>
                <p>
                  <strong>Ngày tạo:</strong> {new Date(order.createdAt).toLocaleString()}
                </p>

                <h3 className="mt-4 pt-4 border-t font-semibold text-gray-700">Sản phẩm đã đặt</h3>
                <ul className="list-disc ml-6 space-y-1">
                  {order.items?.map((item) => (
                    <li key={item.productId}>
                      {item.productName} × <strong>{item.quantity}</strong> —{" "}
                      <span className="font-medium">
                        {(item.price * item.quantity).toLocaleString()} ₫
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>

        {/* Phần chân modal */}
        <div className="text-right mt-6 pt-4 border-t">
          <button
            className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}