import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 text-gray-800 py-16 px-6">
      <div className="max-w-5xl mx-auto text-center space-y-10">
        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 drop-shadow-sm"
        >
          About TechStore
        </motion.h1>

        {/* Short description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
        >
          <span className="font-semibold text-blue-600">TechStore</span> is an
          e-commerce platform specializing in authentic technology products —
          from laptops and smartphones to components and accessories.  
          Our mission is to bring high-quality tech products to customers at the best prices.
        </motion.p>

        {/* Core values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid md:grid-cols-3 gap-8 mt-12 text-left"
        >
          <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all">
            <h3 className="text-xl font-bold text-blue-600 mb-3">100% Authentic</h3>
            <p className="text-gray-600 text-sm">
              All products are sourced from trusted distributors, ensuring clear origins and official warranties.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all">
            <h3 className="text-xl font-bold text-blue-600 mb-3">Dedicated Service</h3>
            <p className="text-gray-600 text-sm">
              Our support team is always ready to assist, answer your questions, and handle your requests promptly.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all">
            <h3 className="text-xl font-bold text-blue-600 mb-3">Best Prices & Deals</h3>
            <p className="text-gray-600 text-sm">
              TechStore regularly updates promotions, flash sales, and special offers for loyal customers.
            </p>
          </div>
        </motion.div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 text-gray-600 text-sm max-w-2xl mx-auto"
        >
          <p>
            📍 <strong>Address:</strong> 123 Tech Street, Son Tra, Da Nang City
          </p>
          <p>
            📞 <strong>Hotline:</strong> 1900 123 456  
          </p>
          <p>
            ✉️ <strong>Email:</strong> support@techstore.vn  
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
