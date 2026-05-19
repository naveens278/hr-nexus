import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { addEmployee } from "../../firebase/employeeService";
import CustomDropdown from "../../components/Forms/CustomDropdown";
// auth hook removed

function AddEmployee() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const departments = ["HR", "Engineering", "Marketing", "Sales", "Finance", "Support", "IT"];
  const positions = ["Manager", "Developer", "Analyst", "Lead", "Executive", "Staff"];
  const genders = [
    { label: "Male", value: "M" },
    { label: "Female", value: "F" },
    { label: "Other", value: "O" }
  ];
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "M",
    department: "HR",
    position: "",
    joinDate: new Date().toISOString().split("T")[0],
    employmentType: "full-time",
    salary: { basic: 0, hra: 0, da: 0 },
    status: "active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSalaryChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      salary: {
        ...prev.salary,
        [name]: parseFloat(value) || 0,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await addEmployee(formData);
    if (result.success) {
      navigate("/employees");
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  // Removed restrict authorization check for demo purposes so user can add data

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0f1115", color: "#fff" }}>
      <Sidebar />
      <div style={{ flex: 1, overflow: "auto" }}>
        <Navbar />
        <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
          <div className="animate-glass-slide-down" style={{ marginBottom: "30px" }}>
            <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "800", color: "#667eea" }}>Add New Employee</h1>
            <p style={{ color: "rgba(255, 255, 255, 0.6)", marginTop: "5px" }}>Create a new employee profile in the system.</p>
          </div>

          {error && (
            <div className="animate-glass-in glass-card" style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#fca5a5", marginBottom: "20px" }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="animate-glass-slide-up glass-card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", padding: "30px" }}>
            <div className="list-item-stagger" style={{ animationDelay: "0.1s" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "rgba(255, 255, 255, 0.8)" }}>First Name *</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="glass-input" style={{ width: "100%" }} />
            </div>
            <div className="list-item-stagger" style={{ animationDelay: "0.15s" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "rgba(255, 255, 255, 0.8)" }}>Last Name *</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="glass-input" style={{ width: "100%" }} />
            </div>
            <div className="list-item-stagger" style={{ animationDelay: "0.2s" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "rgba(255, 255, 255, 0.8)" }}>Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="glass-input" style={{ width: "100%" }} />
            </div>
            <div className="list-item-stagger" style={{ animationDelay: "0.25s" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "rgba(255, 255, 255, 0.8)" }}>Phone *</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="glass-input" style={{ width: "100%" }} />
            </div>
            <div className="list-item-stagger" style={{ animationDelay: "0.3s" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "rgba(255, 255, 255, 0.8)" }}>Date of Birth</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="glass-input" style={{ width: "100%" }} />
            </div>
            <div className="list-item-stagger" style={{ animationDelay: "0.35s" }}>
              <CustomDropdown 
                label="Gender"
                name="gender" 
                value={formData.gender} 
                onChange={handleChange} 
                options={genders}
                placeholder="Select Gender"
              />
            </div>
            <div className="list-item-stagger" style={{ animationDelay: "0.4s" }}>
              <CustomDropdown 
                label="Department *"
                name="department" 
                value={formData.department} 
                onChange={handleChange}
                options={departments}
                placeholder="Select Department"
              />
            </div>
            <div className="list-item-stagger" style={{ animationDelay: "0.45s" }}>
              <CustomDropdown 
                label="Position *"
                name="position"
                value={formData.position} 
                onChange={handleChange}
                options={positions}
                placeholder="Select Position"
              />
            </div>
            <div className="list-item-stagger" style={{ animationDelay: "0.5s" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "rgba(255, 255, 255, 0.8)" }}>Basic Salary</label>
              <input type="number" name="basic" value={formData.salary.basic} onChange={handleSalaryChange} className="glass-input" style={{ width: "100%" }} />
            </div>
            <div className="list-item-stagger" style={{ animationDelay: "0.55s" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "rgba(255, 255, 255, 0.8)" }}>Join Date</label>
              <input type="date" name="joinDate" value={formData.joinDate} onChange={handleChange} className="glass-input" style={{ width: "100%" }} />
            </div>

            <div style={{ gridColumn: "1 / -1", marginTop: "10px" }}>
              <button type="submit" disabled={loading} className="glass-button hover-glass-lift transition-glass" style={{ padding: "14px 40px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px", fontWeight: "700", width: "100%" }}>
                {loading ? "Adding Employee..." : "Add Employee Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddEmployee;
