import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import MotionSensorTest from '../components/tests/MotionSensorTest';
import TapTest from '../components/tests/TapTest';
import DrawingTest from '../components/tests/DrawingTest';
import AudioRecordingTest from '../components/tests/AudioRecordingTest';

interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  duration?: number;
  error?: string;
  data?: any;
}

const TestRunner: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([
    { id: 'motion', name: 'Motion Sensor Test', status: 'pending' },
    { id: 'tap', name: 'Tap Test', status: 'pending' },
    { id: 'drawing', name: 'Drawing Test', status: 'pending' },
    { id: 'audio', name: 'Audio Recording Test', status: 'pending' }
  ]);

  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const updateTestStatus = (id: string, status: TestResult['status'], data?: any, error?: string) => {
    setTests(prev => prev.map(test => 
      test.id === id 
        ? { ...test, status, data, error, duration: Date.now() - (test as any).startTime }
        : test
    ));
  };

  const startTest = (id: string) => {
    setCurrentTest(id);
    setIsRunning(true);
    setTests(prev => prev.map(test => 
      test.id === id 
        ? { ...test, status: 'running', startTime: Date.now() }
        : test
    ));
  };

  const runAllTests = async () => {
    setIsRunning(true);
    
    for (const test of tests) {
      if (test.status === 'pending') {
        startTest(test.id);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate test delay
      }
    }
  };

  const resetTests = () => {
    setTests(prev => prev.map(test => ({ ...test, status: 'pending', data: undefined, error: undefined })));
    setCurrentTest(null);
    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'running':
        return <Clock className="h-5 w-5 text-blue-600 animate-spin" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      case 'running':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Runner</h1>
          <p className="text-gray-600">Run all interactive test components to verify functionality</p>
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Test Controls</h2>
            <div className="flex space-x-3">
              <button
                onClick={runAllTests}
                disabled={isRunning}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="h-4 w-4 mr-2" />
                Run All Tests
              </button>
              <button
                onClick={resetTests}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Reset Tests
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tests.map((test) => (
              <div
                key={test.id}
                className={`p-4 rounded-lg border ${getStatusColor(test.status)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{test.name}</span>
                  {getStatusIcon(test.status)}
                </div>
                <div className="text-xs text-gray-600">
                  {test.status === 'running' && 'Running...'}
                  {test.status === 'completed' && `Completed in ${test.duration}ms`}
                  {test.status === 'failed' && 'Failed'}
                  {test.status === 'pending' && 'Ready'}
                </div>
                {test.error && (
                  <div className="mt-2 text-xs text-red-600">
                    {test.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Individual Test Components */}
        <div className="space-y-8">
          {currentTest === 'motion' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Motion Sensor Test</h3>
              <MotionSensorTest
                duration={5}
                onComplete={(data) => {
                  updateTestStatus('motion', 'completed', data);
                  setCurrentTest(null);
                  setIsRunning(false);
                }}
                onError={(error) => {
                  updateTestStatus('motion', 'failed', undefined, error);
                  setCurrentTest(null);
                  setIsRunning(false);
                }}
              />
            </div>
          )}

          {currentTest === 'tap' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tap Test</h3>
              <TapTest
                duration={10}
                onComplete={(data) => {
                  updateTestStatus('tap', 'completed', data);
                  setCurrentTest(null);
                  setIsRunning(false);
                }}
              />
            </div>
          )}

          {currentTest === 'drawing' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Drawing Test</h3>
              <DrawingTest
                drawingType="spiral"
                onComplete={(data) => {
                  updateTestStatus('drawing', 'completed', data);
                  setCurrentTest(null);
                  setIsRunning(false);
                }}
              />
            </div>
          )}

          {currentTest === 'audio' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Audio Recording Test</h3>
              <AudioRecordingTest
                duration={10}
                text="Test recording for 10 seconds"
                onComplete={(data) => {
                  updateTestStatus('audio', 'completed', data);
                  setCurrentTest(null);
                  setIsRunning(false);
                }}
                onError={(error) => {
                  updateTestStatus('audio', 'failed', undefined, error);
                  setCurrentTest(null);
                  setIsRunning(false);
                }}
              />
            </div>
          )}
        </div>

        {/* Test Summary */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Summary</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {tests.filter(t => t.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {tests.filter(t => t.status === 'failed').length}
              </div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">
                {tests.filter(t => t.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestRunner;
