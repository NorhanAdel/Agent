import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PerformanceReports() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:5000/api/employee/performance",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("فشل تحميل البيانات");

      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء تحميل التقارير");
    } finally {
      setLoading(false);
    }
  };

  const totalAmountSum = data.reduce((sum, emp) => sum + emp.totalAmount, 0);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="fw-bold text-success mb-3">تقارير الأداء للموظفين</h3>
        <button
          className="btn btn-outline-success"
          onClick={() => navigate("/activites")}
        >
          الرئيسه
        </button>
      </div>

      {loading && <p>جارٍ التحميل...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && (
        <div className="table-responsive">
          <table
            className="table align-middle text-center"
            style={{
              border: "1px solid #dee2e6",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <thead style={{ backgroundColor: "#198754", color: "white" }}>
              <tr>
                <th>اسم الموظف</th>
                <th>البريد الإلكتروني</th>
                <th>الأنشطة القادمة</th>
                <th>الأنشطة المنتهية</th>
                <th>إجمالي المبالغ (ج.م)</th>
                <th>عرض التفاصيل</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                <>
                  {data.map((emp) => (
                    <tr
                      key={emp._id}
                      style={{ borderBottom: "1px solid #dee2e6" }}
                    >
                      <td>{emp.name}</td>
                      <td>{emp.email}</td>
                      <td>
                        {emp.upcomingActivities.length > 0 ? (
                          emp.upcomingActivities.map((act) => (
                            <div
                              key={act._id}
                              className="d-flex justify-content-between align-items-center mb-1"
                            >
                              <span>{act.title}</span>
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => navigate(`/activity/${act._id}`)}
                              >
                                التفاصيل
                              </button>
                            </div>
                          ))
                        ) : (
                          <span>لا توجد أنشطة قادمة</span>
                        )}
                      </td>
                      <td>
                        {emp.finishedActivities.length > 0 ? (
                          emp.finishedActivities.map((act) => (
                            <div
                              key={act._id}
                              className="d-flex justify-content-between align-items-center mb-1"
                            >
                              <span>{act.title}</span>
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => navigate(`/activity/${act._id}`)}
                              >
                                التفاصيل
                              </button>
                            </div>
                          ))
                        ) : (
                          <span>لا توجد أنشطة منتهية</span>
                        )}
                      </td>
                      <td>{emp.totalAmount}</td>
                      <td>
                        <button
                          className="btn btn-outline-success btn-sm"
                          onClick={() =>
                            navigate(`/employee/${emp._id}/all-activities`)
                          }
                        >
                          كل الأنشطة
                        </button>
                      </td>
                    </tr>
                  ))}

                  <tr
                    style={{ fontWeight: "bold", backgroundColor: "#f8f9fa" }}
                  >
                    <td colSpan="4">المجموع الكلي</td>
                    <td>{totalAmountSum}</td>
                    <td></td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td colSpan="6" className="py-3">
                    لا توجد بيانات
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
