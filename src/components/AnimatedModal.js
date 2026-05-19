import React, { useState, useEffect } from "react";

/**
 * AnimatedModal - Modal dialog with smooth animations
 */
const AnimatedModal = ({
  isOpen,
  title,
  children,
  onClose,
  size = "md",
  footer,
  closeButton = true
}) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  if (!isVisible) return null;

  const sizeStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
      style={{
        animation: isVisible ? "backdropFadeIn 0.3s ease-out" : "backdropFadeIn 0.3s ease-in reverse"
      }}
    >
      <div
        className={`bg-white rounded-lg shadow-2xl ${sizeStyles[size]} w-full mx-4`}
        style={{
          animation: isVisible ? "modalScaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)" : "modalScaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) reverse"
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          {closeButton && (
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-2 transition-all"
            >
              ✕
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimatedModal;
