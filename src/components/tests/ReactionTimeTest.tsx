import React, { useState, useEffect, useRef } from 'react';
import { Zap, Clock, Target, TrendingUp } from 'lucide-react';

interface ReactionData {
  timestamp: number;
  reactionTime: number;
  accuracy: 'hit' | 'miss' | 'early';
}

interface ReactionTimeTestProps {
  duration: number;
  onComplete: (data: ReactionData[]) => void;
}

export default function ReactionTimeTest({ duration, onComplete }: ReactionTimeTestProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [currentPhase, setCurrentPhase] = useState<'waiting' | 'ready' | 'go' | 'complete'>('waiting');
  const [reactionData, setReactionData] = useState<ReactionData[]>([]);
  const [waitTime, setWaitTime] = useState(0);
  const [showTarget, setShowTarget] = useState(false);
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const [startTime, setStartTime] = useState(0);
  const [stats, setStats] = useState({
    averageReactionTime: 0,
    fastestReaction: 0,
    slowestReaction: 0,
    accuracy: 0
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const waitTimerRef = useRef<NodeJS.Timeout | null>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (waitTimerRef.current) clearTimeout(waitTimerRef.current);
    };
  }, []);

  const generateRandomWaitTime = () => {
    return Math.random() * 3000 + 1000; // 1-4 seconds
  };

  const generateRandomPosition = () => {
    const container = targetRef.current?.parentElement;
    if (!container) return { x: 50, y: 50 };
    
    const rect = container.getBoundingClientRect();
    const margin = 50;
    return {
      x: Math.random() * (rect.width - 100) + margin,
      y: Math.random() * (rect.height - 100) + margin
    };
  };

  const startTest = () => {
    setIsActive(true);
    setTimeRemaining(duration);
    setReactionData([]);
    setCurrentPhase('ready');
    startNewRound();
  };

  const startNewRound = () => {
    if (!isActive) return;
    
    setCurrentPhase('waiting');
    setShowTarget(false);
    
    const wait = generateRandomWaitTime();
    setWaitTime(wait);
    
    waitTimerRef.current = setTimeout(() => {
      if (isActive) {
        setCurrentPhase('go');
        setShowTarget(true);
        setTargetPosition(generateRandomPosition());
        setStartTime(Date.now());
      }
    }, wait);
  };

  const handleTargetClick = () => {
    if (currentPhase !== 'go' || !showTarget) return;
    
    const reactionTime = Date.now() - startTime;
    const accuracy = reactionTime < 100 ? 'early' : 'hit';
    
    const newData: ReactionData = {
      timestamp: Date.now(),
      reactionTime,
      accuracy
    };
    
    setReactionData(prev => [...prev, newData]);
    updateStats([...reactionData, newData]);
    
    if (reactionTime >= 100) {
      startNewRound();
    }
  };

  const updateStats = (data: ReactionData[]) => {
    if (data.length === 0) return;
    
    const validReactions = data.filter(d => d.accuracy === 'hit');
    const reactionTimes = validReactions.map(d => d.reactionTime);
    
    if (reactionTimes.length > 0) {
      const average = reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length;
      const fastest = Math.min(...reactionTimes);
      const slowest = Math.max(...reactionTimes);
      const accuracy = (validReactions.length / data.length) * 100;
      
      setStats({
        averageReactionTime: Math.round(average),
        fastestReaction: fastest,
        slowestReaction: slowest,
        accuracy: Math.round(accuracy)
      });
    }
  };

  const completeTest = () => {
    setIsActive(false);
    setCurrentPhase('complete');
    onComplete(reactionData);
  };

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            completeTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [isActive, timeRemaining]);

  const getPhaseMessage = () => {
    switch (currentPhase) {
      case 'waiting':
        return 'Wait for the target to appear...';
      case 'ready':
        return 'Get ready...';
      case 'go':
        return 'Click the target as fast as possible!';
      case 'complete':
        return 'Test completed!';
      default:
        return 'Click to start the reaction time test';
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'waiting':
        return 'text-yellow-600';
      case 'ready':
        return 'text-blue-600';
      case 'go':
        return 'text-green-600';
      case 'complete':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  if (!isActive) {
    return (
      <div className="text-center p-8">
        <Zap className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Reaction Time Test</h3>
        <p className="text-gray-600 mb-4">
          Test your reaction speed by clicking targets as quickly as possible when they appear.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-blue-900 mb-2">Instructions:</h4>
          <ul className="text-sm text-blue-800 text-left space-y-1">
            <li>• Wait for a target to appear on screen</li>
            <li>• Click it as quickly as possible</li>
            <li>• Don't click too early (before target appears)</li>
            <li>• Test duration: {duration} seconds</li>
          </ul>
        </div>
        <button
          onClick={startTest}
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-medium"
        >
          Start Test
        </button>
      </div>
    );
  }

  return (
    <div className="text-center p-8">
      <div className="mb-6">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <Clock className="h-6 w-6 text-blue-500" />
          <div className="text-2xl font-bold text-blue-600">{timeRemaining}s</div>
        </div>
        <div className={`text-lg font-medium ${getPhaseColor()}`}>
          {getPhaseMessage()}
        </div>
      </div>

      {/* Target Area */}
      <div 
        ref={targetRef}
        className="relative bg-gray-100 rounded-lg p-8 mb-6 min-h-[300px] flex items-center justify-center"
        onClick={handleTargetClick}
      >
        {showTarget && currentPhase === 'go' && (
          <div
            className="absolute w-16 h-16 bg-red-500 rounded-full cursor-pointer animate-pulse shadow-lg flex items-center justify-center"
            style={{
              left: `${targetPosition.x}px`,
              top: `${targetPosition.y}px`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <Target className="h-8 w-8 text-white" />
          </div>
        )}
        
        {currentPhase === 'waiting' && (
          <div className="text-gray-500">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
            <div className="text-sm">Waiting...</div>
          </div>
        )}
      </div>

      {/* Stats */}
      {reactionData.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Average</div>
            <div className="text-xl font-bold text-blue-600">{stats.averageReactionTime}ms</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Fastest</div>
            <div className="text-xl font-bold text-green-600">{stats.fastestReaction}ms</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Slowest</div>
            <div className="text-xl font-bold text-red-600">{stats.slowestReaction}ms</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Accuracy</div>
            <div className="text-xl font-bold text-purple-600">{stats.accuracy}%</div>
          </div>
        </div>
      )}

      {/* Progress */}
      <div className="text-sm text-gray-600">
        Attempts: {reactionData.length} | Valid: {reactionData.filter(d => d.accuracy === 'hit').length}
      </div>
    </div>
  );
}
