/**
 * Layout.jsx
 * Universal layout wrapper featuring a blurred photographic background,
 * adaptive dark overlays, and theme-adaptive solid modals for light/dark mode.
 */

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const API_URL = "https://smartwaste-sys-backend.onrender.com";
const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop";

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [profileName, setProfileName] = useState(() => localStorage.getItem("name") || "Gregory Rugarama");
  const [profileImage, setProfileImage] = useState(() => localStorage.getItem("profileImage") || DEFAULT_AVATAR);
  const role = localStorage.getItem("role") || "reporter";

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passMessage, setPassMessage] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") setIsDarkMode(false);
    else setIsDarkMode(true);

    const syncProfile = () => {
      setProfileName(localStorage.getItem("name") || "Gregory Rugarama");
      setProfileImage(localStorage.getItem("profileImage") || DEFAULT_AVATAR);
    };

    window.addEventListener("profileUpdated", syncProfile);
    window.addEventListener("storage", syncProfile);
    return () => {
      window.removeEventListener("profileUpdated", syncProfile);
      window.removeEventListener("storage", syncProfile);
    };
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPassMessage("Updating...");
    const token = localStorage.getItem("token");

    try {
      // FIXED: Now uses the dynamic API_URL
      const response = await fetch(`${API_URL}/api/auth/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ oldPassword, newPassword })
      });

      const data = await response.json();
      if (response.ok) {
        setPassMessage("Password updated successfully!");
        setTimeout(() => {
          setShowPasswordModal(false);
          setPassMessage("");
          setOldPassword("");
          setNewPassword("");
        }, 2000);
      } else {
        setPassMessage(data.error);
      }
    } catch (err) {
      setPassMessage("Server error.");
    }
  };

  const allNavItems = [
    { path: "/dashboard", label: "Dashboard", adminOnly: false, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> },
    { path: "/points", label: "Collection Points", adminOnly: false, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> },
    { path: "/teams", label: "Teams", adminOnly: true, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
    { path: "/schedules", label: "Schedules", adminOnly: true, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> },
    { path: "/reports", label: "Reports", adminOnly: false, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> },
    { path: "/about", label: "About Us", adminOnly: false, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> },
    { path: "/contact", label: "Contact Us", adminOnly: false, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> },
  ];

  const navItems = allNavItems.filter(item => !item.adminOnly || role === "admin");

  const cssVariables = {
    "--text-color": isDarkMode ? "#f8fafc" : "#0f172a",
    "--text-muted": isDarkMode ? "#94a3b8" : "#475569",
    "--glass-bg": isDarkMode ? "rgba(15, 23, 42, 0.75)" : "rgba(255, 255, 255, 0.88)",
    "--glass-border": isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.12)",
    "--input-bg": isDarkMode ? "rgba(0, 0, 0, 0.4)" : "rgba(255, 255, 255, 0.95)",
  };

  const styles = {
    appContainer: { 
      display: "flex", 
      minHeight: "100vh", 
      padding: "16px", 
      gap: "24px",
      position: "relative",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: "var(--text-color)",
    },
    bgContainer: {
      position: "fixed",
      inset: 0,
      zIndex: -1,
      pointerEvents: "none",
      overflow: "hidden",
    },
    bgImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      filter: "blur(10px)",
      transform: "scale(1.05)",
      opacity: isDarkMode ? 0.45 : 0.35,
    },
    bgOverlay: {
      position: "absolute",
      inset: 0,
      background: isDarkMode 
        ? "rgba(11, 15, 25, 0.82)" 
        : "rgba(15, 23, 42, 0.75)",
    },
    sidebar: { 
      width: isSidebarOpen ? "260px" : "80px", 
      backgroundColor: "var(--glass-bg)", 
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      border: "1px solid var(--glass-border)",
      borderRadius: "24px",
      display: "flex", 
      flexDirection: "column", 
      justifyContent: "space-between",
      padding: isSidebarOpen ? "24px" : "24px 12px", 
      transition: "width 0.3s ease-in-out, padding 0.3s ease-in-out",
      position: "sticky",
      top: "16px",
      height: "calc(100vh - 32px)",
      overflow: "hidden",
      boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
      zIndex: 10
    },
    logoArea: { display: "flex", alignItems: "center", justifyContent: isSidebarOpen ? "space-between" : "center", marginBottom: "28px" },
    navItem: { padding: "12px", margin: "2px 0", borderRadius: "16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "16px", color: "var(--text-muted)", textDecoration: "none", transition: "all 0.2s", fontSize: "14px", fontWeight: "500", whiteSpace: "nowrap" },
    navItemActive: { padding: "12px", margin: "2px 0", borderRadius: "16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "16px", color: "#3b82f6", backgroundColor: "rgba(59, 130, 246, 0.15)", textDecoration: "none", fontSize: "14px", fontWeight: "600", whiteSpace: "nowrap" },
    mainContent: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0, justifyContent: "space-between", zIndex: 10 },
    topHeader: { 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center", 
      marginBottom: "32px", 
      padding: isDarkMode ? "0 16px" : "10px 20px",
      backgroundColor: isDarkMode ? "transparent" : "rgba(255, 255, 255, 0.85)",
      backdropFilter: isDarkMode ? "none" : "blur(12px)",
      WebkitBackdropFilter: isDarkMode ? "none" : "blur(12px)",
      borderRadius: isDarkMode ? "0" : "20px",
      border: isDarkMode ? "none" : "1px solid rgba(0, 0, 0, 0.1)",
      boxShadow: isDarkMode ? "none" : "0 4px 20px rgba(0,0,0,0.08)"
    },
    footerArea: { 
      padding: isDarkMode ? "32px 16px 16px 16px" : "20px 20px", 
      textAlign: "center", 
      borderTop: isDarkMode ? "1px solid var(--glass-border)" : "none", 
      marginTop: "40px", 
      backgroundColor: isDarkMode ? "transparent" : "rgba(255, 255, 255, 0.85)",
      backdropFilter: isDarkMode ? "none" : "blur(12px)",
      WebkitBackdropFilter: isDarkMode ? "none" : "blur(12px)",
      borderRadius: isDarkMode ? "0" : "20px",
      border: isDarkMode ? "none" : "1px solid rgba(0, 0, 0, 0.1)",
      boxShadow: isDarkMode ? "none" : "0 -4px 20px rgba(0,0,0,0.08)",
      color: "var(--text-muted)", 
      fontSize: "13px", 
      fontWeight: "500" 
    },
    modalOverlay: { 
      position: "fixed", 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.75)" : "rgba(15, 23, 42, 0.5)", 
      backdropFilter: "blur(6px)", 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      zIndex: 10000 
    },
    modalBox: { 
      backgroundColor: isDarkMode ? "rgba(15, 23, 42, 0.95)" : "#ffffff", 
      border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid rgba(0, 0, 0, 0.15)", 
      padding: "30px", 
      borderRadius: "24px", 
      width: "420px", 
      boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
      color: isDarkMode ? "#f8fafc" : "#0f172a"
    },
    glassPanel: { backgroundColor: "var(--glass-bg)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid var(--glass-border)", borderRadius: "24px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }
  };

  const getLinkStyle = (path) => {
    const isActive = location.pathname === path;
    return {
      ...(isActive ? styles.navItemActive : styles.navItem),
      justifyContent: isSidebarOpen ? "flex-start" : "center",
    };
  };

  return (
    <div style={{ ...styles.appContainer, ...cssVariables }}>
      
      <div style={styles.bgContainer}>
        <img 
          src="https://images.unsplash.com/photo-1519331379826-f10be5486c6f?q=80&w=2070&auto=format&fit=crop" 
          alt="Blurred Nature Background" 
          style={styles.bgImage} 
        />
        <div style={styles.bgOverlay} />
      </div>

      <div style={styles.sidebar}>
        <div>
          <div style={styles.logoArea}>
            {isSidebarOpen && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ backgroundColor: "#3b82f6", padding: "6px", borderRadius: "8px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </div>
                <h2 style={{ margin: 0, fontSize: "18px", letterSpacing: "0.5px", fontWeight: "700", color: "var(--text-color)" }}>SmartWaste</h2>
              </div>
            )}
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          </div>

          <div onClick={() => navigate("/contact")} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px", marginBottom: "20px", borderRadius: "16px", backgroundColor: "var(--input-bg)", border: "1px solid var(--glass-border)", cursor: "pointer", justifyContent: isSidebarOpen ? "flex-start" : "center" }} title="Edit Profile">
            <img src={profileImage} alt="Profile" style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", border: "2px solid #3b82f6", flexShrink: 0 }} />
            {isSidebarOpen && (
              <div style={{ overflow: "hidden" }}>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "var(--text-color)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{profileName}</p>
                <p style={{ margin: 0, fontSize: "11px", color: "#60a5fa", fontWeight: "600", textTransform: "capitalize" }}>{role === "admin" ? "Admin" : "Citizen"}</p>
              </div>
            )}
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} style={getLinkStyle(item.path)}>
                {item.icon}
                {isSidebarOpen && item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div style={{ paddingTop: "16px", borderTop: "1px solid var(--glass-border)", display: "flex", flexDirection: "column", gap: "8px" }}>
          <button onClick={toggleTheme} style={{ ...styles.navItem, backgroundColor: "var(--input-bg)", border: "1px solid var(--glass-border)", color: "var(--text-color)", width: "100%", justifyContent: isSidebarOpen ? "flex-start" : "center" }}>
            {isDarkMode ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                {isSidebarOpen && <span style={{ fontWeight: "600" }}>Light Mode</span>}
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                {isSidebarOpen && <span style={{ fontWeight: "600" }}>Dark Mode</span>}
              </>
            )}
          </button>

          <button onClick={handleLogout} style={{ ...styles.navItem, color: "#f87171", backgroundColor: "transparent", border: "none", width: "100%", justifyContent: isSidebarOpen ? "flex-start" : "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            {isSidebarOpen && <span style={{ fontWeight: "600" }}>Log Out</span>}
          </button>
        </div>
      </div>

      <div style={styles.mainContent}>
        <div>
          <div style={styles.topHeader}>
            <div style={{ flex: 1 }}></div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ backgroundColor: "#3b82f6", padding: "8px", borderRadius: "12px", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </div>
              <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "900", letterSpacing: "-0.5px", color: "var(--text-color)" }}>SmartWaste</h1>
            </div>
            
            <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "16px" }}>
              {location.pathname !== "/dashboard" && (
                <button onClick={() => navigate("/dashboard")} style={{ ...styles.glassPanel, display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", cursor: "pointer", color: "var(--text-color)", fontSize: "14px", fontWeight: "600" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                  Back
                </button>
              )}
              <button onClick={() => setShowPasswordModal(true)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>Security</button>
            </div>
          </div>
          
          <div style={{ maxWidth: "1400px", width: "100%", margin: "0 auto", padding: "0 16px" }}>
            {children}
          </div>
        </div>

        <div style={styles.footerArea}>
          <p style={{ margin: "0 0 6px 0", fontWeight: "700", color: "var(--text-color)" }}>SmartWaste — Building Cleaner Cities, Together.</p>
          <p style={{ margin: 0 }}>© 2026 SmartWaste Civic Operations. All rights reserved.</p>
        </div>
      </div>

      {showPasswordModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h3 style={{ marginTop: 0, color: "var(--text-color)" }}>Update Password</h3>
            <form onSubmit={handlePasswordChange} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <input type="password" placeholder="Current Password" required value={oldPassword} onChange={e => setOldPassword(e.target.value)} style={{ padding: "12px", borderRadius: "12px", border: "1px solid var(--glass-border)", backgroundColor: "var(--input-bg)", color: "var(--text-color)", outline: "none" }} />
              <input type="password" placeholder="New Password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} style={{ padding: "12px", borderRadius: "12px", border: "1px solid var(--glass-border)", backgroundColor: "var(--input-bg)", color: "var(--text-color)", outline: "none" }} />
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="submit" style={{ flex: 1, padding: "10px", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold" }}>Save</button>
                <button type="button" onClick={() => setShowPasswordModal(false)} style={{ flex: 1, padding: "10px", backgroundColor: "var(--input-bg)", color: "var(--text-color)", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold" }}>Cancel</button>
              </div>
            </form>
            {passMessage && <p style={{ textAlign: "center", color: passMessage.includes("success") ? "#22c55e" : "#ef4444", fontWeight: "bold", marginBottom: 0 }}>{passMessage}</p>}
          </div>
        </div>
      )}
    </div>
  );
}