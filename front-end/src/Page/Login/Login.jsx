import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import logo from "../../assests/photo_2024-05-07_22-59-12.jpg";
import IMG from "../../assests/photo_2024-05-07_21-14-05.jpg";

export const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/login", formData);

       
      const { token, role, agentId } = res.data;

      if (!token || !role) {
        throw new Error("الرد من السيرفر غير مكتمل.");
      }

       
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("agentId", agentId || "");

      alert("تم تسجيل الدخول بنجاح ✅");

       
      if (role === "mainAdmin") {
        window.location.replace("/mainAdminDashboard");
      } else if (role === "agentAdmin") {
        window.location.replace("/activites");
      } else if (role === "employee") {
        window.location.replace("/employeeDashboard");
      } else {
        setError("دور المستخدم غير معروف  ");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("الإيميل أو الرقم السري غير صحيح  ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login_page">
      <img src={IMG} className="login_bg" alt="background" />
      <div className="login_form">
        <h1 className="form_title">تسجيل الدخول</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="ادخل البريد الإلكتروني"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="ادخل الرقم السري"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" className="login_btn" disabled={loading}>
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
};
