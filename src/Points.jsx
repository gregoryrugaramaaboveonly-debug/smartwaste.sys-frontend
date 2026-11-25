/**
 * Points.jsx
 * Collection Points map and directory featuring interactive Leaflet mapping,
 * quick municipal team assignment, and background styling.
 */



import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Layout from "./Layout";
import toast from "react-hot-toast";

const API_URL = "https://smartwaste-sys-backend-2.onrender.com";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function Points() {
  const [points, setPoints] = useState([]);
  const [reports, setReports] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); 
  
  const [formData, setFormData] = useState({ name: "", district: "", area: "", waste_type: "Mixed", capacity_kg: 1000, current_status: "Empty", lat: "", lng: "" });
  const [selectedTeams, setSelectedTeams] = useState({});

  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("role") === "admin";

  const fetchData = () => {
    Promise.all([
      fetch(`${API_URL}/api/points`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
      fetch(`${API_URL}/api/reports`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
      fetch(`${API_URL}/api/teams`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json())
    ]).then(([pointsData, reportsData, teamsData]) => {
      setPoints(Array.isArray(pointsData) ? pointsData : []);
      setReports(Array.isArray(reportsData) ? reportsData : []);
      setTeams(Array.isArray(teamsData) ? teamsData : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [token]);

  const handleAddPoint = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/points`, { 
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setShowForm(false);
        setFormData({ name: "", district: "", area: "", waste_type: "Mixed", capacity_kg: 1000, current_status: "Empty", lat: "", lng: "" });
        toast.success("Point added successfully");
        fetchData();
      }
    } catch (err) { console.error(err); }
  };

  const handleQuickAssign = async (reportId) => {
    const teamId = selectedTeams[reportId];
    if (!teamId) return toast.error("Please select a team first");
    try {
      const response = await fetch(`${API_URL}/api/reports/${reportId}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ team_id: teamId })
      });
      if (response.ok) {
        toast.success("Team assigned successfully");
        fetchData();
      }
    } catch (err) { console.error(err); }
  };

  if (loading) return <Layout><div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>Loading collection points...</div></Layout>;

  const mapCenter = [0.3476, 32.5825];

  const filteredPoints = points.filter(point => 
    point.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    point.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    point._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const glassCard = { backgroundColor: "var(--glass-bg)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid var(--glass-border)", borderRadius: "24px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", transition: "all 0.3s ease" };

  return (
    <Layout>
      <div style={{ position: "relative", minHeight: "calc(100vh - 100px)", paddingBottom: "40px" }}>
        
        {/* PAGE-SPECIFIC BACKGROUND IMAGE WITH GRADIENT OVERLAY */}
        <div style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }}>
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" 
            alt="Urban Logistics Background" 
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.22 }} 
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, var(--bg-color), rgba(11, 15, 25, 0.85))" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px", position: "relative", zIndex: 1 }}>
          
          {/* HERO BANNER & MAP USAGE GUIDE */}
          <div style={{ ...glassCard, padding: "32px", textAlign: "center" }}>
            <h1 style={{ margin: "0 0 6px 0", fontSize: "32px", fontWeight: "900", color: "var(--text-color)" }}>Where Waste Meets Its Match</h1>
            <p style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "700", color: "#60a5fa" }}>Interactive Urban Logistics & Collection Map</p>
            <p style={{ margin: "0 auto", fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.6", maxWidth: "800px" }}>
              These are the front lines of the waste war. Every point on this map is a place where waste is collected, sorted, or processed. If a bin is overflowing, you'll see it here. If a location needs attention, you'll know. This is how we keep the city breathing.
            </p>
            {isAdmin && (
              <div style={{ marginTop: "20px" }}>
                <button 
                  onClick={() => setShowForm(!showForm)} 
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.filter = "brightness(1.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0px)"; e.currentTarget.style.filter = "brightness(1)"; }}
                  style={{ backgroundColor: "#3b82f6", color: "white", padding: "10px 24px", borderRadius: "12px", fontWeight: "bold", fontSize: "14px", border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)", transition: "all 0.2s" }}
                >
                  {showForm ? "Cancel Form" : "+ Add New Point"}
                </button>
              </div>
            )}
          </div>

          {/* RESIZED MAP CONTAINER (360px HEIGHT) PLACED FIRST */}
          <div style={{ ...glassCard, padding: "12px", height: "360px" }}>
             <div style={{ width: "100%", height: "100%", borderRadius: "16px", overflow: "hidden" }}>
                <MapContainer center={mapCenter} zoom={11} style={{ height: "100%", width: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                  {points.map((point) => {
                    if (!point.location || !point.location.coordinates) return null;
                    const position = [point.location.coordinates[1], point.location.coordinates[0]];
                    const pointReports = reports.filter(r => r.point_id === point._id && r.status !== "Resolved");

                    return (
                      <Marker key={point._id} position={position}>
                        <Popup minWidth={300}>
                          <div style={{ fontFamily: "sans-serif" }}>
                            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "bold", color: "#0f172a" }}>{point.name}</h3>
                            <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#64748b", fontWeight: "500" }}>Status: {point.current_status}</p>
                            
                            {pointReports.length > 0 && (
                              <div style={{ marginTop: "12px", borderTop: "1px solid #e2e8f0", paddingTop: "8px" }}>
                                <strong style={{ fontSize: "12px", color: "#dc2626", display: "block", marginBottom: "8px" }}>Active Complaints:</strong>
                                {pointReports.map(r => (
                                  <div key={r._id} style={{ backgroundColor: "#f8fafc", padding: "8px", borderRadius: "8px", marginBottom: "8px", border: "1px solid #e2e8f0" }}>
                                    <strong style={{ fontSize: "12px", color: "#1e293b" }}>{r.issue_type}</strong>
                                    <p style={{ margin: "4px 0", fontSize: "11px", color: "#64748b" }}>{r.description}</p>
                                    <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
                                      <select 
                                        onChange={(e) => setSelectedTeams({ ...selectedTeams, [r._id]: e.target.value })}
                                        style={{ flex: 1, padding: "4px", fontSize: "11px", border: "1px solid #cbd5e1", borderRadius: "4px", backgroundColor: "white" }}
                                      >
                                        <option value="">Select Team</option>
                                        {teams.map(t => <option key={t._id} value={t._id}>{t.team_name}</option>)}
                                      </select>
                                      <button onClick={() => handleQuickAssign(r._id)} style={{ padding: "4px 8px", backgroundColor: "#3b82f6", color: "white", fontSize: "11px", fontWeight: "bold", border: "none", borderRadius: "4px", cursor: "pointer" }}>Assign</button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
             </div>
          </div>

          {/* ADD POINT FORM */}
          {showForm && isAdmin && (
            <form onSubmit={handleAddPoint} style={{ ...glassCard, padding: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
              <input required placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: "12px", borderRadius: "12px", backgroundColor: "var(--input-bg)", border: "1px solid var(--glass-border)", color: "var(--text-color)", outline: "none" }} />
              <input required placeholder="District" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} style={{ padding: "12px", borderRadius: "12px", backgroundColor: "var(--input-bg)", border: "1px solid var(--glass-border)", color: "var(--text-color)", outline: "none" }} />
              <input required placeholder="Area" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} style={{ padding: "12px", borderRadius: "12px", backgroundColor: "var(--input-bg)", border: "1px solid var(--glass-border)", color: "var(--text-color)", outline: "none" }} />
              <select value={formData.waste_type} onChange={e => setFormData({...formData, waste_type: e.target.value})} style={{ padding: "12px", borderRadius: "12px", backgroundColor: "var(--input-bg)", border: "1px solid var(--glass-border)", color: "var(--text-color)", outline: "none" }}>
                <option value="Mixed">Mixed</option>
                <option value="Organic">Organic</option>
                <option value="Plastics">Plastics</option>
              </select>
              <input required type="number" step="any" placeholder="Latitude" value={formData.lat} onChange={e => setFormData({...formData, lat: e.target.value})} style={{ padding: "12px", borderRadius: "12px", backgroundColor: "var(--input-bg)", border: "1px solid var(--glass-border)", color: "var(--text-color)", outline: "none" }} />
              <input required type="number" step="any" placeholder="Longitude" value={formData.lng} onChange={e => setFormData({...formData, lng: e.target.value})} style={{ padding: "12px", borderRadius: "12px", backgroundColor: "var(--input-bg)", border: "1px solid var(--glass-border)", color: "var(--text-color)", outline: "none" }} />
              <button type="submit" style={{ backgroundColor: "#22c55e", color: "white", fontWeight: "bold", borderRadius: "12px", border: "none", cursor: "pointer", padding: "12px 24px" }}>Save Point</button>
            </form>
          )}

          {/* COLLECTION POINTS DIRECTORY TABLE */}
          <div style={{ ...glassCard, overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--glass-border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "var(--text-color)" }}>Collection Points Directory</h3>
              <input 
                type="text" 
                placeholder="Search points by name, district, or ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: "100%", maxWidth: "320px", padding: "10px 14px", borderRadius: "10px", backgroundColor: "var(--input-bg)", border: "1px solid var(--glass-border)", color: "var(--text-color)", outline: "none", fontSize: "14px" }}
              />
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", borderBottom: "1px solid var(--glass-border)" }}>
                    <th style={{ padding: "16px 16px 16px 24px", fontWeight: "600" }}>ID</th>
                    <th style={{ padding: "16px", fontWeight: "600" }}>Name</th>
                    <th style={{ padding: "16px", fontWeight: "600" }}>District</th>
                    <th style={{ padding: "16px 24px 16px 16px", fontWeight: "600" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPoints.map(point => (
                    <tr 
                      key={point._id} 
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.04)"} 
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                      style={{ borderBottom: "1px solid var(--glass-border)", transition: "background-color 0.2s" }}
                    >
                      <td style={{ padding: "16px 16px 16px 24px", fontSize: "14px", fontWeight: "600", color: "var(--text-muted)" }}>{point._id}</td>
                      <td style={{ padding: "16px", fontSize: "14px", fontWeight: "700", color: "var(--text-color)" }}>{point.name}</td>
                      <td style={{ padding: "16px", fontSize: "14px", fontWeight: "500", color: "var(--text-color)" }}>{point.district}</td>
                      <td style={{ padding: "16px 24px 16px 16px" }}>
                        <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", backgroundColor: point.current_status === "Full" || point.current_status === "Overflowing" ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)", color: point.current_status === "Full" || point.current_status === "Overflowing" ? "#f87171" : "#4ade80" }}>
                          {point.current_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredPoints.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>No collection points defined yet. Add a point to put it on the map.</td>
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