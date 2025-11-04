import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Activities() {
  const [role, setRole] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [activities, setActivities] = useState([]);
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({
    client: "",
    employee: "",
    range: "",
  });
  const [stats, setStats] = useState({
    upcoming: 0,
    finished: 0,
    clients: 0,
    totalAmount: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    if (!token) {
      navigate("/login");
      return;
    }
    setRole(userRole);
    fetchActivities(userRole, activeTab);
    if (userRole !== "employee") {
      fetchClients();
      fetchEmployees();
      fetchClientsCount();
    }
  }, [activeTab, filters]);

  const fetchClientsCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/clients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStats((prev) => ({ ...prev, clients: data.length }));
    } catch {}
  };

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/clients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setClients(data);
    } catch {}
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEmployees(data);
    } catch {}
  };

  const fetchActivities = async (userRole, statusParam = "upcoming") => {
    try {
      const token = localStorage.getItem("token");
      let query = `status=${statusParam}`;
      if (filters.client) query += `&client=${filters.client}`;
      if (filters.employee) query += `&employee=${filters.employee}`;
      if (filters.range) query += `&range=${filters.range}`;

      let url = "";
      if (userRole === "mainAdmin")
        url = `http://localhost:5000/api/activities/all?${query}`;
      else if (userRole === "agentAdmin")
        url = `http://localhost:5000/api/activities?${query}`;
      else url = `http://localhost:5000/api/my-activities?${query}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setActivities(data);
      const upcomingCount = data.filter((a) => a.status === "upcoming").length;
      const finishedCount = data.filter((a) => a.status === "finished").length;
      const totalAmount = data.reduce((sum, a) => sum + (a.amount || 0), 0);
      setStats((prev) => ({
        ...prev,
        upcoming: upcomingCount,
        finished: finishedCount,
        totalAmount,
      }));
    } catch {}
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا النشاط؟")) {
      try {
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:5000/api/activity/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchActivities(role, activeTab);
      } catch {}
    }
  };

  const renderButtons = () => {
    if (role === "mainAdmin") {
      return (
        <button
          className="btn btn-danger"
          onClick={() => navigate("/mainAdminDashboard")}
        >
          إضافة منظمة
        </button>
      );
    } else if (role === "agentAdmin") {
      return (
        <>
          <button
            className="btn btn-primary ms-2"
            onClick={() => navigate("/addactivity")}
          >
            إضافة نشاط
          </button>
          <button
            className="btn btn-success ms-2"
            onClick={() => navigate("/addemployee")}
          >
            إضافة موظف
          </button>
          <button
            className="btn btn-success ms-2"
            onClick={() => navigate("/addclient")}
          >
            إضافة عميل
          </button>
          <button
            className="btn btn-success ms-2"
            onClick={() => navigate("/employee/performance")}
          >
            تقارير الأداء
          </button>
          <button
            className="btn btn-success"
            onClick={() => navigate("/search")}
          >
            بحث عام
          </button>
        </>
      );
    }
    return null;
  };

  const renderStats = () => {
    if (role === "employee") {
      return (
        <div className="row text-center my-4">
          <div className="col-md-6 mb-3">
            <div className="card shadow-sm p-3">
              <h6 className="text-muted">الأنشطة القادمة</h6>
              <h3 className="text-primary">{stats.upcoming}</h3>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card shadow-sm p-3">
              <h6 className="text-muted">الأنشطة المنتهية</h6>
              <h3 className="text-success">{stats.finished}</h3>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="row text-center my-4">
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm p-3">
            <h6 className="text-muted">الأنشطة القادمة</h6>
            <h3 className="text-primary">{stats.upcoming}</h3>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm p-3">
            <h6 className="text-muted">الأنشطة المنتهية</h6>
            <h3 className="text-success">{stats.finished}</h3>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm p-3">
            <h6 className="text-muted">عدد العملاء</h6>
            <h3 className="text-warning">{stats.clients}</h3>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm p-3">
            <h6 className="text-muted">إجمالي المبالغ</h6>
            <h3 className="text-danger">{stats.totalAmount} ج.م</h3>
          </div>
        </div>
      </div>
    );
  };

  const renderTable = (title) => (
    <div className="mt-4">
      <table className="w-100 table table-striped table-bordered text-center align-middle">
        <thead>
          <tr>
            <th>رقم النشاط</th>
            <th>التاريخ</th>
            <th>اسم النشاط</th>
            <th>نوع النشاط</th>
            <th>العميل</th>
            <th>الموظف</th>
            <th>المبلغ</th>
            <th>الحالة</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {activities.length > 0 ? (
            activities.map((activity) => (
              <tr key={activity._id}>
                <td>{`ACT-${activity._id.slice(-5).toUpperCase()}`}</td>
                <td>
                  {activity.date
                    ? new Date(activity.date).toLocaleDateString("ar-EG")
                    : "—"}
                </td>
                <td>{activity.title}</td>
                <td>{activity.activityType?.name || "غير محدد"}</td>
                <td>{activity.client?.name || "غير محدد"}</td>
                <td>{activity.employee?.name || "غير محدد"}</td>
                <td>{activity.amount}</td>
                <td>{activity.status === "finished" ? "منتهى" : "قادم"}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm ms-2 me-2"
                    onClick={() => navigate(`/activity/${activity._id}`)}
                  >
                    التفاصيل
                  </button>
                  <button
                    className="btn btn-danger btn-sm "
                    onClick={() => handleDelete(activity._id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">لا توجد أنشطة {title}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container mt-3 p-2">
      <div className="d-flex justify-content-between align-items-center">
        <p className="fw-bolder fs-4">الأنشطة</p>
        <div>{renderButtons()}</div>
      </div>

      {renderStats()}

      <div className="filters d-flex flex-wrap gap-2 mb-3">
        <select
          className="form-select w-auto"
          onChange={(e) => setFilters({ ...filters, client: e.target.value })}
        >
          <option value="">كل العملاء</option>
          {clients.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          className="form-select w-auto"
          onChange={(e) => setFilters({ ...filters, employee: e.target.value })}
        >
          <option value="">كل الموظفين</option>
          {employees.map((e) => (
            <option key={e._id} value={e._id}>
              {e.name}
            </option>
          ))}
        </select>
        <select
          className="form-select w-auto"
          onChange={(e) => setFilters({ ...filters, range: e.target.value })}
        >
          <option value="">كل الأوقات</option>
          <option value="day">اليوم</option>
          <option value="week">الأسبوع</option>
          <option value="month">الشهر</option>
        </select>
      </div>

      <div className="activities mt-4">
        <div className="tabs d-flex justify-content-evenly mb-3">
          <button
            className={`btn ${
              activeTab === "upcoming" ? "btn-outline-primary" : "btn-light"
            }`}
            onClick={() => handleTabChange("upcoming")}
          >
            الأنشطة القادمة
          </button>
          <button
            className={`btn ${
              activeTab === "finished" ? "btn-outline-success" : "btn-light"
            }`}
            onClick={() => handleTabChange("finished")}
          >
            الأنشطة المنتهية
          </button>
        </div>
        {activeTab === "finished"
          ? renderTable("المنتهية")
          : renderTable("القادمة")}
      </div>
    </div>
  );
}
