import React, { useState } from "react";

/**
 * AnimatedNavbar - Navigation bar with smooth animations
 */
const AnimatedNavbar = ({
  title = "HR-NEXUS",
  user,
  onLogout,
  menuItems = [],
  onMenuClick
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg animate-slide-in-down">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="animate-bounce-slow text-2xl">📊</div>
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onMenuClick?.(item)}
                className="hover:bg-blue-700 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* User Dropdown & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded-lg transition-all duration-300"
              >
                <span className="text-lg">👤</span>
                <span>{user?.name || "User"}</span>
                <span className={`transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl z-50"
                  style={{ animation: "slideInDown 0.3s ease-out" }}
                >
                  <button
                    onClick={() => {
                      onLogout?.();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-semibold rounded-lg m-1 transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-2xl hover:bg-blue-700 px-2 py-1 rounded-lg transition-all"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden mt-4 space-y-2"
            style={{ animation: "slideInDown 0.3s ease-out" }}
          >
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onMenuClick?.(item);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left hover:bg-blue-700 px-3 py-2 rounded-lg transition-all duration-300 active:bg-blue-500"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default AnimatedNavbar;
