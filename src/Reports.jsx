/**
 * Reports.jsx
 * Waste Reports audit page featuring instant CSV export functionality,
 * citizen complaint logs, and photographic background styling.
 */



import { useState, useEffect } from "react";
import Layout from "./Layout";
import toast from "react-hot-toast";

const API_URL = "https://smartwaste-sys-backend.onrender.com";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");

  const fetchData = () => {
    Promise.all([
      fetch(`${API_URL}/api/reports`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
      fetch(`${API_URL}/api/teams`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json())
    ]).then(([reportsData, pointsData]) => {
      setReports(Array.isArray(reportsData) ? reportsData : []);
      setPoints(Array.isArray(pointsData) ? pointsData : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [token]);

  const handleExportCSV = () => {
    if (reports.length === 0) {
      toast.error("No reports available to export.");
      return;
    }

    const headers = ["ID", "Issue Type", "Priority", "Status", "Description"];
    const rows = reports.map(r => [
      r._id,
      `"${(r.issue_type || "").replace(/"/g, '""')}"`,
      r.priority || "",
      r.status || "",
      `"${(r.description || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `smartwaste_reports_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Reports exported successfully as CSV!");
  };

  if (loading) return <Layout><div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>Loading reports...</div></Layout>;

  const filteredReports = reports.filter(r => 
    r.issue_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.priority?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const glassCard = { backgroundColor: "var(--glass-bg)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid var(--glass-border)", borderRadius: "24px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", transition: "all 0.3s ease" };

  return (
    <Layout>
      <div style={{ position: "relative", minHeight: "calc(100vh - 100px)", paddingBottom: "40px" }}>
        
        {/* PAGE-SPECIFIC BACKGROUND IMAGE WITH GRADIENT OVERLAY */}
        <div style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }}>
          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
            alt="Analytics Reports Background" 
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.22 }} 
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, var(--bg-color), rgba(11, 15, 25, 0.85))" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px", position: "relative", zIndex: 1 }}>
          
          {/* HEADER & EXPORT ACTIONS */}
          <div style={{ ...glassCard, padding: "32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <h2 style={{ margin: "0 0 6px 0", fontSize: "30px", fontWeight: "900", color: "var(--text-color)" }}>Every Report Tells a Story</h2>
              <p style={{ margin: 0, fontSize: "16px", fontWeight: "500", color: "var(--text-muted)" }}>An overflowing bin. An illegal dump site. A missed collection. Each report is a citizen saying, "Something needs to change."</p>
            </div>
            
            <button 
              onClick={handleExportCSV}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.filter = "brightness(1.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0px)"; e.currentTarget.style.filter = "brightness(1)"; }}
              style={{ backgroundColor: "#22c55e", color: "white", padding: "12px 24px", borderRadius: "12px", fontWeight: "bold", fontSize: "14px", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", boxShadow: "0 8px 24px rgba(34, 197, 94, 0.3)", transition: "all 0.2s" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Export CSV
            </button>
          </div>

          {/* REPORTS DIRECTORY TABLE */}
          <div style={{ ...glassCard, overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--glass-border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "var(--text-color)" }}>All Municipal Reports</h3>
              <input 
                type="text" 
                placeholder="Search reports by issue, priority, or status..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: "100%", maxWidth: "340px", padding: "10px 14px", borderRadius: "10px", backgroundColor: "var(--input-bg)", border: "1px solid var(--glass-border)", color: "var(--text-color)", outline: "none", fontSize: "14px" }}
              />
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", borderBottom: "1px solid var(--glass-border)" }}>
                    <th style={{ padding: "16px 16px 16px 24px", fontWeight: "600" }}>ID</th>
                    <th style={{ padding: "16px", fontWeight: "600" }}>Issue Type</th>
                    <th style={{ padding: "16px", fontWeight: "600" }}>Priority</th>
                    <th style={{ padding: "16px", fontWeight: "600" }}>Status</th>
                    <th style={{ padding: "16px 24px 16px 16px", fontWeight: "600" }}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map(report => {
                    const point = points.find(p => p._id === report.point_id);
                    return (
                      <tr 
                        key={report._id} 
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.04)"} 
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        style={{ borderBottom: "1px solid var(--glass-border)", transition: "background-color 0.2s" }}
                      >
                        <td style={{ padding: "16px 16px 16px 24px", fontSize: "14px", fontWeight: "600", color: "var(--text-muted)" }}>{report._id}</td>
                        <td style={{ padding: "16px", fontSize: "14px", fontWeight: "700", color: "var(--text-color)" }}>{report.issue_type}</td>
                        <td style={{ padding: "16px" }}>
                          <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", backgroundColor: report.priority === "High" ? "rgba(239, 68, 68, 0.1)" : report.priority === "Medium" ? "rgba(245, 158, 11, 0.1)" : "rgba(34, 197, 94, 0.1)", color: report.priority === "High" ? "#f87171" : report.priority === "Medium" ? "#fbbf24" : "#4ade80" }}>
                            {report.priority}
                          </span>
                        </td>
                        <td style={{ padding: "16px", fontSize: "14px", fontWeight: "600", color: "var(--text-color)" }}>{report.status}</td>
                        <td style={{ padding: "16px 24px 16px 16px", fontSize: "14px", color: "var(--text-muted)" }}>{report.description || (point ? `Location: ${point.name} (${point.district})` : "N/A")}</td>
                      </tr>
                    );
                  })}
                  {filteredReports.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>Zero active reports. That's a good sign. Your city is clean today.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}