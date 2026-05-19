import { useEffect, useState } from "react";
import { getLeaveRequestsForApproval, approveLeave, rejectLeave } from "../../firebase/leaveService";
import { useAuth } from "../../hooks/useAuth";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";

function LeaveApproval() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      // Managers pull requests where managerId matches their UID
      const data = await getLeaveRequestsForApproval(user.uid);
      setLeaves(data);
      setLoading(false);
    };

    if (user?.uid) {
      loadRequests();
    }
  }, [user]);

  const handleApprove = async (id) => {
    const res = await approveLeave(id, user.uid);
    if (res.success) {
      setLeaves(leaves.filter(l => l.id !== id));
    } else {
      setError("Failed to approve leave.");
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Enter rejection reason:");
    if (reason !== null) {
      const res = await rejectLeave(id, reason);
      if (res.success) {
        setLeaves(leaves.filter(l => l.id !== id));
      } else {
        setError("Failed to reject leave.");
      }
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, overflow: "auto", background: "#0f1115" }}>
        <Navbar />
        <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
          <h1 className="animate-glass-slide-down" style={{ color: "#fff", marginTop: 0 }}>Leave Approvals</h1>

          {error && <div style={{ background: "#fee", color: "#c00", padding: "10px", borderRadius: "5px", marginBottom: "20px" }}>{error}</div>}

          <div className="animate-glass-in" style={{ background: "rgba(24, 24, 27, 0.4)", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            {loading ? (
              <p>Loading requests...</p>
            ) : leaves.length === 0 ? (
              <p style={{ textAlign: "center", color: "rgba(255, 255, 255, 0.7)", padding: "20px" }}>No pending leave requests found.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 10px" }}>
                <thead>
                  <tr style={{ textAlign: "left", color: "#667eea", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                    <th style={{ padding: "12px" }}>Employee</th>
                    <th style={{ padding: "12px" }}>Type</th>
                    <th style={{ padding: "12px" }}>Dates</th>
                    <th style={{ padding: "12px" }}>Reason</th>
                    <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((l, index) => (
                    <tr key={l.id} className="list-item-stagger hover-glass-lift transition-glass" style={{ 
                      background: "rgba(255, 255, 255, 0.03)",
                      borderRadius: "12px",
                      animationDelay: `${index * 0.1}s` 
                    }}>
                      <td style={{ padding: "15px", borderTopLeftRadius: "12px", borderBottomLeftRadius: "12px" }}>
                        <div style={{ fontWeight: "700", color: "#ffffff" }}>
                          {l.firstName || l.lastName ? `${l.firstName || ''} ${l.lastName || ''}` : `Emp ID: ${l.employeeId}`}
                        </div>
                        <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.7)", marginTop: "2px" }}>
                          {l.department || "Internal"} • {l.position || "Staff"}
                        </div>
                      </td>
                      <td style={{ padding: "15px" }}>
                        <span style={{ 
                          padding: "4px 10px", 
                          background: "rgba(102, 126, 234, 0.1)", 
                          color: "#93c5fd", 
                          borderRadius: "6px", 
                          fontSize: "12px",
                          textTransform: "capitalize" 
                        }}>{l.leaveType}</span>
                      </td>
                      <td style={{ padding: "15px", color: "#ffffff", fontSize: "13px", fontWeight: "500" }}>
                        <div>{l.startDate}</div>
                        <div style={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.6)" }}>to {l.endDate}</div>
                      </td>
                      <td style={{ padding: "15px", color: "rgba(255, 255, 255, 0.9)", fontSize: "13px", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={l.reason}>
                        {l.reason}
                      </td>
                      <td style={{ padding: "15px", textAlign: "right", borderTopRightRadius: "12px", borderBottomRightRadius: "12px" }}>
                        <button 
                          onClick={() => handleApprove(l.id)} 
                          className="glass-button"
                          style={{ padding: "6px 12px", background: "rgba(34, 197, 94, 0.2)", color: "#34d399", border: "1px solid rgba(34, 197, 94, 0.3)", borderRadius: "8px", cursor: "pointer", marginRight: "8px", fontSize: "12px" }}
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleReject(l.id)} 
                          className="glass-button"
                          style={{ padding: "6px 12px", background: "rgba(239, 68, 68, 0.2)", color: "#fca5a5", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "8px", cursor: "pointer", fontSize: "12px" }}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaveApproval;