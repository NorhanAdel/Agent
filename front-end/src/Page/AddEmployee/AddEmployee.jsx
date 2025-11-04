import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddEmployee() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/add-employee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "حدث خطأ أثناء الإضافة");

      alert("✅ تم إضافة الموظف بنجاح");
      navigate("/employees");
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء الإضافة ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 p-4">
      <h2 className="mb-4 fw-bold text-center text-success">إضافة موظف جديد</h2>

      {error && <p className="text-danger text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="row g-3 justify-content-center">
        <div className="col-md-6">
          <label className="form-label">اسم الموظف</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">البريد الإلكتروني</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">كلمة المرور</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-12 text-center mt-3">
          <button
            type="submit"
            className="btn btn-success px-5"
            disabled={loading}
          >
            {loading ? "جاري الإضافة..." : "إضافة الموظف"}
          </button>
        </div>
      </form>
    </div>
  );
}
