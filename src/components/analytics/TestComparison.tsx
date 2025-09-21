import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Calendar, BarChart3, Target } from 'lucide-react';

interface TestResult {
  id: string;
  type: string;
  score: number;
  riskLevel: 'low' | 'moderate' | 'high';
  completedAt: string;
  duration: number;
  responses: Record<string, any>;
}

interface TestComparisonProps {
  results: TestResult[];
}

interface ComparisonData {
  type: string;
  current: number;
  previous: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  period: string;
}

export default function TestComparison({ results }: TestComparisonProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedTest, setSelectedTest] = useState<string>('all');

  const getTestResultsByType = (type: string) => {
    return results.filter(result => result.type === type);
  };

  const getResultsInPeriod = (testResults: TestResult[], period: string) => {
    const now = new Date();
    const daysBack = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const cutoffDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    
    return testResults.filter(result => new Date(result.completedAt) >= cutoffDate);
  };

  const calculateComparison = (): ComparisonData[] => {
    const testTypes = selectedTest === 'all' 
      ? ['cognitive', 'motor', 'speech', 'behavioral']
      : [selectedTest];

    return testTypes.map(type => {
      const typeResults = getTestResultsByType(type);
      const periodResults = getResultsInPeriod(typeResults, selectedPeriod);
      
      if (periodResults.length < 2) {
        return {
          type,
          current: periodResults[0]?.score || 0,
          previous: 0,
          change: 0,
          trend: 'stable' as const,
          period: selectedPeriod
        };
      }

      // Sort by date to get chronological order
      const sortedResults = periodResults.sort((a, b) => 
        new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
      );

      const current = sortedResults[sortedResults.length - 1].score;
      const previous = sortedResults[sortedResults.length - 2].score;
      const change = current - previous;
      
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (change > 5) trend = 'up';
      else if (change < -5) trend = 'down';

      return {
        type,
        current,
        previous,
        change: Math.abs(change),
        trend,
        period: selectedPeriod
      };
    });
  };

  const comparisonData = calculateComparison();

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50';
      case 'down':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getTestTypeName = (type: string) => {
    const names = {
      cognitive: 'Cognitive',
      motor: 'Motor',
      speech: 'Speech',
      behavioral: 'Behavioral'
    };
    return names[type as keyof typeof names] || type;
  };

  const getTestTypeIcon = (type: string) => {
    const icons = {
      cognitive: '🧠',
      motor: '🏃',
      speech: '🗣️',
      behavioral: '📊'
    };
    return icons[type as keyof typeof icons] || '📋';
  };

  const getOverallTrend = () => {
    const validComparisons = comparisonData.filter(d => d.current > 0 && d.previous > 0);
    if (validComparisons.length === 0) return 'stable';
    
    const avgChange = validComparisons.reduce((sum, d) => sum + (d.trend === 'up' ? 1 : d.trend === 'down' ? -1 : 0), 0) / validComparisons.length;
    
    if (avgChange > 0.3) return 'up';
    if (avgChange < -0.3) return 'down';
    return 'stable';
  };

  const overallTrend = getOverallTrend();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Test Comparison</h2>
          <p className="text-gray-600">Compare your performance over time</p>
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
        </div>
      </div>

      {/* Overall Trend */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Overall Performance Trend</h3>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getTrendColor(overallTrend)}`}>
            {getTrendIcon(overallTrend)}
            <span className="text-sm font-medium capitalize">{overallTrend}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {comparisonData.filter(d => d.current > 0).length}
            </div>
            <div className="text-sm text-gray-600">Tests Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {comparisonData.length > 0 
                ? Math.round(comparisonData.reduce((sum, d) => sum + d.current, 0) / comparisonData.length)
                : 0
              }
            </div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {comparisonData.filter(d => d.trend === 'up').length}
            </div>
            <div className="text-sm text-gray-600">Improving</div>
          </div>
        </div>
      </div>

      {/* Individual Test Comparisons */}
      <div className="space-y-4">
        {comparisonData.map((data) => (
          <div key={data.type} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getTestTypeIcon(data.type)}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{getTestTypeName(data.type)} Assessment</h3>
                  <p className="text-sm text-gray-600">Last {selectedPeriod} comparison</p>
                </div>
              </div>
              
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getTrendColor(data.trend)}`}>
                {getTrendIcon(data.trend)}
                <span className="text-sm font-medium">
                  {data.trend === 'up' ? 'Improving' : data.trend === 'down' ? 'Declining' : 'Stable'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{data.current}</div>
                <div className="text-sm text-gray-600">Current Score</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-gray-600">{data.previous}</div>
                <div className="text-sm text-gray-600">Previous Score</div>
              </div>
              
              <div className="text-center">
                <div className={`text-lg font-bold ${data.trend === 'up' ? 'text-green-600' : data.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                  {data.change > 0 ? '+' : ''}{data.change}
                </div>
                <div className="text-sm text-gray-600">Change</div>
              </div>
            </div>

            {/* Progress Visualization */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Previous</span>
                <span>Current</span>
              </div>
              <div className="flex space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gray-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((data.previous / 100) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      data.trend === 'up' ? 'bg-green-500' : data.trend === 'down' ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min((data.current / 100) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
        <h3 className="font-semibold text-gray-900 mb-3">Performance Insights</h3>
        <div className="space-y-2 text-sm text-gray-700">
          {overallTrend === 'up' && (
            <p>🎉 Great job! Your overall performance is improving across all test categories.</p>
          )}
          {overallTrend === 'down' && (
            <p>📈 Consider focusing on areas that need improvement and maintaining consistent testing.</p>
          )}
          {overallTrend === 'stable' && (
            <p>📊 Your performance is stable. Continue regular testing to track long-term trends.</p>
          )}
          
          {comparisonData.filter(d => d.trend === 'up').length > 0 && (
            <p>✅ {comparisonData.filter(d => d.trend === 'up').length} test type(s) showing improvement.</p>
          )}
          
          {comparisonData.filter(d => d.trend === 'down').length > 0 && (
            <p>⚠️ {comparisonData.filter(d => d.trend === 'down').length} test type(s) may need attention.</p>
          )}
        </div>
      </div>
    </div>
  );
}
