
import React from 'react';

interface FactDotLogoProps {
  size?: number;
  className?: string;
}

export const FactDotLogo: React.FC<FactDotLogoProps> = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    <path 
      d="M20 50L40 70L85 25" 
      stroke="#1e3a8a" 
      strokeWidth="12" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <circle 
      cx="60" 
      cy="65" 
      r="20" 
      stroke="#1e3a8a" 
      strokeWidth="8" 
      fill="white"
    />
    <path 
      d="M75 80L90 95" 
      stroke="#1e3a8a" 
      strokeWidth="8" 
      strokeLinecap="round" 
    />
    <circle cx="60" cy="65" r="5" fill="#ef4444" />
    <circle cx="25" cy="80" r="8" fill="#22c55e" />
  </svg>
);
