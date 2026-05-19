import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { getTotalPayrollForMonth } from "../../firebase/payrollService";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function PayrollReport() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setSummary(null);
      const data = await getTotalPayrollForMonth(month);
      
      // We expect { success: true, data: { employeeCount, totalBasicSalary, totalGrossSalary... } }
      if (data.success && data.data.employeeCount > 0) {
        setSummary(data.data);
      }
      setLoading(false);
    };

    loadData();
  }, [month]); // Auto-fetch on month change

  const doughnutData = summary ? {
    labels: ['Total Net Salary (₹)', 'Total Deductions (₹)'],
    datasets: [
      {
        data: [summary.totalNetSalary, summary.totalDeductions],
        backgroundColor: ['#28a745', '#dc3545'],
        borderWidth: 1,
      },
    ],
  } : null;

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
      <div style={{ flex: 1, overflow: "auto" }}>
        <Navbar />
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", background: "transparent", minHeight: "100vh" }}>
          <h1 className="animate-glass-slide-down" style={{ marginTop: 0, color: "#fff", textShadow: "0 1px 2px rgba(102,126,234,0.1)" }}>Payroll Expenditure Report</h1>
          
          <div className="animate-glass-in glass-card" style={{ display: "flex", gap: "20px", marginBottom: "30px", background: "rgba(24, 24, 27, 0.4)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.05)", padding: "20px", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", alignItems: "center" }}>
            <label style={{ fontWeight: "700", color: "#667eea", letterSpacing: "0.5px" }}>Select Month:</label>
            <input 
              type="month" 
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              style={{ 
                padding: "10px 15px", 
                background: "rgba(255,255,255,0.05)", 
                border: "1px solid rgba(255,255,255,0.1)", 
                borderRadius: "8px", 
                color: "#fff",
                outline: "none"
              }} 
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "25px" }}>
            <div className="animate-glass-slide-up glass-card" style={{ background: "rgba(24, 24, 27, 0.4)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.05)", padding: "25px", borderRadius: "12px" }}>
              <h3 style={{ marginTop: 0, textAlign: "center", color: "#fff", fontSize: "18px", letterSpacing: "1px", marginBottom: "25px" }}>Expenditure Breakdown</h3>
              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "300px" }}>
                  <div className="animate-spin" style={{ width: "35px", height: "35px", border: "3px solid rgba(102, 126, 234, 0.2)", borderTop: "3px solid #667eea", borderRadius: "50%" }}></div>
                </div>
              ) : (
                <div style={{ height: "300px" }}>
                  {summary ? <Doughnut data={doughnutData} options={chartOptions} /> : (
                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <p style={{ textAlign: "center", color: "rgba(255, 255, 255, 0.4)" }}>No payroll data found for {month}.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="animate-glass-slide-left glass-card" style={{ background: "rgba(24, 24, 27, 0.4)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.05)", padding: "25px", borderRadius: "12px" }}>
              <h3 style={{ marginTop: 0, color: "#fff", fontSize: "18px", letterSpacing: "1px", marginBottom: "25px" }}>Financial Metrics</h3>
              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
                  {[1,2,3,4,5].map(i => <div key={i} className="animate-pulse" style={{ height: "60px", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}></div>)}
                </div>
              ) : summary ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "18px", background: "rgba(102, 126, 234, 0.05)", borderRadius: "10px", borderLeft: "4px solid #667eea" }}>
                    <span style={{ fontWeight: "600", color: "rgba(255,255,255,0.7)" }}>Employees Processed</span>
                    <span style={{ fontSize: "18px", fontWeight: "700", color: "#fff" }}>{summary.employeeCount}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "18px", background: "rgba(255,255,255,0.03)", borderRadius: "10px", borderLeft: "4px solid rgba(255,255,255,0.2)" }}>
                    <span style={{ fontWeight: "600", color: "rgba(255,255,255,0.7)" }}>Total Base Salary</span>
                    <span style={{ fontSize: "18px", fontWeight: "700", color: "#fff" }}>₹{summary.totalBasicSalary.toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "18px", background: "rgba(245, 158, 11, 0.05)", borderRadius: "10px", borderLeft: "4px solid #f59e0b" }}>
                    <span style={{ fontWeight: "600", color: "rgba(255,255,255,0.7)" }}>Total Allowances</span>
                    <span style={{ fontSize: "18px", fontWeight: "700", color: "#f59e0b" }}>₹{summary.totalAllowances.toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "18px", background: "rgba(239, 68, 68, 0.05)", borderRadius: "10px", borderLeft: "4px solid #ef4444" }}>
                    <span style={{ fontWeight: "600", color: "rgba(255,255,255,0.7)" }}>Total Deductions</span>
                    <span style={{ fontSize: "18px", fontWeight: "700", color: "#ef4444" }}>- ₹{summary.totalDeductions.toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "22px", background: "rgba(34, 197, 94, 0.1)", borderRadius: "10px", borderLeft: "4px solid #22c55e", marginTop: "10px" }}>
                    <span style={{ fontWeight: "700", color: "#22c55e", fontSize: "18px" }}>Net Payout</span>
                    <span style={{ fontSize: "26px", fontWeight: "800", color: "#fff" }}>₹{summary.totalNetSalary.toLocaleString()}</span>
                  </div>
                </div>
              ) : (
                <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "50px 0" }}>
                   <p style={{ textAlign: "center", color: "rgba(255, 255, 255, 0.4)" }}>No metrics available.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PayrollReport;
