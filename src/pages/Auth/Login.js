import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { loginUser, googleLogin } from "../../firebase/authService";
import loginIllustration from "../../assets/login-illustration.png";

function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  // Watch for user and redirect when available
  useEffect(() => {
    if (shouldRedirect && user) {
      navigate("/dashboard");
    }
  }, [user, shouldRedirect, navigate]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const timeoutId = setTimeout(() => {
      setLoading(false);
      setShouldRedirect(false);
      setError("Login taking too long. Please check your internet and try again.");
    }, 30000);

    try {
      const result = await loginUser(email, password);
      clearTimeout(timeoutId);
      
      if (result.success) {
        setShouldRedirect(true);
      } else {
        setError(result.error || "Login failed");
        setLoading(false);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    const timeoutId = setTimeout(() => {
      setLoading(false);
      setShouldRedirect(false);
      setError("Google login taking too long. Please try again.");
    }, 60000);

    try {
      const result = await googleLogin();
      clearTimeout(timeoutId);
      
      if (result.success) {
        setShouldRedirect(true);
      } else {
        setError(result.error || "Google login failed");
        setLoading(false);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes auroraGradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes floatOrb1 {
            0% { transform: translate(0, 0) scale(1) rotate(0deg); }
            33% { transform: translate(30px, -50px) scale(1.1) rotate(10deg); }
            66% { transform: translate(-20px, 20px) scale(0.9) rotate(-10deg); }
            100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          }
          @keyframes floatOrb2 {
            0% { transform: translate(0, 0) scale(1) rotate(0deg); }
            33% { transform: translate(-40px, 40px) scale(1.2) rotate(-5deg); }
            66% { transform: translate(20px, -30px) scale(0.8) rotate(5deg); }
            100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          }
          @keyframes floatOrb3 {
            0% { transform: translate(0, 0) scale(1) rotate(0deg); }
            33% { transform: translate(50px, 20px) scale(0.9) rotate(15deg); }
            66% { transform: translate(-30px, -40px) scale(1.1) rotate(-15deg); }
            100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          }
          @keyframes borderGlow {
            0% { box-shadow: 0 0 10px rgba(99, 102, 241, 0.4), inset 0 0 10px rgba(99, 102, 241, 0.2); }
            50% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.6), inset 0 0 15px rgba(168, 85, 247, 0.3); }
            100% { box-shadow: 0 0 10px rgba(99, 102, 241, 0.4), inset 0 0 10px rgba(99, 102, 241, 0.2); }
          }
          @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(30px) scale(0.95); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes shakeError {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-5px); }
            40% { transform: translateX(5px); }
            60% { transform: translateX(-3px); }
            80% { transform: translateX(3px); }
          }
          @keyframes spinLoading {
            to { transform: rotate(360deg); }
          }
          .login-container {
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(120deg, #09090b 0%, #18181b 50%, #09090b 100%);
            background-size: 200% 200%;
            animation: auroraGradient 15s ease infinite;
            position: relative;
            overflow: hidden;
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
          }
          .glass-panel {
            background: rgba(24, 24, 27, 0.65);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-top: 1px solid rgba(255, 255, 255, 0.15);
            border-left: 1px solid rgba(255, 255, 255, 0.15);
            padding: 48px 40px;
            border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
            width: 100%;
            max-width: 440px;
            position: relative;
            z-index: 10;
            animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .orb {
            position: absolute;
            border-radius: 50%;
            filter: blur(60px);
            opacity: 0.5;
            z-index: 1;
          }
          .orb-1 {
            width: 350px;
            height: 350px;
            background: radial-gradient(circle, rgba(99,102,241,1) 0%, rgba(99,102,241,0) 70%);
            top: -100px;
            left: -150px;
            animation: floatOrb1 12s ease-in-out infinite;
          }
          .orb-2 {
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, rgba(168,85,247,1) 0%, rgba(168,85,247,0) 70%);
            bottom: -150px;
            right: -100px;
            animation: floatOrb2 15s ease-in-out infinite;
          }
          .orb-3 {
            width: 250px;
            height: 250px;
            background: radial-gradient(circle, rgba(236,72,153,1) 0%, rgba(236,72,153,0) 70%);
            top: 40%;
            right: 20%;
            animation: floatOrb3 10s ease-in-out infinite;
          }
          .input-group {
            position: relative;
            margin-bottom: 24px;
          }
          .glass-input {
            width: 100%;
            padding: 16px 20px;
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            color: #fff;
            font-size: 15px;
            transition: all 0.3s ease;
            box-sizing: border-box;
            outline: none;
          }
          .glass-input:-webkit-autofill,
          .glass-input:-webkit-autofill:hover, 
          .glass-input:-webkit-autofill:focus, 
          .glass-input:-webkit-autofill:active {
            transition: background-color 5000s ease-in-out 0s;
            -webkit-text-fill-color: white !important;
          }
          .glass-input::placeholder {
            color: rgba(255, 255, 255, 0.3);
          }
          .glass-input:focus {
            background: rgba(0, 0, 0, 0.4);
            border-color: rgba(168, 85, 247, 0.6);
            box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.15);
            transform: translateY(-2px);
          }
          .input-label {
            display: block;
            color: rgba(255, 255, 255, 0.7);
            font-size: 13px;
            font-weight: 500;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
            transition: color 0.3s ease;
          }
          .glass-input:focus + .input-label,
          .input-group.focused .input-label {
            color: #a855f7;
          }
          .primary-btn {
            width: 100%;
            padding: 16px;
            border-radius: 12px;
            border: none;
            background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
            color: white;
            font-size: 15px;
            font-weight: 600;
            letter-spacing: 0.5px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            box-shadow: 0 10px 20px -10px rgba(168, 85, 247, 0.5);
            margin-bottom: 16px;
            z-index: 1;
          }
          .primary-btn::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
            z-index: -1;
            transition: opacity 0.3s ease;
            opacity: 0;
          }
          .primary-btn:hover:not(:disabled) {
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 15px 25px -10px rgba(168, 85, 247, 0.6);
          }
          .primary-btn:hover:not(:disabled)::before {
            opacity: 1;
          }
          .primary-btn:active:not(:disabled) {
            transform: translateY(1px);
          }
          .google-btn {
            width: 100%;
            padding: 15px;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: white;
            font-size: 15px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }
          .google-btn:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
          }
          .g-icon {
            width: 20px;
            height: 20px;
          }
          .title-gradient {
            background: linear-gradient(135deg, #fff 0%, #a1a1aa 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-size: 36px;
            font-weight: 800;
            margin: 0 0 8px 0;
            letter-spacing: -1px;
          }
          .error-toast {
            background: rgba(239, 68, 68, 0.15);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #fca5a5;
            padding: 14px 16px;
            border-radius: 10px;
            margin-bottom: 24px;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: shakeError 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
          }
          .link-text {
            color: #a855f7;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
          }
          .link-text:hover {
            color: #d8b4fe;
            text-shadow: 0 0 10px rgba(168, 85, 247, 0.4);
          }
        `}
      </style>

      <div className="login-container">
        {/* Animated Background Orbs */}
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>

        {/* Main Glassmorphism Card */}
        <div className="glass-panel">
          
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ 
              display: "inline-flex", 
              justifyContent: "center", 
              alignItems: "center",
              width: "120px", 
              height: "120px", 
              borderRadius: "24px",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              marginBottom: "20px",
              padding: "15px",
              boxShadow: "0 15px 35px rgba(0,0,0,0.2)"
            }}>
              <img src={loginIllustration} alt="Login Illustration" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <h1 className="title-gradient">HR-Nexus</h1>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: "14px", fontWeight: 400 }}>
              Enter your credentials to continue
            </p>
          </div>

          {error && (
            <div className="error-toast">
              <span style={{ fontSize: "18px" }}>⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin} autoComplete="off">
            <div className={`input-group ${focusedInput === 'email' ? 'focused' : ''}`}>
              <label className="input-label">Email Address</label>
              <input
                type="email"
                className="glass-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
                placeholder="name@company.com"
                autoComplete="off"
                required
              />
            </div>

            <div className={`input-group ${focusedInput === 'password' ? 'focused' : ''}`} style={{ marginBottom: "32px" }}>
              <label className="input-label">Password</label>
              <input
                type="password"
                className="glass-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
            </div>

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                  <div style={{
                    width: "18px", height: "18px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spinLoading 0.8s linear infinite"
                  }}></div>
                  Authenticating...
                </div>
              ) : "Sign In"}
            </button>
          </form>

          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            margin: "24px 0",
            color: "rgba(255,255,255,0.3)",
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "1px"
          }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }}></div>
            <span style={{ padding: "0 12px" }}>Or continue with</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }}></div>
          </div>

          <button 
            type="button" 
            className="google-btn" 
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg className="g-icon" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          <div style={{ 
            marginTop: "32px", 
            textAlign: "center",
            fontSize: "13px",
            color: "rgba(255,255,255,0.6)"
          }}>
            <p style={{ margin: "0 0 12px 0" }}>
              Don't have an account? <Link to="/register" className="link-text">Create one</Link>
            </p>
            <Link to="/forgot-password" style={{
              color: "rgba(255,255,255,0.4)",
              textDecoration: "none",
              transition: "color 0.3s ease"
            }}
            onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.8)"}
            onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}
            >
              Recover Password
            </Link>
          </div>
          
        </div>
      </div>
    </>
  );
}

export default Login;