import React from 'react';
import { cn } from '../lib/utils';

interface BrandLogoProps {
  className?: string;
  withText?: boolean;
  textColor?: string;
}

export function BrandLogo({ className, withText = false, textColor = "text-slate-900" }: BrandLogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-full h-full shrink-0"
      >
        {/* Main T - Navy */}
        <path 
          d="M 40 25 H 72 V 38 H 58 V 82 H 52 Q 48 82 48 76 V 38 H 25 Q 25 25 40 25 Z" 
          fill="currentColor" 
        />
        {/* Upper Wing - Medium Blue */}
        <path 
          d="M 28 42 H 44 V 54 H 33.5 Z" 
          fill="#5C6AB0" 
        />
        {/* Lower Wing - Light Blue */}
        <path 
          d="M 34.5 58 H 44 V 78 Q 44 82 41 82 H 40 Q 37 82 36.5 76 Z" 
          fill="#9DA8CF" 
        />
      </svg>
      {withText && (
        <span className={cn("font-bold tracking-tight text-lg", textColor)}>
          TenderSense
        </span>
      )}
    </div>
  );
}
