import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import MotionSensorTest from './tests/MotionSensorTest';
import TapTest from './tests/TapTest';
import DrawingTest from './tests/DrawingTest';
import AudioRecordingTest from './tests/AudioRecordingTest';
import ReactionTimeTest from './tests/ReactionTimeTest';
import SpatialMemoryTest from './tests/SpatialMemoryTest';
import ExecutiveFunctionTest from './tests/ExecutiveFunctionTest';

interface TestConfig {
  id: string;
  name: string;
  component: React.ComponentType<any>;
  duration?: number;
  props?: any;
}

interface TestResult {
  testId: string;
  data: any;
  completedAt: string;
  duration: number;
}

interface TestRunnerProps {
  onComplete: (results: TestResult[]) => void;
  onError: (error: string) => void;
}

const testConfigs: TestConfig[] = [
  {
    id: 'reaction_time',
    name: 'Reaction Time Test',
    component: ReactionTimeTest,
    duration: 30,
    props: { duration: 30 }
  },
  {
    id: 'spatial_memory',
    name: 'Spatial Memory Test',
    component: SpatialMemoryTest,
    props: {}
  },
  {
    id: 'executive_function',
    name: 'Executive Function Test',
    component: ExecutiveFunctionTest,
    duration: 60,
    props: { duration: 60 }
  },
  {
    id: 'motion_sensor',
    name: 'Motion Sensor Test',
    component: MotionSensorTest,
    duration: 30,
    props: { duration: 30 }
  },
  {
    id: 'tap_test',
    name: 'Tap Test',
    component: TapTest,
    duration: 20,
    props: { duration: 20 }
  },
  {
    id: 'drawing',
    name: 'Drawing Test',
    component: DrawingTest,
    props: { drawingType: 'spiral' }
  },
  {
    id: 'audio_recording',
    name: 'Audio Recording Test',
    component: AudioRecordingTest,
    duration: 30,
    props: { duration: 30, text: 'Please read this text aloud for speech analysis.' }
  }
];

export default function TestRunner({ onComplete, onError }: TestRunnerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testStartTime, setTestStartTime] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentTest = testConfigs[currentTestIndex];
  const progress = ((currentTestIndex + 1) / testConfigs.length) * 100;
  const totalDuration = testConfigs.reduce((sum, test) => sum + (test.duration || 0), 0);

  const startTestSuite = () => {
    setIsRunning(true);
    setCurrentTestIndex(0);
    setTestResults([]);
    setTestStartTime(Date.now());
    setPaused(false);
    setError(null);
  };

  const pauseTestSuite = () => {
    setPaused(true);
  };

  const resumeTestSuite = () => {
    setPaused(false);
  };

  const resetTestSuite = () => {
    setIsRunning(false);
    setCurrentTestIndex(0);
    setTestResults([]);
    setTestStartTime(null);
    setPaused(false);
    setError(null);
  };

  const handleTestComplete = (data: any) => {
    if (paused) return;

    const testResult: TestResult = {
      testId: currentTest.id,
      data,
      completedAt: new Date().toISOString(),
      duration: testStartTime ? Date.now() - testStartTime : 0
    };

    const newResults = [...testResults, testResult];
    setTestResults(newResults);

    if (currentTestIndex < testConfigs.length - 1) {
      setCurrentTestIndex(prev => prev + 1);
    } else {
      // All tests completed
      setIsRunning(false);
      onComplete(newResults);
    }
  };

  const handleTestError = (error: string) => {
    setError(error);
    onError(error);
  };

  const getTestStatus = (index: number) => {
    if (index < currentTestIndex) return 'completed';
    if (index === currentTestIndex) return 'current';
    return 'pending';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'current':
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'current':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-600';
    }
  };

  if (!isRunning) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Comprehensive Test Suite</h2>
        <p className="text-gray-600 mb-6">
          Run all neurological assessments in sequence for a complete evaluation
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3">Test Suite Includes:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
            {testConfigs.map((test, index) => (
              <div key={test.id} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>{test.name}</span>
                {test.duration && <span className="text-blue-600">({test.duration}s)</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Estimated Duration:</span>
            <span>{Math.round(totalDuration / 60)} minutes</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Total Tests:</span>
            <span>{testConfigs.length}</span>
          </div>
        </div>

        <button
          onClick={startTestSuite}
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-medium flex items-center mx-auto"
        >
          <Play className="h-5 w-5 mr-2" />
          Start Test Suite
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Test Suite Progress</h2>
          <div className="flex space-x-2">
            {paused ? (
              <button
                onClick={resumeTestSuite}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Play className="h-4 w-4 mr-1" />
                Resume
              </button>
            ) : (
              <button
                onClick={pauseTestSuite}
                className="flex items-center px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                <Pause className="h-4 w-4 mr-1" />
                Pause
              </button>
            )}
            <button
              onClick={resetTestSuite}
              className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>Test {currentTestIndex + 1} of {testConfigs.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </div>

      {/* Test List */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="font-semibold text-gray-900 mb-4">Test Status</h3>
        <div className="space-y-2">
          {testConfigs.map((test, index) => {
            const status = getTestStatus(index);
            return (
              <div
                key={test.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(status)}`}
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(status)}
                  <span className="font-medium">{test.name}</span>
                  {test.duration && <span className="text-sm">({test.duration}s)</span>}
                </div>
                {status === 'completed' && (
                  <span className="text-sm font-medium">✓ Completed</span>
                )}
                {status === 'current' && (
                  <span className="text-sm font-medium">In Progress</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Test */}
      {!paused && currentTest && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-4">
            Current Test: {currentTest.name}
          </h3>
          <div className="border rounded-lg p-4">
            <currentTest.component
              {...currentTest.props}
              onComplete={handleTestComplete}
              onError={handleTestError}
            />
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800 font-medium">Error:</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      )}

      {/* Paused State */}
      {paused && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <Pause className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">Test Suite Paused</h3>
          <p className="text-yellow-800 mb-4">
            The test suite has been paused. Click "Resume" to continue where you left off.
          </p>
          <button
            onClick={resumeTestSuite}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Resume Tests
          </button>
        </div>
      )}
    </div>
  );
}
