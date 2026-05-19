import React, { useState, useRef, useEffect } from 'react';

const CustomDropdown = ({ label, options, value, onChange, placeholder = "Select...", name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (dropdownRef.current) {
      const parent = dropdownRef.current.closest('.list-item-stagger');
      if (parent) {
        parent.style.zIndex = isOpen ? '1000' : 'auto';
        parent.style.position = isOpen ? 'relative' : '';
      }
    }
  }, [isOpen]);

  const handleSelect = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value) || options.find(opt => opt === value);
  const displayValue = selectedOption ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption) : placeholder;

  return (
    <div className="custom-dropdown-container" ref={dropdownRef} style={{ position: 'relative', width: '100%', zIndex: isOpen ? 100 : 1 }}>
      {label && <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'rgba(255, 255, 255, 0.8)' }}>{label}</label>}
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="glass-input"
        style={{ 
          width: '100%', 
          cursor: 'pointer', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '12px 16px',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: value ? '#fff' : 'rgba(255, 255, 255, 0.5)',
          transition: 'all 0.3s ease'
        }}
      >
        <span>{displayValue}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ 
            transition: 'transform 0.3s ease', 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' 
          }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {isOpen && (
        <ul 
          className="glass-panel animate-glass-slide-up"
          style={{ 
            position: 'absolute', 
            top: 'calc(100% + 5px)', 
            left: 0, 
            right: 0, 
            zIndex: 1000, 
            background: 'rgba(24, 24, 27, 0.95)', 
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '12px', 
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
            padding: '8px', 
            margin: 0, 
            listStyle: 'none',
            maxHeight: '250px',
            overflowY: 'auto'
          }}
        >
          {options.map((option, idx) => {
            const optValue = typeof option === 'object' ? option.value : option;
            const optLabel = typeof option === 'object' ? option.label : option;
            const isSelected = value === optValue;

            return (
              <li 
                key={idx}
                onClick={() => handleSelect(optValue)}
                style={{ 
                  padding: '10px 14px', 
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  color: isSelected ? '#fff' : 'rgba(255, 255, 255, 0.8)',
                  background: isSelected ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)' : 'transparent',
                  border: isSelected ? '1px solid rgba(102, 126, 234, 0.3)' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                  fontSize: '14px',
                  marginBottom: '2px'
                }}
                className="hover-glass-white"
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                  }
                }}
              >
                {optLabel}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
