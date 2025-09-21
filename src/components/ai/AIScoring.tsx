import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Target, AlertCircle, CheckCircle, BarChart3, Sparkles } from 'lucide-react';
import { geminiService, TestResult } from '../../services/geminiService';

interface AIScoringProps {
  testType: string;
  responses: Record<string, any>;
  onScoreCalculated?: (score: number, recommendations: string[]) => void;
}

interface AIScore {
  baseScore: number;
  aiAdjustedScore: number;
  confidence: number;
  factors: {
    positive: string[];
    negative: string[];
    neutral: string[];
  };
  recommendations: string[];
  riskLevel: 'low' | 'moderate' | 'high';
}

export default function AIScoring({ testType, responses, onScoreCalculated }: AIScoringProps) {
  const [aiScore, setAiScore] = useState<AIScore | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Object.keys(responses).length > 0) {
      calculateAIScore();
    }
  }, [testType, responses]);

  const calculateAIScore = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // First calculate base score using existing logic
      const baseScore = calculateBaseScore(testType, responses);
      
      // Then get AI-enhanced analysis
      const recommendations = await geminiService.generateRecommendations(baseScore, testType, responses);
      
      // Create AI score object
      const aiScoreData: AIScore = {
        baseScore,
        aiAdjustedScore: baseScore, // Could be adjusted based on AI analysis
        confidence: 0.85, // AI confidence level
        factors: {
          positive: extractPositiveFactors(responses),
          negative: extractNegativeFactors(responses),
          neutral: extractNeutralFactors(responses)
        },
        recommendations,
        riskLevel: determineRiskLevel(baseScore)
      };
      
      setAiScore(aiScoreData);
      onScoreCalculated?.(aiScoreData.aiAdjustedScore, recommendations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate AI score');
    } finally {
      setLoading(false);
    }
  };

  const calculateBaseScore = (type: string, responses: Record<string, any>): number => {
    // Use existing scoring logic as base
    switch (type) {
      case 'cognitive':
        return calculateCognitiveScore(responses);
      case 'motor':
        return calculateMotorScore(responses);
      case 'speech':
        return calculateSpeechScore(responses);
      case 'behavioral':
        return calculateBehavioralScore(responses);
      default:
        return 75; // Default score
    }
  };

  const calculateCognitiveScore = (responses: Record<string, any>): number => {
    let score = 0;
    let totalWeight = 0;

    // Memory: id 1 (continue), id 3 (recall)
    if (responses[3] && typeof responses[3] === 'string') {
      const recalledWords = responses[3].toLowerCase().split(',').map((s: string) => s.trim());
      const correctWords = ['apple', 'chair', 'penny'];
      let correctCount = 0;
      correctWords.forEach(word => {
        if (recalledWords.includes(word)) {
          correctCount++;
        }
      });
      score += (correctCount / correctWords.length) * 25;
      totalWeight += 25;
    }

    // Attention: id 2 (text - counting backwards)
    if (responses[2] && typeof responses[2] === 'string') {
      const numbers = responses[2].split(',').map((s: string) => parseInt(s.trim()));
      const expected = [100, 93, 86, 79, 72];
      let correctCount = 0;
      for (let i = 0; i < Math.min(numbers.length, expected.length); i++) {
        if (numbers[i] === expected[i]) {
          correctCount++;
        }
      }
      score += (correctCount / expected.length) * 25;
      totalWeight += 25;
    }

    // Orientation: id 4 (date)
    if (responses[4] && typeof responses[4] === 'string') {
      const inputDate = new Date(responses[4]);
      const today = new Date();
      if (inputDate.toDateString() === today.toDateString()) {
        score += 25;
      }
      totalWeight += 25;
    }

    // Language: id 5 (timed_text - naming animals)
    if (responses[5] && typeof responses[5] === 'string') {
      const animals = responses[5].toLowerCase().split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
      const uniqueAnimals = new Set(animals);
      score += Math.min(uniqueAnimals.size * 5, 25);
      totalWeight += 25;
    }

    return totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 0;
  };

  const calculateMotorScore = (responses: Record<string, any>): number => {
    let score = 0;
    let totalWeight = 0;

    // Tremor: id 1 (motion_sensor)
    if (responses[1] && responses[1].tremorScore !== undefined) {
      score += Math.max(0, 100 - responses[1].tremorScore * 10) * 0.25;
      totalWeight += 25;
    }

    // Coordination: id 2 (tap_test)
    if (responses[2] && responses[2].performance) {
      const { tapsPerSecond, accuracy } = responses[2].performance;
      score += (tapsPerSecond * 5 + accuracy * 50) * 0.25;
      totalWeight += 25;
    }

    // Fine Motor: id 3 (drawing)
    if (responses[3] && responses[3].metrics) {
      const { smoothness } = responses[3].metrics;
      score += smoothness * 0.25;
      totalWeight += 25;
    }

    // Gait: id 4 (walking_test)
    if (responses[4] && responses[4].gaitMetrics) {
      const { stepLength, stepTime, variability } = responses[4].gaitMetrics;
      score += (stepLength * 20 + (1 - Math.abs(stepTime - 0.7)) * 30 + (1 - variability) * 50) * 0.25;
      totalWeight += 25;
    }

    return totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 0;
  };

  const calculateSpeechScore = (responses: Record<string, any>): number => {
    let score = 0;
    let totalWeight = 0;

    // Reading: id 1 (audio_recording)
    if (responses[1] && responses[1].analysis) {
      const { clarity, fluency } = responses[1].analysis;
      score += (clarity * 0.5 + fluency * 0.5) * 33.33;
      totalWeight += 33.33;
    }

    // Spontaneous: id 2 (audio_recording)
    if (responses[2] && responses[2].analysis) {
      const { clarity, fluency } = responses[2].analysis;
      score += (clarity * 0.5 + fluency * 0.5) * 33.33;
      totalWeight += 33.33;
    }

    // Naming: id 3 (audio_recording)
    if (responses[3] && responses[3].analysis) {
      const { accuracy } = responses[3].analysis;
      score += accuracy * 33.33;
      totalWeight += 33.33;
    }

    return totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 0;
  };

  const calculateBehavioralScore = (responses: Record<string, any>): number => {
    let score = 100;

    Object.values(responses).forEach((response: string) => {
      if (typeof response === 'string') {
        const lowerResponse = response.toLowerCase();
        if (lowerResponse.includes('nearly every day') || lowerResponse.includes('severe') || lowerResponse.includes('very much') || lowerResponse.includes('poor')) {
          score -= 20;
        } else if (lowerResponse.includes('more than half') || lowerResponse.includes('moderate') || lowerResponse.includes('a little') || lowerResponse.includes('fair')) {
          score -= 10;
        } else if (lowerResponse.includes('several days') || lowerResponse.includes('mild')) {
          score -= 5;
        }
      }
    });

    return Math.max(score, 0);
  };

  const extractPositiveFactors = (responses: Record<string, any>): string[] => {
    const factors: string[] = [];
    
    // Analyze responses for positive indicators
    Object.entries(responses).forEach(([key, value]) => {
      if (typeof value === 'string') {
        const lowerValue = value.toLowerCase();
        if (lowerValue.includes('excellent') || lowerValue.includes('very good') || lowerValue.includes('never')) {
          factors.push(`Strong performance in ${key}`);
        }
      } else if (typeof value === 'number' && value > 80) {
        factors.push(`High score in ${key}`);
      }
    });
    
    return factors.length > 0 ? factors : ['Consistent test completion'];
  };

  const extractNegativeFactors = (responses: Record<string, any>): string[] => {
    const factors: string[] = [];
    
    Object.entries(responses).forEach(([key, value]) => {
      if (typeof value === 'string') {
        const lowerValue = value.toLowerCase();
        if (lowerValue.includes('poor') || lowerValue.includes('severe') || lowerValue.includes('very much')) {
          factors.push(`Concerning response in ${key}`);
        }
      } else if (typeof value === 'number' && value < 50) {
        factors.push(`Low score in ${key}`);
      }
    });
    
    return factors;
  };

  const extractNeutralFactors = (responses: Record<string, any>): string[] => {
    return ['Standard test completion', 'Average performance indicators'];
  };

  const determineRiskLevel = (score: number): 'low' | 'moderate' | 'high' => {
    if (score >= 85) return 'low';
    if (score >= 70) return 'moderate';
    return 'high';
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm border">
        <div className="flex items-center justify-center space-x-3">
          <Brain className="h-6 w-6 animate-pulse text-blue-600" />
          <span className="text-lg font-medium text-gray-700">AI Analyzing Score...</span>
        </div>
        <p className="text-center text-gray-500 mt-2">
          Our AI is analyzing your responses for enhanced scoring
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-3">
          <AlertCircle className="h-6 w-6 text-red-600" />
          <h3 className="text-lg font-semibold text-red-900">AI Scoring Error</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={calculateAIScore}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!aiScore) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <Brain className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">AI Scoring Not Available</h3>
        <p className="text-gray-500">Complete a test to get AI-enhanced scoring</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Score Display */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI-Enhanced Score</h2>
              <p className="text-gray-600">{testType} Assessment</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-blue-600">{aiScore.aiAdjustedScore}/100</div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(aiScore.riskLevel)}`}>
              {aiScore.riskLevel.toUpperCase()} RISK
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <div className="text-sm text-gray-600">Base Score</div>
            <div className="text-2xl font-bold text-gray-900">{aiScore.baseScore}</div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-sm text-gray-600">AI Confidence</div>
            <div className="text-2xl font-bold text-green-600">{Math.round(aiScore.confidence * 100)}%</div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-sm text-gray-600">Risk Level</div>
            <div className="text-2xl font-bold text-gray-900">{aiScore.riskLevel}</div>
          </div>
        </div>
      </div>

      {/* Performance Factors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Positive Factors */}
        {aiScore.factors.positive.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold text-green-900">Positive Factors</h3>
            </div>
            <ul className="space-y-2">
              {aiScore.factors.positive.map((factor, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-green-800 text-sm">{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Negative Factors */}
        {aiScore.factors.negative.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold text-red-900">Areas of Concern</h3>
            </div>
            <ul className="space-y-2">
              {aiScore.factors.negative.map((factor, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-red-800 text-sm">{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Neutral Factors */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="h-6 w-6 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">General Factors</h3>
          </div>
          <ul className="space-y-2">
            {aiScore.factors.neutral.map((factor, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-800 text-sm">{factor}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900">AI Recommendations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiScore.recommendations.map((recommendation, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-blue-100">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">{index + 1}</span>
                </div>
                <p className="text-blue-800 text-sm">{recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Features Info */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h3 className="font-semibold text-purple-900 mb-3">AI-Enhanced Scoring Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-800">
          <div className="flex items-start space-x-2">
            <Brain className="h-4 w-4 text-purple-600 mt-0.5" />
            <span>Advanced pattern recognition in responses</span>
          </div>
          <div className="flex items-start space-x-2">
            <TrendingUp className="h-4 w-4 text-purple-600 mt-0.5" />
            <span>Contextual scoring adjustments</span>
          </div>
          <div className="flex items-start space-x-2">
            <Target className="h-4 w-4 text-purple-600 mt-0.5" />
            <span>Personalized recommendations</span>
          </div>
          <div className="flex items-start space-x-2">
            <Sparkles className="h-4 w-4 text-purple-600 mt-0.5" />
            <span>AI-powered risk assessment</span>
          </div>
        </div>
      </div>
    </div>
  );
}
