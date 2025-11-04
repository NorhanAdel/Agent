import React, { useState } from "react";
import IMG from "../../assests/photo_2024-05-07_21-14-05.jpg";
import "./AddAgent.css";
import { useNavigate } from "react-router-dom";

export const AddAgent = () => {
  const [name, setName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [agentType, setAgentType] = useState("");
  const [minimumMoney, setMinimumMoney] = useState("");
  const [agentStatus, setAgentStatus] = useState("");
  const [limitedMoney, setLimitedMoney] = useState("");
  const [licenseCode, setLicenseCode] = useState("");
  const [attachments, setAttachments] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const navigate = useNavigate();

  const addHandler = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", name);
    fd.append("bankAccount", bankAccount);
    fd.append("agentType", agentType);
    fd.append("minimumMoney", minimumMoney);
    fd.append("agentStatus", agentStatus);
    fd.append("limitedMoney", limitedMoney);
    fd.append("licenseCode", licenseCode);
    fd.append("email", email);
    fd.append("password", password);
    fd.append("contactPerson", contactPerson);
    fd.append("phone", phone);
    fd.append("address", address);

    if (attachments) {
      fd.append("attachments", attachments);
    }

    // عرض البيانات اللي بتتبعت عشان تتأكدي
    for (let pair of fd.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    try {
      const res = await fetch("http://localhost:5000/api/add-agent", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ تمت إضافة المنظمة بنجاح!");
        navigate("/mainAdminDashboard");
      } else {
        console.error("Server Response:", data);
        alert("❌ فشل في الإضافة: " + (data.message || "تحققي من البيانات"));
      }
    } catch (error) {
      console.error("Error adding organization:", error);
      alert("⚠️ حدث خطأ أثناء الإرسال");
    }
  };

  return (
    <form
      onSubmit={addHandler}
      encType="multipart/form-data"
      className="add_agent"
    >
      <img src={IMG} className="bg" alt="background" />

      <div className="login_form">
        <h1 className="form_title">إضافة منظمة جديدة</h1>

        <div className="items">
          <div className="item">
            <label>اسم المؤسسة</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="item">
            <label>الشخص المسؤول</label>
            <input
              type="text"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              required
            />
          </div>

          <div className="item">
            <label>رقم الهاتف</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="item">
            <label>العنوان</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="item">
            <label>رقم الحساب البنكي</label>
            <input
              type="text"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              required
            />
          </div>

          <div className="item">
            <label>نوع المؤسسة</label>
            <input
              type="text"
              value={agentType}
              onChange={(e) => setAgentType(e.target.value)}
              required
            />
          </div>

          <div className="item">
            <label>الحد المالي الأدنى</label>
            <input
              type="number"
              value={minimumMoney}
              onChange={(e) => setMinimumMoney(e.target.value)}
              required
            />
          </div>

          <div className="item">
            <label>حالة المؤسسة</label>
            <input
              type="text"
              value={agentStatus}
              onChange={(e) => setAgentStatus(e.target.value)}
              required
            />
          </div>

          <div className="item">
            <label>الحد المالي الأقصى</label>
            <input
              type="number"
              value={limitedMoney}
              onChange={(e) => setLimitedMoney(e.target.value)}
              required
            />
          </div>

          <div className="item">
            <label>كود الترخيص</label>
            <input
              type="text"
              value={licenseCode}
              onChange={(e) => setLicenseCode(e.target.value)}
              required
            />
          </div>

          <div className="item">
            <label>إيميل الأدمن</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="item">
            <label>كلمة المرور للأدمن</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="item">
            <label>تحميل ملف المرفقات (Excel)</label>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={(e) => setAttachments(e.target.files[0])}
            />
          </div>
        </div>

        <button type="submit" className="login_btn">
          إضافة منظمة
        </button>
      </div>
    </form>
  );
};
