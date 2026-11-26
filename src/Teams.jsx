/**
 * Teams.jsx
 * Collection Teams management page featuring photographic background team cards,
 * interactive workforce modals, and human-centered copywriting.
 */




import { useState, useEffect } from "react";
import Layout from "./Layout";
import toast from "react-hot-toast";

const API_URL = "https://smartwaste-sys-backend.onrender.com";

const teamImages = [
  "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?q=80&w=1000&auto=format&fit=crop"
];

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ team_name: "", district: "", team_status: "Active" });
  
  // Interactive Modal / Drawer State for Team Deep Dive
  const [selectedTeam, setSelectedTeam] = useState(null);

  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("role") === "admin";

  const fetchTeams = () => {
    fetch(`${API_URL}/api/teams`, { headers: { Authorization: `Bearer ${token}` } })
  .then(res => res.json())
      .then(res => res.json())
      .then(data => { setTeams(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchTeams(); }, [token]);

  const handleAddTeam = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setShowForm(false);
        setFormData({ team_name: "", district: "", team_status: "Active" });
        toast.success("Team added successfully");
        fetchTeams();
      }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team?")) return;
    try {
      const response = await fetch(`${API_URL}/api/teams/${id}`,  {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        toast.success("Team deleted");
        fetchTeams();
      }
    } catch (err) { console.error(err); }
  };

  if (loading) return <Layout><div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>Loading teams...</div></Layout>;

  const glassCard = { backgroundColor: "var(--glass-bg)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid var(--glass-border)", borderRadius: "24px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", transition: "all 0.3s ease" };
  const inputStyle = { width: "100%", padding: "12px", borderRadius: "12px", backgroundColor: "var(--input-bg)", border: "1px solid var(--glass-border)", color: "var(--text-color)", outline: "none", transition: "border-color 0.2s" };

  const handleCardHover = (e, enter) => {
    e.currentTarget.style.transform = enter ? "translateY(-6px)" : "translateY(0px)";
    e.currentTarget.style.boxShadow = enter ? "0 14px 40px rgba(59, 130, 246, 0.2)" : "0 8px 32px rgba(0,0,0,0.3)";
  };

  return (
    <Layout>
      <div style={{ position: "relative", minHeight: "calc(100vh - 100px)", paddingBottom: "40px" }}>
        
        {/* PAGE-SPECIFIC BACKGROUND IMAGE WITH GRADIENT OVERLAY */}
        <div style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }}>
          <img 
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop" 
            alt="Workforce Operations Background" 
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.22 }} 
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, var(--bg-color), rgba(11, 15, 25, 0.85))" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px", position: "relative", zIndex: 1 }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "30px", fontWeight: "900", color: "var(--text-color)" }}>The Crews That Keep Us Clean</h2>
              <p style={{ margin: "4px 0 0 0", fontSize: "16px", fontWeight: "500", color: "var(--text-muted)" }}>Behind every clean street is a team of people who got up before sunrise and did the work.</p>
            </div>
            {isAdmin && (
              <button 
                onClick={() => setShowForm(!showForm)} 
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.filter = "brightness(1.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0px)"; e.currentTarget.style.filter = "brightness(1)"; }}
                style={{ backgroundColor: "#3b82f6", color: "white", padding: "10px 20px", borderRadius: "12px", fontWeight: "bold", fontSize: "14px", border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)", transition: "all 0.2s" }}
              >
                {showForm ? "Cancel" : "+ Add New Team"}
              </button>
            )}
          </div>

          {showForm && isAdmin && (
            <form onSubmit={handleAddTeam} style={{ ...glassCard, padding: "24px", display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-end" }}>
              <div style={{ flex: 1, minWidth: "200px" }}>
                <label style={{ fontSize: "12px", fontWeight: "bold", color: "var(--text-muted)", marginBottom: "4px", display: "block" }}>Team Name</label>
                <input required value={formData.team_name} onChange={e => setFormData({...formData, team_name: e.target.value})} onFocus={(e) => e.target.style.borderColor = "#3b82f6"} onBlur={(e) => e.target.style.borderColor = "var(--glass-border)"} style={inputStyle} />
              </div>
              <div style={{ flex: 1, minWidth: "200px" }}>
                <label style={{ fontSize: "12px", fontWeight: "bold", color: "var(--text-muted)", marginBottom: "4px", display: "block" }}>District</label>
                <input required value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} onFocus={(e) => e.target.style.borderColor = "#3b82f6"} onBlur={(e) => e.target.style.borderColor = "var(--glass-border)"} style={inputStyle} />
              </div>
              <button 
                type="submit" 
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.filter = "brightness(1.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0px)"; e.currentTarget.style.filter = "brightness(1)"; }}
                style={{ backgroundColor: "#22c55e", color: "white", fontWeight: "bold", padding: "12px 24px", borderRadius: "12px", border: "none", cursor: "pointer", transition: "all 0.2s" }}
              >
                Save Team
              </button>
            </form>
          )}

          {/* TEAM CARDS GRID */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
            {teams.map((team, index) => (
              <div 
                key={team._id} 
                onClick={() => setSelectedTeam(team)}
                onMouseEnter={(e) => handleCardHover(e, true)}
                onMouseLeave={(e) => handleCardHover(e, false)}
                style={{ ...glassCard, position: "relative", height: "260px", borderRadius: "24px", overflow: "hidden", cursor: "pointer" }}
              >
                <img src={teamImages[index % teamImages.length]} alt={team.team_name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)" }} />
                
                <div style={{ position: "absolute", inset: 0, padding: "24px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                      <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", marginBottom: "8px", backdropFilter: "blur(8px)", backgroundColor: team.team_status === "Active" ? "rgba(34, 197, 94, 0.2)" : "rgba(245, 158, 11, 0.2)", color: team.team_status === "Active" ? "#4ade80" : "#fbbf24", border: team.team_status === "Active" ? "1px solid rgba(34, 197, 94, 0.3)" : "1px solid rgba(245, 158, 11, 0.3)" }}>
                        ● {team.team_status}
                      </span>
                      <h3 style={{ margin: 0, color: "white", fontSize: "20px", fontWeight: "900", lineHeight: "1.2" }}>{team.team_name}</h3>
                      <p style={{ margin: "4px 0 0 0", color: "#cbd5e1", fontSize: "14px", fontWeight: "500" }}>📍 {team.district} District</p>
                    </div>
                    
                    {isAdmin && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(team._id); }} 
                        onMouseEnter={(e) => e.currentTarget.style.filter = "brightness(1.3)"}
                        onMouseLeave={(e) => e.currentTarget.style.filter = "brightness(1)"}
                        style={{ backgroundColor: "rgba(239, 68, 68, 0.2)", color: "#f87171", padding: "8px", borderRadius: "12px", border: "1px solid rgba(239, 68, 68, 0.3)", cursor: "pointer", backdropFilter: "blur(8px)", transition: "filter 0.2s" }} 
                        title="Delete Team"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {teams.length === 0 && (
              <div style={{ ...glassCard, padding: "40px", gridColumn: "1 / -1", textAlign: "center", color: "var(--text-muted)" }}>
                No teams registered yet. Add your first collection team to start dispatching.
              </div>
            )}
          </div>

          {/* TEAM DETAILS MODAL */}
          {selectedTeam && (
            <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10000, padding: "20px" }}>
              <div style={{ ...glassCard, width: "100%", maxWidth: "450px", padding: "32px", backgroundColor: "var(--bg-color)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", backgroundColor: selectedTeam.team_status === "Active" ? "rgba(34, 197, 94, 0.2)" : "rgba(245, 158, 11, 0.2)", color: selectedTeam.team_status === "Active" ? "#4ade80" : "#fbbf24" }}>
                    ● {selectedTeam.team_status}
                  </span>
                  <button onClick={() => setSelectedTeam(null)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", fontSize: "20px", cursor: "pointer", fontWeight: "bold" }}>&times;</button>
                </div>
                
                <h3 style={{ margin: "0 0 8px 0", fontSize: "24px", fontWeight: "900", color: "var(--text-color)" }}>{selectedTeam.team_name}</h3>
                <p style={{ margin: "0 0 24px 0", fontSize: "14px", color: "var(--text-muted)", fontWeight: "600" }}>Assigned Operating District: <span style={{ color: "var(--text-color)" }}>{selectedTeam.district}</span></p>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px", backgroundColor: "var(--input-bg)", padding: "16px", borderRadius: "16px", border: "1px solid var(--glass-border)", marginBottom: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                    <span style={{ color: "var(--text-muted)", fontWeight: "600" }}>Team ID:</span>
                    <span style={{ color: "var(--text-color)", fontWeight: "700" }}>{selectedTeam._id}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                    <span style={{ color: "var(--text-muted)", fontWeight: "600" }}>Workforce Status:</span>
                    <span style={{ color: "#4ade80", fontWeight: "700" }}>Fully Operational</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                    <span style={{ color: "var(--text-muted)", fontWeight: "600" }}>Assigned Routes:</span>
                    <span style={{ color: "#3b82f6", fontWeight: "700" }}>Active Schedule Managed</span>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedTeam(null)} 
                  style={{ width: "100%", padding: "14px", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold", boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)" }}
                >
                  Close Details
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}