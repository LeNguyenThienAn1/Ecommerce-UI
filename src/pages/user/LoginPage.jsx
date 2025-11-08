import React, { useState } from "react";
import { Lock, User, Loader2, AlertCircle, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  // ✅ Chuẩn hóa số điện thoại về +84
  const formatPhone = (phone) => {
    const p = phone.trim();
    if (p.startsWith("0")) return "+84" + p.slice(1);
    if (p.startsWith("84") && !p.startsWith("+84")) return "+" + p;
    return p;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        // ✅ Gọi hàm login từ AuthContext
        await login({
          phoneNumber: formatPhone(phoneNumber),
          password,
        });
        navigate("/");
      } else {
        // ✅ Đăng ký tài khoản mới
        const res = await fetch("https://localhost:7165/api/Auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phoneNumber: formatPhone(phoneNumber),
            password,
            name,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.title || "Registration failed");
        }

        alert("Registration successful! Please log in.");
        setIsLogin(true);
      }
    } catch (err) {
      let message = "Something went wrong!";
      const msg = err?.message?.toLowerCase() || "";

      if (msg.includes("vô hiệu hóa")) message = "Tài khoản của bạn đã bị vô hiệu hóa.";
      else if (msg.includes("sai mật khẩu")) message = "Sai mật khẩu, vui lòng thử lại.";
      else if (msg.includes("không tồn tại")) message = "Số điện thoại chưa được đăng ký.";
      else if (err.response?.data?.title) message = err.response.data.title;

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "15px",
      }}
    >
      <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-6">
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-600 text-xs">
            {isLogin
              ? "Sign in with your phone number and password"
              : "Register with your phone number and password"}
          </p>
        </div>

        {error && (
          <div className="mb-3 p-2 bg-red-50 border-l-4 border-red-400 rounded">
            <div className="flex items-start">
              <AlertCircle className="w-3 h-3 text-red-400 mt-0.5 mr-2" />
              <p className="text-red-700 text-xs font-medium">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative mb-3">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                  <User className="h-3.5 w-3.5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full pl-8 pr-2.5 py-2.5 text-gray-900 placeholder-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                  required
                />
              </div>
            </>
          )}

          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Phone Number
          </label>
          <div className="relative mb-3">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <User className="h-3.5 w-3.5 text-gray-400" />
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full pl-8 pr-2.5 py-2.5 text-gray-900 placeholder-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
              required
            />
          </div>

          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Password
          </label>
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <Lock className="h-3.5 w-3.5 text-gray-400" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full pl-8 pr-2.5 py-2.5 text-gray-900 placeholder-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !phoneNumber || !password}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-2.5 px-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 text-xs shadow-lg transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-3 h-3 animate-spin mr-2" />
                {isLogin ? "Signing in..." : "Registering..."}
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <LogIn className="w-3 h-3 mr-2" />
                {isLogin ? "Sign In" : "Sign Up"}
              </div>
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-xs text-indigo-600 hover:underline"
          >
            {isLogin
              ? "Don't have an account? Register here"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
