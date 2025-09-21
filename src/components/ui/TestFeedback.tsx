import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, Zap, Target, Brain, Activity } from 'lucide-react';

interface TestFeedbackProps {
  type: 'success' | 'error' | 'warning' | 'info' | 'performance';
  message: string;
  details?: string;
  score?: number;
  maxScore?: number;
  showIcon?: boolean;
  autoHide?: boolean;
  duration?: number;
  onClose?: () => void;
}

export default function TestFeedback({
  type,
  message,
  details,
  score,
  maxScore,
  showIcon = true,
  autoHide = false,
  duration = 3000,
  onClose
}: TestFeedbackProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (autoHide) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (duration / 100));
          if (newProgress <= 0) {
            setIsVisible(false);
            onClose?.();
            return 0;
          }
          return newProgress;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [autoHide, duration, onClose]);

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          iconColor: 'text-green-600',
          progressColor: 'bg-green-600'
        };
      case 'error':
        return {
          icon: XCircle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
          progressColor: 'bg-red-600'
        };
      case 'warning':
        return {
          icon: AlertCircle,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          progressColor: 'bg-yellow-600'
        };
      case 'info':
        return {
          icon: Info,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-600',
          progressColor: 'bg-blue-600'
        };
      case 'performance':
        return {
          icon: score && score >= 80 ? Target : score && score >= 60 ? Brain : Activity,
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          textColor: 'text-purple-800',
          iconColor: 'text-purple-600',
          progressColor: 'bg-purple-600'
        };
      default:
        return {
          icon: Info,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-600',
          progressColor: 'bg-gray-600'
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  if (!isVisible) return null;

  return (
    <div className={`relative p-4 rounded-lg border ${config.bgColor} ${config.borderColor} animate-in slide-in-from-top-2 duration-300`}>
      <div className="flex items-start space-x-3">
        {showIcon && (
          <Icon className={`h-5 w-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        )}
        
        <div className="flex-1 min-w-0">
          <div className={`font-medium ${config.textColor}`}>
            {message}
          </div>
          
          {details && (
            <div className={`text-sm mt-1 ${config.textColor} opacity-80`}>
              {details}
            </div>
          )}
          
          {score !== undefined && maxScore && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className={config.textColor}>Score</span>
                <span className={`font-medium ${config.textColor}`}>
                  {score}/{maxScore}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${config.progressColor}`}
                  style={{ width: `${(score / maxScore) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className={`text-sm ${config.textColor} opacity-60 hover:opacity-100 transition-opacity`}
          >
            ✕
          </button>
        )}
      </div>
      
      {autoHide && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden">
          <div
            className={`h-full ${config.progressColor} transition-all duration-100`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
