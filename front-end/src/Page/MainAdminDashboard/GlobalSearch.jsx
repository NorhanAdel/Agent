import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim().length === 0) {
        setSuggestions([]);
        setResults([]);
        setShowSuggestions(false);
        return;
      }
      fetchSuggestions(query);
    }, 350);
    return () => clearTimeout(delay);
  }, [query]);

  const fetchSuggestions = async (q) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/search?query=${encodeURIComponent(q)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!Array.isArray(data)) {
        const combined = [
          ...(data.clients || []),
          ...(data.employees || []),
          ...(data.activities || []),
        ].map((it) => ({ ...it, type: it.type || inferType(it) }));
        setSuggestions(combined.slice(0, 8));
        setResults(combined);
      } else {
        setSuggestions(data.slice(0, 8));
        setResults(data);
      }
      setShowSuggestions(true);
    } catch {
      setSuggestions([]);
      setResults([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
    }
  };

  const inferType = (item) => {
    if (item.title) return "نشاط";
    if (item.role === "employee" || item.email) return "موظف";
    return "عميل";
  };

  const handleSelectSuggestion = (item) => {
    setQuery(item.name || item.title || "");
    setShowSuggestions(false);
    if (
      item.type === "عميل" ||
      item.type === "Client" ||
      item.contactPerson !== undefined
    ) {
      navigate(`/editclient/${item._id}`);
      return;
    }
    if (item.type === "موظف" || item.role === "employee") {
      navigate(`/employee/${item._id}/activities`);
      return;
    }
    if (item.type === "نشاط" || item.title) {
      navigate(`/activity/${item._id}`);
      return;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim().length === 0) return;
    setShowSuggestions(false);
    if (results.length === 0) return;
  };

  return (
    <div className="container mt-4" ref={containerRef}>
      <h3 className="fw-bold text-success mb-3 text-center">بحث عام</h3>
      <button
        className="btn btn-outline-success "
        onClick={() => navigate("/activites")}
      >
        الرئيسه
      </button>
      <form
        onSubmit={handleSubmit}
        className="d-flex justify-content-center mb-3"
        style={{ position: "relative" }}
      >
        <input
          type="text"
          className="form-control m-2"
          placeholder="ابحث عن عميل، موظف أو نشاط..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: "60%", minWidth: "260px" }}
          onFocus={() => {
            if (suggestions.length) setShowSuggestions(true);
          }}
        />
        <button className="btn btn-success " type="submit" disabled={loading}>
          {loading ? "جاري البحث..." : "بحث"}
        </button>

        {showSuggestions && suggestions.length > 0 && (
          <ul
            className="list-group position-absolute"
            style={{
              top: "48px",
              left: "0",
              right: "40%",
              zIndex: 2000,
              maxHeight: "320px",
              overflowY: "auto",
              borderRadius: "6px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
            }}
          >
            {suggestions.map((s, i) => (
              <li
                key={s._id || i}
                className="list-group-item list-group-item-action"
                style={{
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onClick={() => handleSelectSuggestion(s)}
              >
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 600 }}>{s.name || s.title}</div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    {s.type || inferType(s)}{" "}
                    {s.email ? `· ${s.email}` : s.phone ? `· ${s.phone}` : ""}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#198754",
                    marginLeft: "8px",
                  }}
                >
                  عرض
                </div>
              </li>
            ))}
          </ul>
        )}
      </form>

      <div>
        {results.length > 0 && (
          <div className="table-responsive">
            <table
              className="table align-middle text-center"
              style={{ border: "1px solid #dee2e6" }}
            >
              <thead style={{ backgroundColor: "#f8f9fa" }}>
                <tr>
                  <th style={{ border: "1px solid #dee2e6", padding: "10px" }}>
                    النوع
                  </th>
                  <th style={{ border: "1px solid #dee2e6", padding: "10px" }}>
                    الاسم / العنوان
                  </th>
                  <th style={{ border: "1px solid #dee2e6", padding: "10px" }}>
                    تفاصيل
                  </th>
                  <th style={{ border: "1px solid #dee2e6", padding: "10px" }}>
                    إجراء
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.map((item, idx) => {
                  const type = item.type || inferType(item);
                  return (
                    <tr key={item._id || idx}>
                      <td
                        style={{ border: "1px solid #dee2e6", padding: "8px" }}
                      >
                        {type}
                      </td>
                      <td
                        style={{ border: "1px solid #dee2e6", padding: "8px" }}
                      >
                        {item.name || item.title}
                      </td>
                      <td
                        style={{ border: "1px solid #dee2e6", padding: "8px" }}
                      >
                        {item.email || item.phone || item.description || "—"}
                      </td>
                      <td
                        style={{ border: "1px solid #dee2e6", padding: "8px" }}
                      >
                        <button
                          className="btn btn-outline-success btn-sm"
                          onClick={() => handleSelectSuggestion(item)}
                        >
                          عرض
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {results.length === 0 && !loading && query.trim().length > 0 && (
          <p className="text-center text-muted">لا توجد نتائج</p>
        )}
      </div>
    </div>
  );
}
