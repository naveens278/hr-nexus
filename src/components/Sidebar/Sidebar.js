import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Sidebar() {
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState(null);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");
  
  const isSubmenuActive = (item) => {
    if (isActive(item.path)) return true;
    if (item.submenu) {
      return item.submenu.some(sub => location.pathname === sub.path);
    }
    return false;
  };

  const menuItems = [
    { label: "Dashboard", path: "/dashboard" },
    {
      label: "Employees",
      path: "/employees",
      submenu: [
        { label: "Employee List", path: "/employees" },
        { label: "Add Employee", path: "/add-employee" },
      ],
    },
    {
      label: "Attendance",
      path: "/attendance",
      submenu: [
        { label: "Check In/Out", path: "/attendance" },
        { label: "Attendance Report", path: "/attendance-report" },
      ],
    },
    {
      label: "Leave Management",
      path: "/leave",
      submenu: [
        { label: "Apply Leave", path: "/leave-apply" },
        { label: "Leave History", path: "/leave-history" },
        { label: "Approve Leaves", path: "/leave-approval" },
      ],
    },
    {
      label: "Payroll",
      path: "/payroll",
      submenu: [
        { label: "Process Payroll", path: "/payroll" },
        { label: "Payslip", path: "/payslip" },
      ],
    },
    {
      label: "Departments",
      path: "/departments",
      submenu: [
        { label: "Department List", path: "/departments" },
        { label: "Add Department", path: "/add-department" },
      ],
    },
    {
      label: "Recruitment",
      path: "/recruitment",
      submenu: [
        { label: "Job Posts", path: "/job-post" },
        { label: "Applicants", path: "/applicants" },
        { label: "Interview Schedule", path: "/interview-schedule" },
      ],
    },
    {
      label: "Reports",
      path: "/reports",
      submenu: [
        { label: "Employee Report", path: "/employee-report" },
        { label: "Attendance Report", path: "/attendance-report" },
        { label: "Payroll Report", path: "/payroll-report" },
      ],
    },
    { label: "Settings", path: "/settings" },
  ];

  // Auto-expand the current active menu on mount and location change
  useEffect(() => {
    const activeItem = menuItems.find(item => isSubmenuActive(item));
    if (activeItem && activeItem.submenu) {
      setExpandedMenu(activeItem.path);
    }
  }, [location.pathname]);

  return (
    <div
      className="animate-glass-slide-right"
      style={{
        width: "250px",
        height: "100vh",
        background: "rgba(24, 24, 27, 0.4)",
        backdropFilter: "blur(10px)",
        color: "#fff",
        padding: "20px",
        overflowY: "auto",
        boxShadow: "2px 0 10px rgba(0, 0, 0, 0.5)",
        borderRight: "1px solid rgba(102, 126, 234, 0.1)",
      }}
    >
      <h2 style={{ 
        margin: "10px 0 30px 0", 
        fontSize: "24px", 
        fontWeight: "800", 
        background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)", 
        WebkitBackgroundClip: "text", 
        WebkitTextFillColor: "transparent", 
        backgroundClip: "text",
        letterSpacing: "1px",
        textAlign: "center"
      }}>
        📊 HR-NEXUS
      </h2>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {menuItems.map((item) => {
          const active = isSubmenuActive(item);
          return (
            <li key={item.label} style={{ marginBottom: "5px" }}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() =>
                      setExpandedMenu(expandedMenu === item.path ? null : item.path)
                    }
                    className="hover-glass-lift transition-glass"
                    style={{
                      width: "100%",
                      padding: "12px 15px",
                      background: active ? "rgba(99, 102, 241, 0.15)" : "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(8px)",
                      color: active ? "#6366f1" : "rgba(255, 255, 255, 0.4)",
                      border: active ? "1px solid rgba(99, 102, 241, 0.3)" : "1px solid rgba(255, 255, 255, 0.05)",
                      borderRadius: "8px",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: "14px",
                      fontWeight: active ? "bold" : "normal",
                      transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      outline: "none"
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = "rgba(99, 102, 241, 0.1)";
                        e.currentTarget.style.color = "#818cf8";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                        e.currentTarget.style.color = "rgba(255, 255, 255, 0.4)";
                      }
                    }}
                  >
                    <span>{item.label}</span>
                    <span style={{ fontSize: "10px", transition: "transform 0.3s ease", transform: expandedMenu === item.path ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                  </button>

                  {expandedMenu === item.path && (
                    <ul
                      style={{
                        listStyle: "none",
                        padding: "0 0 0 10px",
                        margin: "5px 0",
                        borderLeft: "2px solid rgba(102, 126, 234, 0.3)",
                      }}
                    >
                      {item.submenu.map((subitem) => (
                        <li key={subitem.path}>
                          <Link
                            to={subitem.path}
                            className="hover-glass-lift transition-glass"
                            style={{
                              display: "block",
                              padding: "10px 15px",
                              color: location.pathname === subitem.path ? "#6366f1" : "rgba(255, 255, 255, 0.6)",
                              textDecoration: "none",
                              fontSize: "13px",
                              borderRadius: "6px",
                              transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                              background: location.pathname === subitem.path
                                ? "rgba(99, 102, 241, 0.1)"
                                : "transparent",
                              border: location.pathname === subitem.path ? "1px solid rgba(99, 102, 241, 0.2)" : "none",
                            }}
                          >
                            • {subitem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  className="hover-glass-lift transition-glass"
                  style={{
                    display: "block",
                    padding: "12px 15px",
                    color: location.pathname === item.path ? "#6366f1" : "rgba(255, 255, 255, 0.4)",
                    textDecoration: "none",
                    fontSize: "14px",
                    borderRadius: "8px",
                    transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    background: location.pathname === item.path
                      ? "rgba(99, 102, 241, 0.25)"
                      : "rgba(255, 255, 255, 0.05)",
                    border: location.pathname === item.path ? "1px solid rgba(99, 102, 241, 0.3)" : "1px solid transparent",
                    fontWeight: location.pathname === item.path ? "bold" : "normal",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar;