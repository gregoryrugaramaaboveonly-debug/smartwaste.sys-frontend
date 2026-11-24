import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import CitizenLayout from "./CitizenLayout";

const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 14, { duration: 1.5 });
  }, [center, map]);
  return null;
}

export default function CitizenMap() {
  const navigate = useNavigate();
  const [points, setPoints] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [mapCenter, setMapCenter] = useState([0.3476, 32.5825]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("All");
  const [activeTab, setActiveTab] = useState("Active");

  const [showForm, setShowForm] = useState(null);
  const [formData, setFormData] = useState({ reporter_name: "", issue_type: "", description: "", is_anonymous: false });

  const fetchData = () => {
    Promise.all([
      fetch("http://localhost:5000/api/points/public").then(res => res.json()),
      fetch("http://localhost:5000/api/reports/public").then(res => res.json())
    ]).then(([pointsData, reportsData]) => {
      setPoints(Array.isArray(pointsData) ? pointsData : []);
      setReports(Array.isArray(reportsData) ? reportsData : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleReport = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/reports/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, point_id: showForm._id })
      });
      if (response.ok) {
        setShowForm(null);
        setFormData({ reporter_name: "", issue_type: "", description: "", is_anonymous: false });
        fetchData();
      }
    } catch (err) { console.error(err); }
  };

  const handleUpvote = async (reportId) => {
    await fetch(`http://localhost:5000/api/reports/public/${reportId}/upvote`, { method: "PATCH" });
    fetchData();
  };

  if (loading) return <CitizenLayout><div className="p-8 text-center text-slate-500">Loading map data...</div></CitizenLayout>;

  const filteredReports = reports.filter(r => {
    const point = points.find(p => p._id === r.point_id);
    if (activeTab === "Active" && r.status === "Resolved") return false;
    if (activeTab === "Resolved" && r.status !== "Resolved") return false;
    if (filterDistrict !== "All" && (!point || point.district !== filterDistrict)) return false;
    if (searchTerm && !r.issue_type.toLowerCase().includes(searchTerm.toLowerCase()) && !r.description?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <CitizenLayout>
      <div className="flex flex-col gap-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-black mb-2 text-[var(--text-primary)]">Live City Map</h1>
            <p className="text-[var(--text-secondary)] font-medium">View the status of collection points and report issues.</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 h-[700px]">
          
          {/* SIDEBAR */}
          <div className="w-full lg:w-[380px] glass-panel rounded-3xl flex flex-col overflow-hidden">
            
            <div className="flex border-b border-[var(--border-color)] p-2 gap-2">
              <button onClick={() => setActiveTab("Active")} className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${activeTab === "Active" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" : "text-[var(--text-secondary)] hover:bg-black/5"}`}>Active</button>
              <button onClick={() => setActiveTab("Resolved")} className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${activeTab === "Resolved" ? "bg-green-500/10 text-green-600 dark:text-green-400" : "text-[var(--text-secondary)] hover:bg-black/5"}`}>Resolved</button>
            </div>

            <div className="p-4 border-b border-[var(--border-color)] flex flex-col gap-3">
              <input type="text" placeholder="Search issues..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-transparent focus:border-blue-500 outline-none text-sm" />
              <select value={filterDistrict} onChange={(e) => setFilterDistrict(e.target.value)} className="w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-transparent focus:border-blue-500 outline-none text-sm font-medium">
                <option value="All">All Districts</option>
                <option value="Kampala">Kampala</option>
                <option value="Wakiso">Wakiso</option>
                <option value="Mukono">Mukono</option>
                <option value="Jinja">Jinja</option>
              </select>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {filteredReports.map(r => {
                const point = points.find(p => p._id === r.point_id);
                let borderColor = "border-l-green-500"; 
                if (r.priority === "High") borderColor = "border-l-red-500";
                if (r.priority === "Medium") borderColor = "border-l-yellow-500";

                return (
                  <div key={r._id} className={`glass-panel p-4 rounded-xl border-l-4 ${borderColor} flex flex-col gap-2 transition-transform hover:scale-[1.02]`}>
                    <div className="flex justify-between items-center">
                      <strong className="text-sm">{r.issue_type}</strong>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${r.status === "Resolved" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-600"}`}>{r.status}</span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] font-medium">📍 {point ? point.name : "Unknown"}</p>
                    <div className="flex gap-2 mt-1">
                      {r.status !== "Resolved" && (
                        <button onClick={() => handleUpvote(r._id)} className="flex-1 py-1.5 bg-green-500/10 text-green-600 rounded-lg text-xs font-bold hover:bg-green-500 hover:text-white transition-colors">Me Too ({r.upvotes || 0})</button>
                      )}
                      <button onClick={() => { if (point && point.location) setMapCenter([point.location.coordinates[1], point.location.coordinates[0]]); }} className="flex-1 py-1.5 bg-blue-500/10 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-500 hover:text-white transition-colors">View</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MAP */}
          <div className="flex-1 glass-panel p-2 rounded-3xl relative">
            <div className="w-full h-full rounded-2xl overflow-hidden relative z-0">
              <MapContainer center={mapCenter} zoom={11} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapController center={mapCenter} />
                {points.map((point) => {
                  if (!point.location || !point.location.coordinates) return null;
                  const position = [point.location.coordinates[1], point.location.coordinates[0]];
                  const pointReports = reports.filter(r => r.point_id === point._id && r.status !== "Resolved");
                  const isFull = point.current_status === "Full" || point.current_status === "Overflowing";
                  const icon = isFull ? redIcon : greenIcon;

                  return (
                    <Marker key={point._id} position={position} icon={icon}>
                      <Popup>
                        <div className="font-sans min-w-[200px]">
                          <h3 className="m-0 text-base font-bold text-slate-900">{point.name}</h3>
                          <span className={`inline-block mt-1 px-2 py-1 rounded-full text-[10px] font-bold ${isFull ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>Status: {point.current_status}</span>
                          
                          {pointReports.length > 0 && <hr className="my-2 border-slate-200" />}
                          
                          {pointReports.map(r => (
                            <div key={r._id} className="mb-2 bg-slate-50 p-2 rounded-lg">
                              <strong className="text-xs text-slate-800">{r.issue_type}</strong><br />
                              <span className="text-[10px] text-slate-500">{r.is_anonymous ? "Anonymous" : r.reporter_name}</span>
                            </div>
                          ))}
                          
                          <hr className="my-2 border-slate-200" />
                          <button onClick={() => setShowForm(point)} className="w-full py-2 bg-green-500 text-white rounded-lg font-bold text-xs hover:bg-green-600 transition-colors">Report Issue</button>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>

      {/* REPORT FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="glass-panel bg-white dark:bg-[#131b2c] p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-2">Report Issue</h3>
            <p className="text-sm text-[var(--text-secondary)] font-medium mb-6">Location: <span className="text-[var(--text-primary)]">{showForm.name}</span></p>
            
            <form onSubmit={handleReport} className="flex flex-col gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.is_anonymous} onChange={(e) => setFormData({...formData, is_anonymous: e.target.checked})} className="w-5 h-5 accent-green-500 rounded" />
                <span className="text-sm font-bold">Submit Anonymously</span>
              </label>

              {!formData.is_anonymous && (
                <input required placeholder="Your Name" value={formData.reporter_name} onChange={(e) => setFormData({...formData, reporter_name: e.target.value})} className="w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-transparent focus:border-green-500 outline-none" />
              )}

              <input required placeholder="Issue Type (e.g. Overflowing Bin)" value={formData.issue_type} onChange={(e) => setFormData({...formData, issue_type: e.target.value})} className="w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-transparent focus:border-green-500 outline-none" />
              <textarea placeholder="Details (optional)" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-transparent focus:border-green-500 outline-none min-h-[100px]" />

              <button type="submit" className="w-full py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors mt-2">Submit Report</button>
              <button type="button" onClick={() => setShowForm(null)} className="w-full py-3 bg-black/5 dark:bg-white/10 font-bold rounded-xl hover:bg-black/10 transition-colors">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </CitizenLayout>
  );
}