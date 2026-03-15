import React from 'react';

interface PyrizeLogoProps {
  variant?: 'dark' | 'light';
  className?: string;
  animated?: boolean;
}

export function PyrizeLogo({ variant = 'dark', className = 'h-7', animated = true }: PyrizeLogoProps) {
  const fill = variant === 'light' ? '#2B2D42' : '#FFFFFF';

  return (
    <svg
      className={className}
      viewBox="0 0 300 60"
      xmlns="http://www.w3.org/2000/svg"
      style={{ height: undefined, width: 'auto' }}
    >
      {/* P */}
      <path fill={fill} d="M0,4 h11v52h-11z M11,4h20q18,0 18,16.5q0,16.5-18,16.5h-20v-11h18q8,0 8-5.5q0-5.5-8-5.5h-18z"/>
      {/* Y */}
      <path fill={fill} d="M62,4l16.5,22 16.5-22h13l-23,30.5v21.5h-11v-21.5L50,4z"/>
      {/* R */}
      <path fill={fill} d="M118,4h11v52h-11z M129,4h18q18,0 18,15.5q0,12-10,14.5l16,22h-13l-14.5-21h-14.5v-11h17q7,0 7-5.5q0-5.5-7-5.5h-17z"/>
      {/* I */}
      <path fill={fill} d="M178,4h11v52h-11z"/>
      {/* Z */}
      <path fill={fill} d="M202,4h40v10l-27,32h27v10h-42v-10l27-32h-25z"/>
      {/* E (no middle bar — dot replaces it) */}
      <path fill={fill} d="M258,4h11v52h-11z M269,4h30v10h-30z M269,46h30v10h-30z"/>
      {/* Animated dot */}
      <circle
        cx="284"
        cy="30"
        r="6.5"
        fill="#FF0066"
        className={animated ? 'animate-pulse' : ''}
      />
    </svg>
  );
}

export function PyrizeLogoIcon({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center rounded-lg bg-gradient-to-br from-[#DBE64C] to-[#74C365] shadow-[0_0_12px_rgba(219,230,76,0.35)] ${className}`}>
      <span className="text-[#001F3F] font-black text-sm" style={{ fontFamily: "var(--font-montserrat)" }}>P</span>
    </div>
  );
}
