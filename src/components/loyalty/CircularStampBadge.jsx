import React from 'react';
import { motion } from 'framer-motion';

export function CircularStampBadge({
  text = 'VALENCE CLUB • VERIFIED PASS •',
  centerText = 'GOLD',
  subText = 'TIER 3',
  size = 88,
  variant = 'oxblood', // 'oxblood' | 'cream' | 'mustard'
  icon: Icon,
  className = ''
}) {
  const isOxblood = variant === 'oxblood';
  const isMustard = variant === 'mustard';
  const isCream = variant === 'cream';

  const strokeColor = isOxblood
    ? '#7A1F1F'
    : isMustard
    ? '#E5A93C'
    : '#F2ECD8';

  const textColor = isOxblood
    ? '#7A1F1F'
    : isMustard
    ? '#7A1F1F'
    : '#F2ECD8';

  const bgColor = isOxblood
    ? '#F2ECD8'
    : isMustard
    ? '#E5A93C'
    : '#7A1F1F';

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full transform animate-spin-slow overflow-visible"
        style={{ animationDuration: '28s' }}
      >
        <defs>
          <path
            id="badgeCirclePath"
            d="M 60,60 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
          />
        </defs>

        {/* Outer Circular Scallop or Ring */}
        <circle
          cx="60"
          cy="60"
          r="56"
          fill={bgColor}
          stroke={strokeColor}
          strokeWidth="3"
        />

        {/* Inner Dotted Decorative Ring */}
        <circle
          cx="60"
          cy="60"
          r="48"
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />

        {/* Center Inner Circle */}
        <circle
          cx="60"
          cy="60"
          r="30"
          fill={isMustard ? '#7A1F1F' : bgColor}
          stroke={strokeColor}
          strokeWidth="2"
        />

        {/* Curved Text around perimeter */}
        <text
          fill={textColor}
          fontSize="10.5"
          fontFamily="Inter, sans-serif"
          fontWeight="800"
          letterSpacing="0.16em"
        >
          <textPath href="#badgeCirclePath" startOffset="50%" textAnchor="middle">
            {text}
          </textPath>
        </text>
      </svg>

      {/* Center Fixed Content (Does NOT rotate with the text ring) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
        {Icon ? (
          <Icon
            className="w-6 h-6 stroke-[2.5]"
            style={{ color: isMustard ? '#F2ECD8' : textColor }}
          />
        ) : (
          <>
            <span
              className="font-groovy font-bold text-xs uppercase leading-none"
              style={{ color: isMustard ? '#F2ECD8' : textColor }}
            >
              {centerText}
            </span>
            {subText && (
              <span
                className="font-mono text-[8px] font-bold tracking-tight uppercase leading-none mt-0.5"
                style={{ color: isMustard ? '#F2ECD8' : textColor }}
              >
                {subText}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
