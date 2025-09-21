import React, { useState, useEffect, useCallback } from 'react';
import { Brain, Clock, Target, CheckCircle, XCircle } from 'lucide-react';

interface MemoryGameProps {
  onComplete: (data: any) => void;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryGame({ onComplete, difficulty = 'medium' }: MemoryGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const symbols = ['🎯', '🧠', '⭐', '💎', '🎪', '🎨', '🎵', '🌟'];
  const gameConfig = {
    easy: { pairs: 4, timeLimit: 90 },
    medium: { pairs: 6, timeLimit: 60 },
    hard: { pairs: 8, timeLimit: 45 }
  };

  const config = gameConfig[difficulty];

  const initializeGame = useCallback(() => {
    const gameSymbols = symbols.slice(0, config.pairs);
    const gameCards = [...gameSymbols, ...gameSymbols]
      .map((symbol, index) => ({
        id: index,
        value: symbol,
        isFlipped: false,
        isMatched: false
      }))
      .sort(() => Math.random() - 0.5);

    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setTimeLeft(config.timeLimit);
    setGameStarted(false);
    setGameCompleted(false);
    setScore(0);
  }, [config.pairs, config.timeLimit]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (gameStarted && !gameCompleted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameCompleted) {
      completeGame();
    }
  }, [gameStarted, timeLeft, gameCompleted]);

  const handleCardClick = (cardId: number) => {
    if (!gameStarted) return;
    if (flippedCards.length >= 2) return;
    if (cards.find(card => card.id === cardId)?.isFlipped || cards.find(card => card.id === cardId)?.isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setCards(prevCards =>
      prevCards.map(card =>
        card.id === cardId ? { ...card, isFlipped: true } : card
      )
    );

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      setTimeout(() => {
        const [firstId, secondId] = newFlippedCards;
        const firstCard = cards.find(card => card.id === firstId);
        const secondCard = cards.find(card => card.id === secondId);

        if (firstCard && secondCard && firstCard.value === secondCard.value) {
          // Match found
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstId || card.id === secondId
                ? { ...card, isMatched: true, isFlipped: false }
                : card
            )
          );
          setMatches(prev => prev + 1);
        } else {
          // No match, flip cards back
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstId || card.id === secondId
                ? { ...card, isFlipped: false }
                : card
            )
          );
        }
        setFlippedCards([]);
      }, 1000);
    }
  };

  const completeGame = () => {
    setGameCompleted(true);
    setGameStarted(false);
    
    // Calculate score based on matches, moves, and time left
    const accuracy = (matches / config.pairs) * 100;
    const efficiency = (config.pairs / moves) * 100;
    const timeBonus = (timeLeft / config.timeLimit) * 100;
    
    const finalScore = Math.round((accuracy * 0.5) + (efficiency * 0.3) + (timeBonus * 0.2));
    setScore(finalScore);

    onComplete({
      gameType: 'memory_game',
      difficulty,
      score: finalScore,
      moves,
      matches,
      accuracy: (matches / config.pairs) * 100,
      timeLeft,
      completed: true
    });
  };

  useEffect(() => {
    if (matches === config.pairs && gameStarted) {
      completeGame();
    }
  }, [matches, config.pairs, gameStarted]);

  const startGame = () => {
    setGameStarted(true);
  };

  const resetGame = () => {
    initializeGame();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <Brain className="h-8 w-8 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Memory Game</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Match pairs of symbols by clicking on cards. Remember their positions!
        </p>
        
        {!gameStarted && !gameCompleted && (
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-blue-900 mb-2">Game Rules:</h3>
            <ul className="text-sm text-blue-800 text-left max-w-md mx-auto">
              <li>• Find {config.pairs} pairs of matching symbols</li>
              <li>• Click cards to flip them and see their symbols</li>
              <li>• Match pairs to score points</li>
              <li>• Complete before time runs out!</li>
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
          <span className={`text-lg font-bold ${timeLeft < 10 ? 'text-red-600' : 'text-gray-900'}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Target className="h-4 w-4 text-gray-600 mr-1" />
            <span className="text-sm font-medium text-gray-600">Moves</span>
          </div>
          <span className="text-lg font-bold text-gray-900">{moves}</span>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <CheckCircle className="h-4 w-4 text-gray-600 mr-1" />
            <span className="text-sm font-medium text-gray-600">Matches</span>
          </div>
          <span className="text-lg font-bold text-gray-900">{matches}/{config.pairs}</span>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Brain className="h-4 w-4 text-gray-600 mr-1" />
            <span className="text-sm font-medium text-gray-600">Score</span>
          </div>
          <span className="text-lg font-bold text-gray-900">{score}</span>
        </div>
      </div>

      {/* Game Board */}
      <div className="mb-6">
        <div className={`grid gap-3 mx-auto ${
          config.pairs === 4 ? 'grid-cols-4' : 
          config.pairs === 6 ? 'grid-cols-4' : 
          'grid-cols-4'
        }`} style={{ maxWidth: '400px' }}>
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={!gameStarted || gameCompleted}
              className={`aspect-square rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                card.isMatched
                  ? 'bg-green-100 border-green-300 text-green-800'
                  : card.isFlipped
                  ? 'bg-white border-blue-300 text-gray-900'
                  : 'bg-blue-100 border-blue-300 text-blue-600 hover:bg-blue-200'
              } ${!gameStarted || gameCompleted ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-center h-full text-2xl">
                {card.isFlipped || card.isMatched ? card.value : '?'}
              </div>
            </button>
          ))}
        </div>
      </div>

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
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Accuracy:</span>
                  <br />
                  {Math.round((matches / config.pairs) * 100)}%
                </div>
                <div>
                  <span className="font-medium">Efficiency:</span>
                  <br />
                  {Math.round((config.pairs / moves) * 100)}%
                </div>
                <div>
                  <span className="font-medium">Time Bonus:</span>
                  <br />
                  {Math.round((timeLeft / config.timeLimit) * 100)}%
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
