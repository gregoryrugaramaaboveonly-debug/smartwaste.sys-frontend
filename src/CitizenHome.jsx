import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CitizenLayout from "./CitizenLayout";

const API_URL = "https://smartwaste-sys-backend.onrender.com";


export default function CitizenHome() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalReports: 0, resolvedReports: 0 });
  const userName = localStorage.getItem("name") || "Citizen";

    useEffect(() => {
    // 1. Fetch the public reports
    fetch(`${API_URL}/api/reports/public`)
      .then(res => res.json())
      .then(data => {
        setReports(Array.isArray(data) ? data : []); // Make sure it's an array
        
        // Only set loading to false if you have a setLoading state
        // setLoading(false); 
      })
      .catch(err => {
        console.error("Error fetching public reports:", err);
        // setLoading(false);
      });
  }, []);

  return (
    <CitizenLayout>
      <div className="flex flex-col gap-8">
        
        {/* HERO SECTION */}
        <div className="relative w-full rounded-[2rem] overflow-hidden min-h-[500px] flex items-center p-10 md:p-16 shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2070&auto=format&fit=crop" 
            alt="Clean City" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#064e3b]/95 via-[#064e3b]/70 to-transparent" />
          
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-green-500/20 text-green-300 font-bold text-sm border border-green-500/30 backdrop-blur-md mb-6">
              Welcome back, {userName}
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-6 drop-shadow-2xl">
              RECYCLE<br />
              <span className="text-green-400">FOR LIFE.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 font-medium mb-8 max-w-lg leading-relaxed">
              Promoting sustainable waste management practices for a cleaner, greener city. Together, we build healthier communities.
            </p>
            <button 
              onClick={() => navigate("/citizen")} 
              className="bg-green-500 hover:bg-green-400 text-[#064e3b] font-black py-4 px-8 rounded-full transition-all active:scale-95 shadow-lg shadow-green-500/30 inline-flex items-center gap-3 text-lg"
            >
              EXPLORE LIVE MAP
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="glass-panel p-8 rounded-3xl flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 text-green-500/10 group-hover:scale-110 transition-transform duration-500">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
            </div>
            <h3 className="text-4xl font-black text-[var(--text-primary)] mb-2">2.01B</h3>
            <p className="text-[var(--text-secondary)] font-bold text-sm uppercase tracking-wider">Tonnes Generated Yearly</p>
          </div>

          <div className="glass-panel p-8 rounded-3xl flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 text-blue-500/10 group-hover:scale-110 transition-transform duration-500">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
            </div>
            <h3 className="text-4xl font-black text-[var(--text-primary)] mb-2">{stats.totalReports}</h3>
            <p className="text-[var(--text-secondary)] font-bold text-sm uppercase tracking-wider">City Reports Logged</p>
          </div>

          <div className="glass-panel p-8 rounded-3xl flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 text-yellow-500/10 group-hover:scale-110 transition-transform duration-500">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            </div>
            <h3 className="text-4xl font-black text-[var(--text-primary)] mb-2">{stats.resolvedReports}</h3>
            <p className="text-[var(--text-secondary)] font-bold text-sm uppercase tracking-wider">Issues Resolved</p>
          </div>

        </div>

        {/* HOW IT WORKS / ACTION SECTION */}
        <div className="glass-panel rounded-[2rem] p-10 md:p-14 mt-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3">How You Can Help</h2>
            <p className="text-[var(--text-secondary)] font-medium max-w-xl mx-auto">Every report helps our teams respond faster. Here is how you can make a difference today.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => navigate("/citizen")}>
              <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <h3 className="font-bold text-lg mb-2">1. Spot an Issue</h3>
              <p className="text-[var(--text-secondary)] text-sm font-medium">Find an overflowing bin or illegal dumping site on the map.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => navigate("/citizen")}>
              <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </div>
              <h3 className="font-bold text-lg mb-2">2. Report It</h3>
              <p className="text-[var(--text-secondary)] text-sm font-medium">Submit a quick, anonymous report directly from the map.</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => navigate("/citizen")}>
              <div className="w-16 h-16 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h3 className="font-bold text-lg mb-2">3. We Resolve It</h3>
              <p className="text-[var(--text-secondary)] text-sm font-medium">Our professional teams are dispatched to clear the issue.</p>
            </div>
          </div>
        </div>

      </div>
    </CitizenLayout>
  );
}