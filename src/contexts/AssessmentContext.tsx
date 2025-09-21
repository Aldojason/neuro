import React, { createContext, useContext, useState } from 'react';

interface AssessmentResult {
  id: string;
  type: string;
  score: number;
  riskLevel: 'low' | 'moderate' | 'high';
  recommendations: string[];
  completedAt: string;
  responses: Record<string, any>;
  duration: number;
  questionCount: number;
  skippedQuestions: number[];
  validationErrors: Record<string, string[]>;
}

interface AssessmentSession {
  id: string;
  type: string;
  startTime: number;
  currentQuestion: number;
  responses: Record<string, any>;
  timeSpent: Record<string, number>;
  completedQuestions: number[];
  skippedQuestions: number[];
  validationErrors: Record<string, string[]>;
}

interface AssessmentContextType {
  results: AssessmentResult[];
  currentSession: AssessmentSession | null;
  addResult: (result: Omit<AssessmentResult, 'id' | 'completedAt'>) => void;
  getResultsByType: (type: string) => AssessmentResult[];
  getLatestResult: (type: string) => AssessmentResult | null;
  startSession: (type: string) => void;
  updateSession: (updates: Partial<AssessmentSession>) => void;
  endSession: () => void;
  getSessionProgress: () => {
    currentQuestion: number;
    totalQuestions: number;
    completedQuestions: number[];
    skippedQuestions: number[];
    timeElapsed: number;
    estimatedTimeRemaining: number;
  } | null;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
}

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [currentSession, setCurrentSession] = useState<AssessmentSession | null>(null);

  const addResult = (result: Omit<AssessmentResult, 'id' | 'completedAt'>) => {
    const newResult: AssessmentResult = {
      ...result,
      id: Date.now().toString(),
      completedAt: new Date().toISOString()
    };
    setResults(prev => [newResult, ...prev]);
  };

  const getResultsByType = (type: string) => {
    return results.filter(result => result.type === type);
  };

  const getLatestResult = (type: string) => {
    const typeResults = getResultsByType(type);
    return typeResults.length > 0 ? typeResults[0] : null;
  };

  const startSession = (type: string) => {
    const session: AssessmentSession = {
      id: Date.now().toString(),
      type,
      startTime: Date.now(),
      currentQuestion: 0,
      responses: {},
      timeSpent: {},
      completedQuestions: [],
      skippedQuestions: [],
      validationErrors: {}
    };
    setCurrentSession(session);
  };

  const updateSession = (updates: Partial<AssessmentSession>) => {
    if (currentSession) {
      setCurrentSession(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const endSession = () => {
    setCurrentSession(null);
  };

  const getSessionProgress = () => {
    if (!currentSession) return null;

    const timeElapsed = Math.floor((Date.now() - currentSession.startTime) / 1000);
    const avgTimePerQuestion = 120; // 2 minutes average
    const remainingQuestions = 5 - currentSession.currentQuestion; // Assuming 5 questions
    const estimatedTimeRemaining = remainingQuestions * avgTimePerQuestion;

    return {
      currentQuestion: currentSession.currentQuestion,
      totalQuestions: 5, // This should come from assessment data
      completedQuestions: currentSession.completedQuestions,
      skippedQuestions: currentSession.skippedQuestions,
      timeElapsed,
      estimatedTimeRemaining
    };
  };

  const value = {
    results,
    currentSession,
    addResult,
    getResultsByType,
    getLatestResult,
    startSession,
    updateSession,
    endSession,
    getSessionProgress
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
}