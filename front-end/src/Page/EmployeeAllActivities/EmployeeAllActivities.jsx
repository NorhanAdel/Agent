import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function EmployeeAllActivities() {
  const { id } = useParams();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/employee/${id}/all-activities`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("فشل تحميل البيانات");
      const result = await res.json();
      setActivities(result);
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء تحميل الأنشطة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold text-success mb-3">كل الأنشطة الخاصة بالموظف</h3>
        <button
          className="btn btn-outline-success  "
          onClick={() => navigate("/activites")}
        >
          الرئيسه
        </button>
      </div>
      {loading && <p>جارٍ التحميل...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && (
        <div className="table-responsive">
          <table className="table align-middle text-center">
            <thead style={{ backgroundColor: "#198754", color: "white" }}>
              <tr>
                <th>اسم النشاط</th>
                <th>الحالة</th>
                <th>التاريخ</th>
                <th>المبلغ</th>
              </tr>
            </thead>
            <tbody>
              {activities.length > 0 ? (
                activities.map((act) => (
                  <tr key={act._id}>
                    <td>{act.title}</td>
                    <td>{act.status === "finished" ? "منتهية" : "قادمة"}</td>
                    <td>{new Date(act.date).toLocaleDateString()}</td>
                    <td>{act.amount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-3">
                    لا توجد أنشطة
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
