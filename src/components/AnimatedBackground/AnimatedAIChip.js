import React from 'react';
import './AnimatedAIChip.css';

const AnimatedAIChip = ({ size = 56 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 56 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="animated-ai-chip"
  >
    {/* Chip Outline */}
    <rect x="8" y="8" width="40" height="40" rx="6" fill="#101828" stroke="#60A5FA" strokeWidth="2.5" filter="url(#glow)" />
    {/* Glowing effect */}
    <g filter="url(#chip-glow)">
      <rect x="8" y="8" width="40" height="40" rx="6" fill="#2563EB" fillOpacity="0.15" />
    </g>
    {/* AI Text */}
    <text x="50%" y="54%" textAnchor="middle" fill="#60A5FA" fontSize="18" fontWeight="bold" fontFamily="Inter, sans-serif" dominantBaseline="middle" letterSpacing="2">AI</text>
    {/* Animated Impulses */}
    <g>
      {/* Horizontal impulse */}
      <rect x="12" y="28" width="32" height="2" rx="1" fill="#38BDF8" opacity="0.3" />
      <circle className="impulse-dot impulse-dot-horizontal" cx="12" cy="29" r="3" fill="#38BDF8" />
      {/* Diagonal impulse */}
      <g transform="rotate(-25 28 28)">
        <rect x="12" y="28" width="32" height="2" rx="1" fill="#38BDF8" opacity="0.2" />
        <circle className="impulse-dot impulse-dot-diagonal" cx="12" cy="29" r="2.5" fill="#60A5FA" />
      </g>
      {/* (Optional) Short vertical impulse */}
      <rect x="27" y="16" width="2" height="24" rx="1" fill="#38BDF8" opacity="0.15" />
      <circle className="impulse-dot impulse-dot-vertical" cx="28" cy="18" r="2" fill="#7dd3fc" />
    </g>
    <defs>
      <filter id="glow" x="0" y="0" width="56" height="56" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feFlood floodColor="#60A5FA" floodOpacity="0.5" />
        <feComposite in2="blur" operator="in" />
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="chip-glow" x="-10" y="-10" width="76" height="76" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feGaussianBlur stdDeviation="8" result="chip-blur" />
        <feFlood floodColor="#38BDF8" floodOpacity="0.25" />
        <feComposite in2="chip-blur" operator="in" />
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  </svg>
);

export default AnimatedAIChip; 