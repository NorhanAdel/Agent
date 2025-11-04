import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/clients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا العميل؟")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/client/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchClients();
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold text-success">إدارة العملاء</h3>

        <div>
          <button
            className="btn btn-success ms-2"
            onClick={() => navigate("/addclient")}
          >
            إضافة عميل جديد
          </button>

          <button
            className="btn btn-outline-success "
            onClick={() => navigate("/activites")}
          >
            الرئيسه
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table
          className="table align-middle text-center"
          style={{
            border: "1px solid #dee2e6",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <thead
            style={{
              backgroundColor: "#198754",
              color: "white",
            }}
          >
            <tr>
              <th>الاسم</th>
              <th>الشخص المسؤول</th>
              <th>رقم الهاتف</th>
              <th>العنوان</th>
              <th>البريد الإلكتروني</th>
              <th>الإجراء</th>
            </tr>
          </thead>
          <tbody>
            {clients.length > 0 ? (
              clients.map((client) => (
                <tr
                  key={client._id}
                  style={{ borderBottom: "1px solid #dee2e6" }}
                >
                  <td>{client.name}</td>
                  <td>{client.contactPerson || "—"}</td>
                  <td>{client.phone || "—"}</td>
                  <td>{client.address || "—"}</td>
                  <td>{client.email || "—"}</td>
                  <td>
                    <button
                      className="btn btn-outline-success btn-sm me-2 ms-2"
                      onClick={() => navigate(`/editclient/${client._id}`)}
                    >
                      تعديل
                    </button>
                    <button
                      className="btn btn-sm text-white"
                      style={{
                        backgroundColor: "#dc3545",
                        border: "1px solid #dc3545",
                      }}
                      onClick={() => handleDelete(client._id)}
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-3">
                  لا توجد بيانات عملاء
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
