import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ActivityDetails() {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [newReport, setNewReport] = useState("");
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActivityDetails();
    fetchReports();
  }, [id]);

  const fetchActivityDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/activity/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setActivity(data);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/reports/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setReports(data);
    } catch {}
  };

  const handleAddReport = async () => {
    if (!newReport.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:5000/api/add-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ activityId: id, content: newReport }),
      });
      setNewReport("");
      fetchReports();
    } catch {}
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = handleSaveRecording;
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch {
      alert("يجب السماح بالوصول إلى الميكروفون");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleSaveRecording = async () => {
    const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    const url = URL.createObjectURL(blob);
    setAudioURL(url);
    const formData = new FormData();
    formData.append("voiceNote", blob, "voiceNote.webm");
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/activity/${id}/upload-voice`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      fetchActivityDetails();
    } catch {}
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );

  if (!activity)
    return (
      <div className="text-center mt-5">
        <h4>النشاط غير موجود</h4>
      </div>
    );

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-success">تفاصيل النشاط</h3>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
        >
          العودة
        </button>
      </div>

      <div className="row g-4">
        <div className="col-md-7">
          <div className="card shadow-lg border-0 rounded-4 p-4">
            <h5 className="fw-bold mb-3 text-success border-bottom pb-2">
              بيانات النشاط
            </h5>
            <div className="mb-3">
              <strong>الاسم:</strong> {activity.title}
            </div>
            <div className="mb-3">
              <strong>الوصف:</strong>{" "}
              {activity.description ? activity.description : "لا يوجد وصف"}
            </div>
            <div className="mb-3">
              <strong>النوع:</strong>{" "}
              {activity.activityType?.name || "غير محدد"}
            </div>
            <div className="mb-3">
              <strong>العميل:</strong>{" "}
              {activity.client?.name ||
                (typeof activity.client === "string"
                  ? activity.client
                  : "غير محدد")}
            </div>
            <div className="mb-3">
              <strong>العامل:</strong>{" "}
              {activity.agent?.name ||
                (typeof activity.agent === "string"
                  ? activity.agent
                  : "غير محدد")}
            </div>
            <div className="mb-3">
              <strong>المبلغ:</strong> {activity.amount} ج.م
            </div>
            <div className="mb-3">
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
            </div>
            <div className="mb-3">
              <strong>تاريخ التنفيذ:</strong>{" "}
              {new Date(activity.date).toLocaleDateString("ar-EG")}
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card shadow-lg border-0 rounded-4 p-4 h-100">
            <h5 className="fw-bold mb-3 text-success border-bottom pb-2">
              الملاحظات والتقارير
            </h5>
            <div className="mb-3">
              <textarea
                className="form-control mb-3"
                rows="4"
                placeholder="أضف تقرير أو ملاحظة..."
                value={newReport}
                onChange={(e) => setNewReport(e.target.value)}
              ></textarea>
              <button
                className="btn btn-success w-100"
                onClick={handleAddReport}
                disabled={!newReport.trim()}
              >
                حفظ التقرير
              </button>
            </div>
            <hr />
            <div className="reports-list mt-3">
              {reports.length > 0 ? (
                reports.map((rep) => (
                  <div
                    key={rep._id}
                    className="p-3 mb-3 bg-light rounded shadow-sm border-start border-4 border-success"
                  >
                    <p className="mb-1">{rep.content}</p>
                    <small className="text-muted">
                      {new Date(rep.createdAt).toLocaleString("ar-EG")} —{" "}
                      {rep.createdBy?.name || "غير معروف"}
                    </small>
                  </div>
                ))
              ) : (
                <p className="text-muted text-center">لا توجد تقارير بعد</p>
              )}
            </div>
            <hr />
            {!recording ? (
              <button
                className="btn btn-success w-100"
                onClick={startRecording}
              >
                بدء التسجيل الصوتي
              </button>
            ) : (
              <button className="btn btn-danger w-100" onClick={stopRecording}>
                إيقاف التسجيل
              </button>
            )}
            {audioURL && (
              <div className="mt-3 text-center">
                <audio controls src={audioURL} className="w-100" />
              </div>
            )}
            {activity.voiceNote && (
              <div className="mt-4 text-center">
                <h6 className="text-success">آخر ملاحظة صوتية:</h6>
                <audio
                  controls
                  src={`http://localhost:5000/${activity.voiceNote}`}
                  className="w-100"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
