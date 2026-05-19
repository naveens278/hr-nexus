import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { generatePayslip } from "../../firebase/payrollService";
import { getEmployees } from "../../firebase/employeeService";
import { useAuth } from "../../hooks/useAuth";

function Payslip() {
  const { user } = useAuth();
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [payslipData, setPayslipData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  
  const isAdmin = user?.email === "naveensenthil396@gmail.com";

  useEffect(() => {
    if (isAdmin) {
      getEmployees().then(setEmployees);
    }
  }, [isAdmin]);

  const handleGenerate = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    setPayslipData(null);

    // If admin has selected someone, use their email. Otherwise use null (current user).
    const result = await generatePayslip(user.uid, month, selectedEmail || (isAdmin ? null : user.email));
    
    if (result.success) {
      setPayslipData(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const printDocument = () => {
    window.print();
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div className="no-print" style={{ height: "100%" }}>
        <Sidebar />
      </div>
      <div style={{ flex: 1, overflow: "auto" }}>
        <div className="no-print">
          <Navbar />
        </div>
        
        <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto", background: "transparent", minHeight: "100vh" }}>
          <div className="no-print animate-glass-slide-down glass-card" style={{ marginBottom: "30px", background: "rgba(24, 24, 27, 0.4)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.05)", padding: "30px", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
            <h1 style={{ marginTop: 0, color: "#fff", textShadow: "0 1px 2px rgba(102,126,234,0.1)" }}>Payslip Generator</h1>
            <div style={{ display: "flex", gap: "20px", alignItems: "flex-end", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "200px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "rgba(255, 255, 255, 0.8)", fontSize: "14px" }}>Select Month</label>
                <input 
                  type="month" 
                  value={month} 
                  onChange={(e) => setMonth(e.target.value)}
                  style={{ 
                    width: "100%", 
                    padding: "12px", 
                    background: "rgba(255, 255, 255, 0.05)", 
                    border: "1px solid rgba(255, 255, 255, 0.1)", 
                    borderRadius: "8px", 
                    color: "#fff",
                    outline: "none"
                  }}
                />
              </div>

              {isAdmin && (
                <div style={{ flex: 1, minWidth: "250px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "rgba(255, 255, 255, 0.8)", fontSize: "14px" }}>Select Employee (Admin Mode)</label>
                  <select 
                    value={selectedEmail} 
                    onChange={(e) => setSelectedEmail(e.target.value)}
                    style={{ 
                      width: "100%", 
                      padding: "12px", 
                      background: "rgba(255, 255, 255, 0.05)", 
                      border: "1px solid rgba(255, 255, 255, 0.1)", 
                      borderRadius: "8px", 
                      color: "#fff",
                      outline: "none"
                    }}
                  >
                    <option value="" style={{ background: "#222" }}>Choose Employee...</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.email} style={{ background: "#222" }}>
                        {emp.firstName} {emp.lastName} ({emp.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button 
                onClick={handleGenerate} 
                className="hover-glass-lift transition-glass"
                disabled={loading || (isAdmin && !selectedEmail)}
                style={{ 
                  padding: "0 30px", 
                  background: loading || (isAdmin && !selectedEmail) ? "rgba(102, 126, 234, 0.5)" : "#6366f1", 
                  color: "white", 
                  border: "none", 
                  borderRadius: "8px", 
                  cursor: loading || (isAdmin && !selectedEmail) ? "not-allowed" : "pointer", 
                  height: "45px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)"
                }}
              >
                {loading && <div className="animate-spin" style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%" }}></div>}
                {loading ? "Generating..." : "Generate Payslip"}
              </button>
              {payslipData && (
                <button 
                  onClick={printDocument}
                  className="hover-glass-lift transition-glass"
                  style={{ 
                    padding: "0 30px", 
                    background: "rgba(34, 197, 94, 0.8)", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "8px", 
                    cursor: "pointer", 
                    height: "45px",
                    fontWeight: "600",
                    boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)"
                  }}
                >
                  Print / Save PDF
                </button>
              )}
            </div>
            
            {error && <div className="animate-fade-in" style={{ marginTop: "20px", color: "#ff6b6b", padding: "12px 20px", background: "rgba(220, 53, 69, 0.1)", border: "1px solid rgba(220, 53, 69, 0.2)", borderRadius: "8px", fontWeight: "500" }}>{error}</div>}
          </div>

          {/* Payslip Document Area */}
          {payslipData && (
            <div className="animate-glass-slide-up print-area" style={{ 
              background: "rgba(24, 24, 27, 0.6)", 
              backdropFilter: "blur(20px)",
              color: "#ffffff", 
              padding: "50px", 
              borderRadius: "24px", 
              boxShadow: "0 25px 80px rgba(0,0,0,0.5)", 
              position: "relative",
              margin: "0 auto",
              width: "100%",
              maxWidth: "900px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              overflow: "hidden"
            }}>
              {/* Decorative backgrounds for screen view only */}
              <div className="no-print" style={{ position: "absolute", top: "-100px", right: "-100px", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)", zIndex: 0 }}></div>
              <div className="no-print" style={{ position: "absolute", bottom: "-100px", left: "-100px", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%)", zIndex: 0 }}></div>

              <style>{`
                .print-area {
                  font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
                }
                .print-area h1, .print-area h2, .print-area h3, .print-area h4 {
                  letter-spacing: -0.02em !important;
                }
                @media print {
                  @page { margin: 1cm; size: A4; }
                  .no-print { display: none !important; }
                  .print-area { 
                    box-shadow: none !important; 
                    border: 1px solid #000 !important; 
                    width: 100% !important; 
                    padding: 20px !important; 
                    margin: 0 !important; 
                    background: white !important; 
                    color: black !important; 
                    position: static !important;
                    transform: none !important;
                    animation: none !important;
                    border-radius: 0 !important;
                    backdrop-filter: none !important;
                  }
                  .print-area * {
                    color: black !important;
                    background-color: transparent !important;
                    border-color: #eee !important;
                    box-shadow: none !important;
                    text-shadow: none !important;
                  }
                  .net-payable-box {
                    border: 2px solid #000 !important;
                    background: #f0f0f0 !important;
                    color: black !important;
                  }
                  .section-header {
                    background: #333 !important;
                    color: white !important;
                    -webkit-print-color-adjust: exact !important;
                  }
                }
              `}</style>
              
              <div style={{ position: "relative", zIndex: 1, textAlign: "center", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "30px", marginBottom: "40px" }}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginBottom: "10px" }}>
                  <div style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)" }}>
                    <span style={{ color: "white", fontWeight: "900", fontSize: "20px" }}>N</span>
                  </div>
                  <h1 style={{ margin: 0, color: "#fff", letterSpacing: "1px", fontWeight: "800", fontSize: "36px", background: "linear-gradient(to right, #fff, #a5b4fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {payslipData.company.name}
                  </h1>
                </div>
                <p style={{ margin: "5px 0", color: "rgba(255, 255, 255, 0.6)", fontSize: "14px", fontWeight: "500" }}>{payslipData.company.address}</p>
                <div style={{ marginTop: "20px" }}>
                  <span style={{ background: "rgba(99, 102, 241, 0.2)", color: "#a5b4fc", padding: "8px 24px", borderRadius: "100px", fontSize: "12px", fontWeight: "700", border: "1px solid rgba(99, 102, 241, 0.3)", textTransform: "uppercase", letterSpacing: "1px" }}>
                    Statement for {payslipData.payroll.month}
                  </span>
                </div>
              </div>

              <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px", marginBottom: "40px" }}>
                <div style={{ padding: "25px", background: "rgba(255, 255, 255, 0.03)", borderRadius: "20px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                  <h4 style={{ margin: "0 0 20px 0", color: "#a5b4fc", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>Personnel Details</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "14px" }}>Employee ID:</span> <span style={{ fontWeight: "600" }}>{payslipData.employee.id}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "14px" }}>Full Name:</span> <span style={{ fontWeight: "600" }}>{payslipData.employee.firstName} {payslipData.employee.lastName}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "14px" }}>Department:</span> <span style={{ fontWeight: "600" }}>{payslipData.employee.department}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "14px" }}>Position:</span> <span style={{ fontWeight: "600" }}>{payslipData.employee.employment.position}</span></div>
                  </div>
                </div>
                <div style={{ padding: "25px", background: "rgba(255, 255, 255, 0.03)", borderRadius: "20px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                  <h4 style={{ margin: "0 0 20px 0", color: "#a5b4fc", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>Payment Information</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "14px" }}>Bank:</span> <span style={{ fontWeight: "600" }}>{payslipData.employee.bank.bankName}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "14px" }}>Account:</span> <span style={{ fontWeight: "600" }}>{payslipData.employee.bank.accountNumber}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "14px" }}>Type:</span> <span style={{ fontWeight: "600" }}>Direct Deposit</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "14px" }}>Ref ID:</span> <span style={{ fontWeight: "600", color: "rgba(255,255,255,0.7)" }}>{payslipData.payroll.generationId.split('-').pop()}</span></div>
                  </div>
                </div>
              </div>

              <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "40px" }}>
                {/* Earnings */}
                <div style={{ background: "rgba(255, 255, 255, 0.02)", borderRadius: "20px", padding: "25px", border: "1px solid rgba(255, 255, 255, 0.03)" }}>
                  <h4 className="section-header" style={{ margin: "0 0 20px 0", color: "#6366f1", fontSize: "14px", fontWeight: "800", textTransform: "uppercase", borderBottom: "1px solid rgba(99, 102, 241, 0.2)", paddingBottom: "10px" }}>EARNINGS</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}><span style={{ color: "rgba(255, 255, 255, 0.6)" }}>Basic Salary</span> <span style={{ fontWeight: "600" }}>₹{payslipData.payroll.basicSalary.toLocaleString()}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}><span style={{ color: "rgba(255, 255, 255, 0.6)" }}>HRA (Rent)</span> <span style={{ fontWeight: "600" }}>₹{payslipData.payroll.allowances.hra.toLocaleString()}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}><span style={{ color: "rgba(255, 255, 255, 0.6)" }}>Dearness (DA)</span> <span style={{ fontWeight: "600" }}>₹{payslipData.payroll.allowances.dearness.toLocaleString()}</span></div>
                    <div style={{ marginTop: "10px", paddingTop: "15px", borderTop: "1px dashed rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: "800", color: "#fff", fontSize: "14px" }}>GROSS EARNINGS</span>
                      <span style={{ fontWeight: "900", color: "#fff", fontSize: "16px" }}>₹{payslipData.payroll.grossSalary.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div style={{ background: "rgba(255, 255, 255, 0.02)", borderRadius: "20px", padding: "25px", border: "1px solid rgba(255, 255, 255, 0.03)" }}>
                  <h4 className="section-header" style={{ margin: "0 0 20px 0", color: "#ef4444", fontSize: "14px", fontWeight: "800", textTransform: "uppercase", borderBottom: "1px solid rgba(239, 68, 68, 0.2)", paddingBottom: "10px" }}>DEDUCTIONS</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}><span style={{ color: "rgba(255, 255, 255, 0.6)" }}>Provident Fund (PF)</span> <span style={{ fontWeight: "600", color: "#ff6b6b" }}>₹{payslipData.payroll.deductions.pf.toLocaleString()}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}><span style={{ color: "rgba(255, 255, 255, 0.6)" }}>Income Tax (PT)</span> <span style={{ fontWeight: "600", color: "#ff6b6b" }}>₹{payslipData.payroll.deductions.tax.toLocaleString()}</span></div>
                    <div style={{ height: "34px" }}></div>
                    <div style={{ marginTop: "10px", paddingTop: "15px", borderTop: "1px dashed rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: "800", color: "#ff6b6b", fontSize: "14px" }}>TOTAL DEDUCTIONS</span>
                      <span style={{ fontWeight: "900", color: "#ff6b6b", fontSize: "16px" }}>₹{payslipData.payroll.totalDeductions.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="net-payable-box" style={{ 
                position: "relative",
                zIndex: 1,
                background: "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.2) 100%)", 
                padding: "40px", 
                borderRadius: "24px", 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                border: "1px solid rgba(34, 197, 94, 0.3)",
                boxShadow: "0 0 40px rgba(34, 197, 94, 0.1) inset"
              }}>
                <div>
                  <h3 style={{ margin: 0, color: "#4ade80", fontSize: "14px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "2px" }}>Net Monthly Salary</h3>
                  <p style={{ margin: "8px 0 0 0", color: "rgba(255, 255, 255, 0.5)", fontSize: "13px" }}>Security verified & processed via HR-Nexus Gateway</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: "0 0 5px 0", color: "#4ade80", fontSize: "14px", fontWeight: "700" }}>Total Payable</p>
                  <h2 style={{ margin: 0, color: "#fff", fontSize: "56px", fontWeight: "900", letterSpacing: "-1px", textShadow: "0 0 20px rgba(74, 222, 128, 0.2)" }}>₹{payslipData.payroll.netSalary.toLocaleString()}</h2>
                </div>
              </div>

              <div style={{ position: "relative", zIndex: 1, marginTop: "50px", fontSize: "11px", color: "rgba(255, 255, 255, 0.3)", textAlign: "center", borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "30px", letterSpacing: "0.5px" }}>
                <p style={{ margin: "0 0 5px 0" }}>Digital Timestamp: {new Date().toISOString()}</p>
                <p style={{ margin: 0 }}>© 2026 HR-NEXUS INC • Enterprise Payroll Solutions • This document is confidential and legally protected.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Payslip;