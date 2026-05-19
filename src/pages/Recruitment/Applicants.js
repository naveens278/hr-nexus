import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { getJobPostings, getApplicantsForJob, updateApplicantStatus } from "../../firebase/recruitmentService";

function Applicants() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    if (selectedJob) {
      loadApplicants(selectedJob);
    } else {
      setApplicants([]);
      setLoading(false);
    }
  }, [selectedJob]);

  const loadJobs = async () => {
    const data = await getJobPostings();
    setJobs(data);
    if (data.length > 0) {
      setSelectedJob(data[0].id);
    } else {
      setLoading(false);
    }
  };

  const loadApplicants = async (jobId) => {
    setLoading(true);
    const data = await getApplicantsForJob(jobId);
    setApplicants(data);
    setLoading(false);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const res = await updateApplicantStatus(id, newStatus);
    if (res.success) {
      loadApplicants(selectedJob);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, overflow: "auto", background: "#f8f9fa" }}>
        <Navbar />
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
          <h1 className="animate-glass-slide-down" style={{ marginTop: 0, color: "#fff" }}>Job Applicants</h1>
          
          <div className="animate-glass-in" style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px", background: "rgba(24, 24, 27, 0.4)", padding: "15px 20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <label style={{ fontWeight: "bold" }}>Select Job Posting:</label>
            <select 
              value={selectedJob} 
              onChange={(e) => setSelectedJob(e.target.value)}
              style={{ flex: 1, padding: "10px", border: "1px solid #ddd", borderRadius: "4px" }}
            >
              {jobs.length === 0 ? <option value="">No jobs available</option> : null}
              {jobs.map(job => (
                <option key={job.id} value={job.id}>{job.title} ({job.status})</option>
              ))}
            </select>
          </div>

          <div className="animate-glass-slide-up" style={{ background: "rgba(24, 24, 27, 0.4)", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            {loading ? (
              <p>Loading applicants...</p>
            ) : !selectedJob ? (
              <div style={{ textAlign: "center", padding: "40px", color: "rgba(255, 255, 255, 0.7)" }}>Please select a job posting to view applicants.</div>
            ) : applicants.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "rgba(255, 255, 255, 0.7)" }}>No applications found for this job.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f5f5f5", textAlign: "left" }}>
                    <th style={{ padding: "12px" }}>Name</th>
                    <th style={{ padding: "12px" }}>Email</th>
                    <th style={{ padding: "12px" }}>Applied On</th>
                    <th style={{ padding: "12px" }}>Resume</th>
                    <th style={{ padding: "12px" }}>Status</th>
                    <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map((app, index) => (
                    <tr key={app.id} className="list-item-stagger" style={{ borderBottom: "1px solid #ddd", animationDelay: `${index * 0.1}s` }}>
                      <td style={{ padding: "12px" }}>{app.firstName} {app.lastName}</td>
                      <td style={{ padding: "12px" }}>{app.email}</td>
                      <td style={{ padding: "12px" }}>{new Date(app.appliedDate).toLocaleDateString()}</td>
                      <td style={{ padding: "12px" }}>
                        {app.resume ? (
                          <a href={app.resume} target="_blank" rel="noreferrer" style={{ color: "#007bff", textDecoration: "none" }}>View Resume</a>
                        ) : "N/A"}
                      </td>
                      <td style={{ padding: "12px", textTransform: "capitalize" }}>
                        <span style={{ 
                          padding: "4px 8px", 
                          borderRadius: "12px", 
                          fontSize: "12px",
                          background: app.status === 'applied' ? '#e2e3e5' : app.status === 'shortlisted' ? '#cff4fc' : app.status === 'rejected' ? '#f8d7da' : '#d4edda',
                          color: app.status === 'applied' ? '#383d41' : app.status === 'shortlisted' ? '#055160' : app.status === 'rejected' ? '#842029' : '#0f5132'
                        }}>
                          {app.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px", textAlign: "right" }}>
                        <select 
                          value={app.status} 
                          onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                          style={{ padding: "6px", border: "1px solid #ddd", borderRadius: "4px", background: "#f8f9fa" }}
                        >
                          <option value="applied">Applied</option>
                          <option value="reviewing">Reviewing</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="interview">Interview</option>
                          <option value="offered">Offered</option>
                          <option value="rejected">Rejected</option>
                        </select>
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

export default Applicants;
