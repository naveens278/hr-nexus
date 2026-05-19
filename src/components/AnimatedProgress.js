import React from "react";

/**
 * AnimatedProgress - Animated progress bar
 */
const AnimatedProgress = ({
  value = 0,
  max = 100,
  label,
  size = "md",
  color = "blue",
  showLabel = true,
  animated = true
}) => {
  const percentage = (value / max) * 100;

  const sizeClass = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  };

  const colorClass = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    red: "bg-red-600",
    yellow: "bg-yellow-600",
    purple: "bg-purple-600"
  };

  return (
    <div className="w-full">
      {(label || showLabel) && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm font-semibold text-gray-600">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`${sizeClass[size]} bg-gray-200 rounded-full overflow-hidden`}>
        <div
          className={`${colorClass[color]} h-full rounded-full transition-all duration-500 ${animated && "animate-pulse"}`}
          style={{
            width: `${percentage}%`,
            animation: `slideInLeft 0.8s ease-out`
          }}
        />
      </div>
    </div>
  );
};

export default AnimatedProgress;
