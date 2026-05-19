import { useState, useEffect, useCallback } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { getEmployees } from "../../firebase/employeeService";
import { processMonthlyPayroll, getTotalPayrollForMonth } from "../../firebase/payrollService";

function PayrollPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [month] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [summary, setSummary] = useState(null);
  const [message, setMessage] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    const emps = await getEmployees();
    setEmployees(emps);
    
    const payrollSummary = await getTotalPayrollForMonth(month);
    if (payrollSummary.success && payrollSummary.data.employeeCount > 0) {
      setSummary(payrollSummary.data);
    }
    setLoading(false);
  }, [month]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleProcessPayroll = async () => {
    if (summary) {
      if (!window.confirm("Payroll for this month has already been processed. Process again?")) {
        return;
      }
    }
    
    setProcessing(true);
    setMessage("");
    
    const result = await processMonthlyPayroll(month, employees);
    if (result.success) {
      setMessage(`Successfully processed payroll for ${month}.`);
      loadData(); // Reload to get new summary
    } else {
      setMessage(`Error: ${result.error}`);
    }
    
    setProcessing(false);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, overflow: "auto" }}>
        <Navbar />
        <div style={{ 
          padding: "20px", 
          maxWidth: "1000px", 
          margin: "0 auto",
          background: "transparent",
          minHeight: "100vh"
        }}>
          <h1 className="animate-glass-slide-down" style={{ marginTop: 0, color: "#fff", textShadow: "0 1px 2px rgba(102,126,234,0.1)" }}>Payroll Management</h1>
          
          <div className="animate-glass-in glass-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(24, 24, 27, 0.4)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.05)", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", marginBottom: "20px" }}>
            <div>
              <h3 style={{ margin: "0 0 10px 0", color: "#fff" }}>Process Payroll for: <span style={{ color: "#667eea" }}>{month}</span></h3>
              {summary ? (
                <p style={{ margin: 0, color: "#22c55e", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }}></span>
                  Status: Processed ({summary.employeeCount} employees, Total Net: ₹{summary.totalNetSalary.toLocaleString()})
                </p>
              ) : (
                <p style={{ margin: 0, color: "#dc3545", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#dc3545", boxShadow: "0 0 8px #dc3545" }}></span>
                  Status: Pending Processing
                </p>
              )}
            </div>
            
            <button 
              onClick={handleProcessPayroll}
              disabled={loading || processing || employees.length === 0}
              className={`hover-glass-lift transition-glass ${processing || loading ? "opacity-50" : ""}`}
              style={{ 
                padding: "12px 24px", 
                background: processing ? "rgba(108, 117, 125, 0.5)" : "rgba(102, 126, 234, 0.8)",
                backdropFilter: "blur(8px)",
                color: "white", 
                border: "1px solid rgba(255, 255, 255, 0.1)", 
                borderRadius: "8px", 
                cursor: (loading || processing) ? "not-allowed" : "pointer",
                fontWeight: "600",
                letterSpacing: "0.5px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.2)"
              }}
            >
              {processing && <div className="animate-spin" style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%" }}></div>}
              {processing ? "Processing..." : "Process Monthly Payroll"}
            </button>
          </div>

          {message && (
            <div className="animate-fade-in" style={{ 
              background: message.startsWith("Error") ? "rgba(220, 53, 69, 0.15)" : "rgba(40, 167, 69, 0.15)", 
              color: message.startsWith("Error") ? "#ff6b6b" : "#4ade80", 
              border: `1px solid ${message.startsWith("Error") ? "rgba(220, 53, 69, 0.3)" : "rgba(40, 167, 69, 0.3)"}`,
              backdropFilter: "blur(10px)",
              padding: "15px 20px", 
              borderRadius: "8px", 
              marginBottom: "20px",
              fontWeight: "500"
            }}>
              {message}
            </div>
          )}

          <div className="animate-glass-slide-up glass-card" style={{ background: "rgba(24, 24, 27, 0.4)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.05)", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
            <h3 style={{ marginTop: 0, color: "#fff", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "15px", marginBottom: "15px" }}>Employees to Process ({employees.length})</h3>
            
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0" }}>
                 <div className="animate-spin" style={{ width: "40px", height: "40px", border: "3px solid rgba(102, 126, 234, 0.2)", borderTop: "3px solid #667eea", borderRadius: "50%", marginBottom: "15px" }}></div>
                 <p style={{ color: "rgba(255,255,255,0.7)", fontWeight: "500", letterSpacing: "0.5px" }}>Loading employees data...</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(255, 255, 255, 0.05)", textAlign: "left" }}>
                      <th style={{ padding: "15px 20px", color: "rgba(255, 255, 255, 0.9)", fontWeight: "600", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.5px", borderTopLeftRadius: "8px", borderBottomLeftRadius: "8px" }}>Name</th>
                      <th style={{ padding: "15px 20px", color: "rgba(255, 255, 255, 0.9)", fontWeight: "600", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Email</th>
                      <th style={{ padding: "15px 20px", color: "rgba(255, 255, 255, 0.9)", fontWeight: "600", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Department</th>
                      <th style={{ padding: "15px 20px", color: "rgba(255, 255, 255, 0.9)", fontWeight: "600", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.5px", borderTopRightRadius: "8px", borderBottomRightRadius: "8px" }}>Base Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp, index) => (
                      <tr key={emp.id} className="list-item-stagger transition-glass" 
                          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)" }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent" }}
                          style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)", animationDelay: `${index * 0.05}s` }}>
                        <td style={{ padding: "15px 20px", color: "#fff", fontWeight: "500" }}>{emp.firstName} {emp.lastName}</td>
                        <td style={{ padding: "15px 20px", color: "rgba(255, 255, 255, 0.7)" }}>{emp.email}</td>
                        <td style={{ padding: "15px 20px" }}>
                           <span style={{ background: "rgba(102, 126, 234, 0.15)", color: "#818cf8", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>
                             {emp.department || "Unassigned"}
                           </span>
                        </td>
                        <td style={{ padding: "15px 20px", color: "#fff", fontWeight: "600" }}>₹{emp.salary?.basic?.toLocaleString() || "Not Set"}</td>
                      </tr>
                    ))}
                    {employees.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ padding: "40px", textAlign: "center", color: "rgba(255, 255, 255, 0.5)" }}>
                          <p style={{ fontSize: "16px", marginBottom: "0" }}>No employees found.</p>
                        </td>
                      </tr>
                    )}
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

export default PayrollPage;
