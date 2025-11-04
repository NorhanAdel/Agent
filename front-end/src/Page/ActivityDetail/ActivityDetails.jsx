import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ActivityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivityDetails();
  }, [id]);

  const fetchActivityDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/activities/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setActivity(data);
    } catch (error) {
      console.error("Error fetching activity details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-success"></div>
      </div>
    );

  if (!activity)
    return <p className="text-center mt-5">لم يتم العثور على بيانات النشاط</p>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-success">تفاصيل النشاط</h3>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
        >
          رجوع
        </button>
      </div>

      <div className="card shadow-lg border-0 rounded-4 p-4">
        <div className="row">
          <div className="col-md-6">
            <p>
              <strong>الاسم:</strong> {activity.title}
            </p>
            <p>
              <strong>الوصف:</strong> {activity.description || "—"}
            </p>
            <p>
              <strong>النوع:</strong> {activity.activityType?.name || "—"}
            </p>
            <p>
              <strong>العميل:</strong> {activity.client?.name || "—"}
            </p>
            <p>
              <strong>المندوب:</strong> {activity.employee?.name || "—"}
            </p>
            <p>
              <strong>الوكالة:</strong> {activity.agent?.name || "—"}
            </p>
          </div>

          <div className="col-md-6">
            <p>
              <strong>التاريخ:</strong>{" "}
              {activity.date
                ? new Date(activity.date).toLocaleDateString("ar-EG")
                : "—"}
            </p>
            <p>
              <strong>المبلغ:</strong> {activity.amount} ج.م
            </p>
            <p>
              <strong>الحالة:</strong>{" "}
              <span
                className={`badge ${
                  activity.status === "finished"
                    ? "bg-success"
                    : "bg-warning text-dark"
                }`}
              >
                {activity.status === "finished" ? "منتهى" : "قادم"}
              </span>
            </p>
          </div>
        </div>

        {/* 🧾 قسم التقرير */}
        <div className="mt-4 p-3 bg-light rounded-3 border">
          <h5 className="fw-bold text-success border-bottom pb-2 mb-3">
            تقرير النشاط
          </h5>
          {activity.report ? (
            <p>{activity.report}</p>
          ) : (
            <p className="text-muted">لا يوجد تقرير مضاف لهذا النشاط</p>
          )}
        </div>
      </div>
    </div>
  );
}
