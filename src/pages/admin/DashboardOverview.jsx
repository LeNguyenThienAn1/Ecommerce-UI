import React, { useEffect, useState } from "react";
import { Package, ShoppingCart, Users, ShoppingBag, TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    users: 0,
    orders: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // === Products ===
        const resProducts = await fetch("https://localhost:7165/api/admin/Paging", {
          headers: { Accept: "text/plain" },
        });
        const textProducts = await resProducts.text();
        let productsData = [];
        try {
          const parsed = JSON.parse(textProducts);
          productsData = Array.isArray(parsed) ? parsed : parsed.$values || [];
        } catch (err) {
          console.error("Parse products error:", err, textProducts);
        }

        // === Categories ===
        const resCategories = await fetch("https://localhost:7165/api/admin/categories", {
          headers: { Accept: "text/plain" },
        });
        const textCategories = await resCategories.text();
        let categoriesData = [];
        try {
          const parsed = JSON.parse(textCategories);
          categoriesData = Array.isArray(parsed) ? parsed : parsed.$values || [];
        } catch (err) {
          console.error("Parse categories error:", err, textCategories);
        }

        // === Users ===
        const resUsers = await fetch("https://localhost:7165/api/users", {
          headers: { Accept: "text/plain" },
        });
        const textUsers = await resUsers.text();
        let usersData = [];
        try {
          const parsed = JSON.parse(textUsers);
          usersData = Array.isArray(parsed) ? parsed : parsed.$values || [];
        } catch (err) {
          console.error("Parse users error:", err, textUsers);
        }

        // === Orders ===
        const resOrders = await fetch("https://localhost:7165/api/order", {
          headers: { Accept: "text/plain" },
        });
        const textOrders = await resOrders.text();
        let ordersData = [];
        try {
          const parsed = JSON.parse(textOrders);
          ordersData = Array.isArray(parsed) ? parsed : parsed.$values || [];
        } catch (err) {
          console.error("Parse orders error:", err, textOrders);
        }

        // Update state
        setStats({
          products: productsData.length,
          categories: categoriesData.length,
          users: usersData.length,
          orders: ordersData.length,
        });
      } catch (error) {
        console.error("Error loading dashboard data", error);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: "Total Products",
      value: stats.products,
      icon: Package,
      gradient: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
      change: "+12.5%",
      isPositive: true,
    },
    {
      title: "Total Categories",
      value: stats.categories,
      icon: ShoppingCart,
      gradient: "from-emerald-500 to-emerald-600",
      bgLight: "bg-emerald-50",
      textColor: "text-emerald-600",
      change: "+8.2%",
      isPositive: true,
    },
    {
      title: "Total Users",
      value: stats.users,
      icon: Users,
      gradient: "from-purple-500 to-purple-600",
      bgLight: "bg-purple-50",
      textColor: "text-purple-600",
      change: "+23.1%",
      isPositive: true,
    },
    {
      title: "Total Orders",
      value: stats.orders,
      icon: ShoppingBag,
      gradient: "from-orange-500 to-orange-600",
      bgLight: "bg-orange-50",
      textColor: "text-orange-600",
      change: "+15.3%",
      isPositive: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.bgLight} p-3 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <div className="flex items-center gap-1">
                    {stat.isPositive ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-semibold ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value.toLocaleString()}</p>
                </div>
              </div>
              <div className={`h-1 bg-gradient-to-r ${stat.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
            </div>
          );
        })}
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Card */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <DollarSign className="w-6 h-6" />
            </div>
            <Activity className="w-5 h-5 opacity-80" />
          </div>
          <p className="text-white/90 text-sm mb-1">Total Revenue</p>
          <p className="text-3xl font-bold mb-2">$47,589</p>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+18.2% from last month</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Pending Orders</span>
              <span className="font-semibold text-gray-800">24</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Low Stock Items</span>
              <span className="font-semibold text-orange-600">8</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">New Customers</span>
              <span className="font-semibold text-green-600">156</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Conversion Rate</span>
              <span className="font-semibold text-blue-600">3.2%</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-800 font-medium">New order received</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-800 font-medium">Product updated</p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-800 font-medium">New user registered</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}