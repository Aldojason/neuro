import React, { useEffect, useState } from 'react';

interface AnimatedProgressBarProps {
  progress: number;
  duration?: number;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  animated?: boolean;
}

export default function AnimatedProgressBar({
  progress,
  duration = 1000,
  color = 'blue',
  size = 'md',
  showPercentage = true,
  animated = true
}: AnimatedProgressBarProps) {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (animated) {
      const startTime = Date.now();
      const startProgress = displayProgress;
      const progressDiff = progress - startProgress;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progressRatio = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progressRatio, 3);
        const currentProgress = startProgress + (progressDiff * easeOutCubic);
        
        setDisplayProgress(currentProgress);

        if (progressRatio < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    } else {
      setDisplayProgress(progress);
    }
  }, [progress, duration, animated]);

  const getColorClasses = () => {
    const colors = {
      blue: 'bg-blue-600',
      green: 'bg-green-600',
      yellow: 'bg-yellow-600',
      red: 'bg-red-600',
      purple: 'bg-purple-600'
    };
    return colors[color];
  };

  const getSizeClasses = () => {
    const sizes = {
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4'
    };
    return sizes[size];
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${getSizeClasses()}`}>
        <div
          className={`${getColorClasses()} transition-all duration-300 ease-out rounded-full ${getSizeClasses()}`}
          style={{ width: `${Math.min(Math.max(displayProgress, 0), 100)}%` }}
        />
      </div>
      {showPercentage && (
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>0%</span>
          <span className="font-medium">{Math.round(displayProgress)}%</span>
          <span>100%</span>
        </div>
      )}
    </div>
  );
}
