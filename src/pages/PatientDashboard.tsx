import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Activity, 
  Calendar, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  BarChart3,
  Stethoscope,
  MessageSquare,
  FileText,
  Clock,
  Heart,
  Shield,
  Target,
  Zap,
  Eye,
  Upload,
  Download
} from 'lucide-react';
import { useAssessment } from '../contexts/AssessmentContext';
import TestAnalytics from '../components/analytics/TestAnalytics';
import AIInsightsComponent from '../components/ai/AIInsights';
import DoctorSuggestionSystem from '../components/medical/DoctorSuggestionSystem';

const assessmentTypes = [
  {
    id: 'cognitive',
    name: 'Cognitive Assessment',
    icon: Brain,
    description: 'Memory, attention, and processing speed evaluation',
    duration: '15-20 minutes',
    color: 'blue',
    riskFactors: ['Memory loss', 'Attention deficits', 'Processing speed issues']
  },
  {
    id: 'motor',
    name: 'Motor Function Test',
    icon: Activity,
    description: 'Tremor detection and coordination analysis',
    duration: '10-15 minutes',
    color: 'green',
    riskFactors: ['Tremors', 'Coordination problems', 'Balance issues']
  },
  {
    id: 'speech',
    name: 'Speech Analysis',
    icon: MessageSquare,
    description: 'Voice pattern recognition and speech analysis',
    duration: '5-10 minutes',
    color: 'purple',
    riskFactors: ['Speech difficulties', 'Voice changes', 'Communication issues']
  },
  {
    id: 'behavioral',
    name: 'Behavioral Assessment',
    icon: Users,
    description: 'Mood, behavior, and cognitive function evaluation',
    duration: '20-25 minutes',
    color: 'orange',
    riskFactors: ['Mood changes', 'Behavioral shifts', 'Personality changes']
  }
];

export default function PatientDashboard() {
  const { results, getLatestResult } = useAssessment();
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [showDoctorConsultation, setShowDoctorConsultation] = useState(false);
  const [uploadedScans, setUploadedScans] = useState<any[]>([]);

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100',
      green: 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100',
      purple: 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100',
      orange: 'bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleScanUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newScans = Array.from(files).map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date().toISOString(),
        file: file
      }));
      setUploadedScans(prev => [...prev, ...newScans]);
    }
  };

  const latestResult = getLatestResult();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Your Health Dashboard
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
                  <p className="text-sm font-medium text-gray-600">Latest Assessment</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {latestResult?.type?.charAt(0).toUpperCase() + latestResult?.type?.slice(1)}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${getRiskLevelColor(latestResult?.riskLevel || 'low')}`}>
                  <Target className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Risk Level</span>
                  <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                    latestResult?.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                    latestResult?.riskLevel === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {latestResult?.riskLevel?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                  <p className="text-2xl font-bold text-gray-900">{results.length}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Last taken: {new Date(latestResult?.completedAt || '').toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overall Score</p>
                  <p className="text-2xl font-bold text-gray-900">{latestResult?.score || 0}/100</p>
                </div>
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${latestResult?.score || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assessment Types */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Assessments</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {assessmentTypes.map((assessment) => (
              <Link
                key={assessment.id}
                to={`/assessment/${assessment.id}`}
                className={`group p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${getColorClasses(assessment.color)}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <assessment.icon className="h-8 w-8" />
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{assessment.name}</h3>
                <p className="text-sm mb-3 opacity-80">{assessment.description}</p>
                <div className="flex items-center text-xs opacity-70">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{assessment.duration}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Medical Scans Upload */}
        <div className="mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload Medical Scans</h2>
            <p className="text-gray-600 mb-6">
              Upload your MRI, CT, EEG, or other medical scans for AI analysis and doctor consultation.
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">Upload Medical Scans</p>
              <p className="text-gray-600 mb-4">Support for MRI, CT, EEG, X-Ray, and other medical imaging formats</p>
              <input
                type="file"
                multiple
                accept="image/*,.dcm,.nii,.nii.gz"
                onChange={handleScanUpload}
                className="hidden"
                id="scan-upload"
              />
              <label
                htmlFor="scan-upload"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
              >
                <Upload className="h-5 w-5 mr-2" />
                Choose Files
              </label>
            </div>

            {/* Uploaded Scans */}
            {uploadedScans.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Scans</h3>
                <div className="space-y-3">
                  {uploadedScans.map((scan) => (
                    <div key={scan.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">{scan.name}</p>
                          <p className="text-sm text-gray-600">
                            {(scan.size / 1024 / 1024).toFixed(2)} MB • {new Date(scan.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Download className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Doctor Consultation Section */}
        <div className="mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Doctor Consultation</h2>
                <p className="text-gray-600">Get professional medical advice based on your assessment results and scans</p>
              </div>
              <button
                onClick={() => setShowDoctorConsultation(!showDoctorConsultation)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Stethoscope className="h-4 w-4 mr-2" />
                {showDoctorConsultation ? 'Hide Consultation' : 'Request Consultation'}
              </button>
            </div>

            {showDoctorConsultation && (
              <div className="border-t pt-6">
                <DoctorSuggestionSystem 
                  patientResults={results}
                  uploadedScans={uploadedScans}
                />
              </div>
            )}
          </div>
        </div>

        {/* Health Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl border">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Health Tips</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Regular Exercise</h3>
                <p className="text-gray-600 text-sm">
                  Physical activity helps maintain brain health and reduces the risk of neurological conditions.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Mental Stimulation</h3>
                <p className="text-gray-600 text-sm">
                  Keep your brain active with puzzles, reading, and learning new skills.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Quality Sleep</h3>
                <p className="text-gray-600 text-sm">
                  Aim for 7-9 hours of sleep per night to support brain function and memory consolidation.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Regular Monitoring</h3>
                <p className="text-gray-600 text-sm">
                  Take assessments regularly to track changes and catch potential issues early.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}