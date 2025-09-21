import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Shield, Users, TrendingUp, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Early Detection for
              <span className="text-yellow-300"> Neurological Health</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto leading-relaxed">
              AI-powered assessments to identify early signs of Alzheimer's, Parkinson's, 
              Epilepsy, and Stroke through accessible, scientifically-backed screening tools.
            </p>
            
            {/* Medical Disclaimer */}
            <div className="bg-orange-500/20 border-2 border-orange-300 rounded-lg p-6 mb-8 max-w-4xl mx-auto">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-6 w-6 text-orange-200 mt-1 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="font-bold text-orange-100 mb-2">Important Medical Disclaimer</h3>
                  <p className="text-orange-100 text-sm leading-relaxed">
                    This platform is for educational and screening purposes only. It does not provide medical diagnosis 
                    or replace professional medical advice. Always consult qualified healthcare providers for medical concerns.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Link
                to="/patient-login"
                className="inline-flex items-center bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-colors"
              >
                Patient Login
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/doctor-login"
                className="inline-flex items-center bg-green-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-600 transition-colors"
              >
                Doctor Portal
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/education"
                className="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Neurological Screening
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Multi-modal assessments designed for accessibility and clinical accuracy
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all">
              <Brain className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cognitive Assessment</h3>
              <p className="text-gray-600 leading-relaxed">
                Memory, attention, and processing speed tests designed for early detection
              </p>
            </div>

            <div className="text-center p-6 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all">
              <TrendingUp className="h-16 w-16 text-teal-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Motor Function</h3>
              <p className="text-gray-600 leading-relaxed">
                Tremor detection and coordination analysis using device sensors
              </p>
            </div>

            <div className="text-center p-6 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all">
              <Users className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Speech Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Voice pattern recognition for early neurological indicators
              </p>
            </div>

            <div className="text-center p-6 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all">
              <Shield className="h-16 w-16 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Private</h3>
              <p className="text-gray-600 leading-relaxed">
                HIPAA-compliant data protection with encrypted health information
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Early Detection Matters
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Better Outcomes</h3>
                    <p className="text-gray-600">Early intervention can significantly slow disease progression and improve quality of life</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Accessible Testing</h3>
                    <p className="text-gray-600">Convenient at-home assessments eliminate barriers to neurological screening</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Evidence-Based</h3>
                    <p className="text-gray-600">AI models trained on clinical research and validated assessment protocols</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Family Peace of Mind</h3>
                    <p className="text-gray-600">Monitor loved ones' neurological health with regular, objective assessments</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Conditions We Screen For</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span className="text-lg font-medium text-gray-900">Alzheimer's Disease</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-teal-50 rounded-lg">
                  <div className="w-3 h-3 bg-teal-600 rounded-full"></div>
                  <span className="text-lg font-medium text-gray-900">Parkinson's Disease</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span className="text-lg font-medium text-gray-900">Epilepsy</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                  <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                  <span className="text-lg font-medium text-gray-900">Stroke Risk</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Take Control of Your Neurological Health
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands who are proactively monitoring their brain health with our AI-powered screening platform.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link
              to="/patient-login"
              className="inline-flex items-center bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-xl hover:bg-yellow-300 transition-colors"
            >
              Patient Portal
              <ArrowRight className="ml-2 h-6 w-6" />
            </Link>
            <Link
              to="/doctor-login"
              className="inline-flex items-center bg-green-500 text-white px-8 py-4 rounded-lg font-bold text-xl hover:bg-green-600 transition-colors"
            >
              Doctor Portal
              <ArrowRight className="ml-2 h-6 w-6" />
            </Link>
          </div>
          <p className="text-blue-200 mt-4 text-sm">
            Free to start • No credit card required • HIPAA compliant
          </p>
        </div>
      </div>
    </div>
  );
}