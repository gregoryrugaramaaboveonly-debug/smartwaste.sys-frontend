import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Lamp from "./Lamp";

const API_URL = "https://smartwaste-sys-backend.onrender.com";

function Login() {
  const [isLampOn, setIsLampOn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const loginBoxRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      // THIS IS CRUCIAL - Look at your browser console to see what the backend sends!
      console.log("Backend Response:", data); 

      if (response.ok) {
        setMessage("Login successful!");
        
        // Save the token and user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("name", data.user.name);
        
        // Navigate to dashboard
        navigate("/dashboard"); 
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch (error) {
      setMessage("Server error. Is the backend running?");
      console.error("Login error:", error);
    }
  };

  const handleBackgroundClick = (e) => {
    if (isLampOn && loginBoxRef.current && !loginBoxRef.current.contains(e.target)) {
      setIsLampOn(false);
    }
  };

  return (
    <div 
      onClick={handleBackgroundClick}
      style={{
        minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center",
        backgroundColor: isLampOn ? "#C94F12" : "#542512", 
        transition: "background-color 1.5s ease-in-out",
        overflow: "hidden", position: "relative", fontFamily: "'Segoe UI', sans-serif"
      }}
    >
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
        style={{ textAlign: "center", marginTop: "30px", zIndex: 20 }}
      >
        <h1 style={{ color: "white", margin: 0, fontSize: "32px", letterSpacing: "4px", fontWeight: "900" }}>
          SMART<span style={{ color: "#F5A623" }}>WASTE</span>
        </h1>
        <p style={{ color: "#FFF0D8", letterSpacing: "3px", margin: "10px 0 0 0", fontSize: "12px", fontWeight: "600" }}>CIVIC OPERATIONS PLATFORM</p>
        <p style={{ color: "#a8a29e", margin: "5px 0 0 0", fontSize: "13px" }}>Real-time data for a cleaner city.</p>
      </motion.div>

      <div style={{ marginTop: "40px", position: "relative", zIndex: 20 }}>
        <Lamp isOn={isLampOn} onPull={() => setIsLampOn(!isLampOn)} />
      </div>

      {!isLampOn && (
        <motion.div
          animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          style={{ marginTop: "30px", color: "#F5A623", display: "flex", alignItems: "center", gap: "10px", zIndex: 20 }}
        >
          <span>Pull the string to log in</span>
        </motion.div>
      )}

      <AnimatePresence>
        {isLampOn && (
          <motion.div
            ref={loginBoxRef}
            initial={{ y: 500, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 500, opacity: 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 60 }}
            style={{
              width: "100%", maxWidth: "350px", backgroundColor: "#FFF0D8",
              padding: "30px", 
              borderRadius: "20px", 
              marginTop: "-30px",
              marginBottom: "40px", 
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)", 
              zIndex: 30, position: "relative"
            }}
          >
            <h2 style={{ textAlign: "center", color: "#542512", margin: "0 0 5px 0", fontSize: "24px" }}>Welcome Back</h2>
            <p style={{ textAlign: "center", color: "#9E320D", fontSize: "10px", letterSpacing: "2px", margin: "0 0 20px 0" }}>SMARTWASTE COLLECTION</p>

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input 
                type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required
                style={{ padding: "12px", borderRadius: "8px", border: "1px solid #F5A623", backgroundColor: "#FFF8ED", color: "#542512", fontSize: "14px" }}
              />
              <input 
                type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required
                style={{ padding: "12px", borderRadius: "8px", border: "1px solid #F5A623", backgroundColor: "#FFF8ED", color: "#542512", fontSize: "14px" }}
              />
              
              <button type="submit" style={{ padding: "12px", backgroundColor: "#C94F12", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "bold", marginTop: "8px" }}>
                LOG IN
              </button>
            </form>

            {message && <p style={{ textAlign: "center", color: "#9E320D", fontWeight: "bold", marginTop: "12px", fontSize: "14px" }}>{message}</p>}
            
            <p style={{ textAlign: "center", color: "#542512", marginTop: "15px", fontSize: "14px" }}>
              Don't have an account? <span onClick={() => navigate("/register")} style={{ color: "#C94F12", fontWeight: "bold", cursor: "pointer" }}>Register here</span>
            </p>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Login;