import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { getAttendance } from "../../firebase/attendanceService";
import { getEmployees } from "../../firebase/employeeService";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { formatDateTime } from "../../utils/formatDate";

ChartJS.register(ArcElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function AttendanceReport() {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  // Initialize selectedDate with local YYYY-MM-DD to avoid timezone shift bugs
  const tzOffset = new Date().getTimezoneOffset() * 60000;
  const initialDate = new Date(Date.now() - tzOffset).toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(initialDate);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const attData = await getAttendance();
      const empData = await getEmployees();
      setAttendance(attData || []);
      setEmployees(empData || []);
    } catch (error) {
      console.error("Error loading report data", error);
    }
    setLoading(false);
  };

  // Merge the employee list with attendance records for the SELECTED DATE
  // This explicitly shows who is "Absent" vs "Present"
  const dailyReport = employees.map(emp => {
    const records = attendance.filter(a => {
      if (!a.date) return false;
      const dStr = typeof a.date === "string" ? a.date : new Date(a.date).toISOString();
      return String(a.employeeId) === String(emp.id) && dStr.startsWith(selectedDate);
    });

    records.sort((a,b) => new Date(a.checkInTime) - new Date(b.checkInTime));

    const isPresent = records.length > 0;
    const latestRecord = isPresent ? records[records.length - 1] : null;
    const status = isPresent ? (latestRecord.checkOutTime ? "Checked Out" : (latestRecord.status || "Present")) : "Absent";

    return {
      employee: emp,
      records: records,
      status: status
    };
  });

  // Calculate status summary for Pie Chart
  const statusCounts = { present: 0, absent: 0, late: 0, "half-day": 0, "checked-out": 0 };
  dailyReport.forEach(item => {
    const s = (item.status || '').toLowerCase();
    if (s === "absent") statusCounts.absent += 1;
    else if (s === "checked out" || s === "checked-out") statusCounts["checked-out"] += 1;
    else if (s === "late") statusCounts.late += 1;
    else if (s === "half-day") statusCounts["half-day"] += 1;
    else statusCounts.present += 1;
  });

  // For the chart display, merge "Checked Out" into "Present" visually if desired, 
  // but it's great to have them distinct if they finished the day.
  const pieData = {
    labels: ['Active/Present', 'Completed/Checked Out', 'Absent', 'Late'],
    datasets: [
      {
        data: [statusCounts.present, statusCounts["checked-out"], statusCounts.absent, statusCounts.late],
        backgroundColor: ['#007bff', '#28a745', '#dc3545', '#ffc107'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, overflow: "auto", background: "transparent" }}>
        <Navbar />
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
          <h1 className="animate-glass-slide-down" style={{ marginTop: 0, color: "#fff", marginBottom: "5px" }}>Daily Attendance Report</h1>
          <p style={{ color: "rgba(255, 255, 255, 0.7)", marginBottom: "20px" }}>View the complete status of all registered employees for any particular day.</p>
          
          <div className="animate-glass-in glass-card" style={{ display: "flex", gap: "15px", marginBottom: "20px", alignItems: "center", flexWrap: "wrap", padding: "15px" }}>
            <label style={{ fontWeight: "bold" }}>Select Date:</label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} 
            />
            <div style={{ padding: "8px 15px", background: "rgba(59, 130, 246, 0.2)", color: "#93c5fd", borderRadius: "8px", fontWeight: "bold", marginLeft: "auto", border: "1px solid rgba(59, 130, 246, 0.3)" }}>
              Total Workforce: {employees.length}
            </div>
            <button
               onClick={loadData}
               className="glass-button"
            >
              ⟳ Refresh
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 1fr) minmax(300px, 1fr)", gap: "20px", marginBottom: "30px" }}>
             <div className="animate-glass-slide-up glass-card" style={{ padding: "20px" }}>
              <h3 style={{ marginTop: 0, textAlign: "center", color: "#fff" }}>Daily Insight ({selectedDate})</h3>
              {loading ? <p style={{ textAlign: "center", padding: "100px 0", color: "rgba(255, 255, 255, 0.5)" }}>Calculating...</p> : (
                <div style={{ height: "300px" }}>
                  {employees.length > 0 ? <Pie data={pieData} options={chartOptions} /> : <p style={{ textAlign: "center", color: "rgba(255, 255, 255, 0.5)", marginTop: "100px" }}>No employee data available</p>}
                </div>
              )}
            </div>

            <div className="animate-glass-slide-left glass-card" style={{ padding: "20px" }}>
              <h3 style={{ marginTop: 0, textAlign: "center", color: "#fff" }}>Daily Summary</h3>
              {loading ? <p style={{ textAlign: "center", padding: "100px 0", color: "rgba(255, 255, 255, 0.5)" }}>Loading metrics...</p> : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "20px" }}>
                  <div style={{ background: "rgba(59, 130, 246, 0.2)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(59, 130, 246, 0.3)", textAlign: "center" }}>
                    <h2 style={{ margin: 0, color: "#fff", fontSize: "36px" }}>{statusCounts.present}</h2>
                    <p style={{ margin: 0, color: "#93c5fd", fontWeight: "bold" }}>Active / Present</p>
                  </div>
                  <div style={{ background: "rgba(34, 197, 94, 0.2)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(34, 197, 94, 0.3)", textAlign: "center" }}>
                    <h2 style={{ margin: 0, color: "#fff", fontSize: "36px" }}>{statusCounts["checked-out"]}</h2>
                    <p style={{ margin: 0, color: "#86efac", fontWeight: "bold" }}>Completed Shift</p>
                  </div>
                  <div style={{ background: "rgba(239, 68, 68, 0.2)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(239, 68, 68, 0.3)", textAlign: "center" }}>
                    <h2 style={{ margin: 0, color: "#fff", fontSize: "36px" }}>{statusCounts.absent}</h2>
                    <p style={{ margin: 0, color: "#fca5a5", fontWeight: "bold" }}>Absent / Unlogged</p>
                  </div>
                  <div style={{ background: "rgba(245, 158, 11, 0.2)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(245, 158, 11, 0.3)", textAlign: "center" }}>
                    <h2 style={{ margin: 0, color: "#fff", fontSize: "36px" }}>{statusCounts.late}</h2>
                    <p style={{ margin: 0, color: "#fcd34d", fontWeight: "bold" }}>Late Arrivals</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="animate-glass-slide-up glass-card" style={{ padding: "20px" }}>
            <h3 style={{ marginTop: 0, color: "#fff", marginBottom: "20px" }}>Full Staff Register ({selectedDate})</h3>
            {loading ? (
               <div style={{ textAlign: "center", padding: "40px 0" }}>
                 <div className="animate-spin" style={{ display: "inline-block", width: "40px", height: "40px", border: "4px solid rgba(102, 126, 234, 0.2)", borderTop: "4px solid #667eea", borderRadius: "50%", marginBottom: "15px" }}></div>
                 <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>Loading staff directory...</p>
                              </div>
            ) : (
              <div className="glass-table-container" style={{ overflowX: "auto" }}>
                <table className="glass-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Department</th>
                      <th>Attendance Logs (In / Out)</th>
                      <th>Total Hrs</th>
                      <th>End Status</th>
                    </tr>
                  </thead>
                  <tbody>                    {dailyReport.map((item, i) => {
                      const { employee, records, status } = item;
                      const isAbsent = status === "Absent";
                      const isPresent = status === "Present";
                      
                      const totalHours = records.reduce((acc, r) => acc + (parseFloat(r.workingHours) || 0), 0);
                      
                      return (
                        <tr key={employee.id || i} style={{ transition: "background 0.2s", background: isAbsent ? "rgba(255, 255, 255, 0.02)" : "transparent" }}>
                          <td style={{ padding: "12px" }}>
                            <div style={{ fontWeight: "bold", color: "#fff" }}>{employee.firstName} {employee.lastName}</div>
                            <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.5)" }}>ID: {employee.id}</div>
                          </td>
                          <td style={{ padding: "12px", color: "rgba(255, 255, 255, 0.7)" }}>{employee.department}</td>
                          
                          {/* Logs */}
                          <td style={{ padding: "12px", color: "#fff" }}>
                            {isAbsent ? "-" : (
                               <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                  {records.map((r, idx) => (
                                     <div key={idx} style={{ background: "rgba(255, 255, 255, 0.05)", padding: "4px 8px", borderRadius: "8px", fontSize: "12px", borderLeft: r.checkOutTime ? "3px solid #34d399" : "3px solid #60a5fa" }}>
                                        <span style={{color: "#93c5fd", fontWeight: "600"}}>In:</span> {r.checkInTime ? formatDateTime(new Date(r.checkInTime)).split(" ").slice(1).join(" ") : "-"} 
                                        <span style={{margin: "0 8px", color: "rgba(255, 255, 255, 0.2)"}}>|</span>
                                        <span style={{color: "#86efac", fontWeight: "600"}}>Out:</span> {r.checkOutTime ? formatDateTime(new Date(r.checkOutTime)).split(" ").slice(1).join(" ") : "Active"}
                                     </div>
                                  ))}
                               </div>
                            )}
                          </td>
                          
                          {/* Hours */}
                          <td style={{ padding: "12px", color: "#fff", fontWeight: "bold" }}>
                            {records.length > 0 ? (
                              records.some(r => !r.checkOutTime) ? (
                                totalHours > 0 ? `Tracking (+${totalHours.toFixed(2)}h)` : "Tracking"
                              ) : (
                                `${totalHours.toFixed(2)}h`
                              )
                            ) : "-"}
                          </td>
                          
                          {/* Status */}
                          <td style={{ padding: "12px" }}>
                            <span style={{ 
                              padding: "6px 12px", 
                              borderRadius: "8px", 
                              fontSize: "12px", 
                              fontWeight: "bold",
                              background: isAbsent ? "rgba(239, 68, 68, 0.2)" : isPresent ? "rgba(59, 130, 246, 0.2)" : "rgba(34, 197, 94, 0.2)",
                              color: isAbsent ? "#fca5a5" : isPresent ? "#93c5fd" : "#86efac",
                              border: `1px solid ${isAbsent ? "rgba(239, 68, 68, 0.3)" : isPresent ? "rgba(59, 130, 246, 0.3)" : "rgba(34, 197, 94, 0.3)"}`
                            }}>
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}


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

export default AttendanceReport;