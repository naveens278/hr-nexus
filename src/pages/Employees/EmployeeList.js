import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { getEmployees, deleteEmployee } from "../../firebase/employeeService";
import { Link } from "react-router-dom";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("");

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(""); // Clear previous errors
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      const errorMessage = err.message === 'Failed to fetch' 
        ? "Failed to load employees. Please ensure the backend server is running (npm run dev)."
        : `Failed to load employees: ${err.message}`;
      setError(errorMessage);
      console.error(err);
      setEmployees([]); // Reset to empty list on error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      const result = await deleteEmployee(id);
      if (result.success) {
        loadEmployees();
      } else {
        setError(result.error);
      }
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchSearch =
      (emp.firstName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (emp.lastName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (emp.email?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchDept = !filterDept || emp.department === filterDept;

    return matchSearch && matchDept;
  });

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, overflow: "auto", background: "transparent" }}>
        <Navbar />
        <div style={{ padding: "30px", maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
            <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "700", color: "#667eea" }}>👥 Employees</h1>
            <Link to="/add-employee" style={{
              padding: "12px 24px",
              background: "transparent",
              color: "white",
              textDecoration: "none",
              borderRadius: "10px",
              fontWeight: "700",
              transition: "all 0.3s",
              boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 12px 32px rgba(102, 126, 234, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 8px 24px rgba(102, 126, 234, 0.3)";
            }}
            >
              ➕ Add Employee
            </Link>
          </div>

          {error && (
            <div style={{
              background: "rgba(239, 68, 68, 0.2)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(239, 68, 68, 0.5)",
              color: "#dc2626",
              padding: "12px 16px",
              borderRadius: "10px",
              marginBottom: "20px",
              fontSize: "14px",
            }}>
              ⚠️ {error}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#667eea" }}>
              <div className="animate-spin" style={{
                display: "inline-block",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "3px solid rgba(102, 126, 234, 0.2)",
                borderTop: "3px solid #667eea",
                marginBottom: "16px",
              }}></div>
              <p>Loading employees...</p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: "24px", display: "flex", gap: "15px" }}>
                <input
                  type="text"
                  placeholder="🔍 Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="glass-input"
                  style={{ flex: 1 }}
                />
                <select
                  value={filterDept}
                  onChange={(e) => setFilterDept(e.target.value)}
                  className="glass-input"
                  style={{ cursor: "pointer", color: "#667eea" }}
                >
                  <option value="">All Departments</option>
                  <option value="HR">HR</option>
                  <option value="IT">IT</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>

              <div className="glass-table-container">
                <div style={{ overflowX: "auto" }}>
                  <table className="glass-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Position</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.length > 0 ? (
                        filteredEmployees.map((emp) => (
                          <tr key={emp.id}>
                            <td style={{ color: "#fff", fontWeight: "500" }}>
                              {emp.firstName} {emp.lastName}
                            </td>
                            <td style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "13px" }}>{emp.email}</td>
                            <td style={{ color: "#667eea" }}>{emp.department}</td>
                            <td style={{ color: "rgba(255, 255, 255, 0.7)" }}>{emp.position}</td>
                            <td>
                              <span style={{
                                padding: "6px 12px",
                                background: emp.status === "active"
                                  ? "rgba(52, 211, 153, 0.2)"
                                  : "rgba(239, 68, 68, 0.2)",
                                color: emp.status === "active" ? "#059669" : "#dc2626",
                                borderRadius: "8px",
                                fontSize: "12px",
                                fontWeight: "600",
                                border: `1px solid ${emp.status === "active" ? "rgba(52, 211, 153, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                              }}>
                                {emp.status === "active" ? "🟢" : "🔴"} {emp.status}
                              </span>
                            </td>
                            <td>
                              <Link to={`/employees/${emp.id}`} style={{
                                marginRight: "10px",
                                color: "#667eea",
                                cursor: "pointer",
                                fontWeight: "600",
                                textDecoration: "none",
                                transition: "all 0.3s",
                                padding: "6px 12px",
                                borderRadius: "6px",
                                display: "inline-block",
                                background: "rgba(102, 126, 234, 0.1)",
                              }}
                              >
                                👁️ View
                              </Link>
                              <button 
                                onClick={() => handleDelete(emp.id)} 
                                className="glass-button transition-glass hover-glass-danger"
                                style={{
                                  background: "rgba(239, 68, 68, 0.15)",
                                  color: "#fca5a5",
                                  padding: "6px 14px",
                                  border: "1px solid rgba(239, 68, 68, 0.25)",
                                  borderRadius: "8px",
                                  cursor: "pointer",
                                  fontWeight: "600",
                                  fontSize: "13px",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "6px"
                                }}
                              >
                                <span>🗑️</span> Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" style={{ padding: "40px 20px", textAlign: "center", color: "rgba(255, 255, 255, 0.5)" }}>
                            No employees found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeeList;