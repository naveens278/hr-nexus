import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { getEmployeeCount, getEmployees } from "../../firebase/employeeService";
import EmployeeChart from "../../components/Charts/EmployeeChart";
import { getPresentCountToday } from "../../firebase/attendanceService";
import { getPendingLeaveCount } from "../../firebase/leaveService";
import { getTotalPayrollForMonth } from "../../firebase/payrollService";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    pendingLeaves: 0,
    monthlyPayroll: 0,
  });
  const [departmentData, setDepartmentData] = useState(null);
  const [recentEmployees, setRecentEmployees] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
        
        const [empCount, presentCount, leaveCount, payrollData, employees] = await Promise.all([
          getEmployeeCount(),
          getPresentCountToday(),
          getPendingLeaveCount(),
          getTotalPayrollForMonth(currentMonth),
          getEmployees()
        ]);

        const deptCounts = {};
        employees.forEach(emp => {
          const dept = emp.department || 'Unassigned';
          deptCounts[dept] = (deptCounts[dept] || 0) + 1;
        });

        setDepartmentData({
          labels: Object.keys(deptCounts),
          datasets: [{
            label: 'Employees',
            data: Object.values(deptCounts),
            backgroundColor: [
              'rgba(59, 130, 246, 0.6)',
              'rgba(16, 185, 129, 0.6)',
              'rgba(245, 158, 11, 0.6)',
              'rgba(139, 92, 246, 0.6)',
              'rgba(236, 72, 153, 0.6)'
            ],
            borderWidth: 1,
            borderColor: 'rgba(59, 130, 246, 0.2)'
          }]
        });

        setRecentEmployees(employees.slice(0, 5));

        setStats({
          totalEmployees: empCount || 0,
          presentToday: presentCount || 0,
          pendingLeaves: leaveCount || 0,
          monthlyPayroll: payrollData?.success ? payrollData.data?.totalNetSalary || 0 : 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, overflow: "auto" }}>
        <Navbar />
        <div style={{ 
          padding: "20px", 
          background: "transparent", 
          minHeight: "100vh",
          backgroundAttachment: "fixed"
        }}>
          <h1 className="animate-glass-slide-down" style={{ marginTop: 0, color: "#fff", textShadow: "0 1px 2px rgba(102,126,234,0.1)" }}>HR-NEXUS Dashboard</h1>

          {/* KPI Cards */}
          <div
            className="animate-glass-in"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            {/* Total Employees */}
            <div
              className="list-item-stagger glass-card"
              style={{
                textAlign: "center",
                cursor: "pointer",
                animation: "glassScaleIn 0.5s ease-out",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "perspective(1000px) translateZ(20px) translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(102, 126, 234, 0.2)";
                e.currentTarget.style.border = "1px solid rgba(102, 126, 234, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateZ(0)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(102, 126, 234, 0.1)";
                e.currentTarget.style.border = "1px solid rgba(102, 126, 234, 0.15)";
              }}
            >
              <p style={{ margin: 0, fontSize: "12px", opacity: 0.7, textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600", color: "#667eea" }}>Total Employees</p>
              <h2 style={{ margin: "15px 0 0 0", fontSize: "42px", fontWeight: "700", color: "#fff" }}>
                {loading ? <span className="animate-pulse">...</span> : stats.totalEmployees}
              </h2>
            </div>

            {/* Present Today */}
            <div
              className="list-item-stagger glass-card"
              style={{
                border: "1px solid rgba(239, 68, 68, 0.2)",
                boxShadow: "0 4px 16px rgba(239, 68, 68, 0.1)",
                textAlign: "center",
                cursor: "pointer",
                animation: "glassScaleIn 0.5s ease-out 0.1s both",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "perspective(1000px) translateZ(20px) translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(239, 68, 68, 0.15)";
                e.currentTarget.style.border = "1px solid rgba(239, 68, 68, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateZ(0)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(239, 68, 68, 0.1)";
                e.currentTarget.style.border = "1px solid rgba(239, 68, 68, 0.2)";
              }}
            >
              <p style={{ margin: 0, fontSize: "12px", opacity: 0.7, textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600", color: "#dc3545" }}>Present Today</p>
              <h2 style={{ margin: "15px 0 0 0", fontSize: "42px", fontWeight: "700", color: "#fff" }}>
                {loading ? <span className="animate-pulse">...</span> : stats.presentToday}
              </h2>
            </div>

            {/* Pending Leaves */}
            <div
              className="list-item-stagger glass-card"
              style={{
                border: "1px solid rgba(0, 182, 218, 0.2)",
                boxShadow: "0 4px 16px rgba(0, 182, 218, 0.1)",
                textAlign: "center",
                cursor: "pointer",
                animation: "glassScaleIn 0.5s ease-out 0.2s both",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "perspective(1000px) translateZ(20px) translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(0, 182, 218, 0.15)";
                e.currentTarget.style.border = "1px solid rgba(0, 182, 218, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateZ(0)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 182, 218, 0.1)";
                e.currentTarget.style.border = "1px solid rgba(0, 182, 218, 0.2)";
              }}
            >
              <p style={{ margin: 0, fontSize: "12px", opacity: 0.7, textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600", color: "#00b6da" }}>Pending Leaves</p>
              <h2 style={{ margin: "15px 0 0 0", fontSize: "42px", fontWeight: "700", color: "#fff" }}>
                {loading ? <span className="animate-pulse">...</span> : stats.pendingLeaves}
              </h2>
            </div>

            {/* Monthly Payroll */}
            <div
              className="list-item-stagger glass-card"
              style={{
                border: "1px solid rgba(34, 197, 94, 0.2)",
                boxShadow: "0 4px 16px rgba(34, 197, 94, 0.1)",
                textAlign: "center",
                cursor: "pointer",
                animation: "glassScaleIn 0.5s ease-out 0.3s both",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "perspective(1000px) translateZ(20px) translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(34, 197, 94, 0.15)";
                e.currentTarget.style.border = "1px solid rgba(34, 197, 94, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateZ(0)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(34, 197, 94, 0.1)";
                e.currentTarget.style.border = "1px solid rgba(34, 197, 94, 0.2)";
              }}
            >
              <p style={{ margin: 0, fontSize: "12px", opacity: 0.7, textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600", color: "#22c55e" }}>Monthly Payroll</p>
              <h2 style={{ margin: "15px 0 0 0", fontSize: "42px", fontWeight: "700", color: "#fff" }}>
                {loading ? <span className="animate-pulse">...</span> : `₹${(stats.monthlyPayroll / 100000).toFixed(1)}L`}
              </h2>
            </div>
          </div>

          {/* Analytics and Data Display */}
          <div className="animate-fade-in" style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", 
            gap: "20px", 
            marginBottom: "30px" 
          }}>
            {/* Chart Section */}
            <div className="glass-card">
              <h3 style={{ marginTop: 0, color: "#fff", fontSize: "1.2rem", fontWeight: "700" }}>Department Distribution</h3>
              {loading ? (
                <div style={{ height: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <div className="animate-spin" style={{ width: "30px", height: "30px", border: "3px solid rgba(102, 126, 234, 0.2)", borderTop: "3px solid #667eea", borderRadius: "50%" }}></div>
                </div>
              ) : (
                departmentData && <EmployeeChart chartData={departmentData} />
              )}
            </div>

            {/* Recent Employees List */}
            <div className="glass-card" style={{ overflow: "auto" }}>
              <h3 style={{ marginTop: 0, color: "#fff", fontSize: "1.2rem", fontWeight: "700", marginBottom: "20px" }}>Recently Added Employees</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {loading ? (
                  <div style={{ padding: "20px", textAlign: "center" }}>
                    <div className="animate-spin" style={{ display: "inline-block", width: "30px", height: "30px", border: "3px solid rgba(102, 126, 234, 0.2)", borderTop: "3px solid #667eea", borderRadius: "50%" }}></div>
                    <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px", marginTop: "10px" }}>Loading employees...</p>
                  </div>
                ) : recentEmployees.length > 0 ? recentEmployees.map((emp) => (
                  <div 
                    key={emp.id}
                    onClick={() => navigate(`/employees/${emp.id}`)}
                    className="hover:shadow-md transition-shadow"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "15px",
                      background: "rgba(240, 244, 255, 0.5)",
                      borderRadius: "10px",
                      cursor: "pointer",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontWeight: "600", color: "#fff" }}>{emp.firstName} {emp.lastName}</p>
                      <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "rgba(255, 255, 255, 0.7)" }}>{emp.department || "Unassigned"}</p>
                    </div>
                    <div>
                      <span style={{
                        background: "rgba(59, 130, 246, 0.1)",
                        color: "#3b82f6",
                        padding: "5px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600"
                      }}>
                        {emp.position || "Employee"}
                      </span>
                    </div>
                  </div>
                )) : (
                  <p style={{ textAlign: "center", color: "rgba(255, 255, 255, 0.5)", marginTop: "20px" }}>No employees found</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="animate-glass-slide-up glass-card" style={{ marginTop: "20px" }}>
            <h3 className="animate-glass-slide-left" style={{ color: "#fff", fontWeight: "700", marginTop: 0 }}>Quick Links</h3>
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
              <button 
                onClick={() => navigate('/add-employee')}
                className="hover-glass-lift transition-glass" style={{
                padding: "12px 24px",
                background: "rgba(59, 130, 246, 0.3)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                color: "#3b82f6",
                border: "1px solid rgba(59, 130, 246, 0.5)",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
                transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}>
                Add Employee
              </button>
              <button 
                onClick={() => navigate('/attendance')}
                className="hover-glass-lift transition-glass" style={{
                padding: "12px 24px",
                background: "rgba(34, 197, 94, 0.3)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                color: "#22c55e",
                border: "1px solid rgba(34, 197, 94, 0.5)",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
                transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}>
                Check Attendance
              </button>
              <button 
                onClick={() => navigate('/leave-approval')}
                className="hover-glass-lift transition-glass" style={{
                padding: "12px 24px",
                background: "rgba(245, 158, 11, 0.3)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                color: "#f59e0b",
                border: "1px solid rgba(245, 158, 11, 0.5)",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
                transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}>
                Approve Leaves
              </button>
              <button 
                onClick={() => navigate('/payroll')}
                className="hover-glass-lift transition-glass" style={{
                padding: "12px 24px",
                background: "rgba(6, 182, 212, 0.3)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                color: "#06b6d4",
                border: "1px solid rgba(6, 182, 212, 0.5)",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
                transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}>
                View Payroll
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;