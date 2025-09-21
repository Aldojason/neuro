import React, { useState, useEffect } from 'react';
import { MessageSquare, Clock, Target, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface WordAssociationGameProps {
  onComplete: (data: any) => void;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface WordPair {
  word: string;
  associations: string[];
  correctAnswer: string;
  category: string;
}

export default function WordAssociationGame({ onComplete, difficulty = 'medium' }: WordAssociationGameProps) {
  const [currentWordPair, setCurrentWordPair] = useState<WordPair | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions] = useState(8);

  const gameConfig = {
    easy: { timePerQuestion: 45, categories: ['basic', 'colors', 'animals'] },
    medium: { timePerQuestion: 30, categories: ['basic', 'colors', 'animals', 'professions', 'emotions'] },
    hard: { timePerQuestion: 20, categories: ['basic', 'colors', 'animals', 'professions', 'emotions', 'abstract', 'science'] }
  };

  const config = gameConfig[difficulty];

  const wordPairs: WordPair[] = [
    // Basic associations
    { word: 'Apple', associations: ['Red', 'Fruit', 'Tree', 'Sweet'], correctAnswer: 'Fruit', category: 'basic' },
    { word: 'Sun', associations: ['Hot', 'Yellow', 'Day', 'Bright'], correctAnswer: 'Bright', category: 'basic' },
    { word: 'Book', associations: ['Pages', 'Read', 'Library', 'Story'], correctAnswer: 'Read', category: 'basic' },
    
    // Colors
    { word: 'Sky', associations: ['Blue', 'Clouds', 'High', 'Weather'], correctAnswer: 'Blue', category: 'colors' },
    { word: 'Grass', associations: ['Green', 'Ground', 'Nature', 'Soft'], correctAnswer: 'Green', category: 'colors' },
    { word: 'Snow', associations: ['White', 'Cold', 'Winter', 'Soft'], correctAnswer: 'White', category: 'colors' },
    
    // Animals
    { word: 'Dog', associations: ['Bark', 'Pet', 'Loyal', 'Four legs'], correctAnswer: 'Pet', category: 'animals' },
    { word: 'Bird', associations: ['Fly', 'Wings', 'Sky', 'Sing'], correctAnswer: 'Fly', category: 'animals' },
    { word: 'Fish', associations: ['Swim', 'Water', 'Gills', 'Scales'], correctAnswer: 'Swim', category: 'animals' },
    
    // Professions
    { word: 'Doctor', associations: ['Heal', 'Hospital', 'Medicine', 'White coat'], correctAnswer: 'Heal', category: 'professions' },
    { word: 'Teacher', associations: ['Educate', 'School', 'Students', 'Knowledge'], correctAnswer: 'Educate', category: 'professions' },
    { word: 'Chef', associations: ['Cook', 'Kitchen', 'Food', 'Recipe'], correctAnswer: 'Cook', category: 'professions' },
    
    // Emotions
    { word: 'Happy', associations: ['Smile', 'Joy', 'Laugh', 'Positive'], correctAnswer: 'Joy', category: 'emotions' },
    { word: 'Sad', associations: ['Cry', 'Tears', 'Down', 'Negative'], correctAnswer: 'Cry', category: 'emotions' },
    { word: 'Angry', associations: ['Mad', 'Frustrated', 'Red', 'Fight'], correctAnswer: 'Mad', category: 'emotions' },
    
    // Abstract
    { word: 'Freedom', associations: ['Liberty', 'Choice', 'Independent', 'Unrestricted'], correctAnswer: 'Liberty', category: 'abstract' },
    { word: 'Wisdom', associations: ['Knowledge', 'Experience', 'Understanding', 'Insight'], correctAnswer: 'Understanding', category: 'abstract' },
    
    // Science
    { word: 'Gravity', associations: ['Pull', 'Mass', 'Down', 'Physics'], correctAnswer: 'Pull', category: 'science' },
    { word: 'Photosynthesis', associations: ['Plants', 'Sunlight', 'Oxygen', 'Green'], correctAnswer: 'Plants', category: 'science' }
  ];

  const generateQuestion = (): WordPair => {
    const availablePairs = wordPairs.filter(pair => 
      config.categories.includes(pair.category)
    );
    return availablePairs[Math.floor(Math.random() * availablePairs.length)];
  };

  useEffect(() => {
    if (gameStarted && !gameCompleted) {
      setCurrentWordPair(generateQuestion());
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

    const isCorrect = selectedAnswer === currentWordPair?.correctAnswer;
    
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
    setCurrentWordPair(generateQuestion());
  };

  const completeGame = () => {
    setGameCompleted(true);
    setGameStarted(false);
    
    const accuracy = (correctAnswers / totalQuestions) * 100;
    const finalScore = Math.round(score + (accuracy * 0.5));

    onComplete({
      gameType: 'word_association',
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
    setCurrentWordPair(generateQuestion());
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
          <MessageSquare className="h-8 w-8 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Word Association Game</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Choose the word that best associates with the given word!
        </p>
        
        {!gameStarted && !gameCompleted && (
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-blue-900 mb-2">Game Rules:</h3>
            <ul className="text-sm text-blue-800 text-left max-w-md mx-auto">
              <li>• Look at the given word</li>
              <li>• Choose the best associated word from the options</li>
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
            <MessageSquare className="h-4 w-4 text-gray-600 mr-1" />
            <span className="text-sm font-medium text-gray-600">Score</span>
          </div>
          <span className="text-lg font-bold text-gray-900">{score}</span>
        </div>
      </div>

      {/* Game Content */}
      {gameStarted && currentWordPair && !gameCompleted && (
        <div className="mb-6">
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Which word best associates with:
            </h3>
            <div className="text-4xl font-bold text-blue-600 mb-8">
              {currentWordPair.word}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {currentWordPair.associations.map((association, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(association)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedAnswer === association
                      ? 'bg-blue-100 border-blue-500 text-blue-800'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg font-medium">{association}</span>
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
