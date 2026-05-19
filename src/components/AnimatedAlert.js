import React, { useState, useEffect } from "react";

/**
 * AnimatedAlert - Toast/Alert notification with animations
 */
const AnimatedAlert = ({
  message,
  type = "info",
  duration = 5000,
  onClose,
  icon,
  action
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, isVisible, onClose]);

  if (!isVisible) return null;

  const typeStyles = {
    success: {
      bg: "bg-green-50 border-green-500 text-green-800",
      icon: "🎉",
      light: "bg-green-100"
    },
    error: {
      bg: "bg-red-50 border-red-500 text-red-800",
      icon: "❌",
      light: "bg-red-100"
    },
    warning: {
      bg: "bg-yellow-50 border-yellow-500 text-yellow-800",
      icon: "⚠️",
      light: "bg-yellow-100"
    },
    info: {
      bg: "bg-blue-50 border-blue-500 text-blue-800",
      icon: "ℹ️",
      light: "bg-blue-100"
    }
  };

  const style = typeStyles[type] || typeStyles.info;

  return (
    <div
      className={`${style.bg} border-l-4 p-4 rounded-r-lg shadow-lg animate-slide-in-top`}
      style={{
        animation: isVisible ? "slideInTop 0.4s ease-out" : "slideOutTop 0.4s ease-in"
      }}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl">{icon || style.icon}</span>
        <div className="flex-1">
          <p className="font-semibold">{message}</p>
          {action && (
            <button
              onClick={() => {
                action.onClick?.();
                setIsVisible(false);
              }}
              className="text-xs font-bold underline mt-1 hover:opacity-75"
            >
              {action.label}
            </button>
          )}
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-xl opacity-50 hover:opacity-100 transition"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default AnimatedAlert;
