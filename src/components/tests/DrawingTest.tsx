import React, { useState, useRef, useEffect } from 'react';
import { PenTool, RotateCcw, CheckCircle } from 'lucide-react';

interface DrawingData {
  points: Array<{ x: number; y: number; timestamp: number }>;
  strokes: Array<Array<{ x: number; y: number; timestamp: number }>>;
  totalTime: number;
  pathLength: number;
}

interface DrawingTestProps {
  drawingType: 'spiral' | 'line' | 'circle';
  onComplete: (data: DrawingData) => void;
}

export default function DrawingTest({ drawingType, onComplete }: DrawingTestProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Array<{ x: number; y: number; timestamp: number }>>([]);
  const [allStrokes, setAllStrokes] = useState<Array<Array<{ x: number; y: number; timestamp: number }>>>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getDrawingInstructions = () => {
    switch (drawingType) {
      case 'spiral':
        return {
          title: 'Spiral Drawing Test',
          instruction: 'Draw a spiral starting from the center, moving outward. Try to stay on the guide line.',
          guide: 'spiral'
        };
      case 'line':
        return {
          title: 'Line Drawing Test',
          instruction: 'Draw a straight line from the left point to the right point.',
          guide: 'line'
        };
      case 'circle':
        return {
          title: 'Circle Drawing Test',
          instruction: 'Draw a circle following the guide circle as closely as possible.',
          guide: 'circle'
        };
      default:
        return {
          title: 'Drawing Test',
          instruction: 'Follow the guide to complete the drawing.',
          guide: 'none'
        };
    }
  };

  const instructions = getDrawingInstructions();

  const startDrawing = () => {
    try {
      setIsDrawing(true);
      setStartTime(Date.now());
      setCurrentPath([]);
      setAllStrokes([]);
    } catch (error) {
      console.error('Error starting drawing test:', error);
    }
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const pos = getMousePos(e);
    const newPoint = { ...pos, timestamp: Date.now() };
    setCurrentPath([newPoint]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || currentPath.length === 0) return;
    
    const pos = getMousePos(e);
    const newPoint = { ...pos, timestamp: Date.now() };
    setCurrentPath(prev => [...prev, newPoint]);
    drawCurrentPath();
  };

  const handleMouseUp = () => {
    if (!isDrawing || currentPath.length === 0) return;
    
    setAllStrokes(prev => [...prev, currentPath]);
    setCurrentPath([]);
  };

  const drawGuide = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    switch (instructions.guide) {
      case 'spiral':
        ctx.beginPath();
        for (let i = 0; i < 4 * Math.PI; i += 0.1) {
          const radius = 20 + i * 8;
          const x = centerX + Math.cos(i) * radius;
          const y = centerY + Math.sin(i) * radius;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        break;
        
      case 'line':
        ctx.beginPath();
        ctx.moveTo(50, centerY);
        ctx.lineTo(canvas.width - 50, centerY);
        ctx.stroke();
        break;
        
      case 'circle':
        ctx.beginPath();
        ctx.arc(centerX, centerY, 80, 0, 2 * Math.PI);
        ctx.stroke();
        break;
    }
    
    ctx.setLineDash([]);
  };

  const drawCurrentPath = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Redraw guide
    drawGuide();
    
    // Draw completed strokes
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    allStrokes.forEach(stroke => {
      if (stroke.length > 1) {
        ctx.beginPath();
        ctx.moveTo(stroke[0].x, stroke[0].y);
        for (let i = 1; i < stroke.length; i++) {
          ctx.lineTo(stroke[i].x, stroke[i].y);
        }
        ctx.stroke();
      }
    });
    
    // Draw current path
    if (currentPath.length > 1) {
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(currentPath[0].x, currentPath[0].y);
      for (let i = 1; i < currentPath.length; i++) {
        ctx.lineTo(currentPath[i].x, currentPath[i].y);
      }
      ctx.stroke();
    }
  };

  useEffect(() => {
    drawGuide();
  }, []);

  const calculateDrawingMetrics = (): {
    smoothness: number;
    accuracy: number;
    speed: number;
    tremor: number;
  } => {
    if (allStrokes.length === 0) return { smoothness: 0, accuracy: 0, speed: 0, tremor: 0 };

    const allPoints = allStrokes.flat();
    if (allPoints.length < 2) return { smoothness: 0, accuracy: 0, speed: 0, tremor: 0 };

    // Calculate smoothness (based on angle changes)
    let totalAngleChange = 0;
    for (let i = 2; i < allPoints.length; i++) {
      const p1 = allPoints[i - 2];
      const p2 = allPoints[i - 1];
      const p3 = allPoints[i];
      
      const angle1 = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
      const angleChange = Math.abs(angle2 - angle1);
      totalAngleChange += angleChange;
    }
    const smoothness = Math.max(0, 100 - (totalAngleChange / allPoints.length) * 50);

    // Calculate speed (points per second)
    const totalTime = (allPoints[allPoints.length - 1].timestamp - allPoints[0].timestamp) / 1000;
    const speed = allPoints.length / totalTime;

    // Calculate tremor (high frequency variations)
    let tremorSum = 0;
    for (let i = 1; i < allPoints.length; i++) {
      const prev = allPoints[i - 1];
      const curr = allPoints[i];
      const distance = Math.sqrt(Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2));
      tremorSum += distance;
    }
    const avgDistance = tremorSum / (allPoints.length - 1);
    const tremor = Math.min(avgDistance * 2, 100);

    // Calculate accuracy (how well it follows the guide)
    let accuracy = 100;
    if (instructions.guide === 'circle') {
      const centerX = canvasRef.current!.width / 2;
      const centerY = canvasRef.current!.height / 2;
      const targetRadius = 80;
      
      let totalDeviation = 0;
      allPoints.forEach(point => {
        const distance = Math.sqrt(Math.pow(point.x - centerX, 2) + Math.pow(point.y - centerY, 2));
        const deviation = Math.abs(distance - targetRadius);
        totalDeviation += deviation;
      });
      accuracy = Math.max(0, 100 - (totalDeviation / allPoints.length) * 2);
    }

    return { smoothness, accuracy, speed, tremor };
  };

  const completeTest = () => {
    if (!startTime) return;
    
    const allPoints = allStrokes.flat();
    const totalTime = (Date.now() - startTime) / 1000;
    
    // Calculate path length
    let pathLength = 0;
    for (let i = 1; i < allPoints.length; i++) {
      const prev = allPoints[i - 1];
      const curr = allPoints[i];
      pathLength += Math.sqrt(Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2));
    }

    const data: DrawingData = {
      points: allPoints,
      strokes: allStrokes,
      totalTime,
      pathLength
    };

    onComplete(data);
  };

  const clearDrawing = () => {
    setAllStrokes([]);
    setCurrentPath([]);
    drawGuide();
  };

  const metrics = calculateDrawingMetrics();

  if (!isDrawing) {
    return (
      <div className="text-center p-8">
        <PenTool className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{instructions.title}</h3>
        <p className="text-gray-600 mb-4">{instructions.instruction}</p>
        <button
          onClick={startDrawing}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          Start Drawing
        </button>
      </div>
    );
  }

  return (
    <div className="text-center p-8">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{instructions.title}</h3>
        <p className="text-gray-600">{instructions.instruction}</p>
      </div>

      <div className="bg-gray-100 rounded-lg p-4 mb-4">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="border border-gray-300 rounded cursor-crosshair bg-white"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="bg-white p-3 rounded-lg">
          <div className="font-medium text-gray-900">Smoothness</div>
          <div className="text-xl font-bold text-blue-600">{metrics.smoothness.toFixed(0)}%</div>
        </div>
        <div className="bg-white p-3 rounded-lg">
          <div className="font-medium text-gray-900">Accuracy</div>
          <div className="text-xl font-bold text-green-600">{metrics.accuracy.toFixed(0)}%</div>
        </div>
      </div>

      <div className="flex space-x-4 justify-center">
        <button
          onClick={clearDrawing}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Clear
        </button>
        <button
          onClick={completeTest}
          className="flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Complete Test
        </button>
      </div>
    </div>
  );
}
