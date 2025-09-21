import React from 'react';
import { Clock, CheckCircle, Circle, AlertTriangle } from 'lucide-react';

interface ProgressTrackerProps {
  currentQuestion: number;
  totalQuestions: number;
  timeElapsed: number;
  estimatedTimeRemaining: number;
  completedQuestions: number[];
  skippedQuestions: number[];
  className?: string;
}

export default function ProgressTracker({
  currentQuestion,
  totalQuestions,
  timeElapsed,
  estimatedTimeRemaining,
  completedQuestions,
  skippedQuestions,
  className = ''
}: ProgressTrackerProps) {
  const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;
  const completionRate = (completedQuestions.length / totalQuestions) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionStatus = (questionIndex: number) => {
    if (completedQuestions.includes(questionIndex)) {
      return 'completed';
    }
    if (skippedQuestions.includes(questionIndex)) {
      return 'skipped';
    }
    if (questionIndex === currentQuestion) {
      return 'current';
    }
    return 'pending';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'skipped':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'current':
        return <Circle className="h-4 w-4 text-blue-600 fill-current" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">
            {currentQuestion + 1} of {totalQuestions} questions
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>{Math.round(progressPercentage)}%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Time Information */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Clock className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-sm font-medium text-gray-700">Elapsed</span>
          </div>
          <div className="text-lg font-bold text-gray-900">
            {formatTime(timeElapsed)}
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Clock className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-sm font-medium text-gray-700">Remaining</span>
          </div>
          <div className="text-lg font-bold text-gray-900">
            {formatTime(estimatedTimeRemaining)}
          </div>
        </div>
      </div>

      {/* Question Status Overview */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-700">Question Status</span>
          <span className="text-sm text-gray-600">
            {completedQuestions.length} completed, {skippedQuestions.length} skipped
          </span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: totalQuestions }, (_, index) => {
            const status = getQuestionStatus(index);
            return (
              <div
                key={index}
                className={`flex items-center justify-center p-2 rounded-lg border ${
                  status === 'current'
                    ? 'border-blue-300 bg-blue-50'
                    : status === 'completed'
                    ? 'border-green-300 bg-green-50'
                    : status === 'skipped'
                    ? 'border-yellow-300 bg-yellow-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
                title={`Question ${index + 1} - ${status}`}
              >
                {getStatusIcon(status)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Completion Rate */}
      <div className="text-center">
        <div className="text-sm text-gray-600 mb-1">Completion Rate</div>
        <div className="text-2xl font-bold text-blue-600">
          {Math.round(completionRate)}%
        </div>
        <div className="text-xs text-gray-500">
          {completedQuestions.length} of {totalQuestions} questions completed
        </div>
      </div>
    </div>
  );
}
