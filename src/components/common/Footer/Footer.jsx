import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Phần link chính */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Cột 1: Về TechStore */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">TechStore</h3>
            <p className="text-slate-400 text-sm">
              Cửa hàng chuyên cung cấp các thiết bị điện tử, công nghệ chính hãng với giá tốt nhất.
            </p>
          </div>

          {/* Cột 2: Sản phẩm */}
          <div className="space-y-4">
            <h3 className="font-bold tracking-wider uppercase">Sản phẩm</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products?category=phones" className="text-slate-400 hover:text-white">Điện thoại</Link></li>
              <li><Link to="/products?category=laptops" className="text-slate-400 hover:text-white">Laptop</Link></li>
              <li><Link to="/products?category=tablets" className="text-slate-400 hover:text-white">Máy tính bảng</Link></li>
              <li><Link to="/products?category=accessories" className="text-slate-400 hover:text-white">Phụ kiện</Link></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div className="space-y-4">
            <h3 className="font-bold tracking-wider uppercase">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="text-slate-400 hover:text-white">Liên hệ</Link></li>
              <li><Link to="/faq" className="text-slate-400 hover:text-white">Câu hỏi thường gặp</Link></li>
              <li><Link to="/shipping-policy" className="text-slate-400 hover:text-white">Chính sách vận chuyển</Link></li>
              <li><Link to="/return-policy" className="text-slate-400 hover:text-white">Chính sách đổi trả</Link></li>
            </ul>
          </div>

          {/* Cột 4: Đăng ký nhận tin */}
          <div className="space-y-4">
            <h3 className="font-bold tracking-wider uppercase">Đăng ký nhận tin</h3>
            <p className="text-slate-400 text-sm">Nhận thông tin về sản phẩm mới và khuyến mãi đặc biệt.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="w-full px-4 py-2 text-black rounded-l-md focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-r-md hover:bg-blue-700"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>

        {/* Phần dưới cùng: Copyright và Social */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-slate-500 mb-4 sm:mb-0">
            &copy; {new Date().getFullYear()} TechStore. All Rights Reserved.
          </p>
          <div className="flex space-x-4">
            {/* Thêm icon social media ở đây */}
            <a href="#" className="text-slate-500 hover:text-white">Facebook</a>
            <a href="#" className="text-slate-500 hover:text-white">Instagram</a>
            <a href="#" className="text-slate-500 hover:text-white">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;