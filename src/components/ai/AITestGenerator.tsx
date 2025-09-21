import React, { useState, useEffect } from 'react';
import { Brain, RefreshCw, Sparkles, CheckCircle, XCircle, Loader2, Lightbulb } from 'lucide-react';
import { geminiService, AITestQuestion, TestResult } from '../../services/geminiService';

interface AITestGeneratorProps {
  testType: string;
  userHistory: TestResult[];
  onQuestionGenerated?: (questions: AITestQuestion[]) => void;
}

export default function AITestGenerator({ testType, userHistory, onQuestionGenerated }: AITestGeneratorProps) {
  const [questions, setQuestions] = useState<AITestQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<number>(5);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    if (userHistory.length > 0) {
      generateQuestions();
    }
  }, [testType, userHistory]);

  const generateQuestions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const aiQuestions = await geminiService.generatePersonalizedQuestions(testType, userHistory);
      setQuestions(aiQuestions);
      onQuestionGenerated?.(aiQuestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate AI questions');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty >= 8) return 'text-red-600 bg-red-100';
    if (difficulty >= 6) return 'text-orange-600 bg-orange-100';
    if (difficulty >= 4) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty >= 8) return 'Expert';
    if (difficulty >= 6) return 'Advanced';
    if (difficulty >= 4) return 'Intermediate';
    return 'Beginner';
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm border">
        <div className="flex items-center justify-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-lg font-medium text-gray-700">Generating AI Questions...</span>
        </div>
        <p className="text-center text-gray-500 mt-2">
          Our AI is creating personalized questions based on your test history
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-3">
          <XCircle className="h-6 w-6 text-red-600" />
          <h3 className="text-lg font-semibold text-red-900">Generation Error</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={generateQuestions}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <Brain className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Questions Generated</h3>
        <p className="text-gray-500 mb-4">Complete some tests to get AI-generated questions</p>
        <button
          onClick={generateQuestions}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate Questions
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI-Generated Questions</h2>
              <p className="text-gray-600">Personalized for {testType} assessment</p>
            </div>
          </div>
          <button
            onClick={generateQuestions}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Regenerate</span>
          </button>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>Questions: {questions.length}</span>
          <span>•</span>
          <span>Type: {testType}</span>
          <span>•</span>
          <span>Based on {userHistory.length} previous tests</span>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-lg font-semibold text-gray-900">Question {index + 1}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                    {getDifficultyLabel(question.difficulty)} (Level {question.difficulty})
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {question.category}
                  </span>
                </div>
                <p className="text-gray-800 text-lg mb-4">{question.question}</p>
              </div>
            </div>

            {/* Options */}
            {question.options && question.options.length > 0 && (
              <div className="space-y-2 mb-4">
                {question.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      className="text-blue-600"
                    />
                    <span className="text-gray-700">{option}</span>
                    {showAnswers && option === question.correctAnswer && (
                      <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
                    )}
                  </label>
                ))}
              </div>
            )}

            {/* Answer and Explanation */}
            {showAnswers && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-900">Correct Answer:</span>
                  <span className="text-green-800">{question.correctAnswer}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <span className="font-semibold text-yellow-900">Explanation:</span>
                    <p className="text-yellow-800 text-sm mt-1">{question.explanation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAnswers(!showAnswers)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                showAnswers 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              {showAnswers ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
              <span>{showAnswers ? 'Hide' : 'Show'} Answers</span>
            </button>
          </div>
          
          <div className="text-sm text-gray-600">
            <span>Generated by AI • Personalized for your level</span>
          </div>
        </div>
      </div>

      {/* AI Features Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">AI-Powered Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div className="flex items-start space-x-2">
            <Brain className="h-4 w-4 text-blue-600 mt-0.5" />
            <span>Questions adapted to your performance level</span>
          </div>
          <div className="flex items-start space-x-2">
            <Sparkles className="h-4 w-4 text-blue-600 mt-0.5" />
            <span>Personalized based on your test history</span>
          </div>
          <div className="flex items-start space-x-2">
            <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
            <span>Detailed explanations for learning</span>
          </div>
          <div className="flex items-start space-x-2">
            <RefreshCw className="h-4 w-4 text-blue-600 mt-0.5" />
            <span>Regenerate questions anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
}
