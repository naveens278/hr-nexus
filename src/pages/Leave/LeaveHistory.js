import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { getLeaves, cancelLeave, clearLeaveHistory } from "../../firebase/leaveService";
import { formatDate } from "../../utils/formatDate";

function LeaveHistory() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaveHistory = async () => {
      // Fetch overall history instead of per-user
      const result = await getLeaves();
      setLeaves(result);
      setLoading(false);
    };
    loadLeaveHistory();
  }, []);

  const handleCancel = async (id) => {
    const reason = prompt("Enter cancellation reason:");
    if (reason !== null) {
      if (reason.trim() === "") {
        alert("Reason is required to cancel an approved leave.");
        return;
      }
      setLoading(true);
      const res = await cancelLeave(id, reason);
      if (res.success) {
        const result = await getLeaves();
        setLeaves(result);
      } else {
        alert("Failed to cancel leave.");
      }
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (leaves.length === 0) return;
    if (window.confirm("Are you sure you want to completely clear the entire leave history log? This action cannot be undone.")) {
      setLoading(true);
      const res = await clearLeaveHistory();
      if (res.success) {
        setLeaves([]);
      } else {
        alert("Failed to clear leave history.");
      }
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0f1115" }}>
      <Sidebar />
      <div style={{ flex: 1, overflow: "auto" }}>
        <Navbar />
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
          <div className="animate-glass-slide-down" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
            <h1 style={{ margin: 0, color: "#fff" }}>Overall Leave History</h1>
            {leaves.length > 0 && (
              <button 
                onClick={handleClearHistory} 
                className="glass-button transition-glass hover-glass-danger"
                style={{
                  background: "rgba(239, 68, 68, 0.15)",
                  color: "#fca5a5",
                  padding: "10px 20px",
                  border: "1px solid rgba(239, 68, 68, 0.25)",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "14px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <span>🗑️</span> Clear History
              </button>
            )}
          </div>

          {loading ? (
             <div style={{ textAlign: "center", padding: "60px", color: "#667eea" }}>
             <div className="animate-spin" style={{ display: "inline-block", width: "40px", height: "40px", border: "3px solid rgba(102, 126, 234, 0.2)", borderTop: "3px solid #667eea", borderRadius: "50%" }}></div>
             <p style={{ marginTop: "15px" }}>Loading overall leave history...</p>
           </div>
          ) : leaves.length > 0 ? (
            <div className="animate-glass-in glass-card" style={{ padding: "0", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(255, 255, 255, 0.05)", textAlign: "left" }}>
                    <th style={{ padding: "15px", color: "#667eea", fontSize: "14px" }}>Employee</th>
                    <th style={{ padding: "15px", color: "#667eea", fontSize: "14px" }}>Type</th>
                    <th style={{ padding: "15px", color: "#667eea", fontSize: "14px" }}>Dates</th>
                    <th style={{ padding: "15px", color: "#667eea", fontSize: "14px" }}>Reason</th>
                    <th style={{ padding: "15px", color: "#667eea", fontSize: "14px" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((leave, index) => (
                    <tr key={leave.id} className="list-item-stagger transition-glass" style={{ 
                      borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                      animationDelay: `${index * 0.1}s`
                    }}>
                      <td style={{ padding: "15px" }}>
                        <div style={{ color: "#ffffff", fontWeight: "700" }}>
                          {leave.firstName} {leave.lastName}
                        </div>
                        <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", marginTop: "2px" }}>
                          {leave.department || "Internal"} • {leave.position || "Staff"}
                        </div>
                      </td>
                      <td style={{ padding: "15px", textTransform: "capitalize" }}>
                        <div style={{ color: "#ffffff", fontWeight: "600" }}>{leave.leaveType}</div>
                      </td>
                      <td style={{ padding: "15px", color: "#ffffff", fontSize: "13px" }}>
                        <div style={{ color: "#ffffff", fontWeight: "500" }}>{formatDate(leave.startDate)}</div>
                        <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.7)" }}>to {formatDate(leave.endDate)}</div>
                      </td>
                      <td style={{ padding: "15px", color: "rgba(255, 255, 255, 0.9)", fontSize: "13px", maxWidth: "250px" }}>
                        <div>{leave.reason}</div>
                        {leave.status === "rejected" && leave.rejection_reason && (
                          <div style={{ marginTop: "8px", fontSize: "12px", color: "#fca5a5", fontStyle: "italic", borderLeft: "2px solid rgba(239, 68, 68, 0.3)", paddingLeft: "8px" }}>
                            <strong>Note:</strong> {leave.rejection_reason}
                          </div>
                        )}
                        {leave.status === "cancelled" && leave.cancellation_reason && (
                          <div style={{ marginTop: "8px", fontSize: "12px", color: "#fbbf24", fontStyle: "italic", borderLeft: "2px solid rgba(245, 158, 11, 0.3)", paddingLeft: "8px" }}>
                            <strong>Cancelled by HR:</strong> {leave.cancellation_reason}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "15px" }}>
                        <span style={{ 
                          padding: "6px 12px", 
                          background: leave.status === "approved" ? "rgba(34, 197, 94, 0.15)" : 
                                     leave.status === "rejected" ? "rgba(239, 68, 68, 0.15)" : 
                                     leave.status === "cancelled" ? "rgba(245, 158, 11, 0.15)" :
                                     "rgba(96, 165, 250, 0.15)", 
                          color: leave.status === "approved" ? "#34d399" : 
                                 leave.status === "rejected" ? "#fca5a5" : 
                                 leave.status === "cancelled" ? "#fbbf24" :
                                 "#93c5fd", 
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          border: `1px solid ${leave.status === "approved" ? "rgba(34, 197, 94, 0.2)" : 
                                               leave.status === "rejected" ? "rgba(239, 68, 68, 0.2)" : 
                                               leave.status === "cancelled" ? "rgba(245, 158, 11, 0.2)" :
                                               "rgba(96, 165, 250, 0.2)"}`
                        }}>
                          {leave.status}
                        </span>
                        {leave.status === "approved" && (
                          <div style={{ marginTop: "10px" }}>
                            <button 
                              onClick={() => handleCancel(leave.id)} 
                              className="glass-button"
                              style={{ padding: "4px 10px", background: "rgba(245, 158, 11, 0.1)", color: "#fbbf24", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "6px", cursor: "pointer", fontSize: "11px" }}
                            >
                              Cancel Leave
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="animate-glass-in glass-card" style={{ padding: "60px", textAlign: "center", color: "rgba(255, 255, 255, 0.5)" }}>
              <div style={{ fontSize: "48px", marginBottom: "15px" }}>📄</div>
              <h3>No leave requests found</h3>
              <p>Overall leave history will appear here once employees start applying.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LeaveHistory;
