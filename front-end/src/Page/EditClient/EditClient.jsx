import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditClient() {
  const { id } = useParams();
  const [client, setClient] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    address: "",
    email: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchClient();
  }, []);

  const fetchClient = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/client/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setClient(data);
    } catch (error) {
      console.error("Error fetching client:", error);
    }
  };

  const handleChange = (e) => {
    setClient({ ...client, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/client/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(client),
      });
      navigate("/clients");
    } catch (error) {
      console.error("Error updating client:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="fw-bold mb-3">تعديل بيانات العميل</h4>
      <form onSubmit={handleSubmit} className="w-50 mx-auto">
        <div className="mb-3">
          <label className="form-label">اسم العميل</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={client.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">الشخص المسؤول</label>
          <input
            type="text"
            className="form-control"
            name="contactPerson"
            value={client.contactPerson}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">رقم الهاتف</label>
          <input
            type="text"
            className="form-control"
            name="phone"
            value={client.phone}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">العنوان</label>
          <input
            type="text"
            className="form-control"
            name="address"
            value={client.address}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">البريد الإلكتروني</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={client.email}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-success w-100">
          حفظ التعديلات
        </button>
      </form>
    </div>
  );
}
