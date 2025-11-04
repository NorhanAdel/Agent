import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EmployeeActivities() {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    filterByStatus();
  }, [activeTab, activities]);

  useEffect(() => {
    handleSearch();
  }, [searchQuery]);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/employee/activities", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error("فشل في جلب الأنشطة");
        return;
      }

      const data = await res.json();
      setActivities(data);
      filterByStatus(data);
    } catch (error) {
      console.error("حدث خطأ أثناء جلب الأنشطة:", error);
    }
  };

  const filterByStatus = (dataList = activities) => {
    const filtered = dataList.filter((a) => a.status === activeTab);
    setFilteredActivities(filtered);
  };

  const handleSearch = () => {
    let filtered = activities.filter((a) => a.status === activeTab);

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((a) =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredActivities(filtered);
  };

  const renderTable = (title) => (
    <div className="mt-4">
      <table className="table table-striped table-bordered text-center align-middle">
        <thead className="table-success">
          <tr>
            <th>اسم النشاط</th>
            <th>التاريخ</th>
            <th>المبلغ</th>
            <th>العميل</th>
            <th>الحالة</th>
            <th>الإجراء</th>
          </tr>
        </thead>
        <tbody>
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <tr key={activity._id}>
                <td>{activity.title}</td>
                <td>
                  {activity.date
                    ? new Date(activity.date).toLocaleDateString("ar-EG")
                    : "—"}
                </td>
                <td>{activity.amount} ج.م</td>
                <td>{activity.client?.name || "غير محدد"}</td>
                <td>{activity.status === "finished" ? "منتهى" : "قادم"}</td>
                <td>
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() =>
                      navigate(`/employee/activity/${activity._id}`)
                    }
                  >
                    عرض التفاصيل
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">لا توجد أنشطة {title}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold text-success">أنشطة الموظف</h3>
        <div className="d-flex align-items-center">
          <input
            type="text"
            className="form-control me-2"
            placeholder="ابحث عن نشاط..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "250px" }}
          />
          <button className="btn btn-success" onClick={handleSearch}>
            بحث
          </button>
        </div>
      </div>

      <div className="d-flex justify-content-evenly mb-3">
        <button
          className={`btn ${
            activeTab === "upcoming"
              ? "btn-outline-success"
              : "btn-light border"
          }`}
          onClick={() => setActiveTab("upcoming")}
          style={{ borderRadius: "6px" }}
        >
          الأنشطة القادمة
        </button>
        <button
          className={`btn ${
            activeTab === "finished"
              ? "btn-outline-success"
              : "btn-light border"
          }`}
          onClick={() => setActiveTab("finished")}
          style={{ borderRadius: "6px" }}
        >
          الأنشطة المنتهية
        </button>
      </div>

      {activeTab === "upcoming"
        ? renderTable("القادمة")
        : renderTable("المنتهية")}
    </div>
  );
}
