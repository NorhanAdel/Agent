import React, { useState } from 'react';

export default function Activities() {
  const [flow, setFlow] = useState('admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [activityType, setActivityType] = useState('');
  const [organization, setOrganization] = useState('');
  const [agent, setAgent] = useState('');
  const [activeTab, setActiveTab] = useState('finished');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderFinishedActivities = () => {
    // Logic to render finished activities
    return (
      <div className='mt-5'>
        <table className='w-100'>
          <thead>
            <tr >
              <th>رقم الهوية</th>
              <th> التاريخ الفعلي</th>
              <th> الوقت الفعلي</th>
              <th> اسم النشاط</th>
              <th> العميل</th>
              <th> العامل</th>
            </tr>
            <tr>
        <td colSpan="6"><hr /></td>
      </tr>
          </thead>
          <tbody>
      <tr>
        <td>#2223</td>
        <td>إبريل</td>
        <td>اكتوبر</td>
        <td>اسم النشاط</td>
        <td>اسم العميل</td>
        <td>اسم العامل</td>
      </tr>
      <tr>
        <td colSpan="6"><hr /></td>
      </tr>
    </tbody>
        </table>
      </div>
    );
  };

  const renderUpcomingActivities = () => {
    // Logic to render upcoming activities
    return (
        <div className='mt-5'>
  <table className='w-100'>
    <thead>
      <tr>
        <th>رقم الهوية</th>
        <th>التاريخ المحدد</th>
        <th>الوقت المحدد</th>
        <th>اسم النشاط</th>
        <th>العميل</th>
        <th>العامل</th>
      </tr>
      <tr>
        <td colSpan="6"><hr /></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>#2223</td>
        <td>إبريل</td>
        <td>اكتوبر</td>
        <td>اسم النشاط</td>
        <td>اسم العميل</td>
        <td>اسم العامل</td>
      </tr>
      <tr>
        <td colSpan="6"><hr /></td>
      </tr>
    </tbody>
  </table>
</div>

      
      
    );
  };

  const handleSearch = () => {
    // Perform search based on the selected values and search query
  };

  return (
    <>
      <div className="container mt-3 p-2">
        <div className="header d-flex justify-content-between">
          <p className='fw-bolder'>الأنشطة</p>
          <div className="buttons">
            {flow === 'admin' && (
              <div>
                <button className='btn ms-2' onClick={() => console.log('Add Organization')}>إضافة مستخدمين</button>
                <button className='btn add' onClick={() => console.log('Add Users')}>إضافة منظمة</button>
              </div>
            )}

            {flow === 'organization' && (
              <div>
                <button className='btn ms-2' onClick={() => console.log('Add Agents')}>إضافة انشطة</button>
                <button className='btn add' onClick={() => console.log('Add Activities')}>إضافة عمال</button>
              </div>
            )}
          </div>
        </div>
        <div className="search mt-4 d-flex  align-items-center flex-wrap flex-row">
          <input
            type="text"
            className="form-control ms-2 w-25"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className='btn add ms-3' onClick={handleSearch} >بحث</button>
          <select
            className="form-control ms-1 select"
            value={activityType}
            onChange={(e) => setActivityType(e.target.value)}
          >
            <option value="" disabled selected>اختر نوع النشاط...</option>
            <option value="agent1">توصيل</option>
            <option value="agent2">تفتيش </option>
            <option value="agent3">مبيعات </option>
            <option value="agent1">بعد االبيع </option>
          </select>

          <select
            className="form-control ms-1 select"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
          >
            <option value="" selected disabled>اختر العميل...</option>
            <option value="agent1">توصيل</option>
            <option value="agent2">تفتيش </option>
            <option value="agent3">مبيعات </option>
            <option value="agent1">بعد االبيع </option>
          </select>

          <select
            className="form-control  select"
            value={agent}
            onChange={(e) => setAgent(e.target.value)}
          >
            <option value="">اختر العامل...</option>
            <option value="agent1">توصيل</option>
            <option value="agent2">تفتيش </option>
            <option value="agent3">مبيعات </option>
            <option value="agent1">بعد االبيع </option>
          </select>
        </div>
        <div className="activities  mt-4">
          <div className="tabs d-flex justify-content-evenly">
            <button
              className={`btn butt ${activeTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => handleTabChange('upcoming')}
            >
              الأنشطة القادمة
            </button>
            <button
              className={`btn butt ${activeTab === 'finished' ? 'active' : ''}`}
              onClick={() => handleTabChange('finished')}
            >
              الأنشطة المنتهية
            </button>
          </div>

          <div className="activity">
            {activeTab === 'finished' ? renderFinishedActivities() : renderUpcomingActivities()}
          </div>
        </div>
      </div>
    </>
  );
}
