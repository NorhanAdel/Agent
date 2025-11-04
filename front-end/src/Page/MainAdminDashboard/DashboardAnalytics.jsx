import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function DashboardAnalytics() {
  const [stats, setStats] = useState({
    orgs: 0,
    clients: 0,
    activities: 0,
    totalAmount: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [filter, setFilter] = useState("month");
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    handleFilterChange(filter);
  }, [filter]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("خطأ في جلب الإحصائيات:", error);
    }
  };

  const handleFilterChange = (type) => {
    setFilter(type);
    if (type === "month") {
      setChartData([
        { name: "يناير", clients: 10, activities: 5, amount: 20000 },
        { name: "فبراير", clients: 15, activities: 8, amount: 25000 },
        { name: "مارس", clients: 20, activities: 12, amount: 30000 },
        { name: "إبريل", clients: 25, activities: 15, amount: 40000 },
      ]);
    } else if (type === "quarter") {
      setChartData([
        { name: "الربع 1", clients: 45, activities: 30, amount: 75000 },
        { name: "الربع 2", clients: 60, activities: 45, amount: 110000 },
        { name: "الربع 3", clients: 80, activities: 55, amount: 150000 },
        { name: "الربع 4", clients: 95, activities: 70, amount: 180000 },
      ]);
    } else if (type === "year") {
      setChartData([
        { name: "2022", clients: 200, activities: 150, amount: 400000 },
        { name: "2023", clients: 250, activities: 180, amount: 520000 },
        { name: "2024", clients: 310, activities: 220, amount: 640000 },
        { name: "2025", clients: 380, activities: 260, amount: 800000 },
      ]);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-success">لوحة التحليلات</h3>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/mainAdminDashboard")}
        >
          رجوع للوحة الأدمن
        </button>
      </div>

      <div className="row g-4 text-center">
        <div className="col-md-3">
          <div className="card border p-4">
            <h6 className="text-muted">عدد المنظمات</h6>
            <h2 className="text-primary fw-bold">{stats.orgs}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border p-4">
            <h6 className="text-muted">عدد العملاء</h6>
            <h2 className="text-warning fw-bold">{stats.clients}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border p-4">
            <h6 className="text-muted">عدد الأنشطة</h6>
            <h2 className="text-success fw-bold">{stats.activities}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border p-4">
            <h6 className="text-muted">إجمالي المبالغ</h6>
            <h2 className="text-danger fw-bold">
              {stats.totalAmount?.toLocaleString()} ج.م
            </h2>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold text-secondary">تحليل الأداء</h5>
          <div className="d-flex gap-2">
            <button
              className={`btn ${
                filter === "month" ? "btn-success" : "btn-outline-success"
              } rounded-btn`}
              onClick={() => handleFilterChange("month")}
            >
              شهري
            </button>

            <button
              className={`btn ${
                filter === "quarter" ? "btn-success" : "btn-outline-success"
              } rounded-btn`}
              onClick={() => handleFilterChange("quarter")}
            >
              ربع سنوي
            </button>

            <button
              className={`btn ${
                filter === "year" ? "btn-success" : "btn-outline-success"
              } rounded-btn`}
              onClick={() => handleFilterChange("year")}
            >
              سنوي
            </button>
          </div>
        </div>

        <div
          className="card border p-4"
          style={{ height: "400px", background: "#fff" }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="clients"
                stroke="#f1c40f"
                strokeWidth={2}
                name="عدد العملاء"
              />
              <Line
                type="monotone"
                dataKey="activities"
                stroke="#2ecc71"
                strokeWidth={2}
                name="عدد الأنشطة"
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#e74c3c"
                strokeWidth={2}
                name="المبالغ (ج.م)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
