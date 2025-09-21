import React, { useState, useEffect } from 'react';
import { Calculator, Clock, Target, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface NumberSequenceGameProps {
  onComplete: (data: any) => void;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface Sequence {
  numbers: number[];
  answer: number;
  pattern: string;
}

export default function NumberSequenceGame({ onComplete, difficulty = 'medium' }: NumberSequenceGameProps) {
  const [currentSequence, setCurrentSequence] = useState<Sequence | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions] = useState(10);

  const gameConfig = {
    easy: { timePerQuestion: 45, patterns: ['arithmetic', 'simple_geometric'] },
    medium: { timePerQuestion: 30, patterns: ['arithmetic', 'geometric', 'fibonacci'] },
    hard: { timePerQuestion: 20, patterns: ['arithmetic', 'geometric', 'fibonacci', 'prime', 'square'] }
  };

  const config = gameConfig[difficulty];

  const generateSequence = (): Sequence => {
    const pattern = config.patterns[Math.floor(Math.random() * config.patterns.length)];
    let numbers: number[] = [];
    let answer: number;
    let patternDescription: string;

    switch (pattern) {
      case 'arithmetic':
        const commonDiff = Math.floor(Math.random() * 5) + 1;
        const start = Math.floor(Math.random() * 10) + 1;
        numbers = [start, start + commonDiff, start + 2 * commonDiff, start + 3 * commonDiff];
        answer = start + 4 * commonDiff;
        patternDescription = `Arithmetic sequence (+${commonDiff})`;
        break;

      case 'geometric':
        const ratio = Math.floor(Math.random() * 3) + 2;
        const startGeo = Math.floor(Math.random() * 5) + 1;
        numbers = [startGeo, startGeo * ratio, startGeo * ratio * ratio, startGeo * ratio * ratio * ratio];
        answer = startGeo * ratio * ratio * ratio * ratio;
        patternDescription = `Geometric sequence (×${ratio})`;
        break;

      case 'fibonacci':
        const fibStart = Math.floor(Math.random() * 5) + 1;
        numbers = [fibStart, fibStart, fibStart * 2, fibStart * 3];
        answer = fibStart * 5;
        patternDescription = `Fibonacci-like sequence`;
        break;

      case 'prime':
        const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
        const startIndex = Math.floor(Math.random() * 4);
        numbers = primes.slice(startIndex, startIndex + 4);
        answer = primes[startIndex + 4];
        patternDescription = `Prime numbers`;
        break;

      case 'square':
        const base = Math.floor(Math.random() * 5) + 1;
        numbers = [base * base, (base + 1) * (base + 1), (base + 2) * (base + 2), (base + 3) * (base + 3)];
        answer = (base + 4) * (base + 4);
        patternDescription = `Perfect squares`;
        break;

      default:
        numbers = [1, 2, 3, 4];
        answer = 5;
        patternDescription = `Simple sequence`;
    }

    return { numbers, answer, pattern: patternDescription };
  };

  useEffect(() => {
    if (gameStarted && !gameCompleted) {
      setCurrentSequence(generateSequence());
    }
  }, [gameStarted, currentQuestion]);

  useEffect(() => {
    if (gameStarted && !gameCompleted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameCompleted) {
      handleNextQuestion();
    }
  }, [gameStarted, timeLeft, gameCompleted]);

  const handleAnswerSubmit = () => {
    if (!userAnswer.trim()) return;

    const isCorrect = parseInt(userAnswer) === currentSequence?.answer;
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setScore(prev => prev + 10);
    }

    if (currentQuestion >= totalQuestions) {
      completeGame();
    } else {
      handleNextQuestion();
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestion(prev => prev + 1);
    setTimeLeft(config.timePerQuestion);
    setUserAnswer('');
    setCurrentSequence(generateSequence());
  };

  const completeGame = () => {
    setGameCompleted(true);
    setGameStarted(false);
    
    const accuracy = (correctAnswers / totalQuestions) * 100;
    const finalScore = Math.round(score + (accuracy * 0.5));

    onComplete({
      gameType: 'number_sequence',
      difficulty,
      score: finalScore,
      correctAnswers,
      totalQuestions,
      accuracy,
      completed: true
    });
  };

  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(config.timePerQuestion);
    setCurrentSequence(generateSequence());
  };

  const resetGame = () => {
    setScore(0);
    setCurrentQuestion(1);
    setCorrectAnswers(0);
    setUserAnswer('');
    setGameCompleted(false);
    setGameStarted(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <Calculator className="h-8 w-8 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Number Sequence Game</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Find the pattern and predict the next number in the sequence!
        </p>
        
        {!gameStarted && !gameCompleted && (
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-blue-900 mb-2">Game Rules:</h3>
            <ul className="text-sm text-blue-800 text-left max-w-md mx-auto">
              <li>• Look for patterns in the number sequence</li>
              <li>• Enter the next number that should appear</li>
              <li>• You have {config.timePerQuestion} seconds per question</li>
              <li>• Complete {totalQuestions} questions to finish</li>
            </ul>
          </div>
        )}
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Clock className="h-4 w-4 text-gray-600 mr-1" />
            <span className="text-sm font-medium text-gray-600">Time</span>
          </div>
          <span className={`text-lg font-bold ${timeLeft < 5 ? 'text-red-600' : 'text-gray-900'}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Target className="h-4 w-4 text-gray-600 mr-1" />
            <span className="text-sm font-medium text-gray-600">Question</span>
          </div>
          <span className="text-lg font-bold text-gray-900">{currentQuestion}/{totalQuestions}</span>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <CheckCircle className="h-4 w-4 text-gray-600 mr-1" />
            <span className="text-sm font-medium text-gray-600">Correct</span>
          </div>
          <span className="text-lg font-bold text-gray-900">{correctAnswers}</span>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Calculator className="h-4 w-4 text-gray-600 mr-1" />
            <span className="text-sm font-medium text-gray-600">Score</span>
          </div>
          <span className="text-lg font-bold text-gray-900">{score}</span>
        </div>
      </div>

      {/* Game Content */}
      {gameStarted && currentSequence && !gameCompleted && (
        <div className="mb-6">
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Find the next number:</h3>
            <div className="flex justify-center items-center space-x-4 mb-6">
              {currentSequence.numbers.map((number, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-16 h-16 bg-blue-100 border-2 border-blue-300 rounded-lg flex items-center justify-center text-xl font-bold text-blue-800">
                    {number}
                  </div>
                  {index < currentSequence.numbers.length - 1 && (
                    <span className="text-2xl text-gray-400 mx-2">→</span>
                  )}
                </div>
              ))}
              <span className="text-2xl text-gray-400 mx-2">→</span>
              <div className="w-16 h-16 bg-yellow-100 border-2 border-yellow-300 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-yellow-800">?</span>
              </div>
            </div>
            
            <div className="flex justify-center items-center space-x-4">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter answer"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-center"
                autoFocus
              />
              <button
                onClick={handleAnswerSubmit}
                disabled={!userAnswer.trim()}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Controls */}
      <div className="text-center">
        {!gameStarted && !gameCompleted && (
          <button
            onClick={startGame}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-lg transition-colors"
          >
            Start Game
          </button>
        )}
        
        {gameCompleted && (
          <div className="space-y-4">
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-8 w-8 text-green-600 mr-2" />
                <h3 className="text-xl font-bold text-green-900">Game Completed!</h3>
              </div>
              <p className="text-green-800 mb-4">Final Score: {score}/100</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Accuracy:</span>
                  <br />
                  {Math.round((correctAnswers / totalQuestions) * 100)}%
                </div>
                <div>
                  <span className="font-medium">Correct Answers:</span>
                  <br />
                  {correctAnswers}/{totalQuestions}
                </div>
              </div>
            </div>
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
