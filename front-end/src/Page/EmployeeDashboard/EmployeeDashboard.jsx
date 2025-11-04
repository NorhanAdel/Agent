import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function EmployeeDashboard() {
  const [stats, setStats] = useState({
    upcoming: 0,
    finished: 0,
    clients: 0,
    totalAmount: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [period, setPeriod] = useState("month");
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    fetchChartData();
  }, [period]);

  const fetchStats = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/employee/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setStats(data);
  };

  const fetchChartData = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:5000/api/employee/chart?period=${period}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    setChartData(data);
  };

  return (
    <div className="container py-4">
      <h3 className="fw-bold text-success mb-4">لوحة تحكم الموظف</h3>

      <div className="row text-center mb-4">
        <div className="col-md-3 mb-3">
          <div className="card p-3 border-0 shadow-sm">
            <h6 className="text-muted">الأنشطة القادمة</h6>
            <h3 className="text-primary">{stats.upcoming}</h3>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card p-3 border-0 shadow-sm">
            <h6 className="text-muted">الأنشطة المنتهية</h6>
            <h3 className="text-success">{stats.finished}</h3>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card p-3 border-0 shadow-sm">
            <h6 className="text-muted">عدد العملاء</h6>
            <h3 className="text-warning">{stats.clients}</h3>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card p-3 border-0 shadow-sm">
            <h6 className="text-muted">إجمالي المبالغ</h6>
            <h3 className="text-danger">{stats.totalAmount} ج.م</h3>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold">تحليل الأداء</h5>
        <select
          className="form-select w-auto"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="month">آخر شهر</option>
          <option value="quarter">آخر 3 شهور</option>
          <option value="year">آخر سنة</option>
        </select>
      </div>

      <div className="card p-4 border-0 shadow-sm mb-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#198754" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-center">
        <button
          className="btn btn-success px-4"
          onClick={() => navigate("/employee/activities")}
        >
          عرض الأنشطة
        </button>
      </div>
    </div>
  );
}
