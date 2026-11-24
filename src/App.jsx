import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Auth
import Login from "./Login";
import Register from "./Register";

// Core Pages (Unified Layout)
import Dashboard from "./Dashboard";
import Points from "./Points";
import Teams from "./Teams";
import Schedules from "./Schedules";
import Reports from "./Reports";
import About from "./About";
import CitizenMap from "./CitizenMap";
import Contact from "./Contact";

// A small helper component to guard admin-only routes
function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/" />;
  if (role !== "admin") return <Navigate to="/dashboard" />; // Block citizens from admin pages
  return children;
}

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Universal Logged-in Routes (Accessible by both Admin and Citizen) */}
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/points" element={token ? <Points /> : <Navigate to="/" />} />
        <Route path="/reports" element={token ? <Reports /> : <Navigate to="/" />} />
        <Route path="/about" element={token ? <About /> : <Navigate to="/" />} />
        <Route path="/contact" element={token ? <Contact /> : <Navigate to="/" />} />
        <Route path="/citizen" element={token ? <CitizenMap /> : <Navigate to="/" />} />

        {/* Admin-Only Guarded Routes */}
        <Route path="/teams" element={<AdminRoute><Teams /></AdminRoute>} />
        <Route path="/schedules" element={<AdminRoute><Schedules /></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;