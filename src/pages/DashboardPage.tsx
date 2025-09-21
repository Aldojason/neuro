import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, TrendingUp, Users, Activity, Calendar, ArrowRight, AlertCircle, CheckCircle2, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAssessment } from '../contexts/AssessmentContext';
import TestAnalytics from '../components/analytics/TestAnalytics';
import AIInsightsComponent from '../components/ai/AIInsights';

const assessmentTypes = [
  {
    id: 'cognitive',
    name: 'Cognitive Assessment',
    icon: Brain,
    description: 'Memory, attention, and processing speed evaluation',
    duration: '15-20 minutes',
    color: 'blue',
    conditions: ['Alzheimer\'s', 'Dementia']
  },
  {
    id: 'motor',
    name: 'Motor Function',
    icon: Activity,
    description: 'Tremor detection and coordination analysis',
    duration: '10-15 minutes',
    color: 'teal',
    conditions: ['Parkinson\'s', 'Movement Disorders']
  },
  {
    id: 'speech',
    name: 'Speech Analysis',
    icon: Users,
    description: 'Voice pattern and speech clarity assessment',
    duration: '5-10 minutes',
    color: 'green',
    conditions: ['Various neurological conditions']
  },
  {
    id: 'behavioral',
    name: 'Behavioral Health',
    icon: TrendingUp,
    description: 'Mood and behavioral pattern evaluation',
    duration: '10-12 minutes',
    color: 'purple',
    conditions: ['Depression', 'Anxiety', 'Behavioral changes']
  }
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { results, getLatestResult } = useAssessment();
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      teal: 'bg-teal-50 border-teal-200 text-teal-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name}
              </h1>
              <p className="text-xl text-gray-600">
                Monitor your neurological health with AI-powered assessments
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
              </button>
              <button
                onClick={() => setShowAIInsights(!showAIInsights)}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Brain className="h-4 w-4 mr-2" />
                {showAIInsights ? 'Hide AI Insights' : 'Show AI Insights'}
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        {showAnalytics && (
          <div className="mb-8">
            <TestAnalytics results={results} />
          </div>
        )}

        {/* AI Insights Section */}
        {showAIInsights && (
          <div className="mb-8">
            <AIInsightsComponent results={results} />
          </div>
        )}

        {/* Quick Stats */}
        {results.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                  <p className="text-3xl font-bold text-gray-900">{results.length}</p>
                </div>
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Latest Score</p>
                  <p className="text-3xl font-bold text-gray-900">{results[0]?.score || 0}/100</p>
                </div>
                <TrendingUp className="h-12 w-12 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Risk Level</p>
                  <p className={`text-2xl font-bold capitalize ${getRiskColor(results[0]?.riskLevel || 'low').split(' ')[0]}`}>
                    {results[0]?.riskLevel || 'Low'}
                  </p>
                </div>
                <AlertCircle className="h-12 w-12 text-yellow-500" />
              </div>
            </div>
          </div>
        )}

        {/* Assessment Cards */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Available Assessments</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Recommended: Weekly screening</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {assessmentTypes.map((assessment) => {
              const Icon = assessment.icon;
              const latestResult = getLatestResult(assessment.id);
              
              return (
                <div key={assessment.id} className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-lg ${getColorClasses(assessment.color)}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{assessment.name}</h3>
                          <p className="text-sm text-gray-600">{assessment.duration}</p>
                        </div>
                      </div>
                      {latestResult && (
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(latestResult.riskLevel)}`}>
                          {latestResult.riskLevel} risk
                        </div>
                      )}
                    </div>

                    <p className="text-gray-600 mb-4">{assessment.description}</p>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Screens for:</p>
                      <div className="flex flex-wrap gap-2">
                        {assessment.conditions.map((condition) => (
                          <span key={condition} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>

                    {latestResult && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Last completed:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(latestResult.completedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Score:</span>
                          <span className="text-sm font-medium text-gray-900">{latestResult.score}/100</span>
                        </div>
                      </div>
                    )}

                    <Link
                      to={`/assessment/${assessment.id}`}
                      className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>{latestResult ? 'Retake Assessment' : 'Start Assessment'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Results */}
        {results.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Recent Assessment Results</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {results.slice(0, 5).map((result) => (
                  <div key={result.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        result.riskLevel === 'low' ? 'bg-green-500' :
                        result.riskLevel === 'moderate' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <h3 className="font-medium text-gray-900 capitalize">{result.type} Assessment</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(result.completedAt).toLocaleDateString()} • Score: {result.score}/100
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(result.riskLevel)}`}>
                        {result.riskLevel} risk
                      </span>
                      <Link
                        to={`/results/${result.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Educational Resources */}
        <div className="mt-8 bg-blue-600 rounded-xl text-white p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Learn About Neurological Health</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Access educational resources, latest research, and expert insights on maintaining brain health.
            </p>
            <Link
              to="/education"
              className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Explore Resources
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}