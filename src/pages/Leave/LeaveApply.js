import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { applyLeave } from "../../firebase/leaveService";
import { getEmployees } from "../../firebase/employeeService";
import CustomDropdown from "../../components/Forms/CustomDropdown";

const LeaveApply = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const data = await getEmployees();
      setEmployees(data || []);
    };
    fetchEmployees();
  }, []);

  const leaveTypes = ["Casual Leave", "Medical Leave", "Vacation", "Emergency Leave"];

  const [formData, setFormData] = useState({
    employeeId: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    manager: "",
  });

  const employeeOptions = employees.map(emp => ({
    label: `${emp.firstName} ${emp.lastName || ''} - ${emp.department || 'Unassigned'}`,
    value: emp.id
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.startDate || !formData.endDate) {
      setError("Please select start and end dates");
      setLoading(false);
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError("Start date must be before end date");
      setLoading(false);
      return;
    }

    if (!formData.employeeId) {
      setError("Please select an employee");
      setLoading(false);
      return;
    }

    const selectedEmployee = employees.find(emp => emp.id === formData.employeeId);

    const result = await applyLeave({
      employeeId: selectedEmployee.id,
      email: selectedEmployee.email,
      employeeName: `${selectedEmployee.firstName} ${selectedEmployee.lastName || ''}`.trim(),
      department: selectedEmployee.department || 'Unassigned',
      position: selectedEmployee.position || '',
      leaveType: formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      managerId: formData.manager,
      status: "pending",
    });

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate("/leave-history");
      }, 2000);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, overflow: "auto" }}>
        <Navbar />
        <div style={{ padding: "30px", maxWidth: "800px", margin: "0 auto" }}>
          <div className="animate-glass-slide-down" style={{ marginBottom: "40px" }}>
            <h1 style={{ margin: 0, fontSize: "36px", fontWeight: "800", color: "#667eea", textShadow: "0 0 20px rgba(102, 126, 234, 0.3)" }}>Apply for Leave</h1>
            <p style={{ color: "rgba(255, 255, 255, 0.6)", marginTop: "10px", fontSize: "16px" }}>Submit your request for time off to your manager.</p>
          </div>

          {error && (
            <div className="animate-glass-in glass-card" style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#fca5a5", marginBottom: "25px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "20px" }}>⚠️</span> {error}
            </div>
          )}
          
          {success && (
            <div className="animate-glass-in glass-card" style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.3)", color: "#34d399", marginBottom: "25px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "20px" }}>✅</span> Leave request submitted successfully! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="animate-glass-slide-up glass-card" style={{ padding: "40px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px", marginBottom: "30px" }}>
              <div className="list-item-stagger" style={{ animationDelay: "0.1s", gridColumn: "span 2" }}>
                <label style={{ display: "block", marginBottom: "10px", color: "rgba(255, 255, 255, 0.8)", fontSize: "14px", fontWeight: "600" }}>Select Employee *</label>
                <CustomDropdown 
                  name="employeeId"
                  value={formData.employeeId} 
                  onChange={handleChange}
                  options={employeeOptions}
                  placeholder="Select Employee from Directory"
                />
              </div>

              <div className="list-item-stagger" style={{ animationDelay: "0.25s" }}>
                <label style={{ display: "block", marginBottom: "10px", color: "rgba(255, 255, 255, 0.8)", fontSize: "14px", fontWeight: "600" }}>Leave Type</label>
                <CustomDropdown 
                  name="leaveType" 
                  value={formData.leaveType} 
                  onChange={handleChange} 
                  options={leaveTypes}
                  placeholder="Select Type"
                />
              </div>

              <div className="list-item-stagger" style={{ animationDelay: "0.3s" }}>
                <label style={{ display: "block", marginBottom: "10px", color: "rgba(255, 255, 255, 0.8)", fontSize: "14px", fontWeight: "600" }}>Manager Email</label>
                <input 
                  type="email" 
                  name="manager" 
                  value={formData.manager} 
                  onChange={handleChange} 
                  placeholder="Approver's email"
                  required
                  className="glass-input"
                  style={{ width: "100%" }}
                />
              </div>

              <div className="list-item-stagger" style={{ animationDelay: "0.4s" }}>
                <label style={{ display: "block", marginBottom: "10px", color: "rgba(255, 255, 255, 0.8)", fontSize: "14px", fontWeight: "600" }}>Start Date</label>
                <input 
                  type="date" 
                  name="startDate" 
                  value={formData.startDate} 
                  onChange={handleChange} 
                  required 
                  className="glass-input"
                  style={{ width: "100%" }}
                />
              </div>

              <div className="list-item-stagger" style={{ animationDelay: "0.5s" }}>
                <label style={{ display: "block", marginBottom: "10px", color: "rgba(255, 255, 255, 0.8)", fontSize: "14px", fontWeight: "600" }}>End Date</label>
                <input 
                  type="date" 
                  name="endDate" 
                  value={formData.endDate} 
                  onChange={handleChange} 
                  required 
                  className="glass-input"
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div className="list-item-stagger" style={{ animationDelay: "0.5s", marginBottom: "30px" }}>
              <label style={{ display: "block", marginBottom: "10px", color: "rgba(255, 255, 255, 0.8)", fontSize: "14px", fontWeight: "600" }}>Reason for Leave</label>
              <textarea 
                name="reason" 
                value={formData.reason} 
                onChange={handleChange} 
                placeholder="Briefly explain the reason for your request"
                rows="4" 
                required 
                className="glass-input"
                style={{ width: "100%", resize: "none" }} 
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="glass-button hover-glass-lift transition-glass"
              style={{ 
                width: "100%", 
                padding: "16px", 
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
                color: "white", 
                border: "none", 
                borderRadius: "12px", 
                cursor: "pointer", 
                fontSize: "18px", 
                fontWeight: "700",
                letterSpacing: "0.5px",
                boxShadow: "0 10px 20px rgba(102, 126, 234, 0.3)"
              }}
            >
              {loading ? "Submitting Request..." : "Submit Leave Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LeaveApply;
