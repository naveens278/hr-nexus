import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { getAttendance } from "../../firebase/attendanceService";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function AttendanceReport() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getAttendance(); // Gets all records, we'll filter client-side for simplicity here
    setAttendance(data);
    setLoading(false);
  };

  // Filter records by selected month
  const currentMonthRecords = attendance.filter(record => record.date && record.date.startsWith(month));

  // Calculate status summary
  const statusCounts = { present: 0, absent: 0, late: 0, "half-day": 0, "on-leave": 0 };
  currentMonthRecords.forEach(record => {
    const status = record.status || "present";
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  const pieData = {
    labels: ['Present', 'Absent', 'Late', 'Half-Day', 'On Leave'],
    datasets: [
      {
        data: [statusCounts.present, statusCounts.absent, statusCounts.late, statusCounts['half-day'], statusCounts['on-leave']],
        backgroundColor: ['#28a745', '#dc3545', '#ffc107', '#17a2b8', '#6c757d'],
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
      <div style={{ flex: 1, overflow: "auto", background: "#f8f9fa" }}>
        <Navbar />
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
          <h1 className="animate-glass-slide-down" style={{ marginTop: 0, color: "#fff" }}>Attendance Report</h1>
          
          <div className="animate-glass-in" style={{ display: "flex", gap: "15px", marginBottom: "20px", background: "rgba(24, 24, 27, 0.4)", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", alignItems: "center" }}>
            <label style={{ fontWeight: "bold" }}>Select Month:</label>
            <input 
              type="month" 
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              style={{ padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} 
            />
            <div style={{ padding: "8px 15px", background: "#e8f0fe", color: "#0056b3", borderRadius: "4px", fontWeight: "bold", marginLeft: "auto" }}>
              Total Logs: {currentMonthRecords.length}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="animate-glass-slide-up" style={{ background: "rgba(24, 24, 27, 0.4)", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
              <h3 style={{ marginTop: 0, textAlign: "center", color: "#555" }}>Overall Attendance Status</h3>
              {loading ? <p style={{ textAlign: "center" }}>Loading chart...</p> : (
                <div style={{ height: "300px" }}>
                  {currentMonthRecords.length > 0 ? <Pie data={pieData} options={chartOptions} /> : <p style={{ textAlign: "center", color: "rgba(255, 255, 255, 0.5)", marginTop: "100px" }}>No data available for {month}</p>}
                </div>
              )}
            </div>

            <div className="animate-glass-slide-left" style={{ background: "rgba(24, 24, 27, 0.4)", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
              <h3 style={{ marginTop: 0, textAlign: "center", color: "#555" }}>Summary Breakdown</h3>
              {loading ? <p style={{ textAlign: "center" }}>Loading metrics...</p> : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "20px" }}>
                  <div style={{ background: "#d4edda", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
                    <h2 style={{ margin: 0, color: "#155724", fontSize: "36px" }}>{statusCounts.present}</h2>
                    <p style={{ margin: 0, color: "#155724" }}>Present</p>
                  </div>
                  <div style={{ background: "#f8d7da", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
                    <h2 style={{ margin: 0, color: "#721c24", fontSize: "36px" }}>{statusCounts.absent}</h2>
                    <p style={{ margin: 0, color: "#721c24" }}>Absent</p>
                  </div>
                  <div style={{ background: "#fff3cd", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
                    <h2 style={{ margin: 0, color: "#856404", fontSize: "36px" }}>{statusCounts.late}</h2>
                    <p style={{ margin: 0, color: "#856404" }}>Late</p>
                  </div>
                  <div style={{ background: "#d1ecf1", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
                    <h2 style={{ margin: 0, color: "#0c5460", fontSize: "36px" }}>{statusCounts['half-day']}</h2>
                    <p style={{ margin: 0, color: "#0c5460" }}>Half Day</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceReport;
