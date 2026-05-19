import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { addDepartment } from "../../firebase/departmentService";

function AddDepartment() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [manager, setManager] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await addDepartment({
      name,
      description,
      manager,
      status: "active",
      employeeCount: 0,
    });

    if (result.success) {
      navigate("/departments");
    } else {
      setError(result.error || "Failed to add department");
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)" }}>
      <Sidebar />
      <div style={{ flex: 1, overflow: "auto" }}>
        <Navbar />
        <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
            <div>
              <h1 className="animate-glass-slide-down" style={{ margin: 0, color: "#fff", fontSize: "2.5rem", fontWeight: "800", letterSpacing: "-0.025em" }}>Add Department</h1>
              <p style={{ color: "rgba(255, 255, 255, 0.6)", margin: "5px 0 0 0" }}>Create a new organizational unit</p>
            </div>
            <button 
              onClick={() => navigate("/departments")}
              className="animate-glass-in"
              style={{ padding: "10px 20px", background: "rgba(255, 255, 255, 0.05)", color: "white", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px", cursor: "pointer", fontWeight: "600", backdropFilter: "blur(10px)" }}
            >
              Back to List
            </button>
          </div>

          <div className="animate-glass-in" style={{ background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(20px)", padding: "40px", borderRadius: "24px", border: "1px solid rgba(255, 255, 255, 0.1)", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}>
            {error && (
              <div style={{ background: "rgba(220, 38, 38, 0.2)", color: "#fecaca", padding: "12px 20px", borderRadius: "12px", marginBottom: "30px", border: "1px solid rgba(220, 38, 38, 0.3)" }}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "10px", fontWeight: "600", color: "rgba(255, 255, 255, 0.7)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Department Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Engineering"
                    style={{ width: "100%", padding: "15px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px", color: "white", boxSizing: "border-box", fontSize: "16px", outline: "none", transition: "all 0.3s" }} 
                    onFocus={e => e.target.style.borderColor = "#6366f1"}
                    onBlur={e => e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "10px", fontWeight: "600", color: "rgba(255, 255, 255, 0.7)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Department Manager</label>
                  <input 
                    type="text" 
                    value={manager}
                    onChange={(e) => setManager(e.target.value)}
                    placeholder="Manager's Name"
                    style={{ width: "100%", padding: "15px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px", color: "white", boxSizing: "border-box", fontSize: "16px", outline: "none", transition: "all 0.3s" }} 
                    onFocus={e => e.target.style.borderColor = "#a855f7"}
                    onBlur={e => e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "10px", fontWeight: "600", color: "rgba(255, 255, 255, 0.7)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Description</label>
                <textarea 
                  rows="4" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the department's core responsibilities and mission..."
                  style={{ width: "100%", padding: "15px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px", color: "white", boxSizing: "border-box", fontFamily: "inherit", fontSize: "16px", outline: "none", transition: "all 0.3s", resize: "none" }}
                  onFocus={e => e.target.style.borderColor = "#6366f1"}
                  onBlur={e => e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"}
                ></textarea>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                <button 
                  type="submit" 
                  disabled={loading}
                  style={{ padding: "16px 32px", background: "linear-gradient(45deg, #6366f1, #a855f7)", color: "white", border: "none", borderRadius: "14px", cursor: loading ? "not-allowed" : "pointer", fontSize: "16px", fontWeight: "700", boxShadow: "0 10px 20px rgba(99, 102, 241, 0.2)", transition: "all 0.3s linear" }}
                  onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  {loading ? "Saving Unit..." : "✨ Create Department"}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AddDepartment;
