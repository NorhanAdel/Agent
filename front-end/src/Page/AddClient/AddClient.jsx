import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddClient() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    address: "",
    email: "",
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
      await axios.post("http://localhost:5000/api/add-client", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ تم إضافة العميل بنجاح");
      navigate("/clients");
    } catch (err) {
      console.error("Error adding client:", err);
      setError("حدث خطأ أثناء إضافة العميل ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 p-4 add-client-page">
      <h2 className="mb-4 fw-bold text-center">إضافة عميل جديد</h2>
      {error && <p className="text-danger text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">اسم العميل</label>
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
          <label className="form-label">اسم جهة الاتصال</label>
          <input
            type="text"
            className="form-control"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">رقم الهاتف</label>
          <input
            type="text"
            className="form-control"
            name="phone"
            value={formData.phone}
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
          />
        </div>

        <div className="col-12">
          <label className="form-label">العنوان</label>
          <input
            type="text"
            className="form-control"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="col-12 text-center mt-3">
          <button
            type="submit"
            className="btn btn-primary px-5"
            disabled={loading}
          >
            {loading ? "جاري الإضافة..." : "إضافة العميل"}
          </button>
        </div>
      </form>
    </div>
  );
}
