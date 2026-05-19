import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { getScheduledInterviews, updateInterviewResult } from "../../firebase/recruitmentService";

function InterviewSchedule() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    setLoading(true);
    const data = await getScheduledInterviews("scheduled"); // Only open ones
    setInterviews(data);
    setLoading(false);
  };

  const handleComplete = async (id) => {
    const result = window.prompt("Enter result (e.g., passed, rejected, hold):");
    if (!result) return;
    
    const feedback = window.prompt("Enter interview feedback/notes:");
    
    const res = await updateInterviewResult(id, result, feedback || "");
    if (res.success) {
      loadInterviews();
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, overflow: "auto", background: "#f8f9fa" }}>
        <Navbar />
        <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
          <h1 className="animate-glass-slide-down" style={{ marginTop: 0, color: "#fff" }}>Interview Schedule</h1>
          
          <div className="animate-glass-in" style={{ background: "rgba(24, 24, 27, 0.4)", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            {loading ? (
              <p>Loading schedule...</p>
            ) : interviews.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "rgba(255, 255, 255, 0.7)" }}>
                <p style={{ margin: 0 }}>No interviews scheduled at this time.</p>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f5f5f5", textAlign: "left" }}>
                    <th style={{ padding: "12px" }}>Applicant ID</th>
                    <th style={{ padding: "12px" }}>Date & Time</th>
                    <th style={{ padding: "12px" }}>Interviewer</th>
                    <th style={{ padding: "12px" }}>Location/Link</th>
                    <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {interviews.map((interview, index) => (
                    <tr key={interview.id} className="list-item-stagger" style={{ borderBottom: "1px solid #ddd", animationDelay: `${index * 0.1}s` }}>
                      <td style={{ padding: "12px", fontFamily: "monospace" }}>{interview.applicantId.slice(0, 8)}...</td>
                      <td style={{ padding: "12px" }}>{new Date(interview.interviewDate).toLocaleString()}</td>
                      <td style={{ padding: "12px" }}>{interview.interviewer}</td>
                      <td style={{ padding: "12px" }}>{interview.location}</td>
                      <td style={{ padding: "12px", textAlign: "right" }}>
                        <button 
                          onClick={() => handleComplete(interview.id)}
                          style={{ padding: "6px 12px", background: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                        >
                          Mark Completed
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

export default InterviewSchedule;
