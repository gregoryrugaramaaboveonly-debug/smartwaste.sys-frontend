import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("reporter");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("Creating account...");

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage("Server error. Is the backend running?");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#542512", fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "400px", backgroundColor: "#FFF0D8", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
        <h2 style={{ textAlign: "center", color: "#542512", margin: "0 0 20px 0", fontSize: "24px" }}>Create Account</h2>
        
        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input 
            type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required
            style={{ padding: "12px", borderRadius: "8px", border: "1px solid #F5A623", backgroundColor: "#FFF8ED", color: "#542512" }}
          />
          <input 
            type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required
            style={{ padding: "12px", borderRadius: "8px", border: "1px solid #F5A623", backgroundColor: "#FFF8ED", color: "#542512" }}
          />
          <input 
            type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
            style={{ padding: "12px", borderRadius: "8px", border: "1px solid #F5A623", backgroundColor: "#FFF8ED", color: "#542512" }}
          />
          
          <select value={role} onChange={(e) => setRole(e.target.value)} style={{ padding: "12px", borderRadius: "8px", border: "1px solid #F5A623", backgroundColor: "#FFF8ED", color: "#542512" }}>
            <option value="reporter">Citizen (Reporter)</option>
            <option value="dispatcher">Supervisor (Dispatcher)</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" style={{ padding: "12px", backgroundColor: "#C94F12", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", marginTop: "10px" }}>
            REGISTER
          </button>
        </form>

        {message && <p style={{ textAlign: "center", color: "#9E320D", fontWeight: "bold", marginTop: "15px" }}>{message}</p>}

        <p style={{ textAlign: "center", color: "#542512", marginTop: "20px", fontSize: "14px" }}>
          Already have an account? <Link to="/" style={{ color: "#C94F12", fontWeight: "bold", textDecoration: "none" }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;