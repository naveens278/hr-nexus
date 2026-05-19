import React from "react";

/**
 * AnimatedCard - Reusable card component with animations
 */
const AnimatedCard = ({ 
  title, 
  value, 
  icon, 
  color = "blue", 
  onClick,
  delay = 0,
  trend,
  subtitle,
  children,
  className = ""
}) => {
  const colorMap = {
    blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-600",
    green: "from-green-50 to-green-100 border-green-200 text-green-600",
    red: "from-red-50 to-red-100 border-red-200 text-red-600",
    purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-600",
    yellow: "from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-600",
    indigo: "from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-600"
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <div
      onClick={onClick}
      style={{
        animation: `slideInUp 0.5s ease-out ${delay}s both`,
      }}
      className={`bg-gradient-to-br ${colors} p-6 rounded-lg border shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 hover:translate-y-1 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
          {subtitle && <p className="text-xs opacity-60 mt-1">{subtitle}</p>}
          {trend && (
            <p className={`text-xs font-semibold mt-2 ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        {icon && (
          <div className="text-3xl opacity-50 animate-bounce-slow">
            {icon}
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

export default AnimatedCard;
