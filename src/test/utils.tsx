import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'
import { AssessmentProvider } from '../contexts/AssessmentContext'

// Only import vi in test environment
const vi = typeof window === 'undefined' ? require('vitest').vi : null

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AssessmentProvider>
          {children}
        </AssessmentProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  ...overrides
})

export const createMockAssessmentResult = (overrides = {}) => ({
  id: '1',
  type: 'cognitive',
  score: 85,
  riskLevel: 'low' as const,
  recommendations: ['Continue regular monitoring'],
  completedAt: new Date().toISOString(),
  responses: { 1: 'test response' },
  ...overrides
})

export const createMockAssessmentData = (type: string) => {
  const baseData = {
    cognitive: {
      name: 'Cognitive Assessment',
      description: 'Evaluates memory, attention, and processing speed',
      questions: [
        {
          id: 1,
          type: 'memory',
          question: 'Test question',
          instruction: 'Test instruction',
          responseType: 'text'
        }
      ]
    }
  }
  
  return baseData[type as keyof typeof baseData] || baseData.cognitive
}

// Mock device sensors
export const mockDeviceMotion = (acceleration: { x: number; y: number; z: number }) => {
  const event = new Event('devicemotion') as any
  event.acceleration = acceleration
  event.accelerationIncludingGravity = acceleration
  event.rotationRate = { alpha: 0, beta: 0, gamma: 0 }
  event.interval = 16
  return event
}

export const mockDeviceOrientation = (orientation: { alpha: number; beta: number; gamma: number }) => {
  const event = new Event('deviceorientation') as any
  event.alpha = orientation.alpha
  event.beta = orientation.beta
  event.gamma = orientation.gamma
  return event
}

// Mock audio recording
export const mockMediaRecorder = () => {
  const mockFn = vi ? vi.fn() : () => {}
  const mockRecorder = {
    start: mockFn,
    stop: mockFn,
    pause: mockFn,
    resume: mockFn,
    addEventListener: mockFn,
    removeEventListener: mockFn,
    state: 'inactive',
    mimeType: 'audio/webm'
  }
  
  Object.defineProperty(window, 'MediaRecorder', {
    writable: true,
    value: vi ? vi.fn().mockImplementation(() => mockRecorder) : () => mockRecorder
  })
  
  return mockRecorder
}

// Assessment scoring utilities
export const calculateCognitiveScore = (responses: Record<string, any>) => {
  let score = 0
  let totalWeight = 0
  
  // Memory test scoring
  if (responses[3]) { // Recall question
    const recalledWords = responses[3].toLowerCase().split(',').map((w: string) => w.trim())
    const targetWords = ['apple', 'chair', 'penny']
    const correctWords = recalledWords.filter((word: string) => 
      targetWords.some(target => word.includes(target) || target.includes(word))
    )
    score += (correctWords.length / targetWords.length) * 15
    totalWeight += 15
  }
  
  // Attention test scoring (counting backwards)
  if (responses[2]) {
    const numbers = responses[2].split(',').map((n: string) => parseInt(n.trim()))
    const expected = [100, 93, 86, 79, 72]
    const correct = numbers.filter((num: number, i: number) => num === expected[i]).length
    score += (correct / expected.length) * 10
    totalWeight += 10
  }
  
  // Language fluency test
  if (responses[5]) {
    const animals = responses[5].split(',').map((a: string) => a.trim()).filter((a: string) => a.length > 0)
    const fluencyScore = Math.min(animals.length * 2, 10) // Max 10 points for 5+ animals
    score += fluencyScore
    totalWeight += 10
  }
  
  // Orientation test
  if (responses[4]) {
    const testDate = new Date(responses[4])
    const today = new Date()
    const daysDiff = Math.abs(today.getTime() - testDate.getTime()) / (1000 * 60 * 60 * 24)
    if (daysDiff <= 1) {
      score += 10
    } else if (daysDiff <= 7) {
      score += 5
    }
    totalWeight += 10
  }

  // Memory Game scoring
  if (responses[6] && responses[6].gameData) {
    const gameScore = responses[6].gameData.score || 0
    score += (gameScore / 100) * 15
    totalWeight += 15
  }

  // Number Sequence Game scoring
  if (responses[7] && responses[7].gameData) {
    const gameScore = responses[7].gameData.score || 0
    score += (gameScore / 100) * 15
    totalWeight += 15
  }

  // Word Association Game scoring
  if (responses[8] && responses[8].gameData) {
    const gameScore = responses[8].gameData.score || 0
    score += (gameScore / 100) * 10
    totalWeight += 10
  }

  // Pattern Recognition Game scoring
  if (responses[9] && responses[9].gameData) {
    const gameScore = responses[9].gameData.score || 0
    score += (gameScore / 100) * 10
    totalWeight += 10
  }

  // Reaction Time Test scoring
  if (responses[10] && responses[10].performance) {
    const reactionScore = Math.max(0, 100 - (responses[10].performance.averageReactionTime || 0))
    score += (reactionScore / 100) * 5
    totalWeight += 5
  }

  // Spatial Memory Test scoring
  if (responses[11] && responses[11].performance) {
    const spatialScore = responses[11].performance.accuracy || 0
    score += (spatialScore / 100) * 5
    totalWeight += 5
  }

  // Executive Function Test scoring
  if (responses[12] && responses[12].performance) {
    const executiveScore = responses[12].performance.accuracy || 0
    score += (executiveScore / 100) * 5
    totalWeight += 5
  }
  
  return totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 0
}

export const calculateMotorScore = (responses: Record<string, any>) => {
  // This would analyze motion sensor data, tap patterns, drawing quality, etc.
  // For now, return a mock score based on response completeness
  const responseCount = Object.keys(responses).length
  return Math.min(responseCount * 20, 100)
}

export const calculateSpeechScore = (responses: Record<string, any>) => {
  // This would analyze audio recordings for clarity, fluency, etc.
  // For now, return a mock score based on response completeness
  const responseCount = Object.keys(responses).length
  return Math.min(responseCount * 30, 100)
}

export const calculateBehavioralScore = (responses: Record<string, any>) => {
  let score = 100 // Start with perfect score
  
  // Lower score for concerning responses
  Object.values(responses).forEach((response: string) => {
    if (typeof response === 'string') {
      const lowerResponse = response.toLowerCase()
      if (lowerResponse.includes('nearly every day') || lowerResponse.includes('severe')) {
        score -= 20
      } else if (lowerResponse.includes('more than half') || lowerResponse.includes('moderate')) {
        score -= 10
      } else if (lowerResponse.includes('several days') || lowerResponse.includes('mild')) {
        score -= 5
      }
    }
  })
  
  return Math.max(score, 0)
}
