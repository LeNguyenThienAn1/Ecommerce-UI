import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const [orderInfo, setOrderInfo] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const resultCode = params.get("resultCode");
    const orderId = params.get("orderId");
    const message = params.get("message");

    if (resultCode === "0") {
      setOrderInfo({
        orderId,
        message: decodeURIComponent(message || "Thanh toán thành công!"),
      });
    } else {
      // Nếu thanh toán thất bại, quay lại giỏ hàng
      navigate("/cart"); 
    }
  }, [navigate]);

  // Hàm xử lý khi nhấn nút "Xem đơn hàng của bạn"
  const handleViewOrder = () => {
    // 💡 SỬA ĐỔI QUAN TRỌNG: Thay navigate bằng window.location.replace
    // để buộc trang /cart tải lại hoàn toàn, đảm bảo đọc lại Local Storage.
    // LƯU Ý: Lý tưởng là chuyển đến trang chi tiết đơn hàng (/orders/orderId)
    // nhưng theo yêu cầu của bạn, chúng ta chuyển về /cart.
    window.location.replace("/cart");
  };

  if (!orderInfo) return <div className="text-center mt-10">Đang xử lý...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          🎉 Thanh toán thành công!
        </h1>
        <p className="text-gray-700 mb-2">
          Cảm ơn bạn đã mua hàng tại <b>ElectroShop</b> 💙
        </p>
        <p className="text-gray-600">
          Mã đơn hàng: <b>{orderInfo.orderId}</b>
        </p>
        <p className="text-gray-500 mt-2">{orderInfo.message}</p>

        <button
          onClick={handleViewOrder} // Gọi hàm mới
          className="mt-6 bg-green-500 text-black px-6 py-2 rounded-lg hover:bg-green-600 transition"
        >
          Xem đơn hàng của bạn
        </button>
      </div>
    </div>
  );
}