/**
 * Schedules.jsx
 * Route schedules and dispatch page featuring upcoming route planning cards,
 * configuration modals, and photographic background styling.
 */





import { useState, useEffect } from "react";
import Layout from "./Layout";
import toast from "react-hot-toast";

const API_URL = "https://smartwaste-sys-backend.onrender.com";

export default function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [points, setPoints] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ point_id: "", team_id: "", schedule_date: "" });

  const token = localStorage.getItem("token");

  const fetchData = () => {
  fetch(`${API_URL}/api/schedules`, { headers: { Authorization: `Bearer ${token}` } })
    .then(res => res.json())
    .then(data => {
      setSchedules(Array.isArray(data) ? data : []);
      setLoading(false);
    })
    .catch(() => setLoading(false));
};


  useEffect(() => { fetchData(); }, [token]);

  const handleOpenModal = (dateStr) => {
    setSelectedDate(dateStr);
    setFormData({ point_id: "", team_id: "", schedule_date: dateStr });
    setShowModal(true);
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        toast.success("Route scheduled successfully!");
        setShowModal(false);
        fetchData();
      } else {
        toast.error("Failed to schedule route");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Layout><div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>Loading schedules...</div></Layout>;

  const glassCard = { backgroundColor: "var(--glass-bg)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid var(--glass-border)", borderRadius: "24px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", transition: "all 0.3s ease" };

  const upcomingDates = [
    { dateStr: "2026-11-24", label: "Nov 24" },
    { dateStr: "2026-11-25", label: "Nov 25" },
    { dateStr: "2026-11-26", label: "Nov 26" },
    { dateStr: "2026-11-27", label: "Nov 27" }
  ];

  return (
    <Layout>
      <div style={{ position: "relative", minHeight: "calc(100vh - 100px)", paddingBottom: "40px" }}>
        
        {/* PAGE-SPECIFIC BACKGROUND IMAGE WITH GRADIENT OVERLAY */}
        <div style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }}>
          <img 
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop" 
            alt="Logistics Network Background" 
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.22 }} 
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, var(--bg-color), rgba(11, 15, 25, 0.85))" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px", position: "relative", zIndex: 1 }}>
          
          {/* HEADER SECTION */}
          <div style={{ ...glassCard, padding: "32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "30px", fontWeight: "900", color: "var(--text-color)" }}>The Plan to Keep the City Clean</h2>
              <p style={{ margin: "4px 0 0 0", fontSize: "16px", fontWeight: "500", color: "var(--text-muted)" }}>Consistency wins wars. This is the daily plan for every team in the field.</p>
            </div>
          </div>

          {/* UPCOMING ROUTE PLANS SECTION */}
          <div style={{ ...glassCard, padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
              <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "800", color: "var(--text-color)" }}>Upcoming Route Plans</h3>
              <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "600" }}>Click any date card to configure a new route</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
              {upcomingDates.map((item) => {
                const daySchedules = schedules.filter(s => s.schedule_date?.startsWith(item.dateStr));
                return (
                  <div 
                    key={item.dateStr}
                    onClick={() => handleOpenModal(item.dateStr)}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "#3b82f6"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0px)"; e.currentTarget.style.borderColor = "var(--glass-border)"; }}
                    style={{ ...glassCard, padding: "20px", cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "150px" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#3b82f6", boxShadow: "0 0 8px #3b82f6" }}></div>
                        <span style={{ fontSize: "16px", fontWeight: "800", color: "var(--text-color)" }}>{item.label}</span>
                      </div>
                      <span style={{ fontSize: "12px", fontWeight: "bold", color: "#60a5fa" }}>+ Add Route</span>
                    </div>

                    <div style={{ marginTop: "16px" }}>
                      {daySchedules.length > 0 ? (
                        <span style={{ fontSize: "12px", fontWeight: "700", color: "#4ade80" }}>{daySchedules.length} Route(s) Scheduled</span>
                      ) : (
                        <span style={{ fontSize: "13px", fontStyle: "italic", color: "var(--text-muted)" }}>No routes scheduled</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ACTIVE ROUTE ASSIGNMENTS TABLE */}
          <div style={{ ...glassCard, overflow: "hidden" }}>
            <div style={{ padding: "24px", borderBottom: "1px solid var(--glass-border)" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "var(--text-color)" }}>All Active Route Assignments</h3>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", borderBottom: "1px solid var(--glass-border)" }}>
                    <th style={{ padding: "16px 16px 16px 24px", fontWeight: "600" }}>Date</th>
                    <th style={{ padding: "16px", fontWeight: "600" }}>Collection Point</th>
                    <th style={{ padding: "16px 24px 16px 16px", fontWeight: "600" }}>Assigned Team</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((sch) => {
                    const point = points.find(p => p._id === sch.point_id);
                    const team = teams.find(t => t._id === sch.team_id);
                    return (
                      <tr key={sch._id} style={{ borderBottom: "1px solid var(--glass-border)" }}>
                        <td style={{ padding: "16px 16px 16px 24px", fontSize: "14px", fontWeight: "600", color: "var(--text-color)" }}>{sch.schedule_date?.split('T')[0]}</td>
                        <td style={{ padding: "16px", fontSize: "14px", fontWeight: "700", color: "var(--text-color)" }}>{point ? point.name : "N/A"}</td>
                        <td style={{ padding: "16px 24px 16px 16px", fontSize: "14px", fontWeight: "600", color: "#60a5fa" }}>{team ? team.team_name : "Unassigned"}</td>
                      </tr>
                    );
                  })}
                  {schedules.length === 0 && (
                    <tr>
                      <td colSpan="3" style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>No schedules for this week yet. Plan a route to get started.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ROUTE CONFIGURATION MODAL */}
          {showModal && (
            <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10000, padding: "20px" }}>
              <div style={{ ...glassCard, width: "100%", maxWidth: "450px", padding: "32px", backgroundColor: "var(--bg-color)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 style={{ margin: 0, fontSize: "22px", fontWeight: "900", color: "var(--text-color)" }}>Configure Route: {selectedDate}</h3>
                  <button onClick={() => setShowModal(false)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", fontSize: "22px", cursor: "pointer", fontWeight: "bold" }}>&times;</button>
                </div>

                <form onSubmit={handleCreateSchedule} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "bold", color: "var(--text-muted)", marginBottom: "6px", display: "block" }}>Select Collection Point</label>
                    <select 
                      required 
                      value={formData.point_id} 
                      onChange={(e) => setFormData({...formData, point_id: e.target.value})}
                      style={{ width: "100%", padding: "12px", borderRadius: "12px", backgroundColor: "var(--input-bg)", border: "1px solid var(--glass-border)", color: "var(--text-color)", outline: "none" }}
                    >
                      <option value="">Choose Point...</option>
                      {points.map(p => <option key={p._id} value={p._id}>{p.name} ({p.district})</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "bold", color: "var(--text-muted)", marginBottom: "6px", display: "block" }}>Assign Collection Team</label>
                    <select 
                      required 
                      value={formData.team_id} 
                      onChange={(e) => setFormData({...formData, team_id: e.target.value})}
                      style={{ width: "100%", padding: "12px", borderRadius: "12px", backgroundColor: "var(--input-bg)", border: "1px solid var(--glass-border)", color: "var(--text-color)", outline: "none" }}
                    >
                      <option value="">Choose Team...</option>
                      {teams.map(t => <option key={t._id} value={t._id}>{t.team_name} ({t.district})</option>)}
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    style={{ width: "100%", padding: "14px", backgroundColor: "#22c55e", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold", fontSize: "15px", marginTop: "8px", boxShadow: "0 8px 24px rgba(34, 197, 94, 0.4)" }}
                  >
                    Save & Dispatch Route
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}