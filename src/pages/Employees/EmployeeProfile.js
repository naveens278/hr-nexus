import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { getEmployeeById, uploadProfilePicture, deleteEmployee } from "../../firebase/employeeService";
import { formatDate } from "../../utils/formatDate";

function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEmployee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadEmployee = async () => {
    try {
      setLoading(true);
      const result = await getEmployeeById(id);
      if (result && result.success) {
        // Handle both flat and nested (result.data) response structures
        const empData = result.data || result;
        setEmployee(empData);
      } else {
        setError(result?.error || "Employee record not found");
      }
    } catch (err) {
      console.error("Error loading employee profile:", err);
      setError("Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const result = await uploadProfilePicture(id, file);
      if (result.success) {
        loadEmployee();
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${employee?.firstName}'s profile? This will also remove all their leave and attendance data.`)) {
      const result = await deleteEmployee(id);
      if (result.success) {
        navigate("/employees");
      } else {
        setError(result.error);
      }
    }
  };

  const handleToggleEdit = () => {
    setEditData({ ...employee });
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('salary.')) {
      const field = name.split('.')[1];
      setEditData(prev => ({
        ...prev,
        salary: { ...prev.salary, [field]: value }
      }));
    } else {
      setEditData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { updateEmployee } = await import("../../firebase/employeeService");
      const result = await updateEmployee(id, editData);
      if (result.success) {
        setIsEditing(false);
        loadEmployee();
      } else {
        alert(result.error || "Failed to update employee");
      }
    } catch (err) {
      console.error("Error saving employee:", err);
    } finally {
      setSaving(false);
    }
  };
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, overflow: "auto", background: "transparent" }}>
        <Navbar />
        <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
          <div className="animate-glass-slide-down" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
            <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "700", color: "#667eea" }}>
              {isEditing ? "Edit Profile" : "Employee Profile"}
            </h1>
            <div style={{ display: "flex", gap: "10px" }}>
              {!isEditing ? (
                <>
                  <button 
                    onClick={handleToggleEdit} 
                    className="glass-button transition-glass"
                    style={{ background: "rgba(102, 126, 234, 0.15)", color: "#93c5fd" }}
                  >
                    ✏️ Edit Profile
                  </button>
                  <button 
                    onClick={handleDelete} 
                    className="glass-button transition-glass hover-glass-danger"
                    style={{
                      background: "rgba(239, 68, 68, 0.15)",
                      color: "#fca5a5",
                    }}
                  >
                    🗑️ Delete Profile
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="glass-button" 
                    style={{ background: "rgba(52, 211, 153, 0.2)", color: "#6ee7b7" }}
                  >
                    {saving ? "Saving..." : "💾 Save Changes"}
                  </button>
                  <button onClick={() => setIsEditing(false)} className="glass-button" style={{ background: "rgba(255, 255, 255, 0.1)" }}>
                    Cancel
                  </button>
                </>
              )}
              <button onClick={() => navigate("/employees")} className="glass-button">
                ← Back to List
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#667eea" }}>
              <div className="animate-spin" style={{ display: "inline-block", width: "40px", height: "40px", border: "3px solid rgba(102, 126, 234, 0.2)", borderTop: "3px solid #667eea", borderRadius: "50%" }}></div>
              <p style={{ marginTop: "15px" }}>Loading employee details...</p>
            </div>
          ) : error ? (
            <div className="glass-card" style={{ border: "1px solid rgba(239, 68, 68, 0.3)", color: "#fca5a5" }}>⚠️ {error}</div>
          ) : (

          <div className="animate-glass-slide-up glass-card" style={{ display: "grid", gridTemplateColumns: "minmax(200px, 250px) 1fr", gap: "40px", alignItems: "start" }}>
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "15px", alignItems: "center" }}>
              <div style={{ 
                width: "180px", 
                height: "180px", 
                borderRadius: "50%", 
                background: "rgba(255, 255, 255, 0.05)", 
                border: "4px solid rgba(102, 126, 234, 0.3)",
                boxShadow: "0 8px 32px rgba(102, 126, 234, 0.2)",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                overflow: "hidden",
                position: "relative"
              }}>
                {employee?.profilePicture ? (
                  <img src={employee.profilePicture} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: "64px" }}>👤</span>
                )}
              </div>
              
              <label className="glass-button" style={{ fontSize: "14px", padding: "8px 16px", cursor: "pointer", display: "inline-block" }}>
                📷 Change Photo
                <input type="file" onChange={handleProfilePictureUpload} style={{ display: "none" }} accept="image/*" />
              </label>

              <div style={{ marginTop: "10px", width: "100%" }}>
                <span style={{ 
                  display: "inline-block",
                  padding: "6px 16px",
                  background: employee?.status === "active" ? "rgba(52, 211, 153, 0.1)" : "rgba(239, 68, 68, 0.1)",
                  color: employee?.status === "active" ? "#34d399" : "#fca5a5",
                  border: `1px solid ${employee?.status === "active" ? "rgba(52, 211, 153, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                  borderRadius: "20px",
                  fontWeight: "700",
                  fontSize: "14px",
                  textTransform: "uppercase",
                  letterSpacing: "1px"
                }}>
                  {employee?.status}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
              {!isEditing ? (
                <div>
                  <h2 style={{ fontSize: "36px", margin: "0 0 5px 0", color: "#fff", textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                    {employee?.firstName} {employee?.lastName}
                  </h2>
                  <h3 style={{ margin: 0, color: "#93c5fd", fontWeight: "500", fontSize: "18px" }}>
                    {employee?.position} • {employee?.department}
                  </h3>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                  <div>
                    <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>First Name</label>
                    <input name="firstName" value={editData.firstName || ''} onChange={handleInputChange} className="glass-input" style={{ width: "100%", marginTop: "5px" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Last Name</label>
                    <input name="lastName" value={editData.lastName || ''} onChange={handleInputChange} className="glass-input" style={{ width: "100%", marginTop: "5px" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Position</label>
                    <input name="position" value={editData.position || ''} onChange={handleInputChange} className="glass-input" style={{ width: "100%", marginTop: "5px" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Department</label>
                    <input name="department" value={editData.department || ''} onChange={handleInputChange} className="glass-input" style={{ width: "100%", marginTop: "5px" }} />
                  </div>
                </div>
              )}

              <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)", paddingTop: "25px" }}></div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
                <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "15px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                  <label style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600" }}>Email</label>
                  {isEditing ? (
                    <input name="email" value={editData.email || ''} onChange={handleInputChange} className="glass-input" style={{ width: "100%", marginTop: "5px" }} />
                  ) : (
                    <p style={{ margin: "5px 0 0 0", color: "#fff", fontSize: "16px", fontWeight: "500" }}>{employee?.email}</p>
                  )}
                </div>
                <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "15px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                  <label style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600" }}>Phone</label>
                  {isEditing ? (
                    <input name="phone" value={editData.phone || ''} onChange={handleInputChange} className="glass-input" style={{ width: "100%", marginTop: "5px" }} />
                  ) : (
                    <p style={{ margin: "5px 0 0 0", color: "#fff", fontSize: "16px", fontWeight: "500" }}>{employee?.phone}</p>
                  )}
                </div>
                <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "15px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                  <label style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600" }}>Join Date</label>
                  {isEditing ? (
                    <input type="date" name="joinDate" value={editData.joinDate ? editData.joinDate.substring(0, 10) : ''} onChange={handleInputChange} className="glass-input" style={{ width: "100%", marginTop: "5px" }} />
                  ) : (
                    <p style={{ margin: "5px 0 0 0", color: "#fff", fontSize: "16px", fontWeight: "500" }}>{formatDate(employee?.joinDate)}</p>
                  )}
                </div>
                <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "15px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                  <label style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600" }}>Date of Birth</label>
                  {isEditing ? (
                    <input type="date" name="dateOfBirth" value={editData.dateOfBirth ? editData.dateOfBirth.substring(0, 10) : ''} onChange={handleInputChange} className="glass-input" style={{ width: "100%", marginTop: "5px" }} />
                  ) : (
                    <p style={{ margin: "5px 0 0 0", color: "#fff", fontSize: "16px", fontWeight: "500" }}>{formatDate(employee?.dateOfBirth)}</p>
                  )}
                </div>
                <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "15px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                  <label style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600" }}>Employment Type</label>
                  {isEditing ? (
                    <select name="employmentType" value={editData.employmentType || ''} onChange={handleInputChange} className="glass-input" style={{ width: "100%", marginTop: "5px" }}>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  ) : (
                    <p style={{ margin: "5px 0 0 0", color: "#fff", fontSize: "16px", fontWeight: "500" }}>{employee?.employmentType}</p>
                  )}
                </div>
                <div style={{ background: "rgba(34, 197, 94, 0.05)", padding: "15px", borderRadius: "10px", border: "1px solid rgba(34, 197, 94, 0.2)" }}>
                  <label style={{ fontSize: "12px", color: "#86efac", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600" }}>Basic Salary</label>
                  {isEditing ? (
                    <input type="number" name="salary.basic" value={editData.salary?.basic || ''} onChange={handleInputChange} className="glass-input" style={{ width: "100%", marginTop: "5px" }} />
                  ) : (
                    <p style={{ margin: "5px 0 0 0", color: "#4ade80", fontSize: "16px", fontWeight: "700" }}>₹{employee?.salary?.basic?.toLocaleString()}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeeProfile;
