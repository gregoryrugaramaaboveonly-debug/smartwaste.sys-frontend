/**
 * Dashboard.jsx
 * Operations Center dashboard featuring city statistics, charts, recent reports,
 * and immersive photographic background layering with human-centered copy.
 */




import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Layout from "./Layout";


const API_URL = "https://smartwaste-sys-backend.onrender.com";

export default function Dashboard() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [points, setPoints] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/"); return; }

    Promise.all([
      fetch(`${API_URL}/api/reports`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
      fetch(`${API_URL}/api/points`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
      fetch(`${API_URL}/api/teams`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json())



    ]).then(([reportsData, pointsData, teamsData]) => {
      setReports(Array.isArray(reportsData) ? reportsData : []);
      setPoints(Array.isArray(pointsData) ? pointsData : []);
      setTeams(Array.isArray(teamsData) ? teamsData : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [navigate]);

  if (loading) return <Layout><div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>Loading dashboard data...</div></Layout>;

  const totalPoints = points.length;
  const activeReports = reports.filter(r => r.status !== "Resolved").length;
  const resolvedReports = reports.filter(r => r.status === "Resolved").length;
  const activeTeams = teams.filter(t => t.team_status === "Active").length;

  const priorityData = [
    { name: "High", value: reports.filter(r => r.priority === "High").length },
    { name: "Medium", value: reports.filter(r => r.priority === "Medium").length },
    { name: "Low", value: reports.filter(r => r.priority === "Low").length },
  ];
  const COLORS = ["#ef4444", "#f59e0b", "#22c55e"];

  const districtCounts = {};
  reports.forEach(report => {
    const point = points.find(p => p._id === report.point_id);
    if (point) districtCounts[point.district] = (districtCounts[point.district] || 0) + 1;
  });
  const districtData = Object.keys(districtCounts).map(district => ({
    district, reports: districtCounts[district]
  }));

  const glassCard = { backgroundColor: "var(--glass-bg)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid var(--glass-border)", borderRadius: "24px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" };

  const handleCardHover = (e, enter) => {
    e.currentTarget.style.transform = enter ? "translateY(-6px)" : "translateY(0px)";
    e.currentTarget.style.boxShadow = enter ? "0 14px 40px rgba(59, 130, 246, 0.2)" : "0 8px 32px rgba(0,0,0,0.1)";
    e.currentTarget.style.borderColor = enter ? "rgba(59, 130, 246, 0.4)" : "var(--glass-border)";
  };

  const handleRowHover = (e, enter) => {
    e.currentTarget.style.backgroundColor = enter ? "rgba(59, 130, 246, 0.05)" : "transparent";
  };

  return (
    <Layout>
      <div style={{ position: "relative", minHeight: "calc(100vh - 100px)", paddingBottom: "40px" }}>
        
        {/* PAGE-SPECIFIC FIXED BACKGROUND IMAGE WITH GRADIENT OVERLAY */}
        <div style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }}>
          <img 
            src="https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?q=80&w=2072&auto=format&fit=crop" 
            alt="Dashboard Operations Background" 
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.22 }} 
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, var(--bg-color), rgba(11, 15, 25, 0.85))" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px", position: "relative", zIndex: 1 }}>
          
          {/* HERO BANNER WITH PHOTOGRAPHIC TEXTURED OVERLAY */}
          <div style={{ ...glassCard, position: "relative", width: "100%", minHeight: "220px", overflow: "hidden", display: "flex", alignItems: "flex-end", padding: "32px" }}>
            <img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop" alt="Waste Management" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.3 }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, var(--bg-color), transparent)" }} />
            <div style={{ position: "relative", zIndex: 10, display: "flex", width: "100%", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <h1 style={{ margin: "0 0 8px 0", fontSize: "30px", fontWeight: "900", color: "var(--text-color)" }}>Operations Center</h1>
                <p style={{ margin: 0, fontSize: "16px", fontWeight: "500", color: "var(--text-muted)", maxWidth: "700px" }}>This is your city at a glance. Every active report, every team in the field, every point that needs attention — it's all here. You are the reason this city stays clean. Let's get to work.</p>
              </div>
              <span style={{ backgroundColor: "rgba(34, 197, 94, 0.2)", color: "#4ade80", border: "1px solid rgba(34, 197, 94, 0.3)", padding: "6px 16px", borderRadius: "20px", fontSize: "14px", fontWeight: "bold", backdropFilter: "blur(8px)" }}>● System Online</span>
            </div>
          </div>

          {/* STATISTICS SUMMARY CARDS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
            {[
              { label: "Total Points", value: totalPoints, path: "/points", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>, bg: "rgba(59, 130, 246, 0.1)" },
              { label: "Active Reports", value: activeReports, path: "/reports", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>, bg: "rgba(239, 68, 68, 0.1)" },
              { label: "Resolved", value: resolvedReports, path: "/reports", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>, bg: "rgba(34, 197, 94, 0.1)" },
              { label: "Active Teams", value: activeTeams, path: "/teams", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>, bg: "rgba(139, 92, 246, 0.1)" }
            ].map((stat, i) => (
              <div 
                key={i} 
                onClick={() => navigate(stat.path)}
                onMouseEnter={(e) => handleCardHover(e, true)}
                onMouseLeave={(e) => handleCardHover(e, false)}
                style={{ ...glassCard, padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between", cursor: "pointer" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{stat.label}</span>
                  <div style={{ padding: "8px", borderRadius: "12px", backgroundColor: stat.bg }}>{stat.icon}</div>
                </div>
                <h2 style={{ margin: 0, fontSize: "36px", fontWeight: "900", color: "var(--text-color)" }}>{stat.value}</h2>
              </div>
            ))}
          </div>

          {/* CHARTS SECTION */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
            <div 
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
              style={{ ...glassCard, padding: "24px", height: "350px", display: "flex", flexDirection: "column" }}
            >
              <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "700", color: "var(--text-color)" }}>Reports by Priority</h3>
              <div style={{ flex: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={priorityData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                      {priorityData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "16px" }}>
                {priorityData.map((entry, index) => (
                  <div key={entry.name} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "600", color: "var(--text-muted)" }}>
                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: COLORS[index] }}></div>
                    {entry.name} ({entry.value})
                  </div>
                ))}
              </div>
            </div>

            <div 
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
              style={{ ...glassCard, padding: "24px", height: "350px", display: "flex", flexDirection: "column" }}
            >
              <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "700", color: "var(--text-color)" }}>Reports by District</h3>
              <div style={{ flex: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={districtData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="district" tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }} />
                    <Bar dataKey="reports" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* RECENT REPORTS TABLE */}
          <div style={{ ...glassCard, overflow: "hidden", marginTop: "8px" }}>
            <div style={{ padding: "24px", borderBottom: "1px solid var(--glass-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "var(--text-color)" }}>Recent Waste Reports</h3>
              <Link 
                to="/reports" 
                onMouseEnter={(e) => e.target.style.filter = "brightness(1.3)"}
                onMouseLeave={(e) => e.target.style.filter = "brightness(1)"}
                style={{ fontSize: "14px", fontWeight: "700", color: "#60a5fa", textDecoration: "none", transition: "filter 0.2s" }}
              >
                View All &rarr;
              </Link>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", borderBottom: "1px solid var(--glass-border)" }}>
                    <th style={{ padding: "16px 16px 16px 24px", fontWeight: "600" }}>ID</th>
                    <th style={{ padding: "16px", fontWeight: "600" }}>Issue Type</th>
                    <th style={{ padding: "16px", fontWeight: "600" }}>Priority</th>
                    <th style={{ padding: "16px 24px 16px 16px", fontWeight: "600" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.slice(0, 5).map((report) => (
                    <tr 
                      key={report._id} 
                      onClick={() => navigate("/reports")}
                      onMouseEnter={(e) => handleRowHover(e, true)}
                      onMouseLeave={(e) => handleRowHover(e, false)}
                      style={{ borderBottom: "1px solid var(--glass-border)", transition: "background-color 0.2s", cursor: "pointer" }}
                    >
                      <td style={{ padding: "16px 16px 16px 24px", fontSize: "14px", fontWeight: "600", color: "var(--text-muted)" }}>{report._id}</td>
                      <td style={{ padding: "16px", fontSize: "14px", fontWeight: "700", color: "var(--text-color)" }}>{report.issue_type}</td>
                      <td style={{ padding: "16px" }}>
                        <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", backgroundColor: report.priority === "High" ? "rgba(239, 68, 68, 0.1)" : report.priority === "Medium" ? "rgba(245, 158, 11, 0.1)" : "rgba(34, 197, 94, 0.1)", color: report.priority === "High" ? "#f87171" : report.priority === "Medium" ? "#fbbf24" : "#4ade80" }}>
                          {report.priority}
                        </span>
                      </td>
                      <td style={{ padding: "16px 24px 16px 16px", fontSize: "14px", fontWeight: "500", color: "var(--text-muted)" }}>{report.status}</td>
                    </tr>
                  ))}
                  {reports.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>No reports yet. When citizens submit issues, they'll appear here in real time.</td>
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