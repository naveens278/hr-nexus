import React from "react";

/**
 * AnimatedBadge - Animated badge/pill component
 */
const AnimatedBadge = ({
  children,
  variant = "primary",
  size = "md",
  animated = true,
  onClick,
  removable = false,
  onRemove,
  icon,
  className = ""
}) => {
  const variants = {
    primary: "bg-blue-100 text-blue-800 border border-blue-300",
    secondary: "bg-gray-100 text-gray-800 border border-gray-300",
    success: "bg-green-100 text-green-800 border border-green-300",
    danger: "bg-red-100 text-red-800 border border-red-300",
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    purple: "bg-purple-100 text-purple-800 border border-purple-300"
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;

  return (
    <span
      className={`
        ${variantClass}
        ${sizeClass}
        rounded-full font-semibold
        inline-flex items-center gap-2
        transition-all duration-300
        hover:shadow-md
        ${animated && "animate-badgePop"}
        ${onClick ? "cursor-pointer hover:scale-110" : ""}
        ${className}
      `}
      style={{
        animation: animated ? "badgePop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)" : "none"
      }}
      onClick={onClick}
    >
      {icon && <span>{icon}</span>}
      {children}
      {removable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="ml-1 hover:opacity-70 transition"
        >
          ✕
        </button>
      )}
    </span>
  );
};

export default AnimatedBadge;
