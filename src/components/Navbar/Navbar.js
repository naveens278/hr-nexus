import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

function Navbar() {
  const { user, userData } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  const logout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div
      className="animate-glass-slide-down"
      style={{
        background: "rgba(24, 24, 27, 0.4)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        padding: "15px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "#fff",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div>
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>HR-NEXUS</h2>
        <p style={{ margin: "5px 0 0 0", fontSize: "12px", opacity: 0.7, color: "#667eea" }}>Professional HR Management</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px", position: "relative" }}>
        <div style={{ fontSize: "14px", color: "#fff", textAlign: "right" }}>
          <p style={{ margin: 0, fontWeight: "700", letterSpacing: "0.3px" }}>{userData?.name || user?.displayName || "User"}</p>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Logged In</p>
        </div>

        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="hover-glass-lift transition-glass"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "rgba(102, 126, 234, 0.1)",
              backdropFilter: "blur(8px)",
              border: "2px solid rgba(102, 126, 234, 0.3)",
              color: "#667eea",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "bold",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(102, 126, 234, 0.15)";
              e.target.style.border = "2px solid rgba(102, 126, 234, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(102, 126, 234, 0.1)";
              e.target.style.border = "2px solid rgba(102, 126, 234, 0.3)";
            }}
          >
            {userData?.photoURL || user?.photoURL ? (
              <img 
                src={userData?.photoURL || user?.photoURL} 
                alt="Profile" 
                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} 
              />
            ) : (
              (userData?.name || user?.displayName)?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"
            )}
          </button>

          {showProfile && (
            <div
              className="animate-depth-3d glass-panel"
              style={{
                position: "absolute",
                top: "50px",
                right: 0,
                color: "#fff",
                borderRadius: "12px",
                zIndex: 9999,
                minWidth: "240px",
                overflow: "hidden",
                padding: "0",
                marginTop: "10px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                border: "1px solid rgba(255,255,255,0.15)"
              }}
            >
              <div style={{ padding: "20px", background: "rgba(255,255,255,0.05)" }}>
                <p style={{ margin: "0 0 5px 0", fontWeight: "700", color: "#fff", fontSize: "16px", letterSpacing: "0.3px" }}>
                  {userData?.name || user?.displayName || "User"}
                </p>
                <p style={{ margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.5)", fontWeight: "400", wordBreak: "break-all" }}>{user?.email}</p>
              </div>
              <button
                onClick={logout}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "rgba(239, 68, 68, 0.2)",
                  color: "#fca5a5",
                  border: "none",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.3s"
                }}
                onMouseEnter={e => e.target.style.background = "rgba(239, 68, 68, 0.4)"}
                onMouseLeave={e => e.target.style.background = "rgba(239, 68, 68, 0.2)"}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
