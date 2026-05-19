import React from "react";

/**
 * AnimatedPageWrapper - Wraps pages with fade-in animation
 */
const AnimatedPageWrapper = ({ children, delay = 0 }) => {
  return (
    <div 
      style={{
        animation: `fadeIn 0.5s ease-out ${delay}s both`,
      }}
      className="page-container"
    >
      {children}
    </div>
  );
};

export default AnimatedPageWrapper;
