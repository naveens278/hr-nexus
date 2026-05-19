import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../../firebase/authService";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const result = await resetPassword(email);

    if (result.success) {
      setMessage("Password reset email sent successfully!");
      setTimeout(() => navigate("/login"), 3000);
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

      {/* Reset Password Card */}
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
            Reset Password
          </h1>
          <p style={{ margin: 0, fontSize: "13px", color: "#667eea", letterSpacing: "1px", textTransform: "uppercase", fontWeight: "600" }}>Recover Your Account Access</p>
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

        {/* Success Message */}
        {message && (
          <div style={{
            background: "rgba(34, 197, 94, 0.1)",
            backdropFilter: "blur(8px)",
            color: "#22c55e",
            padding: "12px 15px",
            borderRadius: "10px",
            marginBottom: "20px",
            border: "1px solid rgba(34, 197, 94, 0.2)",
            fontSize: "13px",
            animation: "slideInTop 0.3s ease-out",
          }}>
            ✅ {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
          {/* Email Input */}
          <div style={{ marginBottom: "25px" }}>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          {/* Reset Button */}
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
                Sending...
              </span>
            ) : "Send Reset Link"}
          </button>
        </form>

        {/* Footer Links */}
        <div style={{
          textAlign: "center",
          borderTop: "1px solid rgba(102, 126, 234, 0.1)",
          paddingTop: "20px",
        }}>
          <Link
            to="/login"
            style={{
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: "13px",
              textDecoration: "none",
              transition: "all 0.3s",
              fontWeight: "600",
            }}
            onMouseEnter={(e) => {
              e.target.style.color = "#667eea";
              e.target.style.textDecoration = "underline";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "#999";
              e.target.style.textDecoration = "none";
            }}
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
