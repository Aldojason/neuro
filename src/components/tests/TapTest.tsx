import React, { useState, useEffect, useRef } from 'react';
import { MousePointer, Clock, Target } from 'lucide-react';

interface TapData {
  timestamp: number;
  x: number;
  y: number;
  accuracy: number;
}

interface TapTestProps {
  duration: number;
  onComplete: (data: TapData[]) => void;
}

export default function TapTest({ duration, onComplete }: TapTestProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [tapData, setTapData] = useState<TapData[]>([]);
  const [targets, setTargets] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);
  const [currentTarget, setCurrentTarget] = useState(0);
  const [score, setScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const generateTargets = () => {
    const newTargets = [];
    for (let i = 0; i < 20; i++) {
      newTargets.push({
        id: i,
        x: Math.random() * 300 + 50,
        y: Math.random() * 200 + 50,
        size: 30 + Math.random() * 20
      });
    }
    setTargets(newTargets);
    setCurrentTarget(0);
  };

  const startTest = () => {
    try {
      generateTargets();
      setIsActive(true);
      setTimeRemaining(duration);
      setTapData([]);
      setScore(0);
      setCurrentTarget(0);

      // Start timer
      timerRef.current = setTimeout(() => {
        setIsActive(false);
        onComplete(tapData);
      }, duration * 1000);

      // Update countdown
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev && prev <= 1) {
            setIsActive(false);
            onComplete(tapData);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error starting tap test:', error);
      setIsActive(false);
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const target = targets[currentTarget];
    if (!target) return;

    const distance = Math.sqrt(
      Math.pow(x - target.x, 2) + Math.pow(y - target.y, 2)
    );
    
    const accuracy = Math.max(0, 100 - (distance / target.size) * 100);
    const isHit = distance <= target.size / 2;

    const tap: TapData = {
      timestamp: Date.now(),
      x,
      y,
      accuracy: isHit ? accuracy : 0
    };

    setTapData(prev => [...prev, tap]);
    
    if (isHit) {
      setScore(prev => prev + Math.round(accuracy));
      setCurrentTarget(prev => Math.min(prev + 1, targets.length - 1));
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw targets
    targets.forEach((target, index) => {
      if (index === currentTarget) {
        // Current target - highlighted
        ctx.fillStyle = '#3B82F6';
        ctx.strokeStyle = '#1D4ED8';
        ctx.lineWidth = 3;
      } else if (index < currentTarget) {
        // Completed targets - green
        ctx.fillStyle = '#10B981';
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 2;
      } else {
        // Future targets - gray
        ctx.fillStyle = '#E5E7EB';
        ctx.strokeStyle = '#9CA3AF';
        ctx.lineWidth = 1;
      }

      ctx.beginPath();
      ctx.arc(target.x, target.y, target.size / 2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Draw target number
      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((index + 1).toString(), target.x, target.y);
    });
  };

  useEffect(() => {
    drawCanvas();
  }, [targets, currentTarget]);

  const calculateScore = (): { tapsPerSecond: number; accuracy: number; coordination: number } => {
    if (tapData.length === 0) return { tapsPerSecond: 0, accuracy: 0, coordination: 0 };

    const totalTime = duration;
    const tapsPerSecond = tapData.length / totalTime;
    const accuracy = tapData.reduce((sum, tap) => sum + tap.accuracy, 0) / tapData.length;
    
    // Calculate coordination based on timing consistency
    const intervals = tapData.slice(1).map((tap, i) => tap.timestamp - tapData[i].timestamp);
    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    const intervalVariance = intervals.reduce((sum, interval) => sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length;
    const coordination = Math.max(0, 100 - (intervalVariance / 1000));

    return { tapsPerSecond, accuracy, coordination };
  };

  const performance = calculateScore();

  if (!isActive) {
    return (
      <div className="text-center p-8">
        <Target className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Tap Test</h3>
        <p className="text-gray-600 mb-4">
          Tap the highlighted targets as quickly and accurately as possible for {duration} seconds.
        </p>
        <button
          onClick={startTest}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
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
        <div className="text-gray-600">Tap the blue target as quickly as possible</div>
      </div>

      <div className="bg-gray-100 rounded-lg p-4 mb-4">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="border border-gray-300 rounded cursor-pointer bg-white"
          onClick={handleCanvasClick}
        />
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="bg-white p-3 rounded-lg">
          <div className="font-medium text-gray-900">Score</div>
          <div className="text-2xl font-bold text-blue-600">{score}</div>
        </div>
        <div className="bg-white p-3 rounded-lg">
          <div className="font-medium text-gray-900">Taps/sec</div>
          <div className="text-2xl font-bold text-green-600">{performance.tapsPerSecond.toFixed(1)}</div>
        </div>
        <div className="bg-white p-3 rounded-lg">
          <div className="font-medium text-gray-900">Accuracy</div>
          <div className="text-2xl font-bold text-purple-600">{performance.accuracy.toFixed(0)}%</div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Target {currentTarget + 1} of {targets.length}
      </div>
    </div>
  );
}
