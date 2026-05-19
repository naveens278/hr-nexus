import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { getDepartments, deleteDepartment } from "../../firebase/departmentService";

function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setLoading(true);
    const data = await getDepartments();
    setDepartments(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      const result = await deleteDepartment(id);
      if (result.success) {
        loadDepartments();
      } else {
        setError(result.error || "Failed to delete department");
      }
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)" }}>
      <Sidebar />
      <div style={{ flex: 1, overflow: "auto" }}>
        <Navbar />
        <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>
          
          {error && (
            <div className="animate-glass-in" style={{ background: "rgba(220, 38, 38, 0.2)", color: "#fecaca", padding: "12px 20px", borderRadius: "12px", marginBottom: "20px", backdropFilter: "blur(10px)", border: "1px solid rgba(220, 38, 38, 0.3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{error}</span>
              <button onClick={() => setError("")} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "20px" }}>&times;</button>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
            <div>
              <h1 className="animate-glass-slide-down" style={{ margin: 0, color: "#fff", fontSize: "2.5rem", fontWeight: "800", letterSpacing: "-0.025em" }}>Departments</h1>
              <p style={{ color: "rgba(255, 255, 255, 0.6)", margin: "5px 0 0 0" }}>Manage your organization's structural units</p>
            </div>
            <button 
              onClick={() => navigate("/add-department")}
              className="animate-glass-in"
              style={{ padding: "12px 24px", background: "linear-gradient(45deg, #6366f1, #a855f7)", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold", fontSize: "14px", boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)", transition: "transform 0.2s" }}
              onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              + Add Department
            </button>
          </div>

          <div className="animate-glass-in" style={{ background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(20px)", padding: "2px", borderRadius: "24px", border: "1px solid rgba(255, 255, 255, 0.1)", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "80px 40px" }}>
                <div className="spinner" style={{ margin: "0 auto 20px", width: "40px", height: "40px", border: "4px solid rgba(255,255,255,0.1)", borderTop: "4px solid #6366f1", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "1.1rem" }}>Loading departments...</p>
              </div>
            ) : departments.length === 0 ? (
              <div style={{ textAlign: "center", padding: "100px 40px", color: "rgba(255, 255, 255, 0.5)" }}>
                <div style={{ fontSize: "50px", marginBottom: "20px" }}>🏢</div>
                <h3 style={{ margin: "0 0 10px 0", color: "#fff", fontSize: "1.5rem" }}>No departments found</h3>
                <p style={{ margin: 0 }}>Start by adding your first organization unit.</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px", padding: "0 20px" }}>
                  <thead>
                    <tr>
                      <th style={{ padding: "20px 15px", textAlign: "left", color: "rgba(255, 255, 255, 0.5)", fontWeight: "600", textTransform: "uppercase", fontSize: "12px", letterSpacing: "0.05em" }}>Name</th>
                      <th style={{ padding: "20px 15px", textAlign: "left", color: "rgba(255, 255, 255, 0.5)", fontWeight: "600", textTransform: "uppercase", fontSize: "12px", letterSpacing: "0.05em" }}>Manager</th>
                      <th style={{ padding: "20px 15px", textAlign: "left", color: "rgba(255, 255, 255, 0.5)", fontWeight: "600", textTransform: "uppercase", fontSize: "12px", letterSpacing: "0.05em" }}>Description</th>
                      <th style={{ padding: "20px 15px", textAlign: "center", color: "rgba(255, 255, 255, 0.5)", fontWeight: "600", textTransform: "uppercase", fontSize: "12px", letterSpacing: "0.05em" }}>Status</th>
                      <th style={{ padding: "20px 15px", textAlign: "right", color: "rgba(255, 255, 255, 0.5)", fontWeight: "600", textTransform: "uppercase", fontSize: "12px", letterSpacing: "0.05em" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((dept, index) => (
                      <tr key={dept.id} className="list-item-stagger" style={{ background: "rgba(255, 255, 255, 0.03)", transition: "all 0.3s ease", animationDelay: `${index * 0.1}s` }} onMouseOver={e=>e.currentTarget.style.background="rgba(255, 255, 255, 0.07)"} onMouseOut={e=>e.currentTarget.style.background="rgba(255, 255, 255, 0.03)"}>
                        <td style={{ padding: "20px 15px", borderTopLeftRadius: "16px", borderBottomLeftRadius: "16px" }}>
                          <span style={{ fontWeight: "700", color: "#fff", fontSize: "1.1rem" }}>{dept.name}</span>
                        </td>
                        <td style={{ padding: "20px 15px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "linear-gradient(45deg, #a855f7, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold", color: "white" }}>{dept.manager?.charAt(0) || "U"}</div>
                            <span style={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: "500" }}>{dept.manager || "Unassigned"}</span>
                          </div>
                        </td>
                        <td style={{ padding: "20px 15px", color: "rgba(255, 255, 255, 0.5)", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "0.95rem" }}>
                          {dept.description || "N/A"}
                        </td>
                        <td style={{ padding: "20px 15px", textAlign: "center" }}>
                          <span style={{ padding: "6px 14px", borderRadius: "100px", fontSize: "11px", background: "rgba(16, 185, 129, 0.1)", color: "#10b981", fontWeight: "700", border: "1px solid rgba(16, 185, 129, 0.2)", textTransform: "uppercase" }}>
                            {dept.status || 'Active'}
                          </span>
                        </td>
                        <td style={{ padding: "20px 15px", textAlign: "right", borderTopRightRadius: "16px", borderBottomRightRadius: "16px" }}>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(dept.id); }}
                            style={{ padding: "10px", background: "rgba(239, 68, 68, 0.1)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "12px", cursor: "pointer", transition: "all 0.2s" }}
                            onMouseOver={e => { e.currentTarget.style.background = "#ef4444"; e.currentTarget.style.color = "white"; }}
                            onMouseOut={e => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"; e.currentTarget.style.color = "#f87171"; }}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DepartmentList;
