import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Square, RotateCcw } from 'lucide-react';

interface AudioData {
  duration: number;
  sampleRate: number;
  audioBlob: Blob;
  analysis: {
    volume: number;
    clarity: number;
    fluency: number;
    pauses: number;
  };
}

interface AudioRecordingTestProps {
  duration: number;
  text?: string;
  onComplete: (data: AudioData) => void;
  onError?: (error: string) => void;
}

export default function AudioRecordingTest({ duration, text, onComplete, onError }: AudioRecordingTestProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingComplete, setRecordingComplete] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      onError?.('Microphone access denied. Please allow microphone access to continue.');
      setHasPermission(false);
      return false;
    }
  };

  const startRecording = async () => {
    const permissionGranted = await requestMicrophonePermission();
    if (!permissionGranted) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setRecordingComplete(true);
        analyzeAudio(audioBlob);
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        onError?.('Recording error occurred. Please try again.');
        setIsRecording(false);
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setTimeRemaining(duration);

      // Start timer
      timerRef.current = setTimeout(() => {
        stopRecording();
      }, duration * 1000);

      // Update countdown
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev && prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      onError?.('Failed to start recording. Please check your microphone and try again.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const playRecording = () => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const resetRecording = () => {
    setRecordingComplete(false);
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setTimeRemaining(duration);
  };

  const analyzeAudio = async (blob: Blob) => {
    try {
      // This is a simplified analysis - in a real app, you'd use Web Audio API
      // or send to a backend service for proper audio analysis
      const analysis = {
        volume: Math.random() * 100, // Simulated volume analysis
        clarity: Math.random() * 100, // Simulated clarity analysis
        fluency: Math.random() * 100, // Simulated fluency analysis
        pauses: Math.floor(Math.random() * 10) // Simulated pause count
      };

      const audioData: AudioData = {
        duration: duration,
        sampleRate: 44100,
        audioBlob: blob,
        analysis
      };

      onComplete(audioData);
    } catch (error) {
      console.error('Error analyzing audio:', error);
      onError?.('Failed to analyze audio recording.');
    }
  };

  const getAnalysisColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (hasPermission === false) {
    return (
      <div className="text-center p-8">
        <MicOff className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Microphone Access Required</h3>
        <p className="text-gray-600 mb-4">
          This test requires access to your microphone to record and analyze your speech.
        </p>
        <button
          onClick={requestMicrophonePermission}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Grant Permission
        </button>
      </div>
    );
  }

  if (recordingComplete && audioBlob) {
    return (
      <div className="text-center p-8">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Recording Complete</h3>
          <p className="text-gray-600">Your audio has been recorded and analyzed.</p>
        </div>

        <div className="bg-gray-100 rounded-lg p-6 mb-6">
          <audio
            ref={audioRef}
            src={audioUrl || undefined}
            onEnded={() => setIsPlaying(false)}
            className="w-full mb-4"
            controls
          />
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={isPlaying ? stopPlayback : playRecording}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {isPlaying ? <Square className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isPlaying ? 'Stop' : 'Play'}
            </button>
            <button
              onClick={resetRecording}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Record Again
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          Duration: {duration} seconds • Size: {(audioBlob.size / 1024).toFixed(1)} KB
        </div>
      </div>
    );
  }

  return (
    <div className="text-center p-8">
      <div className="mb-6">
        <div className="flex items-center justify-center mb-4">
          {isRecording ? (
            <div className="relative">
              <Mic className="h-12 w-12 text-red-500 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
            </div>
          ) : (
            <Mic className="h-12 w-12 text-blue-500" />
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Audio Recording Test</h3>
        <p className="text-gray-600 mb-4">
          {text ? `Read the following text: "${text}"` : 'Speak clearly for the duration of the test.'}
        </p>
        
        {isRecording && (
          <div className="text-2xl font-bold text-red-600 mb-2">{timeRemaining}s</div>
        )}
      </div>

      {text && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 font-medium">{text}</p>
        </div>
      )}

      <div className="space-y-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 font-medium"
          >
            Start Recording
          </button>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-red-600">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Recording in progress...</span>
            </div>
            <button
              onClick={stopRecording}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              Stop Recording
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
