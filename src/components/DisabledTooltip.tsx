import React, { useState, useId } from 'react';

interface DisabledTooltipProps {
  isDisabled: boolean;
  tooltipText: string;
  badgeText?: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'auto';
  className?: string;
  fullWidth?: boolean;
}

export const DisabledTooltip: React.FC<DisabledTooltipProps> = ({
  isDisabled,
  tooltipText,
  badgeText = '오픈 준비 중',
  children,
  position = 'top',
  className = '',
  fullWidth = false
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipId = useId();

  if (!isDisabled) {
    return <>{children}</>;
  }

  const tooltipPositionClass =
    position === 'bottom'
      ? 'top-full mt-2'
      : 'bottom-full mb-2';

  const tooltipArrowClass =
    position === 'bottom'
      ? 'bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-zinc-900'
      : 'top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900';

  return (
    <div
      className={`relative ${fullWidth ? 'w-full flex' : 'inline-flex'} items-center ${className} cursor-not-allowed`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      tabIndex={0}
      aria-describedby={showTooltip ? tooltipId : undefined}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="opacity-70 pointer-events-none flex items-center justify-center gap-1.5 w-full">
        {children}
        {badgeText && (
          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#18181B] text-amber-200/90 border border-amber-500/30 rounded whitespace-nowrap shrink-0">
            {badgeText}
          </span>
        )}
      </div>

      {showTooltip && (
        <div
          id={tooltipId}
          role="tooltip"
          className={`absolute z-[100] ${tooltipPositionClass} left-1/2 -translate-x-1/2 px-3 py-1.5 bg-zinc-900/95 text-zinc-100 text-xs font-medium rounded-xl border border-zinc-700/80 shadow-2xl whitespace-nowrap pointer-events-none animate-fade-in backdrop-blur-md`}
        >
          {tooltipText}
          <div className={`absolute ${tooltipArrowClass}`} />
        </div>
      )}
    </div>
  );
};
