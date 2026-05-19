import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { checkIn, checkOut, getAttendance } from "../../firebase/attendanceService";
import { getEmployees } from "../../firebase/employeeService";
import { useAuth } from "../../hooks/useAuth";
import { formatDateTime } from "../../utils/formatDate";

function AttendancePage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [todayAttendanceList, setTodayAttendanceList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const emps = await getEmployees();
      setEmployees(emps || []);

      const tzOffset = new Date().getTimezoneOffset() * 60000;
      const today = new Date(Date.now() - tzOffset).toISOString().split("T")[0];
      const allAtt = await getAttendance();
      const todayAtt = (allAtt || []).filter(a => {
        if (!a.date) return false;
        const dStr = typeof a.date === "string" ? a.date : new Date(a.date).toISOString();
        return dStr.startsWith(today);
      });
      setTodayAttendanceList(todayAtt);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleEmployeeLogIn = async (empId) => {
    const result = await checkIn(empId, "Manual");
    if (result.success || result.error === "Already checked in") {
      loadData(); // Re-fetch to get accurate times directly from DB
    } else {
      alert("Error checking in: " + result.error);
    }
  };

  const handleEmployeeLogOut = async (empId) => {
    const result = await checkOut(empId, "Manual");
    if (result.success) {
      loadData(); // Re-fetch to get accurate times directly from DB
    } else {
      alert("Error checking out: " + result.error);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, overflow: "auto", background: "transparent" }}>
        <Navbar />
        <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
          <h1 className="animate-glass-slide-down" style={{ marginTop: 0, color: "#fff", marginBottom: "5px" }}>Daily Attendance Kiosk</h1>
          <p style={{ color: "rgba(255, 255, 255, 0.7)", marginBottom: "20px" }}>Log In (Check In) and Log Out (Check Out) employees for today.</p>

          <div className="animate-glass-slide-up glass-card">
            
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div className="animate-spin" style={{ display: "inline-block", width: "40px", height: "40px", border: "4px solid rgba(102, 126, 234, 0.2)", borderTop: "4px solid #667eea", borderRadius: "50%", marginBottom: "15px" }}></div>
                <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>Loading today's attendance data...</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {employees.map(emp => {
                  const records = todayAttendanceList.filter(a => String(a.employeeId) === String(emp.id));
                  records.sort((a,b) => new Date(a.checkInTime) - new Date(b.checkInTime));
                  
                  const latestRecord = records.length > 0 ? records[records.length - 1] : null;
                  const isCheckedIn = !!latestRecord;
                  const isCheckedOut = latestRecord && !!latestRecord.checkOutTime;

                  return (
                    <div key={emp.id} className="hover-glass-lift transition-glass" style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center", 
                      padding: "20px", 
                      border: "1px solid rgba(255, 255, 255, 0.1)", 
                      borderRadius: "16px",
                      background: isCheckedOut ? "rgba(255, 255, 255, 0.05)" : isCheckedIn ? "rgba(52, 211, 153, 0.1)" : "rgba(24, 24, 27, 0.6)",
                      backdropFilter: "blur(10px)",
                    }}>
                      <div>
                        <strong style={{ fontSize: "18px", color: "#fff" }}>{emp.firstName} {emp.lastName}</strong>
                        <div style={{ fontSize: "14px", color: "#888", marginTop: "4px", marginBottom: "8px" }}>{emp.email} • {emp.department}</div>
                        {records.length > 0 && (
                          <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
                            {records.map((r, idx) => (
                               <div key={idx} style={{ fontSize: "12px", background: "rgba(255, 255, 255, 0.05)", padding: "6px 10px", borderRadius: "8px", borderLeft: r.checkOutTime ? "3px solid #34d399" : "3px solid #60a5fa", width: "fit-content", color: "#fff" }}>
                                 <span style={{ color: "#007bff", fontWeight: "bold" }}>In:</span> {r.checkInTime ? formatDateTime(new Date(r.checkInTime)).split(" ").slice(1).join(" ") : "N/A"} 
                                 <span style={{ margin: "0 10px", color: "#ccc" }}>|</span>
                                 <span style={{ color: "#28a745", fontWeight: "bold" }}>Out:</span> {r.checkOutTime ? formatDateTime(new Date(r.checkOutTime)).split(" ").slice(1).join(" ") : "Active"}
                               </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div>
                          <button
                            onClick={() => handleEmployeeLogIn(emp.id)}
                            className="glass-button"
                            style={{ marginRight: "10px" }}
                          >
                            Log In
                          </button>
                          <button
                            onClick={() => handleEmployeeLogOut(emp.id)}
                            className="glass-button"
                            style={{
                              background: "rgba(239, 68, 68, 0.2)",
                              color: "#ef4444",
                              border: "1px solid rgba(239, 68, 68, 0.3)"
                            }}
                          >
                            Log Out
                          </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendancePage;
