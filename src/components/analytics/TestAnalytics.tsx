import { useState } from 'react';
import { TrendingUp, Brain, Activity, Users, Target, Clock, Award, GitCompare } from 'lucide-react';
import TestComparison from './TestComparison';

interface TestResult {
  id: string;
  type: string;
  score: number;
  riskLevel: 'low' | 'moderate' | 'high';
  completedAt: string;
  duration: number;
  responses: Record<string, any>;
}

interface TestAnalyticsProps {
  results: TestResult[];
}

export default function TestAnalytics({ results }: TestAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [selectedTest, setSelectedTest] = useState<string>('all');
  const [showComparison, setShowComparison] = useState(false);

  const filteredResults = results.filter(result => {
    const resultDate = new Date(result.completedAt);
    const now = new Date();
    const daysDiff = (now.getTime() - resultDate.getTime()) / (1000 * 60 * 60 * 24);
    
    const periodMatch = selectedPeriod === 'all' || 
      (selectedPeriod === '7d' && daysDiff <= 7) ||
      (selectedPeriod === '30d' && daysDiff <= 30) ||
      (selectedPeriod === '90d' && daysDiff <= 90);
    
    const testMatch = selectedTest === 'all' || result.type === selectedTest;
    
    return periodMatch && testMatch;
  });

  const getTestTypeIcon = (type: string) => {
    switch (type) {
      case 'cognitive': return Brain;
      case 'motor': return Activity;
      case 'speech': return Users;
      case 'behavioral': return TrendingUp;
      default: return Target;
    }
  };

  const getTestTypeColor = (type: string) => {
    switch (type) {
      case 'cognitive': return 'text-blue-600 bg-blue-100';
      case 'motor': return 'text-green-600 bg-green-100';
      case 'speech': return 'text-purple-600 bg-purple-100';
      case 'behavioral': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const calculateTrends = () => {
    if (filteredResults.length < 2) return null;

    const sortedResults = [...filteredResults].sort((a, b) => 
      new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
    );

    const firstHalf = sortedResults.slice(0, Math.floor(sortedResults.length / 2));
    const secondHalf = sortedResults.slice(Math.floor(sortedResults.length / 2));

    const firstAvg = firstHalf.reduce((sum, r) => sum + r.score, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, r) => sum + r.score, 0) / secondHalf.length;

    return {
      scoreTrend: secondAvg - firstAvg,
      improvement: secondAvg > firstAvg
    };
  };

  const getPerformanceInsights = () => {
    const insights = [];
    
    if (filteredResults.length === 0) {
      return ['No test data available for the selected period.'];
    }

    const avgScore = filteredResults.reduce((sum, r) => sum + r.score, 0) / filteredResults.length;
    const highRiskCount = filteredResults.filter(r => r.riskLevel === 'high').length;
    const recentTests = filteredResults.filter(r => {
      const daysDiff = (new Date().getTime() - new Date(r.completedAt).getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    });

    if (avgScore >= 85) {
      insights.push('Excellent overall performance across all tests');
    } else if (avgScore >= 70) {
      insights.push('Good performance with room for improvement');
    } else {
      insights.push('Performance indicates areas needing attention');
    }

    if (highRiskCount > 0) {
      insights.push(`${highRiskCount} test(s) showed high risk levels`);
    }

    if (recentTests.length >= 3) {
      insights.push('Consistent testing schedule maintained');
    } else if (recentTests.length === 0) {
      insights.push('Consider taking more recent tests for better tracking');
    }

    return insights;
  };

  const trends = calculateTrends();
  const insights = getPerformanceInsights();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Test Analytics</h2>
          <p className="text-gray-600">Comprehensive analysis of your assessment results</p>
        </div>
        
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>
          
          <select
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All tests</option>
            <option value="cognitive">Cognitive</option>
            <option value="motor">Motor</option>
            <option value="speech">Speech</option>
            <option value="behavioral">Behavioral</option>
          </select>
          
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
          >
            <GitCompare className="h-4 w-4 mr-1" />
            {showComparison ? 'Hide' : 'Compare'}
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900">{filteredResults.length}</p>
            </div>
            <Target className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredResults.length > 0 
                  ? Math.round(filteredResults.reduce((sum, r) => sum + r.score, 0) / filteredResults.length)
                  : 0
                }
              </p>
            </div>
            <Award className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Duration</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredResults.length > 0 
                  ? Math.round(filteredResults.reduce((sum, r) => sum + r.duration, 0) / filteredResults.length / 60)
                  : 0
                }m
              </p>
            </div>
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Risk Level</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredResults.length > 0 
                  ? filteredResults[filteredResults.length - 1].riskLevel
                  : 'N/A'
                }
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Test Results Timeline */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Test Results</h3>
        <div className="space-y-4">
          {filteredResults.slice(-5).reverse().map((result) => {
            const Icon = getTestTypeIcon(result.type);
            const colorClass = getTestTypeColor(result.type);
            const riskColor = result.riskLevel === 'low' ? 'text-green-600' : 
                            result.riskLevel === 'moderate' ? 'text-yellow-600' : 'text-red-600';
            
            return (
              <div key={result.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 capitalize">{result.type} Assessment</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(result.completedAt).toLocaleDateString()} at{' '}
                      {new Date(result.completedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{result.score}</div>
                    <div className={`text-sm font-medium ${riskColor}`}>
                      {result.riskLevel} risk
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-blue-800">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trend Analysis */}
      {trends && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trend</h3>
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${trends.improvement ? 'bg-green-100' : 'bg-red-100'}`}>
              <TrendingUp className={`h-6 w-6 ${trends.improvement ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {trends.improvement ? 'Improving' : 'Declining'} Performance
              </p>
              <p className="text-sm text-gray-600">
                Average score change: {trends.scoreTrend > 0 ? '+' : ''}{Math.round(trends.scoreTrend)} points
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Based on your results:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Continue regular testing for better tracking</li>
              <li>• Focus on areas with lower scores</li>
              <li>• Maintain consistent testing schedule</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Next steps:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Schedule follow-up assessments</li>
              <li>• Consider consulting healthcare provider</li>
              <li>• Track progress over time</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      {showComparison && (
        <div className="mt-8">
          <TestComparison results={results} />
        </div>
      )}
    </div>
  );
}
