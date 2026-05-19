import React from "react";

/**
 * SkeletonLoader - Animated skeleton for loading states
 */
const SkeletonLoader = ({ 
  count = 5, 
  variant = "card", 
  className = "" 
}) => {
  if (variant === "card") {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton h-20 rounded-lg" style={{
            animation: `shimmer 2s infinite`,
            animationDelay: `${i * 0.1}s`
          }} />
        ))}
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="skeleton h-12 w-12 rounded" />
            <div className="skeleton h-12 flex-1 rounded" />
            <div className="skeleton h-12 w-24 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "badge") {
    return (
      <div className={`flex gap-2 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton h-8 w-20 rounded-full" />
        ))}
      </div>
    );
  }

  if (variant === "text") {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton h-4 rounded" style={{
            width: i === count - 1 ? "80%" : "100%"
          }} />
        ))}
      </div>
    );
  }

  return (
    <div className={`skeleton h-10 rounded ${className}`} />
  );
};

export default SkeletonLoader;
