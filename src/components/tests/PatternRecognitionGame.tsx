import React, { useState, useEffect } from 'react';
import { Eye, Clock, Target, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface PatternRecognitionGameProps {
  onComplete: (data: any) => void;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface Pattern {
  sequence: string[];
  answer: string;
  patternType: string;
}

export default function PatternRecognitionGame({ onComplete, difficulty = 'medium' }: PatternRecognitionGameProps) {
  const [currentPattern, setCurrentPattern] = useState<Pattern | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions] = useState(8);

  const gameConfig = {
    easy: { timePerQuestion: 45, patterns: ['color', 'shape', 'size'] },
    medium: { timePerQuestion: 30, patterns: ['color', 'shape', 'size', 'position', 'rotation'] },
    hard: { timePerQuestion: 20, patterns: ['color', 'shape', 'size', 'position', 'rotation', 'complex'] }
  };

  const config = gameConfig[difficulty];

  const generatePattern = (): Pattern => {
    const patternType = config.patterns[Math.floor(Math.random() * config.patterns.length)];
    let sequence: string[] = [];
    let answer: string;

    switch (patternType) {
      case 'color':
        const colors = ['🔴', '🟡', '🔵', '🟢', '🟣', '🟠'];
        const colorPattern = colors.slice(0, 3);
        sequence = [...colorPattern, '?'];
        answer = colorPattern[0]; // Repeat the pattern
        break;

      case 'shape':
        const shapes = ['🔺', '🔻', '🔸', '🔹', '🔶', '🔷'];
        const shapePattern = shapes.slice(0, 3);
        sequence = [...shapePattern, '?'];
        answer = shapePattern[0];
        break;

      case 'size':
        const sizes = ['🔸', '🔶', '🔸', '🔶']; // Small, Big, Small, Big
        sequence = sizes.slice(0, 3);
        answer = '🔸'; // Small
        break;

      case 'position':
        const positions = ['⬆️', '➡️', '⬇️', '⬅️'];
        const posPattern = positions.slice(0, 3);
        sequence = [...posPattern, '?'];
        answer = posPattern[0];
        break;

      case 'rotation':
        const rotations = ['↗️', '↘️', '↙️', '↖️'];
        const rotPattern = rotations.slice(0, 3);
        sequence = [...rotPattern, '?'];
        answer = rotPattern[0];
        break;

      case 'complex':
        const complex = ['🔴', '🔺', '🟡', '🔻', '🔵', '🔸'];
        const complexPattern = complex.slice(0, 5);
        sequence = [...complexPattern, '?'];
        answer = complexPattern[0];
        break;

      default:
        sequence = ['🔴', '🟡', '🔵', '?'];
        answer = '🔴';
    }

    return { sequence, answer, patternType };
  };

  const getAnswerOptions = (pattern: Pattern): string[] => {
    const allOptions = ['🔴', '🟡', '🔵', '🟢', '🟣', '🟠', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '⬆️', '➡️', '⬇️', '⬅️', '↗️', '↘️', '↙️', '↖️'];
    const correctAnswer = pattern.answer;
    const wrongAnswers = allOptions.filter(option => option !== correctAnswer);
    
    // Shuffle and take 3 wrong answers
    const shuffledWrong = wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 3);
    
    // Combine correct answer with wrong answers and shuffle
    return [correctAnswer, ...shuffledWrong].sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    if (gameStarted && !gameCompleted) {
      setCurrentPattern(generatePattern());
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

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === currentPattern?.answer;
    
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
    setSelectedAnswer('');
    setCurrentPattern(generatePattern());
  };

  const completeGame = () => {
    setGameCompleted(true);
    setGameStarted(false);
    
    const accuracy = (correctAnswers / totalQuestions) * 100;
    const finalScore = Math.round(score + (accuracy * 0.5));

    onComplete({
      gameType: 'pattern_recognition',
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
    setCurrentPattern(generatePattern());
  };

  const resetGame = () => {
    setScore(0);
    setCurrentQuestion(1);
    setCorrectAnswers(0);
    setSelectedAnswer('');
    setGameCompleted(false);
    setGameStarted(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <Eye className="h-8 w-8 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Pattern Recognition Game</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Identify the pattern and choose what comes next!
        </p>
        
        {!gameStarted && !gameCompleted && (
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-blue-900 mb-2">Game Rules:</h3>
            <ul className="text-sm text-blue-800 text-left max-w-md mx-auto">
              <li>• Look at the sequence of symbols</li>
              <li>• Identify the pattern or rule</li>
              <li>• Choose what should come next</li>
              <li>• You have {config.timePerQuestion} seconds per question</li>
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
            <Eye className="h-4 w-4 text-gray-600 mr-1" />
            <span className="text-sm font-medium text-gray-600">Score</span>
          </div>
          <span className="text-lg font-bold text-gray-900">{score}</span>
        </div>
      </div>

      {/* Game Content */}
      {gameStarted && currentPattern && !gameCompleted && (
        <div className="mb-6">
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-6">What comes next in this pattern?</h3>
            
            <div className="flex justify-center items-center space-x-4 mb-8">
              {currentPattern.sequence.map((symbol, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-16 h-16 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center text-2xl">
                    {symbol}
                  </div>
                  {index < currentPattern.sequence.length - 1 && (
                    <span className="text-2xl text-gray-400 mx-2">→</span>
                  )}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              {getAnswerOptions(currentPattern).map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={`p-4 rounded-lg border-2 transition-all text-2xl ${
                    selectedAnswer === option
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            
            <button
              onClick={handleAnswerSubmit}
              disabled={!selectedAnswer}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium text-lg transition-colors"
            >
              Submit Answer
            </button>
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
