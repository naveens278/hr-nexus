import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import ErrorBoundary from "./components/ErrorBoundary";
import "./assets/styles/animations.css";
import "./App.css";

// Utils
import PrivateRoute from "./routes/PrivateRoute";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";

// Lazy Loaded Pages
const Login = React.lazy(() => import("./pages/Auth/Login"));
const Register = React.lazy(() => import("./pages/Auth/Register"));
const ForgotPassword = React.lazy(() => import("./pages/Auth/ForgotPassword"));
const Dashboard = React.lazy(() => import("./pages/Dashboard/Dashboard"));
const EmployeeList = React.lazy(() => import("./pages/Employees/EmployeeList"));
const AddEmployee = React.lazy(() => import("./pages/Employees/AddEmployee"));
const EmployeeProfile = React.lazy(() => import("./pages/Employees/EmployeeProfile"));
const AttendancePage = React.lazy(() => import("./pages/Attendance/AttendancePage"));
const AttendanceReport = React.lazy(() => import("./pages/Attendance/AttendanceReport"));
const LeaveApply = React.lazy(() => import("./pages/Leave/LeaveApply"));
const LeaveApproval = React.lazy(() => import("./pages/Leave/LeaveApproval"));
const LeaveHistory = React.lazy(() => import("./pages/Leave/LeaveHistory"));
const PayrollPage = React.lazy(() => import("./pages/Payroll/PayrollPage"));
const Payslip = React.lazy(() => import("./pages/Payroll/Payslip"));
const DepartmentList = React.lazy(() => import("./pages/Departments/DepartmentList"));
const AddDepartment = React.lazy(() => import("./pages/Departments/AddDepartment"));
const JobPost = React.lazy(() => import("./pages/Recruitment/JobPost"));
const Applicants = React.lazy(() => import("./pages/Recruitment/Applicants"));
const InterviewSchedule = React.lazy(() => import("./pages/Recruitment/InterviewSchedule"));
const EmployeeReport = React.lazy(() => import("./pages/Reports/EmployeeReport"));
const PayrollReport = React.lazy(() => import("./pages/Reports/PayrollReport"));
const SettingsPage = React.lazy(() => import("./pages/Settings/SettingsPage"));

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen message="Initializing Platform" />;
  }

  return (
    <ErrorBoundary>
      <div className="app-container">
        {/* Animated Background Orbs Globally */}
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <BrowserRouter>
        <Suspense fallback={<LoadingScreen message="Loading page..." small={true} />}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/employees" element={<PrivateRoute><EmployeeList /></PrivateRoute>} />
            <Route path="/add-employee" element={<PrivateRoute><AddEmployee /></PrivateRoute>} />
            <Route path="/employees/:id" element={<PrivateRoute><EmployeeProfile /></PrivateRoute>} />
            
            <Route path="/attendance" element={<PrivateRoute><AttendancePage /></PrivateRoute>} />
            <Route path="/attendance-report" element={<PrivateRoute><AttendanceReport /></PrivateRoute>} />
            
            <Route path="/leave-apply" element={<PrivateRoute><LeaveApply /></PrivateRoute>} />
            <Route path="/leave-approval" element={<PrivateRoute><LeaveApproval /></PrivateRoute>} />
            <Route path="/leave-history" element={<PrivateRoute><LeaveHistory /></PrivateRoute>} />
            
            <Route path="/payroll" element={<PrivateRoute><PayrollPage /></PrivateRoute>} />
            <Route path="/payslip" element={<PrivateRoute><Payslip /></PrivateRoute>} />
            <Route path="/payslip/:id" element={<PrivateRoute><Payslip /></PrivateRoute>} />
            
            <Route path="/departments" element={<PrivateRoute><DepartmentList /></PrivateRoute>} />
            <Route path="/add-department" element={<PrivateRoute><AddDepartment /></PrivateRoute>} />
            
            <Route path="/job-post" element={<PrivateRoute><JobPost /></PrivateRoute>} />
            <Route path="/applicants" element={<PrivateRoute><Applicants /></PrivateRoute>} />
            <Route path="/interview-schedule" element={<PrivateRoute><InterviewSchedule /></PrivateRoute>} />
            
            <Route path="/employee-report" element={<PrivateRoute><EmployeeReport /></PrivateRoute>} />
            <Route path="/payroll-report" element={<PrivateRoute><PayrollReport /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
            
            <Route path="*" element={<div className="animate-glass-in" style={{ padding: "80px 20px", textAlign: "center", minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "white" }}><h1 style={{ fontSize: "6rem", margin: 0, opacity: 0.2 }}>404</h1><h2 style={{ fontSize: "2rem", marginBottom: "10px" }}>Page Not Found</h2><p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "400px", margin: "0 auto 30px" }}>The organizational unit or page you're looking for doesn't exist or has been moved.</p><button onClick={() => window.location.href = '/dashboard'} style={{ padding: "12px 24px", background: "linear-gradient(45deg, #6366f1, #a855f7)", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold" }}>Return to Dashboard</button></div>} />
          </Routes>
        </Suspense>
        </BrowserRouter>
      </div>
    </ErrorBoundary>
  );
}

export default App;