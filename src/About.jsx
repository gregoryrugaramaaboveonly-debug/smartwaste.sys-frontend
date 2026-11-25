/**
 * About.jsx
 * About Us page featuring corporate background history, the global waste crisis,
 * mission statement, impact statistics, and human-centered copywriting.
 */

import { useNavigate } from "react-router-dom";
import Layout from "./Layout";

const API_URL = "https://smartwaste-sys-backend.onrender.com";

export default function About() {
  const navigate = useNavigate();
  const glassCard = { backgroundColor: "var(--glass-bg)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid var(--glass-border)", borderRadius: "24px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", transition: "all 0.3s ease" };

  const handleCardHover = (e, enter) => {
    e.currentTarget.style.transform = enter ? "translateY(-6px)" : "translateY(0px)";
    e.currentTarget.style.boxShadow = enter ? "0 14px 40px rgba(34, 197, 94, 0.15)" : "0 8px 32px rgba(0,0,0,0.1)";
  };

  return (
    <Layout>
      <div style={{ position: "relative", minHeight: "calc(100vh - 100px)", paddingBottom: "40px" }}>
        
        {/* PAGE-SPECIFIC BACKGROUND IMAGE WITH GRADIENT OVERLAY */}
        <div style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }}>
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
            alt="About Corporate Background" 
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.22 }} 
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, var(--bg-color), rgba(11, 15, 25, 0.85))" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "40px", position: "relative", zIndex: 1 }}>
          
          {/* HERO SECTION WITH USER'S URGENT COPYWRITING */}
          <div style={{ position: "relative", borderRadius: "24px", overflow: "hidden", minHeight: "450px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "60px 40px", ...glassCard }}>
            <img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop" alt="Waste Management" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.3 }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, var(--bg-color), rgba(0,0,0,0.6), rgba(0,0,0,0.3))" }} />
            
            <div style={{ position: "relative", zIndex: 10, maxWidth: "800px" }}>
              <h1 style={{ margin: "0 0 20px 0", fontSize: "clamp(36px, 5vw, 60px)", fontWeight: "900", color: "white", lineHeight: "1.1", letterSpacing: "-1px", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
                Your City Is Drowning in Waste. We Built the Lifeboat.
              </h1>
              <p style={{ margin: "0 auto 30px auto", fontSize: "18px", color: "#e2e8f0", fontWeight: "500", lineHeight: "1.6", textShadow: "0 1px 5px rgba(0,0,0,0.5)" }}>
                2.01 billion tonnes of waste are generated every year. Most of it ends up in the wrong place. SmartWaste connects citizens who spot the problem, teams who solve it, and city officials who track it — all in one real-time platform. This isn't just an app. It's how we take our streets back.
              </p>
              <button 
                onClick={() => navigate("/contact")} 
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.filter = "brightness(1.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0px)"; e.currentTarget.style.filter = "brightness(1)"; }}
                style={{ padding: "16px 36px", backgroundColor: "#22c55e", color: "white", border: "none", borderRadius: "30px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "10px", boxShadow: "0 8px 24px rgba(34, 197, 94, 0.4)", transition: "all 0.2s" }}
              >
                Contact Us Today
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>
          </div>

          {/* IMPACT STATISTICS GRID */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            {[
              { value: "10,000+ Tonnes", label: "Waste removed from our streets, our neighborhoods, and our oceans. That's not just a number. It's a better city." },
              { value: "99.8% On-Time", label: "Our teams don't make excuses. They make deadlines." },
              { value: "50+ Teams", label: "Real people, in real trucks, doing real work. These are the hands that keep your city clean." }
            ].map((stat, i) => (
              <div 
                key={i} 
                onMouseEnter={(e) => handleCardHover(e, true)}
                onMouseLeave={(e) => handleCardHover(e, false)}
                style={{ ...glassCard, padding: "32px 24px", textAlign: "center", cursor: "default", display: "flex", flexDirection: "column", justifyContent: "center" }}
              >
                <h2 style={{ margin: "0 0 10px 0", fontSize: "36px", fontWeight: "900", color: "#22c55e", letterSpacing: "-1px" }}>{stat.value}</h2>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: "500", color: "var(--text-muted)", lineHeight: "1.5" }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* WHY SMARTWASTE EXISTS / MISSION SECTION */}
          <div 
            onMouseEnter={(e) => handleCardHover(e, true)}
            onMouseLeave={(e) => handleCardHover(e, false)}
            style={{ ...glassCard, padding: "40px", borderLeft: "6px solid #22c55e" }}
          >
            <h2 style={{ margin: "0 0 16px 0", fontSize: "28px", color: "var(--text-color)", fontWeight: "900" }}>Why SmartWaste Exists</h2>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "16px", lineHeight: "1.8" }}>
              We didn't build SmartWaste to make money. We built it because we watched our neighborhoods choke on uncollected waste. We saw children playing near overflowing bins. We saw city officials overwhelmed by complaints they couldn't track. We saw collection teams arriving at the wrong locations because the system was broken. So we fixed it. SmartWaste is the digital bridge between the people who care and the people who can act. Every report you submit, every team we dispatch, every bin we empty — it's one step closer to a city that works.
            </p>
          </div>

          {/* THE GLOBAL CRISIS SECTION */}
          <div 
            onMouseEnter={(e) => handleCardHover(e, true)}
            onMouseLeave={(e) => handleCardHover(e, false)}
            style={{ ...glassCard, position: "relative", padding: "50px 40px", overflow: "hidden" }}
          >
            <img src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=2000&auto=format&fit=crop" alt="Nature Background" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.1 }} />
            <div style={{ position: "relative", zIndex: 10 }}>
              <h2 style={{ textAlign: "center", fontSize: "32px", fontWeight: "900", marginBottom: "12px", color: "#22c55e" }}>The Numbers Don't Lie</h2>
              <p style={{ textAlign: "center", fontSize: "16px", color: "var(--text-muted)", marginBottom: "40px", fontWeight: "500" }}>This isn't a problem for someone else to solve. It's happening outside your door.</p>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "30px" }}>
                <div style={{ borderLeft: "4px solid #22c55e", paddingLeft: "20px" }}>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "32px", fontWeight: "900", color: "var(--text-color)", lineHeight: "1" }}>2.01 Billion Tonnes</h3>
                  <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "15px", lineHeight: "1.6" }}>The amount of waste the world generates every year. That's enough to fill a football stadium every single day.</p>
                </div>
                <div style={{ borderLeft: "4px solid #22c55e", paddingLeft: "20px" }}>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "32px", fontWeight: "900", color: "var(--text-color)", lineHeight: "1" }}>1 in 3 People</h3>
                  <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "15px", lineHeight: "1.6" }}>Live without access to controlled waste disposal. That's 2.7 billion people whose waste is dumped or burned in the open.</p>
                </div>
                <div style={{ borderLeft: "4px solid #22c55e", paddingLeft: "20px" }}>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "32px", fontWeight: "900", color: "var(--text-color)", lineHeight: "1" }}>100+ Years</h3>
                  <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "15px", lineHeight: "1.6" }}>How long a single plastic bottle will pollute our oceans before it breaks down. A bottle used for 5 minutes outlives the person who used it.</p>
                </div>
              </div>
            </div>
          </div>

          {/* CORE VALUES & TRUST */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "24px" }}>
            <div 
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
              style={{ ...glassCard, padding: "40px", borderTop: "4px solid #22c55e" }}
            >
              <h2 style={{ margin: "0 0 20px 0", fontSize: "26px", color: "var(--text-color)", fontWeight: "800" }}>Core Values</h2>
              <ul style={{ margin: 0, padding: "0 0 0 20px", color: "var(--text-muted)", fontSize: "16px", lineHeight: "1.8" }}>
                <li style={{ marginBottom: "12px" }}><strong style={{ color: "var(--text-color)" }}>Excellence:</strong> We don't just collect waste. We do it professionally, on time, and every single time.</li>
                <li style={{ marginBottom: "12px" }}><strong style={{ color: "var(--text-color)" }}>Transparency:</strong> Our data is open. Our progress is public. You see what we see.</li>
                <li><strong style={{ color: "var(--text-color)" }}>Sustainability:</strong> We recycle, we reduce, we reuse. Because the planet doesn't have a backup.</li>
              </ul>
            </div>

            <div 
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
              style={{ ...glassCard, padding: "40px", borderTop: "4px solid #22c55e" }}
            >
              <h2 style={{ margin: "0 0 20px 0", fontSize: "26px", color: "var(--text-color)", fontWeight: "800" }}>For Homes, Estates, and Businesses</h2>
              <p style={{ margin: "0 0 16px 0", color: "var(--text-muted)", fontSize: "16px", lineHeight: "1.7" }}>
                We offer a discreet, premium home collection service. Verified teams. Real-time tracking. Guaranteed 24-hour response. When you book with SmartWaste, you're not just paying for a service. You're paying for peace of mind.
              </p>
              <button 
                onClick={() => navigate("/contact")} 
                style={{ padding: "12px 24px", backgroundColor: "#22c55e", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold", fontSize: "15px", boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)" }}
              >
                Book Home Collection
              </button>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}