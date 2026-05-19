import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { getEmployees } from "../../firebase/employeeService";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function EmployeeReport() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getEmployees();
    setEmployees(data);
    setLoading(false);
  };

  const filteredEmployees = employees.filter(emp => {
    if (filter === "All") return true;
    if (filter === "Active") return emp.status !== "inactive";
    if (filter === "Inactive") return emp.status === "inactive";
    return true;
  });

  // Calculate Department Distribution
  const deptCounts = {};
  filteredEmployees.forEach(emp => {
    const dept = emp.department || "Unassigned";
    deptCounts[dept] = (deptCounts[dept] || 0) + 1;
  });

  const pieData = {
    labels: Object.keys(deptCounts),
    datasets: [
      {
        data: Object.values(deptCounts),
        backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8', '#6c757d', '#6610f2'],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: Object.keys(deptCounts),
    datasets: [
      {
        label: 'Number of Employees',
        data: Object.values(deptCounts),
        backgroundColor: '#007bff',
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
          <h1 className="animate-glass-slide-down" style={{ marginTop: 0, color: "#fff" }}>Employee Diversity Report</h1>
          
          <div className="animate-glass-in" style={{ display: "flex", gap: "15px", marginBottom: "20px", background: "rgba(24, 24, 27, 0.4)", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label style={{ fontWeight: "bold" }}>Filter Status:</label>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                style={{ padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
              >
                <option value="All">All Employees</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div style={{ padding: "8px 15px", background: "#e8f0fe", color: "#0056b3", borderRadius: "4px", fontWeight: "bold", marginLeft: "auto" }}>
              Total Count: {filteredEmployees.length}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="animate-glass-slide-up" style={{ background: "rgba(24, 24, 27, 0.4)", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
              <h3 style={{ marginTop: 0, textAlign: "center", color: "#555" }}>Department Distribution</h3>
              {loading ? <p style={{ textAlign: "center" }}>Loading chart...</p> : (
                <div style={{ height: "300px" }}>
                  {filteredEmployees.length > 0 ? <Pie data={pieData} options={chartOptions} /> : <p style={{ textAlign: "center", color: "rgba(255, 255, 255, 0.4)", marginTop: "100px" }}>No data available for the selected filter.</p>}
                </div>
              )}
            </div>

            <div className="animate-glass-slide-left" style={{ background: "rgba(24, 24, 27, 0.4)", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
              <h3 style={{ marginTop: 0, textAlign: "center", color: "#fff" }}>Headcount by Department</h3>
              {loading ? <p style={{ textAlign: "center" }}>Loading chart...</p> : (
                <div style={{ height: "300px" }}>
                  {filteredEmployees.length > 0 ? <Bar data={barData} options={{...chartOptions, plugins: { legend: { display: false }}}} /> : <p style={{ textAlign: "center", color: "rgba(255, 255, 255, 0.4)", marginTop: "100px" }}>No data available.</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeReport;
