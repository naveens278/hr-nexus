import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../firebase/authService";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const result = await registerUser(formData.email, formData.password, {
      name: formData.name,
      role: "employee",
    });

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "transparent",
      backgroundAttachment: "fixed",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Animated Background Elements */}
      <div className="animate-pulse" style={{
        position: "absolute",
        width: "400px",
        height: "400px",
        background: "rgba(102, 126, 234, 0.06)",
        borderRadius: "50%",
        top: "-100px",
        left: "-100px",
        animation: "glassBlurPulse 6s ease-in-out infinite",
      }}></div>
      <div className="animate-pulse" style={{
        position: "absolute",
        width: "300px",
        height: "300px",
        background: "rgba(102, 126, 234, 0.06)",
        borderRadius: "50%",
        bottom: "-80px",
        right: "-80px",
        animation: "glassBlurPulse 8s ease-in-out infinite 1s",
      }}></div>

      {/* Register Card */}
      <div className="animate-perspective-3d" style={{
        background: "rgba(24, 24, 27, 0.4)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        padding: "50px 40px",
        borderRadius: "20px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 8px 32px rgba(102, 126, 234, 0.15)",
        width: "420px",
        position: "relative",
        zIndex: 10,
      }}>
        {/* Animated Background Card Effect */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%)",
          borderRadius: "20px",
          zIndex: -1,
        }}></div>

        {/* Header */}
        <div className="animate-glass-slide-down" style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{
            margin: "0 0 10px 0",
            fontSize: "32px",
            fontWeight: "700",
            background: "transparent",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Create Account
          </h1>
          <p style={{ margin: 0, fontSize: "13px", color: "#667eea", letterSpacing: "1px", textTransform: "uppercase", fontWeight: "600" }}>Join HR-Nexus Platform</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="animate-shake" style={{
            background: "rgba(239, 68, 68, 0.1)",
            backdropFilter: "blur(8px)",
            color: "#dc3545",
            padding: "12px 15px",
            borderRadius: "10px",
            marginBottom: "20px",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            fontSize: "13px",
            animation: "slideInTop 0.3s ease-out",
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
          {/* Name Input */}
          <div style={{ marginBottom: "18px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "#fff",
              fontSize: "13px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "rgba(102, 126, 234, 0.05)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "10px",
                boxSizing: "border-box",
                color: "#fff",
                fontSize: "14px",
                transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                outline: "none",
              }}
              placeholder="John Doe"
              onFocus={(e) => {
                e.target.style.background = "rgba(102, 126, 234, 0.1)";
                e.target.style.border = "1px solid rgba(102, 126, 234, 0.3)";
                e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.background = "rgba(102, 126, 234, 0.05)";
                e.target.style.border = "1px solid rgba(102, 126, 234, 0.15)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Email Input */}
          <div style={{ marginBottom: "18px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "#fff",
              fontSize: "13px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "rgba(102, 126, 234, 0.05)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "10px",
                boxSizing: "border-box",
                color: "#fff",
                fontSize: "14px",
                transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                outline: "none",
              }}
              placeholder="you@example.com"
              onFocus={(e) => {
                e.target.style.background = "rgba(102, 126, 234, 0.1)";
                e.target.style.backdropFilter = "blur(12px)";
                e.target.style.border = "1px solid rgba(102, 126, 234, 0.3)";
                e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.background = "rgba(102, 126, 234, 0.05)";
                e.target.style.backdropFilter = "blur(8px)";
                e.target.style.border = "1px solid rgba(102, 126, 234, 0.15)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: "18px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "#fff",
              fontSize: "13px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "rgba(102, 126, 234, 0.05)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "10px",
                boxSizing: "border-box",
                color: "#fff",
                fontSize: "14px",
                transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                outline: "none",
              }}
              placeholder="••••••••"
              onFocus={(e) => {
                e.target.style.background = "rgba(102, 126, 234, 0.1)";
                e.target.style.backdropFilter = "blur(12px)";
                e.target.style.border = "1px solid rgba(102, 126, 234, 0.3)";
                e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.background = "rgba(102, 126, 234, 0.05)";
                e.target.style.backdropFilter = "blur(8px)";
                e.target.style.border = "1px solid rgba(102, 126, 234, 0.15)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Confirm Password Input */}
          <div style={{ marginBottom: "25px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "#fff",
              fontSize: "13px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "rgba(102, 126, 234, 0.05)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "10px",
                boxSizing: "border-box",
                color: "#fff",
                fontSize: "14px",
                transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                outline: "none",
              }}
              placeholder="••••••••"
              onFocus={(e) => {
                e.target.style.background = "rgba(102, 126, 234, 0.1)";
                e.target.style.backdropFilter = "blur(12px)";
                e.target.style.border = "1px solid rgba(102, 126, 234, 0.3)";
                e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.background = "rgba(102, 126, 234, 0.05)";
                e.target.style.backdropFilter = "blur(8px)";
                e.target.style.border = "1px solid rgba(102, 126, 234, 0.15)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading
                ? "rgba(59, 130, 246, 0.5)"
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "15px",
              fontWeight: "700",
              transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
              marginBottom: "15px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = "perspective(1000px) translateY(-2px) translateZ(10px)";
                e.target.style.boxShadow = "0 16px 40px rgba(102, 126, 234, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateZ(0)";
              e.target.style.boxShadow = "0 8px 24px rgba(102, 126, 234, 0.3)";
            }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <span className="animate-spin" style={{ display: "inline-block", width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%" }}></span>
                Creating Account...
              </span>
            ) : "Register"}
          </button>
        </form>

        {/* Footer Links */}
        <div style={{
          textAlign: "center",
          borderTop: "1px solid rgba(102, 126, 234, 0.1)",
          paddingTop: "20px",
        }}>
          <p style={{ margin: "0 0 12px 0", color: "rgba(255, 255, 255, 0.7)", fontSize: "13px" }}>
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#fff",
                fontWeight: "700",
                textDecoration: "none",
                transition: "all 0.3s",
                backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
              onMouseEnter={(e) => {
                e.target.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.target.style.textDecoration = "none";
              }}
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
