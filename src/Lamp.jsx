import { motion } from "framer-motion";

export default function Lamp({ isOn, onPull }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 10 }}>
      
      {/* THE ENTIRE LAMP BODY MOVES UP TOGETHER */}
      <motion.div
        animate={{
          y: isOn ? -20 : 0, // Reduced movement since the lamp is smaller
          filter: isOn ? "drop-shadow(0px 15px 40px rgba(245, 166, 35, 0.8))" : "none",
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}
      >
        
        {/* THE SHADE - Made smaller */}
        <div style={{
          width: "90px", height: "50px",
          backgroundColor: isOn ? "#FFF0D8" : "#D2B48C", 
          clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)", 
          borderBottom: "3px solid #542512",
          transition: "background-color 0.8s",
          position: "relative",
          zIndex: 2 // Keeps the shade in front of the string
        }} />
        
        {/* THE LIGHT GLOW */}
        {isOn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: "absolute", top: "50px", left: "50%", transform: "translateX(-50%)",
              width: "150px", height: "150px",
              background: "radial-gradient(ellipse at top, rgba(245, 166, 35, 0.4) 0%, transparent 70%)",
              pointerEvents: "none",
              zIndex: 1
            }}
          />
        )}

        {/* THE STAND AND BASE - Made shorter */}
        <div style={{ width: "8px", height: "40px", backgroundColor: "#542512", zIndex: 2 }} />
        <div style={{ width: "50px", height: "8px", backgroundColor: "#542512", borderRadius: "8px 8px 0 0", zIndex: 2 }} />

        {/* THE STRING - Placed behind the shade (zIndex: 0) so it comes from inside */}
        <motion.div 
          onClick={onPull}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
          animate={{ 
            y: isOn ? 15 : 0, 
            height: isOn ? "60px" : "45px" 
          }}
          style={{
            position: "absolute", right: "15px", top: "35px", // Adjusted position to be under the shade
            cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center",
            originY: 0,
            zIndex: 0 // This puts it behind the shade
          }}
        >
          <motion.div 
            animate={{ height: isOn ? "55px" : "45px" }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
            style={{ width: "2px", backgroundColor: "#F5A623" }} 
          />
          <motion.div 
            animate={{ y: isOn ? 8 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
            style={{ width: "10px", height: "10px", backgroundColor: "#F5A623", borderRadius: "50%", marginTop: "-2px" }} 
          />
        </motion.div>

      </motion.div>
    </div>
  );
}