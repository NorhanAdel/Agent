import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MainAdminDashboard() {
  const [stats, setStats] = useState({
    orgs: 0,
    clients: 0,
    activities: 0,
    totalAmount: 0,
  });
  const [organizations, setOrganizations] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const navigate = useNavigate();

  const [newOrg, setNewOrg] = useState({
    name: "",
    contactPerson: "",
    bankAccount: "",
    agentType: "",
    minimumMoney: "",
    agentStatus: "",
    limitedMoney: "",
    licenseCode: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    fetchStats();
    fetchOrganizations();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/agents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrganizations(data);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  
 const handleAddOrganization = async (e) => {
   e.preventDefault();
   try {
     const token = localStorage.getItem("token");
     const fd = new FormData();

     Object.entries(newOrg).forEach(([key, value]) => {
       fd.append(key, value);
     });

     const res = await fetch("http://localhost:5000/api/add-agent", {
       method: "POST",
       headers: {
         Authorization: `Bearer ${token}`,
       },
       body: fd,
     });

     const data = await res.json();
     if (!res.ok) throw new Error(data.message || "Failed to add organization");

     alert("✅ تمت إضافة المنظمة بنجاح");
     setShowAddForm(false);
     setNewOrg({
       name: "",
       contactPerson: "",
       bankAccount: "",
       agentType: "",
       minimumMoney: "",
       agentStatus: "",
       limitedMoney: "",
       licenseCode: "",
       email: "",
       password: "",
     });
     fetchOrganizations();
   } catch (error) {
     console.error("Error adding organization:", error);
     alert("❌ فشل في إضافة المنظمة");
   }
 };


  
  const handleEditClick = (org) => {
    setSelectedOrg(org);
    setShowEditForm(true);
    setShowAddForm(false);
  };

 
  const handleUpdateOrganization = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/agents/${selectedOrg._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(selectedOrg),
        }
      );
      if (!res.ok) throw new Error("فشل تعديل البيانات");

      alert("تم تعديل بيانات المنظمة بنجاح");
      setShowEditForm(false);
      fetchOrganizations();
    } catch (error) {
      console.error("Error updating organization:", error);
      alert(" حدث خطأ أثناء التعديل");
    }
  };

  
  const handleDeleteOrganization = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه المنظمة؟")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/agents/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("فشل في حذف المنظمة");

      alert(" تم حذف المنظمة بنجاح");
      fetchOrganizations();
    } catch (error) {
      console.error("Error deleting organization:", error);
      alert(" حدث خطأ أثناء الحذف");
    }
  };

  return (
    <div className="container py-4">
      <h3 className="fw-bold text-success mb-4">لوحة تحكم الأدمن الرئيسي</h3>

      
      <div className="row text-center mb-4">
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm p-3">
            <h6 className="text-muted">عدد المنظمات</h6>
            <h3 className="text-primary">{stats.orgs}</h3>
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
            <h6 className="text-muted">عدد الأنشطة</h6>
            <h3 className="text-success">{stats.activities}</h3>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm p-3">
            <h6 className="text-muted">إجمالي المبالغ</h6>
            <h3 className="text-danger">{stats.totalAmount} ج.م</h3>
          </div>
        </div>
      </div>

      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="text-end mb-3">
  <button
    className="btn btn-outline-success"
    onClick={() => navigate("/analytics")}
  >
    عرض التحليلات  
  </button>
</div>

        <h5 className="fw-bold">قائمة المنظمات</h5>
        <button
          className="btn btn-success"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setShowEditForm(false);
          }}
        >
          {showAddForm ? "إغلاق" : "إضافة منظمة"}
        </button>
      </div>

     
      {showEditForm && selectedOrg && (
        <div className="card p-4 shadow-sm mb-4 bg-light">
          <h5 className="fw-bold text-success mb-3">تعديل بيانات المنظمة</h5>
          <form onSubmit={handleUpdateOrganization}>
            <div className="row g-3">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  value={selectedOrg.name}
                  onChange={(e) =>
                    setSelectedOrg({ ...selectedOrg, name: e.target.value })
                  }
                  placeholder="اسم المنظمة"
                />
              </div>

              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  value={selectedOrg.contactPerson}
                  onChange={(e) =>
                    setSelectedOrg({
                      ...selectedOrg,
                      contactPerson: e.target.value,
                    })
                  }
                  placeholder="الشخص المسؤول"
                />
              </div>

              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  value={selectedOrg.agentStatus}
                  onChange={(e) =>
                    setSelectedOrg({
                      ...selectedOrg,
                      agentStatus: e.target.value,
                    })
                  }
                  placeholder="حالة المنظمة"
                />
              </div>
            </div>
            <button className="btn btn-success mt-3 px-4 ms-2">حفظ التعديلات</button>
            <button
              type="button"
              className="btn btn-secondary mt-3   px-4 "
              onClick={() => setShowEditForm(false)}
            >
              إلغاء
            </button>
          </form>
        </div>
      )}

 
      {showAddForm && (
        <div className="card p-4 shadow-sm mb-4">
          <h5 className="fw-bold text-success mb-3">إضافة منظمة جديدة</h5>
          <form onSubmit={handleAddOrganization}>
            <div className="row g-3">
              {Object.keys(newOrg).map((key, index) => (
                <div className="col-md-4" key={index}>
                  <input
                    type={
                      key === "email"
                        ? "email"
                        : key === "password"
                        ? "password"
                        : "text"
                    }
                    className="form-control"
                    placeholder={key}
                    value={newOrg[key]}
                    onChange={(e) =>
                      setNewOrg({ ...newOrg, [key]: e.target.value })
                    }
                    required
                  />
                </div>
              ))}
            </div>
            <button className="btn btn-success mt-3 px-4">حفظ</button>
          </form>
        </div>
      )}

 
      <div className="table-responsive">
        <table className="table table-striped table-bordered text-center align-middle">
          <thead className="table-success">
            <tr>
              <th>اسم المنظمة</th>
              <th>الشخص المسؤول</th>
              <th>نوع المنظمة</th>
              <th>الحالة</th>
              <th>الحد الأدنى</th>
              <th>الحد الأقصى</th>
              <th>البريد الإلكتروني</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {organizations.length > 0 ? (
              organizations.map((org) => (
                <tr key={org._id}>
                  <td>{org.name}</td>
                  <td>{org.contactPerson}</td>
                  <td>{org.agentType}</td>
                  <td>{org.agentStatus}</td>
                  <td>{org.minimumMoney}</td>
                  <td>{org.limitedMoney}</td>
                  <td>{org.email}</td>
                  <td>
                    <button
                      className="btn btn-outline-info btn-sm me-2"
                      onClick={() => navigate(`/agents/${org._id}`)}
                    >
                      التفاصيل
                    </button>
                    <button
                      className="btn btn-outline-success btn-sm me-2 ms-2"
                      onClick={() => handleEditClick(org)}
                    >
                      تعديل
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDeleteOrganization(org._id)}
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-muted">
                  لا توجد منظمات بعد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
