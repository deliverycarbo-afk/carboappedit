
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ className = '', variant = 'full', size = 'md' }) => {
  // Height mapping for responsive hierarchy
  const sizes = {
    sm: 'h-6',   // Mobile headers / Compact
    md: 'h-8',   // Desktop headers
    lg: 'h-12',  // Drawers / Modals
    xl: 'h-20'   // Splash / Login / Hero
  };

  // Icon Variant (CSS "C" Box) - Used for compact/mobile states or when requested
  if (variant === 'icon') {
    const iconSize = {
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-xl',
      lg: 'w-14 h-14 text-2xl',
      xl: 'w-20 h-20 text-4xl'
    }[size];

    return (
      <div className={`${iconSize} bg-carbo-primary rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-orange-500/30 ${className}`}>
        C
      </div>
    );
  }

  // Full Variant (Image Logo)
  return (
    <img
      src="https://i.imgur.com/3QZqg9S.png"
      alt="Carbo.app"
      className={`object-contain ${sizes[size]} ${className}`}
    />
  );
};
