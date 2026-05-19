import React from 'react';

const LoadingScreen = ({ message = "Initializing Platform", small = false }) => {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: small ? "200px" : "100vh",
      width: "100%",
      background: small ? "transparent" : "#09090b",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Inter', sans-serif",
      zIndex: 9999
    }}>
      {!small && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="orb orb-1" style={{ opacity: 0.4, animationDuration: "8s" }}></div>
          <div className="orb orb-2" style={{ opacity: 0.4, animationDuration: "10s" }}></div>
          <div className="orb orb-3" style={{ opacity: 0.3, animationDuration: "7s" }}></div>
        </div>
      )}

      <div className="animate-glass-scale-in" style={{
        textAlign: "center",
        zIndex: 10,
        background: "rgba(24, 24, 27, 0.45)",
        backdropFilter: "blur(25px)",
        WebkitBackdropFilter: "blur(25px)",
        padding: small ? "20px" : "50px 70px",
        borderRadius: "32px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 25px 60px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
        maxWidth: "90%",
        animation: "glassGlowPulse 3s ease-in-out infinite"
      }}>
        {/* Animated Logo/Spinner */}
        <div style={{ 
          position: "relative",
          width: small ? "60px" : "120px", 
          height: small ? "60px" : "120px", 
          margin: "0 auto 30px" 
        }}>
          {/* Ring 1 - Deep Purple */}
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            border: "4px solid rgba(168, 85, 247, 0.1)",
            borderRadius: "50%",
            borderTopColor: "#a855f7",
            animation: "spinLoading 1.2s cubic-bezier(0.5, 0.1, 0.4, 0.9) infinite",
            boxShadow: "0 0 15px rgba(168, 85, 247, 0.3)"
          }}></div>
          
          {/* Ring 2 - Indigo */}
          <div style={{
            position: "absolute",
            top: "12px", left: "12px", right: "12px", bottom: "12px",
            border: "3px solid rgba(99, 102, 241, 0.1)",
            borderRadius: "50%",
            borderBottomColor: "#6366f1",
            animation: "spinLoading 1.8s cubic-bezier(0.5, 0.1, 0.4, 0.9) reverse infinite",
            boxShadow: "0 0 10px rgba(99, 102, 241, 0.2)"
          }}></div>
          
          {/* Center Logo Icon */}
          <div style={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: small ? "24px" : "48px",
            animation: "glassBlurPulse 2s ease-in-out infinite",
            filter: "drop-shadow(0 0 10px rgba(168, 85, 247, 0.5))"
          }}>
            <span style={{ display: "inline-block", animation: "layer3DBounce 2s ease-in-out infinite" }}>
              🏢
            </span>
          </div>
        </div>

        <h2 className="animate-glass-slide-up" style={{ 
          fontSize: small ? "18px" : "32px", 
          fontWeight: "800", 
          margin: "0 0 12px 0",
          background: "linear-gradient(to right, #ffffff, #a855f7, #6366f1)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-1px",
          animationDelay: "0.2s"
        }}>
          HR-NEXUS
        </h2>
        
        <div className="animate-smooth-fade" style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          animationDelay: "0.4s"
        }}>
          <p style={{ 
            fontSize: small ? "12px" : "15px", 
            color: "rgba(255, 255, 255, 0.5)",
            margin: "0 0 20px 0",
            fontWeight: "500",
            textTransform: "uppercase",
            letterSpacing: "2px"
          }}>
            {message}
          </p>
          
          {/* Sleek Progress Bar */}
          <div style={{
            width: small ? "120px" : "240px",
            height: "2px",
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "10px",
            overflow: "hidden",
            position: "relative"
          }}>
            <div style={{
              position: "absolute",
              top: 0, left: 0, height: "100%",
              width: "40%",
              background: "linear-gradient(90deg, transparent, #a855f7, #6366f1, transparent)",
              borderRadius: "10px",
              animation: "loadingProgress 2.5s cubic-bezier(0.65, 0.05, 0.36, 1) infinite",
              boxShadow: "0 0 15px rgba(168, 85, 247, 0.6)"
            }}></div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes loadingProgress {
            0% { left: -100%; width: 100%; }
            100% { left: 100%; width: 100%; }
          }
          @keyframes spinLoading {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingScreen;
