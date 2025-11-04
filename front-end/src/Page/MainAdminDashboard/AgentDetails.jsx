import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AgentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgentDetails();
  }, [id]);

  const fetchAgentDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/agents/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAgent(data);
    } catch (error) {
      console.error("Error fetching agent details:", error);
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

  if (!agent)
    return <p className="text-center mt-5">لم يتم العثور على بيانات المنظمة</p>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-success">تفاصيل المنظمة</h3>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
        >
          رجوع
        </button>
      </div>

      <div className="card shadow-lg border-0 rounded-4 p-4 mb-4">
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm p-3 h-100 rounded-4 bg-light">
              <h5 className="fw-bold text-success border-bottom pb-2 mb-3">
                بيانات أساسية
              </h5>
              <p>
                <strong>الاسم:</strong> {agent.name}
              </p>
              <p>
                <strong>الشخص المسؤول:</strong> {agent.contactPerson}
              </p>
              <p>
                <strong>البريد الإلكتروني:</strong> {agent.email}
              </p>
              <p>
                <strong>رقم الهاتف:</strong> {agent.phone}
              </p>
              <p>
                <strong>العنوان:</strong> {agent.address}
              </p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card border-0 shadow-sm p-3 h-100 rounded-4 bg-light">
              <h5 className="fw-bold text-success border-bottom pb-2 mb-3">
                بيانات مالية
              </h5>
              <p>
                <strong>نوع المؤسسة:</strong> {agent.agentType}
              </p>
              <p>
                <strong>الحالة:</strong>{" "}
                <span
                  className={`badge ${
                    agent.agentStatus === "active"
                      ? "bg-success"
                      : "bg-danger text-light"
                  }`}
                >
                  {agent.agentStatus}
                </span>
              </p>
              <p>
                <strong>رقم الحساب البنكي:</strong> {agent.bankAccount}
              </p>
              <p>
                <strong>كود الترخيص:</strong> {agent.licenseCode}
              </p>
              <p>
                <strong>الحد الأدنى:</strong> {agent.minimumMoney} ج.م
              </p>
              <p>
                <strong>الحد الأقصى:</strong> {agent.limitedMoney} ج.م
              </p>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm p-4 mt-4 rounded-4 bg-white">
          <h5 className="fw-bold text-success border-bottom pb-2 mb-3">
            بيانات الأدمن المسؤول
          </h5>
          {agent.admin ? (
            <div className="d-flex flex-column">
              <span className="fw-bold">
                {agent.admin.name} ({agent.admin.email})
              </span>
              <span className="text-muted">
                دور المستخدم: {agent.admin.role}
              </span>
            </div>
          ) : (
            <p className="text-muted">لا يوجد أدمن مرتبط بهذه المنظمة</p>
          )}
        </div>
      </div>
    </div>
  );
}
