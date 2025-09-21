import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

interface SpatialMemoryTestProps {
  onComplete: (data: {
    correct: number;
    total: number;
    accuracy: number;
    averageTime: number;
    sequence: Array<{ position: { x: number; y: number }; clicked: boolean; correct: boolean; time: number }>;
  }) => void;
}

export default function SpatialMemoryTest({ onComplete }: SpatialMemoryTestProps) {
  const [phase, setPhase] = useState<'instructions' | 'memorize' | 'recall' | 'complete'>('instructions');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [sequence, setSequence] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [userSequence, setUserSequence] = useState<Array<{ x: number; y: number; id: number; clicked: boolean; correct: boolean; time: number }>>([]);
  const [showSequence, setShowSequence] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0, accuracy: 0, averageTime: 0 });
  const [maxLevel] = useState(5);

  const gridRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const generateSequence = (level: number) => {
    const positions: Array<{ x: number; y: number; id: number }> = [];
    const gridSize = 4; // 4x4 grid
    const sequenceLength = level + 2; // 3, 4, 5, 6, 7 positions

    for (let i = 0; i < sequenceLength; i++) {
      let position;
      do {
        position = {
          x: Math.floor(Math.random() * gridSize),
          y: Math.floor(Math.random() * gridSize),
          id: i
        };
      } while (positions.some(p => p.x === position.x && p.y === position.y));
      
      positions.push(position);
    }

    return positions;
  };

  const startTest = () => {
    setPhase('memorize');
    setCurrentLevel(1);
    const newSequence = generateSequence(1);
    setSequence(newSequence);
    setUserSequence([]);
    setCurrentIndex(0);
    showSequenceStep(newSequence, 0);
  };

  const showSequenceStep = (seq: Array<{ x: number; y: number; id: number }>, index: number) => {
    if (index >= seq.length) {
      setShowSequence(false);
      setPhase('recall');
      setStartTime(Date.now());
      return;
    }

    setShowSequence(true);
    setCurrentIndex(index);

    timerRef.current = setTimeout(() => {
      setShowSequence(false);
      timerRef.current = setTimeout(() => {
        showSequenceStep(seq, index + 1);
      }, 500);
    }, 1000);
  };

  const handleGridClick = (x: number, y: number) => {
    if (phase !== 'recall') return;

    const clickTime = Date.now() - startTime;
    const expectedPosition = sequence[userSequence.length];
    const isCorrect = expectedPosition && expectedPosition.x === x && expectedPosition.y === y;

    const newUserSequence = [...userSequence, {
      x,
      y,
      id: userSequence.length,
      clicked: true,
      correct: isCorrect,
      time: clickTime
    }];

    setUserSequence(newUserSequence);

    if (!isCorrect || newUserSequence.length >= sequence.length) {
      // Level complete or incorrect
      const correct = newUserSequence.filter(s => s.correct).length;
      const total = sequence.length;
      const accuracy = (correct / total) * 100;
      const averageTime = newUserSequence.reduce((sum, s) => sum + s.time, 0) / newUserSequence.length;

      setScore(prev => ({
        correct: prev.correct + correct,
        total: prev.total + total,
        accuracy: ((prev.correct + correct) / (prev.total + total)) * 100,
        averageTime: (prev.averageTime + averageTime) / 2
      }));

      if (currentLevel >= maxLevel) {
        setPhase('complete');
        onComplete({
          correct: score.correct + correct,
          total: score.total + total,
          accuracy: ((score.correct + correct) / (score.total + total)) * 100,
          averageTime: (score.averageTime + averageTime) / 2,
          sequence: newUserSequence
        });
      } else {
        // Next level
        setTimeout(() => {
          setCurrentLevel(prev => prev + 1);
          const newSeq = generateSequence(currentLevel + 1);
          setSequence(newSeq);
          setUserSequence([]);
          setCurrentIndex(0);
          setPhase('memorize');
          showSequenceStep(newSeq, 0);
        }, 2000);
      }
    }
  };

  const renderGrid = () => {
    const gridSize = 4;
    const cells = [];

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const isInSequence = sequence.some(pos => pos.x === x && pos.y === y);
        const isCurrent = showSequence && currentIndex < sequence.length && 
                         sequence[currentIndex].x === x && sequence[currentIndex].y === y;
        const isClicked = userSequence.some(pos => pos.x === x && pos.y === y);
        const isCorrect = userSequence.find(pos => pos.x === x && pos.y === y)?.correct;

        cells.push(
          <div
            key={`${x}-${y}`}
            className={`
              w-16 h-16 border-2 rounded-lg cursor-pointer flex items-center justify-center transition-all duration-200
              ${isCurrent ? 'bg-yellow-400 border-yellow-600 scale-110' : ''}
              ${isClicked ? (isCorrect ? 'bg-green-400 border-green-600' : 'bg-red-400 border-red-600') : ''}
              ${!isCurrent && !isClicked ? 'bg-gray-200 border-gray-300 hover:bg-gray-300' : ''}
            `}
            onClick={() => handleGridClick(x, y)}
          >
            {isCurrent && <MapPin className="h-8 w-8 text-yellow-800" />}
            {isClicked && isCorrect && <CheckCircle className="h-8 w-8 text-green-800" />}
            {isClicked && !isCorrect && <XCircle className="h-8 w-8 text-red-800" />}
          </div>
        );
      }
    }

    return (
      <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
        {cells}
      </div>
    );
  };

  if (phase === 'instructions') {
    return (
      <div className="text-center p-8">
        <MapPin className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Spatial Memory Test</h3>
        <p className="text-gray-600 mb-4">
          Test your spatial memory by memorizing and recreating sequences of positions.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-blue-900 mb-2">Instructions:</h4>
          <ul className="text-sm text-blue-800 text-left space-y-1">
            <li>• Watch the sequence of highlighted positions</li>
            <li>• Click the positions in the same order</li>
            <li>• Sequence gets longer with each level</li>
            <li>• Complete {maxLevel} levels to finish</li>
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
          <div className="text-lg font-semibold text-gray-900">
            Level {currentLevel} of {maxLevel}
          </div>
        </div>
        
        {phase === 'memorize' && (
          <div className="text-blue-600 font-medium mb-4">
            <Eye className="h-5 w-5 inline mr-2" />
            Watch the sequence carefully
          </div>
        )}
        
        {phase === 'recall' && (
          <div className="text-green-600 font-medium mb-4">
            <EyeOff className="h-5 w-5 inline mr-2" />
            Now click the positions in order
          </div>
        )}
      </div>

      {renderGrid()}

      {phase === 'recall' && (
        <div className="mt-6">
          <div className="text-sm text-gray-600 mb-2">
            Progress: {userSequence.length} / {sequence.length}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(userSequence.length / sequence.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {phase === 'complete' && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-2">Test Complete!</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-green-700">Accuracy</div>
              <div className="font-bold text-lg">{Math.round(score.accuracy)}%</div>
            </div>
            <div>
              <div className="text-green-700">Average Time</div>
              <div className="font-bold text-lg">{Math.round(score.averageTime)}ms</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
