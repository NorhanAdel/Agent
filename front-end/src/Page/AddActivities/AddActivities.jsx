import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddActivities() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    amount: "",
    activityType: "",
    client: "",
    employee: "",
    status: "upcoming",
  });
  const [activityTypes, setActivityTypes] = useState([]);
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchInitialData = async () => {
      try {
        const [typesRes, clientsRes, employeesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/activity-types", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/clients", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/employees", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setActivityTypes(typesRes.data);
        setClients(clientsRes.data);
        setEmployees(employeesRes.data);
      } catch (err) {
        console.error("Error fetching select data:", err);
        setError("حدث خطأ أثناء تحميل البيانات");
      }
    };

    fetchInitialData();
  }, [navigate]);

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
      await axios.post("http://localhost:5000/api/add-activity", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("تم إضافة النشاط بنجاح");
      navigate("/activites");
    } catch (err) {
      console.error("Error adding activity:", err);
      setError("حدث خطأ أثناء إضافة النشاط");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 p-4 add-activity-page">
      <h2 className="mb-4 fw-bold text-center">إضافة نشاط جديد</h2>

      {error && <p className="text-danger text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">اسم النشاط</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">المبلغ</label>
          <input
            type="number"
            className="form-control"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">تاريخ النشاط</label>
          <input
            type="date"
            className="form-control"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">نوع النشاط</label>
          <select
            name="activityType"
            className="form-control"
            value={formData.activityType}
            onChange={handleChange}
            required
          >
            <option value="">اختر نوع النشاط...</option>
            {activityTypes.map((type) => (
              <option key={type._id} value={type._id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">العميل</label>
          <select
            name="client"
            className="form-control"
            value={formData.client}
            onChange={handleChange}
            required
          >
            <option value="">اختر العميل...</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">الموظف المسؤول</label>
          <select
            name="employee"
            className="form-control"
            value={formData.employee}
            onChange={handleChange}
            required
          >
            <option value="">اختر الموظف...</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">حالة النشاط</label>
          <select
            name="status"
            className="form-control"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="upcoming">قادم</option>
            <option value="finished">منتهى</option>
          </select>
        </div>

        <div className="col-12">
          <label className="form-label">الوصف</label>
          <textarea
            name="description"
            className="form-control"
            rows="3"
            placeholder="أدخل وصف النشاط (اختياري)"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="col-12 text-center mt-3">
          <button
            type="submit"
            className="btn btn-primary px-5"
            disabled={loading}
          >
            {loading ? "جاري الإضافة..." : "إضافة النشاط"}
          </button>
        </div>
      </form>
    </div>
  );
}
