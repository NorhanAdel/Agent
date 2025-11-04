import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);
    } catch {
      setError("حدث خطأ أثناء تحميل الموظفين");
    }
  };

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setEditData({
      name: employee.name,
      email: employee.email,
      password: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/employee/${selectedEmployee._id}`,
        editData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("تم تحديث بيانات الموظف بنجاح");
      setSelectedEmployee(null);
      fetchEmployees();
    } catch {
      setError("حدث خطأ أثناء تعديل الموظف");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الموظف؟")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/employee/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("تم حذف الموظف بنجاح");
        fetchEmployees();
      } catch {
        alert("حدث خطأ أثناء حذف الموظف");
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold text-success">إدارة الموظفين</h3>
        <div>
          <button
            className="btn btn-success ms-2"
            onClick={() => navigate("/addemployee")}
          >
            إضافة موظف جديد
          </button>
          <button
            className="btn btn-outline-success  "
            onClick={() => navigate("/activites")}
          >
            الرئيسه
          </button>
        </div>
      </div>

      {error && <p className="text-danger">{error}</p>}

      <div className="table-responsive">
        <table
          className="table align-middle text-center"
          style={{
            borderCollapse: "collapse",
            width: "100%",
            border: "1px solid #dee2e6",
          }}
        >
          <thead
            style={{
              backgroundColor: "#f8f9fa",
              borderBottom: "2px solid #dee2e6",
            }}
          >
            <tr>
              <th style={{ border: "1px solid #dee2e6", padding: "10px" }}>
                الاسم
              </th>
              <th style={{ border: "1px solid #dee2e6", padding: "10px" }}>
                البريد الإلكتروني
              </th>
              <th style={{ border: "1px solid #dee2e6", padding: "10px" }}>
                الدور
              </th>
              <th style={{ border: "1px solid #dee2e6", padding: "10px" }}>
                الإجراء
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id}>
                <td style={{ border: "1px solid #dee2e6", padding: "8px" }}>
                  {emp.name}
                </td>
                <td style={{ border: "1px solid #dee2e6", padding: "8px" }}>
                  {emp.email}
                </td>
                <td style={{ border: "1px solid #dee2e6", padding: "8px" }}>
                  {emp.role}
                </td>
                <td style={{ border: "1px solid #dee2e6", padding: "8px" }}>
                  <button
                    className="btn btn-outline-success btn-sm me-2 ms-2"
                    onClick={() => handleEditClick(emp)}
                  >
                    تعديل
                  </button>
                  <button
                    className="btn btn-sm text-white"
                    style={{
                      backgroundColor: "#dc3545",
                      border: "1px solid #dc3545",
                    }}
                    onClick={() => handleDelete(emp._id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedEmployee && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        >
          <div
            className="bg-white p-4 rounded shadow"
            style={{ width: "400px" }}
          >
            <h5 className="text-center mb-3">تعديل بيانات الموظف</h5>
            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label className="form-label">الاسم</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={editData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">البريد الإلكتروني</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={editData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  كلمة المرور الجديدة (اختياري)
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={editData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="btn btn-success px-4 ms-2"
                  disabled={loading}
                >
                  {loading ? "جارِ الحفظ..." : "حفظ"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary ms-2 px-4"
                  onClick={() => setSelectedEmployee(null)}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
