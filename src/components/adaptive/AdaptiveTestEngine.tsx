import React, { useState, useEffect, useCallback } from 'react';
import { Brain, Target, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface TestItem {
  id: string;
  type: string;
  difficulty: number; // 1-10 scale
  content: any;
  expectedScore: number;
  timeLimit?: number;
}

interface PerformanceData {
  testId: string;
  score: number;
  timeSpent: number;
  accuracy: number;
  completedAt: string;
}

interface AdaptiveTestEngineProps {
  testType: string;
  onComplete: (results: PerformanceData[]) => void;
  onError: (error: string) => void;
}

interface DifficultyLevel {
  level: number;
  name: string;
  description: string;
  color: string;
  multiplier: number;
}

const difficultyLevels: DifficultyLevel[] = [
  { level: 1, name: 'Very Easy', description: 'Basic level', color: 'text-green-600', multiplier: 0.5 },
  { level: 2, name: 'Easy', description: 'Below average', color: 'text-green-500', multiplier: 0.7 },
  { level: 3, name: 'Below Average', description: 'Slightly below average', color: 'text-yellow-500', multiplier: 0.8 },
  { level: 4, name: 'Average', description: 'Standard difficulty', color: 'text-yellow-600', multiplier: 1.0 },
  { level: 5, name: 'Above Average', description: 'Slightly above average', color: 'text-orange-500', multiplier: 1.2 },
  { level: 6, name: 'Hard', description: 'Above average', color: 'text-orange-600', multiplier: 1.5 },
  { level: 7, name: 'Very Hard', description: 'High difficulty', color: 'text-red-500', multiplier: 1.8 },
  { level: 8, name: 'Expert', description: 'Very high difficulty', color: 'text-red-600', multiplier: 2.0 },
  { level: 9, name: 'Master', description: 'Extreme difficulty', color: 'text-purple-600', multiplier: 2.5 },
  { level: 10, name: 'Legendary', description: 'Maximum difficulty', color: 'text-purple-700', multiplier: 3.0 }
];

export default function AdaptiveTestEngine({ testType, onComplete, onError }: AdaptiveTestEngineProps) {
  const [currentDifficulty, setCurrentDifficulty] = useState(4); // Start at average
  const [testItems, setTestItems] = useState<TestItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [performanceHistory, setPerformanceHistory] = useState<PerformanceData[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [adaptiveStats, setAdaptiveStats] = useState({
    totalItems: 0,
    correctItems: 0,
    averageScore: 0,
    difficultyProgression: [] as number[]
  });

  const generateTestItem = useCallback((difficulty: number, index: number): TestItem => {
    const baseContent = generateBaseContent(testType);
    const difficultyMultiplier = difficultyLevels.find(d => d.level === difficulty)?.multiplier || 1.0;
    
    return {
      id: `${testType}_${index}`,
      type: testType,
      difficulty,
      content: applyDifficultyModifier(baseContent, difficulty, difficultyMultiplier),
      expectedScore: Math.round(50 + (difficulty * 5)), // Expected score based on difficulty
      timeLimit: calculateTimeLimit(testType, difficulty)
    };
  }, [testType]);

  const generateBaseContent = (type: string) => {
    switch (type) {
      case 'cognitive':
        return {
          question: 'What is 2 + 2?',
          options: ['3', '4', '5', '6'],
          correctAnswer: '4'
        };
      case 'reaction_time':
        return {
          targetSize: 20,
          displayTime: 1000,
          waitTime: 2000
        };
      case 'spatial_memory':
        return {
          sequenceLength: 3,
          gridSize: 3,
          displayTime: 1000
        };
      case 'executive_function':
        return {
          word: 'RED',
          color: 'blue',
          correctColor: 'blue'
        };
      default:
        return { question: 'Test question', answer: 'test' };
    }
  };

  const applyDifficultyModifier = (content: any, difficulty: number, multiplier: number) => {
    switch (testType) {
      case 'cognitive':
        return {
          ...content,
          question: generateMathQuestion(difficulty),
          options: generateMathOptions(difficulty),
          correctAnswer: calculateMathAnswer(difficulty)
        };
      case 'reaction_time':
        return {
          ...content,
          targetSize: Math.max(10, 20 - (difficulty * 2)),
          displayTime: Math.max(200, 1000 - (difficulty * 100)),
          waitTime: Math.max(500, 2000 - (difficulty * 150))
        };
      case 'spatial_memory':
        return {
          ...content,
          sequenceLength: Math.min(8, 3 + Math.floor(difficulty / 2)),
          gridSize: Math.min(6, 3 + Math.floor(difficulty / 3)),
          displayTime: Math.max(300, 1000 - (difficulty * 80))
        };
      case 'executive_function':
        return {
          ...content,
          word: generateStroopWord(difficulty),
          color: generateStroopColor(difficulty),
          correctColor: generateStroopCorrectColor(difficulty)
        };
      default:
        return content;
    }
  };

  const generateMathQuestion = (difficulty: number) => {
    const operations = ['+', '-', '*', '/'];
    const operation = operations[Math.floor(difficulty / 3) % operations.length];
    
    let a, b, question;
    switch (operation) {
      case '+':
        a = Math.floor(Math.random() * (10 + difficulty * 5));
        b = Math.floor(Math.random() * (10 + difficulty * 5));
        question = `What is ${a} + ${b}?`;
        break;
      case '-':
        a = Math.floor(Math.random() * (20 + difficulty * 10));
        b = Math.floor(Math.random() * (a + 1));
        question = `What is ${a} - ${b}?`;
        break;
      case '*':
        a = Math.floor(Math.random() * (5 + difficulty * 2));
        b = Math.floor(Math.random() * (5 + difficulty * 2));
        question = `What is ${a} × ${b}?`;
        break;
      case '/':
        a = Math.floor(Math.random() * (20 + difficulty * 10));
        b = Math.floor(Math.random() * (5 + difficulty)) + 1;
        a = a * b; // Ensure clean division
        question = `What is ${a} ÷ ${b}?`;
        break;
      default:
        question = 'What is 2 + 2?';
    }
    return question;
  };

  const generateMathOptions = (difficulty: number) => {
    const correctAnswer = calculateMathAnswer(difficulty);
    const options = [correctAnswer];
    
    // Generate wrong options
    while (options.length < 4) {
      const wrongAnswer = correctAnswer + Math.floor(Math.random() * 20) - 10;
      if (wrongAnswer !== correctAnswer && !options.includes(wrongAnswer)) {
        options.push(wrongAnswer);
      }
    }
    
    return options.sort(() => Math.random() - 0.5);
  };

  const calculateMathAnswer = (difficulty: number) => {
    // This would need to match the generateMathQuestion logic
    // For simplicity, returning a placeholder
    return Math.floor(Math.random() * 100);
  };

  const generateStroopWord = (difficulty: number) => {
    const words = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'ORANGE'];
    return words[Math.floor(Math.random() * words.length)];
  };

  const generateStroopColor = (difficulty: number) => {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const generateStroopCorrectColor = (difficulty: number) => {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const calculateTimeLimit = (type: string, difficulty: number) => {
    const baseTime = {
      cognitive: 30000,
      reaction_time: 30000,
      spatial_memory: 60000,
      executive_function: 45000
    };
    
    const base = baseTime[type as keyof typeof baseTime] || 30000;
    return Math.max(10000, base - (difficulty * 2000));
  };

  const adjustDifficulty = (performance: PerformanceData) => {
    const { score, accuracy } = performance;
    const currentLevel = difficultyLevels.find(d => d.level === currentDifficulty);
    
    let newDifficulty = currentDifficulty;
    
    if (score >= 90 && accuracy >= 0.9) {
      // Excellent performance - increase difficulty
      newDifficulty = Math.min(10, currentDifficulty + 1);
    } else if (score >= 70 && accuracy >= 0.7) {
      // Good performance - slight increase
      newDifficulty = Math.min(10, currentDifficulty + 0.5);
    } else if (score < 50 || accuracy < 0.5) {
      // Poor performance - decrease difficulty
      newDifficulty = Math.max(1, currentDifficulty - 1);
    } else if (score < 70 || accuracy < 0.7) {
      // Below average - slight decrease
      newDifficulty = Math.max(1, currentDifficulty - 0.5);
    }
    
    setCurrentDifficulty(Math.round(newDifficulty));
    setAdaptiveStats(prev => ({
      ...prev,
      difficultyProgression: [...prev.difficultyProgression, Math.round(newDifficulty)]
    }));
  };

  const startTest = () => {
    setIsActive(true);
    setIsCompleted(false);
    setCurrentItemIndex(0);
    setPerformanceHistory([]);
    setAdaptiveStats({
      totalItems: 0,
      correctItems: 0,
      averageScore: 0,
      difficultyProgression: [currentDifficulty]
    });
    
    // Generate initial test items
    const initialItems = Array.from({ length: 5 }, (_, i) => 
      generateTestItem(currentDifficulty, i)
    );
    setTestItems(initialItems);
  };

  const handleItemComplete = (result: PerformanceData) => {
    const newHistory = [...performanceHistory, result];
    setPerformanceHistory(newHistory);
    
    // Update adaptive stats
    setAdaptiveStats(prev => ({
      ...prev,
      totalItems: prev.totalItems + 1,
      correctItems: prev.correctItems + (result.accuracy >= 0.7 ? 1 : 0),
      averageScore: (prev.averageScore * prev.totalItems + result.score) / (prev.totalItems + 1)
    }));
    
    // Adjust difficulty based on performance
    adjustDifficulty(result);
    
    // Generate next item with adjusted difficulty
    if (currentItemIndex < 9) { // Limit to 10 items total
      const nextItem = generateTestItem(currentDifficulty, currentItemIndex + 1);
      setTestItems(prev => [...prev, nextItem]);
      setCurrentItemIndex(prev => prev + 1);
    } else {
      // Test completed
      setIsActive(false);
      setIsCompleted(true);
      onComplete(newHistory);
    }
  };

  const getCurrentDifficultyInfo = () => {
    return difficultyLevels.find(d => d.level === currentDifficulty) || difficultyLevels[3];
  };

  if (!isActive && !isCompleted) {
    return (
      <div className="text-center p-8">
        <Brain className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Adaptive {testType.charAt(0).toUpperCase() + testType.slice(1)} Test</h2>
        <p className="text-gray-600 mb-6">
          This test automatically adjusts difficulty based on your performance to find your optimal challenge level.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3">How it works:</h3>
          <ul className="text-sm text-blue-800 text-left space-y-1">
            <li>• Starts at moderate difficulty</li>
            <li>• Gets harder if you perform well</li>
            <li>• Gets easier if you struggle</li>
            <li>• Adapts in real-time to your ability</li>
            <li>• Provides accurate assessment of your level</li>
          </ul>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Starting Difficulty:</span>
            <span className="font-medium">{getCurrentDifficultyInfo().name}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Test Duration:</span>
            <span className="font-medium">~5-10 minutes</span>
          </div>
        </div>

        <button
          onClick={startTest}
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-medium"
        >
          Start Adaptive Test
        </button>
      </div>
    );
  }

  if (isCompleted) {
    const finalDifficulty = getCurrentDifficultyInfo();
    const accuracy = (adaptiveStats.correctItems / adaptiveStats.totalItems) * 100;
    
    return (
      <div className="text-center p-8">
        <div className="mb-6">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Adaptive Test Complete!</h2>
          <p className="text-gray-600">Your optimal difficulty level has been determined</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-gray-900">{finalDifficulty.name}</div>
            <div className="text-sm text-gray-600">Final Difficulty</div>
            <div className={`text-sm font-medium ${finalDifficulty.color} mt-1`}>
              Level {finalDifficulty.level}/10
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-gray-900">{Math.round(accuracy)}%</div>
            <div className="text-sm text-gray-600">Overall Accuracy</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-gray-900">{Math.round(adaptiveStats.averageScore)}</div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Difficulty Progression</h3>
          <div className="flex justify-center space-x-2">
            {adaptiveStats.difficultyProgression.map((level, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  level >= 7 ? 'bg-red-100 text-red-700' :
                  level >= 5 ? 'bg-orange-100 text-orange-700' :
                  level >= 3 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}
              >
                {level}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Assessment Summary</h4>
          <p className="text-sm text-gray-600">
            You completed {adaptiveStats.totalItems} test items and reached a difficulty level of {finalDifficulty.name}. 
            This represents your current ability level in {testType} assessments.
          </p>
        </div>
      </div>
    );
  }

  const currentItem = testItems[currentItemIndex];
  const difficultyInfo = getCurrentDifficultyInfo();

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Adaptive Test Progress</h3>
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">
              Item {currentItemIndex + 1} of 10
            </span>
          </div>
        </div>

        {/* Difficulty Indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">Current Difficulty:</span>
            <span className={`font-medium ${difficultyInfo.color}`}>
              {difficultyInfo.name} (Level {currentDifficulty})
            </span>
          </div>
          <div className="text-sm text-gray-600">
            {difficultyInfo.description}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentItemIndex + 1) / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Test Item */}
      {currentItem && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h4 className="font-semibold text-gray-900 mb-4">
            {testType.charAt(0).toUpperCase() + testType.slice(1)} Test Item
          </h4>
          <div className="border rounded-lg p-4">
            {/* This would render the actual test component based on testType */}
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Test item content would be rendered here</p>
              <p className="text-sm text-gray-500">
                Difficulty: {currentDifficulty}/10 | Time Limit: {currentItem.timeLimit ? Math.round(currentItem.timeLimit / 1000) : 'N/A'}s
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-lg font-bold text-gray-900">{adaptiveStats.correctItems}</div>
          <div className="text-sm text-gray-600">Correct</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-lg font-bold text-gray-900">{Math.round(adaptiveStats.averageScore)}</div>
          <div className="text-sm text-gray-600">Avg Score</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-lg font-bold text-gray-900">{currentDifficulty}</div>
          <div className="text-sm text-gray-600">Difficulty</div>
        </div>
      </div>
    </div>
  );
}
