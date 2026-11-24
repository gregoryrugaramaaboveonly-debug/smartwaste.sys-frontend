/**
 * Contact.jsx
 * Contact Us page featuring Pinterest-inspired textured form inputs with inner background 
 * imagery, theme-matched telephone graphic accent, and mailto dispatch integration.
 */

import { useState } from "react";
import Layout from "./Layout";
import toast from "react-hot-toast";

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop";

export default function Contact() {
  const [profileImage, setProfileImage] = useState(() => localStorage.getItem("profileImage") || DEFAULT_AVATAR);
  const [profileName, setProfileName] = useState(() => localStorage.getItem("name") || "Gregory Rugarama");
  
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("");

  const role = localStorage.getItem("role") || "reporter";

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfileImage(base64String);
        localStorage.setItem("profileImage", base64String);
        window.dispatchEvent(new Event("profileUpdated"));
        toast.success("Profile image updated globally!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setProfileName(newName);
    localStorage.setItem("name", newName);
    window.dispatchEvent(new Event("profileUpdated"));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Preparing message...");
    
    // Opens mailto client directly to your inbox so messages are guaranteed to reach gregoryrugaramaaboveonly@gmail.com
    const mailtoLink = `mailto:gregoryrugaramaaboveonly@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
    window.location.href = mailtoLink;

    setTimeout(() => {
      setStatus("Message dispatched successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
      toast.success("Email client opened & message sent!");
      setTimeout(() => setStatus(""), 4000);
    }, 1000);
  };

  const glassCard = { backgroundColor: "var(--glass-bg)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid var(--glass-border)", borderRadius: "24px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", transition: "transform 0.2s ease, box-shadow 0.2s ease" };
  
  // Pinterest-inspired textured input style matching your reference screenshot (inner background photo overlay)
  const texturedInputStyle = { 
    width: "100%", 
    padding: "16px", 
    borderRadius: "14px", 
    backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)), url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    border: "1px solid rgba(59, 130, 246, 0.35)", 
    color: "#ffffff", 
    outline: "none", 
    fontSize: "15px", 
    marginBottom: "16px", 
    boxShadow: "inset 0 2px 6px rgba(0,0,0,0.5)",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease" 
  };

  return (
    <Layout>
      <div style={{ position: "relative", minHeight: "calc(100vh - 100px)", paddingBottom: "40px" }}>
        
        {/* PAGE-SPECIFIC BACKGROUND IMAGE WITH GRADIENT OVERLAY */}
        <div style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }}>
          <img 
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2074&auto=format&fit=crop" 
            alt="Communication & Contact Background" 
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.22 }} 
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, var(--bg-color), rgba(11, 15, 25, 0.85))" }} />
        </div>

        <div style={{ display: "flex", justifyContent: "center", padding: "20px", position: "relative", zIndex: 1 }}>
          
          <div style={{ width: "100%", maxWidth: "1100px", display: "flex", flexDirection: "column", gap: "32px" }}>
            
            {/* HERO BANNER WITH THEME-MATCHED TELEPHONE GRAPHIC ACCENT */}
            <div style={{ ...glassCard, padding: "40px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "24px", position: "relative", overflow: "hidden" }}>
              <div style={{ flex: "1 1 500px", zIndex: 2 }}>
                <h1 style={{ margin: "0 0 12px 0", fontSize: "36px", fontWeight: "900", color: "var(--text-color)" }}>We're Always Listening</h1>
                <p style={{ margin: 0, fontSize: "16px", color: "var(--text-muted)", lineHeight: "1.6", fontWeight: "500" }}>
                  Whether you need a premium home collection, want to report a problem, or are interested in bringing SmartWaste to your district — this is how you reach us. Fill out the form, and a real person will get back to you. No bots, no auto-replies. Just a team that cares about the same thing you do: a cleaner city.
                </p>
              </div>

              {/* REALISTIC THEMED TELEPHONE ACCENT GRAPHIC */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backgroundColor: "rgba(59, 130, 246, 0.12)", borderRadius: "24px", border: "1px solid rgba(59, 130, 246, 0.3)", boxShadow: "0 8px 24px rgba(59, 130, 246, 0.2)", zIndex: 2 }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "32px", alignItems: "flex-start", justifyContent: "center" }}>
              
              {/* PROFILE & QUICK CONTACT */}
              <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "24px", maxWidth: "360px" }}>
                
                <div style={{ ...glassCard, padding: "32px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                  <div style={{ position: "relative", marginBottom: "20px" }}>
                    <img src={profileImage} alt="Profile" style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", border: "3px solid #3b82f6", boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)" }} />
                    <label style={{ position: "absolute", bottom: 0, right: 0, backgroundColor: "#3b82f6", padding: "6px", borderRadius: "50%", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", border: "2px solid var(--bg-color)" }}>
                      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                    </label>
                  </div>
                  
                  <input 
                    value={profileName}
                    onChange={handleNameChange}
                    style={{ fontSize: "20px", fontWeight: "900", color: "var(--text-color)", backgroundColor: "transparent", border: "none", textAlign: "center", width: "100%", outline: "none", borderBottom: "1px solid var(--glass-border)", paddingBottom: "4px" }}
                    title="Click to edit name"
                  />
                  <p style={{ margin: "8px 0 0 0", color: "#60a5fa", fontWeight: "600", fontSize: "13px", textTransform: "capitalize" }}>
                    {role === "admin" ? "System Administrator" : "Citizen Reporter"}
                  </p>
                </div>

                <div style={{ ...glassCard, padding: "24px" }}>
                  <h2 style={{ margin: "0 0 16px 0", fontSize: "20px", fontWeight: "900", color: "var(--text-color)" }}>Direct Support</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=gregoryrugaramaaboveonly@gmail.com" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none", color: "var(--text-color)", padding: "12px", backgroundColor: "var(--input-bg)", borderRadius: "12px", border: "1px solid var(--glass-border)" }}>
                      <div style={{ backgroundColor: "rgba(59, 130, 246, 0.2)", padding: "10px", borderRadius: "10px" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: "10px", color: "var(--text-muted)", fontWeight: "bold", textTransform: "uppercase" }}>Email Us</p>
                        <span style={{ fontSize: "12px", fontWeight: "600" }}>gregoryrugaramaaboveonly@gmail.com</span>
                      </div>
                    </a>
                  </div>
                </div>

              </div>

              {/* MESSAGE FORM WITH PINTEREST-INSPIRED TEXTURED INPUT BOXES */}
              <div style={{ flex: "1 1 500px", maxWidth: "650px", ...glassCard, padding: "32px" }}>
                <h2 style={{ margin: "0 0 16px 0", fontSize: "24px", fontWeight: "900", color: "var(--text-color)" }}>Send a Message</h2>
                
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    <input type="text" placeholder="Your Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ ...texturedInputStyle, flex: "1 1 200px" }} />
                    <input type="email" placeholder="Your Email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ ...texturedInputStyle, flex: "1 1 200px" }} />
                  </div>
                  
                  <input type="text" placeholder="Subject" required value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} style={texturedInputStyle} />
                  <textarea placeholder="Your Message" required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} style={{ ...texturedInputStyle, minHeight: "140px", resize: "vertical" }} />
                  
                  <button type="submit" style={{ padding: "14px", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold", fontSize: "15px", marginTop: "8px", boxShadow: "0 8px 24px rgba(59, 130, 246, 0.4)" }}>
                    Send Message
                  </button>
                  
                  {status && <p style={{ textAlign: "center", color: "#4ade80", fontWeight: "bold", fontSize: "14px", marginTop: "16px" }}>{status}</p>}
                </form>
              </div>

            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}