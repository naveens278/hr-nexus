import React from "react";

/**
 * AnimatedStats - Display statistics with animated counters
 */
const AnimatedStats = ({
  stats = [],
  layout = "grid" // "grid", "horizontal", "vertical"
}) => {
  const containerClass = {
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
    horizontal: "flex flex-wrap gap-4",
    vertical: "space-y-4"
  };

  return (
    <div className={containerClass[layout]}>
      {stats.map((stat, idx) => (
        <div
          key={idx}
          style={{
            animation: `slideInUp 0.5s ease-out ${idx * 0.1}s both`
          }}
          className="bg-white p-6 rounded-lg border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:translate-y-1 hover:scale-105"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <h3 className="text-3xl font-bold mt-2 text-gray-800">
                <span
                  style={{
                    animation: `numberCounter 0.8s ease-out ${idx * 0.1 + 0.3}s both`
                  }}
                >
                  {stat.value}
                </span>
              </h3>
              {stat.change && (
                <p className={`text-xs font-semibold mt-2 ${
                  stat.change > 0 ? "text-green-600" : "text-red-600"
                }`}>
                  {stat.change > 0 ? "📈" : "📉"} {Math.abs(stat.change)}% from last period
                </p>
              )}
            </div>
            {stat.icon && (
              <div className="text-3xl opacity-30 animate-bounce-slow">
                {stat.icon}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnimatedStats;
