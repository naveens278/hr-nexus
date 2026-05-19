import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { getJobPostings, addJobPosting, closeJobPosting } from "../../firebase/recruitmentService";

function JobPost() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    description: "",
    requirements: "",
    salary: "",
    closingDate: ""
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    const data = await getJobPostings();
    setJobs(data);
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requirementsArray = formData.requirements.split("\n").filter(r => r.trim());
    
    const result = await addJobPosting({
      ...formData,
      requirements: requirementsArray,
      salary: Number(formData.salary)
    });

    if (result.success) {
      alert("Job posted successfully!");
      setShowForm(false);
      setFormData({ title: "", department: "", description: "", requirements: "", salary: "", closingDate: "" });
      loadJobs();
    } else {
      alert("Failed to post job: " + result.error);
    }
  };

  const handleCloseJob = async (id) => {
    if (window.confirm("Are you sure you want to close this job posting?")) {
      const result = await closeJobPosting(id);
      if (result.success) loadJobs();
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, overflow: "auto", background: "#f8f9fa" }}>
        <Navbar />
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h1 className="animate-glass-slide-down" style={{ marginTop: 0, color: "#fff" }}>Job Postings</h1>
            <button 
              onClick={() => setShowForm(!showForm)}
              style={{ padding: "10px 20px", background: showForm ? "#dc3545" : "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
            >
              {showForm ? "Cancel Posting" : "+ Post New Job"}
            </button>
          </div>

          <div style={{ display: "flex", gap: "20px", flexDirection: showForm ? "row" : "column" }}>
            
            {/* Job List */}
            <div className="animate-glass-in" style={{ flex: showForm ? 1 : "auto", background: "rgba(24, 24, 27, 0.4)", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
              <h3 style={{ marginTop: 0 }}>Current Openings ({jobs.length})</h3>
              
              {loading ? <p>Loading jobs...</p> : jobs.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: "rgba(255, 255, 255, 0.7)" }}>No job postings yet</div>
              ) : (
                <div style={{ display: "grid", gap: "15px", gridTemplateColumns: showForm ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))" }}>
                  {jobs.map((job, idx) => (
                    <div key={job.id} className="list-item-stagger" style={{ border: "1px solid #eee", padding: "15px", borderRadius: "8px", animationDelay: `${idx * 0.1}s`, background: job.status === "closed" ? "#f8f9fa" : "#fff" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <h4 style={{ margin: "0 0 10px 0", color: "#fff" }}>{job.title}</h4>
                        <span style={{ fontSize: "12px", padding: "4px 8px", borderRadius: "12px", background: job.status === "open" ? "#d4edda" : "#e2e3e5", color: job.status === "open" ? "#155724" : "#6c757d" }}>
                          {job.status.toUpperCase()}
                        </span>
                      </div>
                      <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "rgba(255, 255, 255, 0.7)" }}><strong>Dept:</strong> {job.department}</p>
                      <p style={{ margin: "0 0 15px 0", fontSize: "14px", color: "rgba(255, 255, 255, 0.7)" }}><strong>Closes:</strong> {new Date(job.closingDate).toLocaleDateString()}</p>
                      
                      {job.status === "open" && (
                        <button 
                          onClick={() => handleCloseJob(job.id)}
                          style={{ padding: "6px 12px", background: "#f8f9fa", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                        >
                          Close Opening
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Post Job Form */}
            {showForm && (
              <div className="animate-glass-slide-left" style={{ flex: 1, background: "rgba(24, 24, 27, 0.4)", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                <h3 style={{ marginTop: 0 }}>Create Job Posting</h3>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Job Title *</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", boxSizing: "border-box" }} />
                  </div>
                  
                  <div style={{ display: "flex", gap: "10px" }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Department *</label>
                      <input type="text" name="department" value={formData.department} onChange={handleChange} required style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", boxSizing: "border-box" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Salary Range</label>
                      <input type="number" name="salary" value={formData.salary} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", boxSizing: "border-box" }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Closing Date *</label>
                    <input type="date" name="closingDate" value={formData.closingDate} onChange={handleChange} required style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", boxSizing: "border-box" }} />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Description *</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required rows="3" style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", boxSizing: "border-box", fontFamily: "inherit" }}></textarea>
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Requirements (One per line) *</label>
                    <textarea name="requirements" value={formData.requirements} onChange={handleChange} required rows="4" placeholder="- React expertise\n- Firebase knowledge\n..." style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", boxSizing: "border-box", fontFamily: "inherit" }}></textarea>
                  </div>

                  <button type="submit" style={{ padding: "12px", background: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px", fontWeight: "bold" }}>
                    Publish Job
                  </button>
                </form>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobPost;
