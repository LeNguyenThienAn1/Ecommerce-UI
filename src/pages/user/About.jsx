import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 text-gray-800 py-16 px-6 relative overflow-hidden">
      {/* Snowflakes background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 text-blue-200 text-5xl animate-pulse">❄️</div>
        <div className="absolute top-40 right-20 text-blue-300 text-4xl animate-pulse" style={{animationDelay: '1s'}}>❄️</div>
        <div className="absolute top-60 left-1/4 text-blue-200 text-6xl animate-pulse" style={{animationDelay: '2s'}}>❄️</div>
        <div className="absolute bottom-40 right-1/3 text-blue-300 text-5xl animate-pulse" style={{animationDelay: '0.5s'}}>❄️</div>
        <div className="absolute bottom-20 left-1/3 text-blue-200 text-4xl animate-pulse" style={{animationDelay: '1.5s'}}>❄️</div>
      </div>

      <div className="max-w-5xl mx-auto text-center space-y-10 relative z-10">
        {/* Christmas decorations */}
        <div className="flex justify-center gap-8 text-5xl mb-8">
          <span className="animate-pulse">🎄</span>
          <span className="animate-pulse" style={{animationDelay: '0.5s'}}>🎅</span>
          <span className="animate-pulse" style={{animationDelay: '1s'}}>⛄</span>
          <span className="animate-pulse" style={{animationDelay: '1.5s'}}>🎁</span>
        </div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 drop-shadow-lg"
        >
          🎄 About TechStore 🎁
        </motion.h1>

        {/* Short description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-blue-200 relative"
        >
          <div className="absolute -top-4 -left-4 text-4xl">🎄</div>
          <div className="absolute -top-4 -right-4 text-4xl">🎁</div>
          
          <p className="text-lg md:text-xl text-blue-700 max-w-3xl mx-auto leading-relaxed">
            <span className="font-bold text-blue-600 text-2xl">🎅 TechStore</span> is an
            e-commerce platform specializing in authentic technology products —
            from laptops and smartphones to components and accessories.  
            Our mission is to bring high-quality tech products to customers at the best prices.
          </p>
        </motion.div>

        {/* Core values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid md:grid-cols-3 gap-8 mt-12 text-left"
        >
          <div className="p-8 bg-white rounded-3xl shadow-xl border-4 border-blue-200 hover:shadow-2xl hover:scale-105 transition-all relative overflow-hidden group">
            <div className="absolute -top-2 -right-2 text-3xl opacity-50 group-hover:opacity-100 transition-opacity">✨</div>
            <div className="text-5xl mb-4">🎁</div>
            <h3 className="text-2xl font-black text-blue-600 mb-3">100% Authentic</h3>
            <p className="text-blue-700 text-base font-medium">
              All products are sourced from trusted distributors, ensuring clear origins and official warranties.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl shadow-xl border-4 border-blue-200 hover:shadow-2xl hover:scale-105 transition-all relative overflow-hidden group">
            <div className="absolute -top-2 -right-2 text-3xl opacity-50 group-hover:opacity-100 transition-opacity">⭐</div>
            <div className="text-5xl mb-4">🎅</div>
            <h3 className="text-2xl font-black text-blue-600 mb-3">Dedicated Service</h3>
            <p className="text-blue-700 text-base font-medium">
              Our support team is always ready to assist, answer your questions, and handle your requests promptly.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl shadow-xl border-4 border-blue-200 hover:shadow-2xl hover:scale-105 transition-all relative overflow-hidden group">
            <div className="absolute -top-2 -right-2 text-3xl opacity-50 group-hover:opacity-100 transition-opacity">💫</div>
            <div className="text-5xl mb-4">🎄</div>
            <h3 className="text-2xl font-black text-blue-600 mb-3">Best Prices & Deals</h3>
            <p className="text-blue-700 text-base font-medium">
              TechStore regularly updates promotions, flash sales, and special offers for loyal customers.
            </p>
          </div>
        </motion.div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-3xl p-8 shadow-2xl border-4 border-blue-200 relative"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-4xl">⛄</div>
          
          <h3 className="text-2xl font-black text-blue-800 mb-6 flex items-center justify-center gap-2">
            📞 Contact Us
          </h3>
          
          <div className="text-blue-700 text-base space-y-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 bg-white rounded-full px-6 py-3 shadow-md border-2 border-blue-200">
              <span className="text-2xl">📍</span>
              <p className="font-semibold">
                <strong>Address:</strong> 123 Tech Street, Son Tra, Da Nang City
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-3 bg-white rounded-full px-6 py-3 shadow-md border-2 border-blue-200">
              <span className="text-2xl">📞</span>
              <p className="font-semibold">
                <strong>Hotline:</strong> 1900 123 456
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-3 bg-white rounded-full px-6 py-3 shadow-md border-2 border-blue-200">
              <span className="text-2xl">✉️</span>
              <p className="font-semibold">
                <strong>Email:</strong> support@techstore.vn
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer decoration */}
        <div className="flex justify-center gap-6 text-4xl mt-12">
          <span className="animate-pulse">🎁</span>
          <span className="animate-pulse" style={{animationDelay: '0.3s'}}>❄️</span>
          <span className="animate-pulse" style={{animationDelay: '0.6s'}}>🎄</span>
          <span className="animate-pulse" style={{animationDelay: '0.9s'}}>⛄</span>
          <span className="animate-pulse" style={{animationDelay: '1.2s'}}>🎅</span>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default About;