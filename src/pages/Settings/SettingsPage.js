import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

function Settings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState({ text: "", type: "" });
  
  const [settings, setSettings] = useState({
    notificationsEnabled: true,
    emailAlerts: true,
    darkMode: false,
  });

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().settings) {
          setSettings({ ...settings, ...docSnap.data().settings });
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
      setLoading(false);
    };

    if (user?.uid) {
      loadSettings();
    }
  }, [user, settings]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setAlertMsg({ text: "", type: "" });
    
    try {
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, { settings }, { merge: true });
      
      setAlertMsg({ text: "Settings saved successfully!", type: "success" });
      
      // Optional: Apply Dark Mode globally if needed
      if (settings.darkMode) {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }
    } catch (error) {
      setAlertMsg({ text: "Failed to save settings: " + error.message, type: "error" });
    }
    setSaving(false);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, overflow: "auto", background: settings.darkMode ? "#121212" : "#f8f9fa", color: settings.darkMode ? "#fff" : "#000" }}>
        <Navbar />
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
          <h1 className="animate-glass-slide-down" style={{ marginTop: 0, color: settings.darkMode ? "#fff" : "#333" }}>System Settings</h1>
          
          <div className="animate-glass-in" style={{ background: settings.darkMode ? "#1e1e1e" : "white", padding: "30px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            
            {alertMsg.text && (
              <div style={{ padding: "12px", marginBottom: "20px", borderRadius: "4px", background: alertMsg.type === "success" ? "#d4edda" : "#f8d7da", color: alertMsg.type === "success" ? "#155724" : "#721c24" }}>
                {alertMsg.text}
              </div>
            )}

            {loading ? (
              <p>Loading your preferences...</p>
            ) : (
              <>
                <div style={{ marginBottom: "30px" }}>
                  <h3 style={{ marginBottom: "15px", borderBottom: `1px solid ${settings.darkMode ? "#333" : "#eee"}`, paddingBottom: "10px", color: settings.darkMode ? "#ddd" : "#555" }}>Notifications</h3>
                  
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", marginBottom: "15px", padding: "10px", background: settings.darkMode ? "#2a2a2a" : "#f8f9fa", borderRadius: "4px" }}>
                    <input
                      type="checkbox"
                      name="notificationsEnabled"
                      checked={settings.notificationsEnabled}
                      onChange={handleChange}
                      style={{ width: "18px", height: "18px" }}
                    />
                    <div>
                      <span style={{ display: "block", fontWeight: "bold" }}>Push Notifications</span>
                      <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.7)" }}>Receive alerts directly in the browser</span>
                    </div>
                  </label>
                  
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "10px", background: settings.darkMode ? "#2a2a2a" : "#f8f9fa", borderRadius: "4px" }}>
                    <input
                      type="checkbox"
                      name="emailAlerts"
                      checked={settings.emailAlerts}
                      onChange={handleChange}
                      style={{ width: "18px", height: "18px" }}
                    />
                    <div>
                      <span style={{ display: "block", fontWeight: "bold" }}>Email Alerts</span>
                      <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.7)" }}>Receive important updates via registered email</span>
                    </div>
                  </label>
                </div>

                <div style={{ marginBottom: "30px" }}>
                  <h3 style={{ marginBottom: "15px", borderBottom: `1px solid ${settings.darkMode ? "#333" : "#eee"}`, paddingBottom: "10px", color: settings.darkMode ? "#ddd" : "#555" }}>Appearance</h3>
                  
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "10px", background: settings.darkMode ? "#2a2a2a" : "#f8f9fa", borderRadius: "4px" }}>
                    <input
                      type="checkbox"
                      name="darkMode"
                      checked={settings.darkMode}
                      onChange={handleChange}
                      style={{ width: "18px", height: "18px" }}
                    />
                    <div>
                      <span style={{ display: "block", fontWeight: "bold" }}>Dark Theme</span>
                      <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.7)" }}>Toggle low-light UI scheme</span>
                    </div>
                  </label>
                </div>

                <div style={{ borderTop: `1px solid ${settings.darkMode ? "#333" : "#eee"}`, paddingTop: "20px", display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{ padding: "12px 24px", background: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: saving ? "not-allowed" : "pointer", fontWeight: "bold", fontSize: "16px", minWidth: "150px" }}
                  >
                    {saving ? "Saving..." : "Save Preferences"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
