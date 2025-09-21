import React, { useState, useEffect } from 'react';
import { Brain, Lightbulb, TrendingUp, AlertTriangle, Target, Sparkles, Loader2 } from 'lucide-react';
import { geminiService, AIInsights, TestResult } from '../../services/geminiService';

interface AIInsightsProps {
  results: TestResult[];
  onInsightsGenerated?: (insights: AIInsights) => void;
}

export default function AIInsightsComponent({ results, onInsightsGenerated }: AIInsightsProps) {
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (results.length > 0) {
      generateInsights();
    }
  }, [results]);

  const generateInsights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const aiInsights = await geminiService.analyzeTestResults(results);
      setInsights(aiInsights);
      onInsightsGenerated?.(aiInsights);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate AI insights');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm border">
        <div className="flex items-center justify-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-lg font-medium text-gray-700">Generating AI Insights...</span>
        </div>
        <p className="text-center text-gray-500 mt-2">
          Our AI is analyzing your test results to provide personalized insights
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-3">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          <h3 className="text-lg font-semibold text-red-900">AI Analysis Error</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={generateInsights}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <Brain className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">AI Insights Not Available</h3>
        <p className="text-gray-500">Complete some tests to get AI-powered insights</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
        <div className="flex items-center space-x-3 mb-4">
          <Sparkles className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI-Powered Insights</h2>
            <p className="text-gray-600">Personalized analysis of your neurological health</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Overall Assessment</h3>
          <p className="text-gray-700 leading-relaxed">{insights.overallAssessment}</p>
        </div>
      </div>

      {/* Key Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">Key Strengths</h3>
          </div>
          <ul className="space-y-2">
            {insights.strengths.map((strength, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-green-800 text-sm">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="h-6 w-6 text-yellow-600" />
            <h3 className="text-lg font-semibold text-yellow-900">Areas for Improvement</h3>
          </div>
          <ul className="space-y-2">
            {insights.areasForImprovement.map((area, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-yellow-800 text-sm">{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Lightbulb className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900">AI Recommendations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.recommendations.map((recommendation, index) => (
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

      {/* Risk Factors */}
      {insights.riskFactors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h3 className="text-lg font-semibold text-red-900">Risk Factors to Monitor</h3>
          </div>
          <ul className="space-y-2">
            {insights.riskFactors.map((risk, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-red-800 text-sm">{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Next Steps */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="h-6 w-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-purple-900">Recommended Next Steps</h3>
        </div>
        <ul className="space-y-3">
          {insights.nextSteps.map((step, index) => (
            <li key={index} className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 text-sm font-medium">{index + 1}</span>
              </div>
              <span className="text-purple-800 text-sm">{step}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Personalized Advice */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-indigo-900 mb-3">Personalized Advice</h3>
        <p className="text-indigo-800 leading-relaxed">{insights.personalizedAdvice}</p>
      </div>

      {/* Toggle Details */}
      <div className="text-center">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          {showDetails ? 'Hide' : 'Show'} Technical Details
        </button>
      </div>

      {/* Technical Details */}
      {showDetails && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Details</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Analysis Method:</strong> Google Gemini AI with neurological assessment expertise</p>
            <p><strong>Data Points Analyzed:</strong> {results.length} test results</p>
            <p><strong>Analysis Date:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Confidence Level:</strong> High (AI-powered analysis with medical context)</p>
          </div>
        </div>
      )}
    </div>
  );
}
