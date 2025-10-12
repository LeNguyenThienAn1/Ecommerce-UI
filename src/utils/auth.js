import axios from "axios";

// 🔄 Làm mới token
export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  try {
    const res = await axios.post("https://localhost:7165/api/Auth/refresh-token", {
      refreshToken,
    });

    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    return res.data.accessToken;
  } catch (err) {
    console.error("Refresh token failed:", err.response?.data || err.message);
    localStorage.clear();
    window.location.href = "/login";
    return null;
  }
};

// 🚪 Đăng xuất
export const logout = async (navigate) => {
  const refreshToken = localStorage.getItem("refreshToken");

  try {
    await axios.post("https://localhost:7165/api/Auth/logout", { refreshToken });
  } catch (err) {
    console.error("Logout failed:", err.response?.data || err.message);
  } finally {
    localStorage.clear();
    navigate("/login");
  }
};
