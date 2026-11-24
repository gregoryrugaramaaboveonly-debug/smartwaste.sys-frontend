import { useNavigate } from "react-router-dom";

export default function CitizenAbout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#f4fdf8", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      
      {/* CITIZEN NAVBAR */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 40px", backgroundColor: "#065f46", color: "white", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "800", letterSpacing: "0.5px" }}>SmartWaste</h1>
        </div>
        
        <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
          <span onClick={() => navigate("/citizenHome")} style={{ cursor: "pointer", fontWeight: "500", color: "#dcfce7" }}>Home</span>
          <span onClick={() => navigate("/citizen")} style={{ cursor: "pointer", fontWeight: "500", color: "#dcfce7" }}>Live Map</span>
          <span style={{ cursor: "pointer", fontWeight: "600", color: "#22c55e", borderBottom: "2px solid #22c55e", paddingBottom: "4px" }}>About Us</span>
          <span onClick={() => navigate("/contact")} style={{ cursor: "pointer", fontWeight: "500", color: "#dcfce7" }}>Contact</span>
        </div>

        <div>
          <button onClick={handleLogout} style={{ padding: "8px 20px", backgroundColor: "transparent", color: "white", border: "1px solid #22c55e", borderRadius: "20px", cursor: "pointer", fontWeight: "bold" }}>Log Out</button>
        </div>
      </div>

      {/* MAIN CONTENT - CENTERED WITH MAX WIDTH */}
      <div style={{ flex: 1, padding: "60px 40px", maxWidth: "1200px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: "50px" }}>
        
        {/* HERO */}
        <div style={{ 
          position: "relative",
          borderRadius: "24px", 
          overflow: "hidden",
          minHeight: "400px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "80px 40px",
          backgroundImage: `url('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow: "0 20px 25px -5px rgba(6, 78, 59, 0.3)"
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to top, rgba(6, 78, 59, 0.9), rgba(6, 78, 59, 0.4))" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h1 style={{ margin: "0 0 20px 0", fontSize: "52px", fontWeight: "900", color: "white", lineHeight: "1.1" }}>EXCELLENCE IN WASTE MANAGEMENT</h1>
            <p style={{ margin: "0 auto", fontSize: "20px", color: "#e2e8f0", fontWeight: "500", maxWidth: "700px", lineHeight: "1.5" }}>
              SmartWaste is a premium, community-driven platform connecting citizens, professional collection teams, and city administrators.
            </p>
          </div>
        </div>

        {/* IMPACT STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "30px" }}>
          <div style={{ backgroundColor: "white", padding: "40px", borderRadius: "20px", textAlign: "center", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
            <h2 style={{ margin: "0 0 10px 0", fontSize: "42px", fontWeight: "900", color: "#16a34a" }}>10,000+</h2>
            <p style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>Tons Collected</p>
          </div>
          <div style={{ backgroundColor: "white", padding: "40px", borderRadius: "20px", textAlign: "center", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
            <h2 style={{ margin: "0 0 10px 0", fontSize: "42px", fontWeight: "900", color: "#16a34a" }}>99.8%</h2>
            <p style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>On-Time Resolution</p>
          </div>
          <div style={{ backgroundColor: "white", padding: "40px", borderRadius: "20px", textAlign: "center", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
            <h2 style={{ margin: "0 0 10px 0", fontSize: "42px", fontWeight: "900", color: "#16a34a" }}>50+</h2>
            <p style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>Professional Teams</p>
          </div>
        </div>

        {/* VISION & VALUES */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
          <div style={{ backgroundColor: "white", padding: "50px", borderRadius: "20px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", borderTop: "4px solid #16a34a" }}>
            <h2 style={{ margin: "0 0 20px 0", fontSize: "28px", color: "#064e3b", fontWeight: "800" }}>Our Vision</h2>
            <p style={{ margin: 0, color: "#475569", fontSize: "16px", lineHeight: "1.8" }}>
              We envision a future where waste is managed seamlessly through technology. A city where every neighborhood is clean, safe, and healthy.
            </p>
          </div>
          <div style={{ backgroundColor: "white", padding: "50px", borderRadius: "20px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", borderTop: "4px solid #16a34a" }}>
            <h2 style={{ margin: "0 0 20px 0", fontSize: "28px", color: "#064e3b", fontWeight: "800" }}>Core Values</h2>
            <ul style={{ margin: 0, padding: "0 0 0 20px", color: "#475569", fontSize: "16px", lineHeight: "1.8" }}>
              <li><strong>Excellence:</strong> Professional and on time, every time.</li>
              <li><strong>Transparency:</strong> Real-time data open to the public.</li>
              <li><strong>Sustainability:</strong> Promoting recycling and responsible habits.</li>
            </ul>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ textAlign: "center", padding: "40px 0 20px 0", borderTop: "1px solid #e2e8f0", marginTop: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "900", color: "#064e3b", letterSpacing: "1px" }}>SMART<span style={{ color: "#16a34a" }}>WASTE</span></h2>
          <p style={{ margin: "10px 0 0 0", fontSize: "12px", color: "#94a3b8" }}>© 2026 SmartWaste Civic Operations. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}