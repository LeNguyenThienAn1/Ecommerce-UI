import React from "react";

/**
 * OrderTable component — displays all orders for the admin dashboard.
 * @param {object[]} orders - List of orders.
 * @param {Function} onView - Callback when "View" button is clicked.
 * @param {Function} onUpdateStatus - Callback when admin changes order status.
 */
export default function OrderTable({ orders, onView, onUpdateStatus }) {
  /**
   * Convert backend order status (enum) to readable label and color.
   */
  const getStatusDisplay = (status) => {
    switch (status) {
      case 0:
      case "Created":
        return { text: "Created", color: "bg-gray-200 text-gray-800" };
      case 1:
      case "SellerConfirmed":
        return { text: "Seller Confirmed", color: "bg-yellow-200 text-yellow-800" };
      case 2:
      case "PrepareShipping":
        return { text: "Preparing Shipment", color: "bg-blue-200 text-blue-800" };
      case 3:
      case "Rejected":
        return { text: "Rejected", color: "bg-red-200 text-red-800" };
      case 4:
      case "FailedShipping":
        return { text: "Failed to Deliver", color: "bg-orange-200 text-orange-800" };
      case 5:
      case "Successfully":
        return { text: "Delivered Successfully", color: "bg-green-200 text-green-800" };
      case 6:
      case "Paid":
        return { text: "Paid", color: "bg-teal-200 text-teal-800" };
      default:
        return { text: "Unknown", color: "bg-gray-100 text-gray-600" };
    }
  };

  /**
   * Status options for admin — values are numeric (match C# enum values)
   */
  const statusOptions = [
    { value: 1, label: "Seller Confirmed" },
    { value: 2, label: "Preparing Shipment" },
    { value: 5, label: "Delivered Successfully" },
    { value: 3, label: "Rejected" },
    { value: 4, label: "Failed to Deliver" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded-lg shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 border text-left">Order ID</th>
            <th className="px-4 py-3 border text-left">Customer</th>
            <th className="px-4 py-3 border text-right">Total</th>
            <th className="px-4 py-3 border text-center">Status</th>
            <th className="px-4 py-3 border text-left">Created Date</th>
            <th className="px-4 py-3 border text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center text-gray-500 py-6 italic">
                No orders found.
              </td>
            </tr>
          ) : (
            orders.map((order) => {
              const status = getStatusDisplay(order.status);
              const total =
                order.items?.reduce(
                  (sum, item) => sum + item.unitPrice * item.quantity,
                  0
                ) || 0;

              return (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-mono text-sm">{order.id}</td>
                  <td className="px-4 py-2">
                    {order.customerName || "Unknown"}
                  </td>
                  <td className="px-4 py-2 text-right font-medium">
                    {total.toLocaleString("en-US")} ₫
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
                      ? new Date(order.orderDate).toLocaleString("en-GB")
                      : "Unknown"}
                  </td>
                  <td className="px-4 py-2 text-center space-y-2">
                    {/* 🔍 View Details */}
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      onClick={() => onView(order.id)}
                    >
                      View
                    </button>

                    {/* 🔄 Update Order Status */}
                    <select
                      className="mt-2 px-2 py-1 border rounded text-sm"
                      defaultValue=""
                      onChange={(e) => {
                        const newStatus = parseInt(e.target.value, 10);
                        if (!isNaN(newStatus)) {
                          onUpdateStatus(order.id, newStatus);
                        }
                      }}
                    >
                      <option value="">-- Update Status --</option>
                      {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
