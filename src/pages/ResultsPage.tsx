import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, TrendingUp, AlertTriangle, CheckCircle2, Users, Activity } from 'lucide-react';
import { useAssessment } from '../contexts/AssessmentContext';

const assessmentIcons = {
  cognitive: Brain,
  motor: Activity,
  speech: Users,
  behavioral: TrendingUp
};

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { results } = useAssessment();
  
  const result = results.find(r => r.id === id);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Result Not Found</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const Icon = assessmentIcons[result.type as keyof typeof assessmentIcons] || Brain;
  
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
      case 'moderate': return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' };
      case 'high': return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    }
  };

  const riskColors = getRiskColor(result.riskLevel);

  const getScoreInterpretation = (score: number) => {
    if (score >= 85) return { level: 'Excellent', description: 'Your performance indicates healthy cognitive function.' };
    if (score >= 70) return { level: 'Good', description: 'Your performance is within normal range with minor areas for attention.' };
    if (score >= 55) return { level: 'Fair', description: 'Some areas may benefit from monitoring and lifestyle adjustments.' };
    return { level: 'Needs Attention', description: 'Consider consulting with a healthcare professional.' };
  };

  const scoreInterpretation = getScoreInterpretation(result.score);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Icon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 capitalize">
                {result.type} Assessment Results
              </h1>
              <p className="text-gray-600">
                Completed on {new Date(result.completedAt).toLocaleDateString()} at{' '}
                {new Date(result.completedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* Score Overview */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-blue-600 mb-2">{result.score}</div>
            <div className="text-xl text-gray-600 mb-4">out of 100</div>
            <div className={`inline-flex items-center px-6 py-3 rounded-full border-2 ${riskColors.bg} ${riskColors.text} ${riskColors.border}`}>
              <div className="flex items-center space-x-2">
                {result.riskLevel === 'low' ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <AlertTriangle className="h-5 w-5" />
                )}
                <span className="font-medium capitalize">{result.riskLevel} Risk Level</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Score Interpretation</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-medium text-gray-900 mb-2">{scoreInterpretation.level}</div>
                <p className="text-gray-600">{scoreInterpretation.description}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Assessment Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Assessment Type:</span>
                  <span className="font-medium text-gray-900 capitalize">{result.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Questions Completed:</span>
                  <span className="font-medium text-gray-900">{Object.keys(result.responses).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium text-gray-900">~15 minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommendations</h2>
          <div className="space-y-4">
            {result.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Risk-specific Information */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What This Means</h2>
          
          {result.riskLevel === 'low' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-semibold text-green-800 mb-3">Low Risk - Excellent Results</h3>
              <p className="text-green-700 mb-4">
                Your assessment results indicate healthy cognitive function with no significant concerns. 
                Continue your current lifestyle and consider regular monitoring.
              </p>
              <ul className="text-green-700 space-y-1">
                <li>• Maintain regular physical and mental exercise</li>
                <li>• Continue healthy diet and sleep habits</li>
                <li>• Consider annual reassessments</li>
              </ul>
            </div>
          )}

          {result.riskLevel === 'moderate' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-semibold text-yellow-800 mb-3">Moderate Risk - Areas for Improvement</h3>
              <p className="text-yellow-700 mb-4">
                Your results show some areas that may benefit from attention and lifestyle modifications. 
                Consider implementing the recommendations below.
              </p>
              <ul className="text-yellow-700 space-y-1">
                <li>• Increase physical activity and brain training exercises</li>
                <li>• Consider discussing results with your healthcare provider</li>
                <li>• Schedule follow-up assessments in 3-6 months</li>
              </ul>
            </div>
          )}

          {result.riskLevel === 'high' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="font-semibold text-red-800 mb-3">Higher Risk - Professional Consultation Recommended</h3>
              <p className="text-red-700 mb-4">
                Your assessment results indicate areas of concern that warrant professional medical evaluation. 
                Please consider consulting with a healthcare provider.
              </p>
              <ul className="text-red-700 space-y-1">
                <li>• Schedule an appointment with your healthcare provider</li>
                <li>• Bring these results to your medical consultation</li>
                <li>• Consider comprehensive neurological evaluation</li>
              </ul>
            </div>
          )}
        </div>

        {/* Medical Disclaimer */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-orange-800 mb-2">Important Medical Disclaimer</h3>
              <p className="text-orange-700 text-sm leading-relaxed">
                These results are for screening and educational purposes only and do not constitute a medical diagnosis. 
                Always consult with qualified healthcare professionals for medical advice, diagnosis, and treatment. 
                If you have concerns about your cognitive health, please contact your healthcare provider.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={() => navigate(`/assessment/${result.type}`)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            Retake Assessment
          </button>
          <button
            onClick={() => navigate('/education')}
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 font-medium"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}