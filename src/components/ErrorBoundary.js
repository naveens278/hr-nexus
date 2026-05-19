import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", textAlign: "center", margin: "50px auto", maxWidth: "600px" }}>
          <h1 style={{ color: "#d32f2f" }}>Something went wrong</h1>
          <p style={{ color: "#666", marginBottom: "20px" }}>{this.state.error?.message || "An unexpected error occurred"}</p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: "10px 20px", background: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
