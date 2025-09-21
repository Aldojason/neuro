import React, { useState, useEffect, useRef } from 'react';
import { Activity, AlertCircle, CheckCircle } from 'lucide-react';

interface MotionData {
  acceleration: { x: number; y: number; z: number };
  timestamp: number;
}

interface MotionSensorTestProps {
  duration: number;
  onComplete: (data: MotionData[]) => void;
  onError?: (error: string) => void;
}

export default function MotionSensorTest({ duration, onComplete, onError }: MotionSensorTestProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [motionData, setMotionData] = useState<MotionData[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const requestPermission = async () => {
    try {
      if (typeof DeviceMotionEvent !== 'undefined' && 'requestPermission' in DeviceMotionEvent) {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        setHasPermission(permission === 'granted');
        return permission === 'granted';
      }
      // For browsers that don't require permission
      setHasPermission(true);
      return true;
    } catch (error) {
      console.error('Error requesting motion permission:', error);
      onError?.('Failed to request motion sensor permission. Please check your browser settings.');
      setHasPermission(false);
      return false;
    }
  };

  const startTest = async () => {
    const permissionGranted = await requestPermission();
    if (!permissionGranted) return;

    try {
      setIsActive(true);
      setTimeRemaining(duration);
      setMotionData([]);

      // Start motion data collection
      const handleMotion = (event: DeviceMotionEvent) => {
        if (event.acceleration) {
          const data: MotionData = {
            acceleration: {
              x: event.acceleration.x || 0,
              y: event.acceleration.y || 0,
              z: event.acceleration.z || 0
            },
            timestamp: Date.now()
          };
          setMotionData(prev => [...prev, data]);
        }
      };

      window.addEventListener('devicemotion', handleMotion);

      // Start timer
      timerRef.current = setTimeout(() => {
        setIsActive(false);
        window.removeEventListener('devicemotion', handleMotion);
        onComplete(motionData);
      }, duration * 1000);

      // Update countdown
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev && prev <= 1) {
            setIsActive(false);
            window.removeEventListener('devicemotion', handleMotion);
            onComplete(motionData);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error starting motion test:', error);
      onError?.('Failed to start motion test. Please try again.');
      setIsActive(false);
    }
  };

  const calculateTremorScore = (data: MotionData[]): number => {
    if (data.length < 10) return 0;

    // Calculate variance in acceleration to detect tremors
    const xValues = data.map(d => d.acceleration.x);
    const yValues = data.map(d => d.acceleration.y);
    const zValues = data.map(d => d.acceleration.z);

    const variance = (values: number[]) => {
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    };

    const xVariance = variance(xValues);
    const yVariance = variance(yValues);
    const zVariance = variance(zValues);

    const totalVariance = xVariance + yVariance + zVariance;
    
    // Convert variance to tremor score (0-100, higher = more tremor)
    return Math.min(totalVariance * 100, 100);
  };

  const tremorScore = calculateTremorScore(motionData);
  const tremorLevel = tremorScore < 20 ? 'low' : tremorScore < 50 ? 'moderate' : 'high';

  if (hasPermission === false) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Permission Required</h3>
        <p className="text-gray-600 mb-4">
          This test requires access to your device's motion sensors to detect tremors.
        </p>
        <button
          onClick={requestPermission}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Grant Permission
        </button>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="text-center p-8">
        <Activity className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Motion Sensor Test</h3>
        <p className="text-gray-600 mb-4">
          Hold your device steady for {duration} seconds. We'll measure any involuntary movements.
        </p>
        <button
          onClick={startTest}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          Start Test
        </button>
      </div>
    );
  }

  return (
    <div className="text-center p-8">
      <div className="mb-6">
        <div className="text-4xl font-bold text-blue-600 mb-2">{timeRemaining}</div>
        <div className="text-gray-600">seconds remaining</div>
      </div>

      <div className="bg-gray-100 rounded-lg p-6 mb-4">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <Activity className="h-8 w-8 text-blue-500" />
          <span className="text-lg font-medium">Hold device steady</span>
        </div>
        
        {motionData.length > 0 && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Data points collected:</span>
              <span className="font-medium">{motionData.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Tremor level:</span>
              <span className={`font-medium ${
                tremorLevel === 'low' ? 'text-green-600' : 
                tremorLevel === 'moderate' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {tremorLevel}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center space-x-2 text-gray-600">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm">Recording motion data...</span>
      </div>
    </div>
  );
}
