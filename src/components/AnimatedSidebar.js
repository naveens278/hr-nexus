import React, { useState } from "react";

/**
 * AnimatedSidebar - Collapsible sidebar navigation with animations
 */
const AnimatedSidebar = ({
  items = [],
  activeItem = "",
  onItemClick,
  collapsed = false
}) => {
  const [isHovered, setIsHovered] = useState(null);

  return (
    <div
      className={`
        bg-gradient-to-b from-slate-900 to-slate-800 text-white
        transition-all duration-300 h-screen overflow-y-auto
        border-r border-slate-700
        ${collapsed ? "w-20" : "w-64"}
      `}
      style={{ animation: "slideInLeft 0.5s ease-out" }}
    >
      <div className="p-4 flex items-center justify-center">
        <div className="text-2xl animate-bounce-slow">
          {collapsed ? "📊" : "📊 HR-NEXUS"}
        </div>
      </div>

      <div className="space-y-2 px-3 py-4">
        {items.map((item, idx) => (
          <div
            key={idx}
            style={{
              animation: `slideInLeft 0.4s ease-out ${idx * 0.05}s both`
            }}
          >
            <button
              onClick={() => onItemClick?.(item)}
              onMouseEnter={() => setIsHovered(idx)}
              onMouseLeave={() => setIsHovered(null)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg
                transition-all duration-300
                ${activeItem === item.id
                  ? "bg-blue-600 shadow-lg scale-105"
                  : "hover:bg-slate-700 hover:translate-x-1"
                }
                ${isHovered === idx ? "shadow-md" : ""}
              `}
            >
              <span className="text-xl">{item.icon}</span>
              {!collapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span className="ml-auto text-xs bg-red-500 px-2 py-1 rounded-full animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedSidebar;
