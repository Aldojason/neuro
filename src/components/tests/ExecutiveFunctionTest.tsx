import React, { useState, useEffect, useRef } from 'react';
import { Brain, Clock, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface StroopData {
  word: string;
  color: string;
  correctColor: string;
  response: string;
  isCorrect: boolean;
  reactionTime: number;
  timestamp: number;
}

interface ExecutiveFunctionTestProps {
  duration: number;
  onComplete: (data: StroopData[]) => void;
}

const colorWords = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'ORANGE'];
const colors = ['text-red-600', 'text-blue-600', 'text-green-600', 'text-yellow-600', 'text-purple-600', 'text-orange-600'];

export default function ExecutiveFunctionTest({ duration, onComplete }: ExecutiveFunctionTestProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [currentTrial, setCurrentTrial] = useState<{
    word: string;
    color: string;
    correctColor: string;
    startTime: number;
  } | null>(null);
  const [stroopData, setStroopData] = useState<StroopData[]>([]);
  const [score, setScore] = useState({ correct: 0, total: 0, accuracy: 0 });
  const [phase, setPhase] = useState<'instructions' | 'practice' | 'test' | 'complete'>('instructions');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const generateTrial = () => {
    const word = colorWords[Math.floor(Math.random() * colorWords.length)];
    const correctColor = colors[Math.floor(Math.random() * colors.length)];
    
    // 50% chance of congruent (word matches color) vs incongruent
    const isCongruent = Math.random() < 0.5;
    const color = isCongruent ? correctColor : colors[Math.floor(Math.random() * colors.length)];
    
    return {
      word,
      color,
      correctColor,
      startTime: Date.now()
    };
  };

  const startTest = () => {
    setIsActive(true);
    setTimeRemaining(duration);
    setStroopData([]);
    setScore({ correct: 0, total: 0, accuracy: 0 });
    setPhase('practice');
    setCurrentTrial(generateTrial());
  };

  const handleColorClick = (selectedColor: string) => {
    if (!currentTrial || !isActive) return;

    const reactionTime = Date.now() - currentTrial.startTime;
    const isCorrect = selectedColor === currentTrial.correctColor;
    
    const trialData: StroopData = {
      word: currentTrial.word,
      color: currentTrial.color,
      correctColor: currentTrial.correctColor,
      response: selectedColor,
      isCorrect,
      reactionTime,
      timestamp: Date.now()
    };

    setStroopData(prev => [...prev, trialData]);
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
      accuracy: ((prev.correct + (isCorrect ? 1 : 0)) / (prev.total + 1)) * 100
    }));

    // Generate next trial
    setCurrentTrial(generateTrial());
  };

  const completeTest = () => {
    setIsActive(false);
    setPhase('complete');
    onComplete(stroopData);
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

  const getColorName = (colorClass: string) => {
    const colorMap: { [key: string]: string } = {
      'text-red-600': 'RED',
      'text-blue-600': 'BLUE',
      'text-green-600': 'GREEN',
      'text-yellow-600': 'YELLOW',
      'text-purple-600': 'PURPLE',
      'text-orange-600': 'ORANGE'
    };
    return colorMap[colorClass] || 'UNKNOWN';
  };

  if (phase === 'instructions') {
    return (
      <div className="text-center p-8">
        <Brain className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Executive Function Test (Stroop)</h3>
        <p className="text-gray-600 mb-4">
          Test your executive function by identifying the color of the text, not the word itself.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-blue-900 mb-2">Instructions:</h4>
          <ul className="text-sm text-blue-800 text-left space-y-1">
            <li>• Look at the word displayed</li>
            <li>• Click the color of the text (not the word meaning)</li>
            <li>• Example: If you see "RED" in blue text, click BLUE</li>
            <li>• Test duration: {duration} seconds</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-yellow-900 mb-2">Example:</h4>
          <div className="text-2xl font-bold text-blue-600 mb-2">RED</div>
          <p className="text-sm text-yellow-800">The word says "RED" but it's blue, so click BLUE</p>
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

  if (phase === 'complete') {
    const congruentTrials = stroopData.filter(trial => trial.color === trial.correctColor);
    const incongruentTrials = stroopData.filter(trial => trial.color !== trial.correctColor);
    
    const congruentAccuracy = congruentTrials.length > 0 ? 
      (congruentTrials.filter(t => t.isCorrect).length / congruentTrials.length) * 100 : 0;
    const incongruentAccuracy = incongruentTrials.length > 0 ? 
      (incongruentTrials.filter(t => t.isCorrect).length / incongruentTrials.length) * 100 : 0;

    return (
      <div className="text-center p-8">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Test Complete!</h3>
          <p className="text-gray-600">Here are your results:</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Overall Accuracy</div>
            <div className="text-2xl font-bold text-blue-600">{Math.round(score.accuracy)}%</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Total Trials</div>
            <div className="text-2xl font-bold text-gray-600">{score.total}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Congruent</div>
            <div className="text-2xl font-bold text-green-600">{Math.round(congruentAccuracy)}%</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Incongruent</div>
            <div className="text-2xl font-bold text-red-600">{Math.round(incongruentAccuracy)}%</div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Executive Function Analysis</h4>
          <p className="text-sm text-gray-600">
            {incongruentAccuracy < congruentAccuracy - 10 
              ? "You show normal Stroop interference, indicating good executive function."
              : "You show minimal Stroop interference, suggesting excellent executive control."
            }
          </p>
        </div>
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
        <div className="text-lg font-medium text-gray-700 mb-4">
          Click the color of the text (not the word):
        </div>
      </div>

      {currentTrial && (
        <div className="mb-8">
          <div className={`text-6xl font-bold mb-8 ${currentTrial.color}`}>
            {currentTrial.word}
          </div>
          
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {colors.map((colorClass, index) => (
              <button
                key={index}
                onClick={() => handleColorClick(colorClass)}
                className={`p-4 rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-colors ${colorClass} font-bold text-lg`}
              >
                {getColorName(colorClass)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="bg-white p-3 rounded-lg">
          <div className="font-medium text-gray-900">Accuracy</div>
          <div className="text-xl font-bold text-blue-600">{Math.round(score.accuracy)}%</div>
        </div>
        <div className="bg-white p-3 rounded-lg">
          <div className="font-medium text-gray-900">Correct</div>
          <div className="text-xl font-bold text-green-600">{score.correct}</div>
        </div>
        <div className="bg-white p-3 rounded-lg">
          <div className="font-medium text-gray-900">Total</div>
          <div className="text-xl font-bold text-gray-600">{score.total}</div>
        </div>
      </div>
    </div>
  );
}
