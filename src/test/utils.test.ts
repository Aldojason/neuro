import { describe, it, expect } from 'vitest'
import {
  calculateCognitiveScore,
  calculateMotorScore,
  calculateSpeechScore,
  calculateBehavioralScore
} from '../test/utils'

describe('Assessment Scoring Utilities', () => {
  describe('calculateCognitiveScore', () => {
    it('calculates perfect score for correct responses', () => {
      const responses = {
        3: 'apple, chair, penny', // Perfect recall
        2: '100, 93, 86, 79, 72', // Perfect counting backwards
        5: 'dog, cat, bird, fish, horse, cow, pig, sheep, goat, chicken', // Good fluency
        4: new Date().toISOString().split('T')[0] // Correct date
      }

      const score = calculateCognitiveScore(responses)
      expect(score).toBeGreaterThan(80)
    })

    it('calculates lower score for poor responses', () => {
      const responses = {
        3: 'wrong, words, here', // Wrong recall
        2: '100, 90, 80', // Incomplete counting
        5: 'dog', // Poor fluency
        4: '2020-01-01' // Wrong date
      }

      const score = calculateCognitiveScore(responses)
      expect(score).toBeLessThan(50)
    })

    it('handles missing responses', () => {
      const responses = {}
      const score = calculateCognitiveScore(responses)
      expect(score).toBe(0)
    })

    it('handles partial responses', () => {
      const responses = {
        3: 'apple, chair', // Partial recall
        2: '100, 93, 86' // Partial counting
      }

      const score = calculateCognitiveScore(responses)
      expect(score).toBeGreaterThan(0)
      expect(score).toBeLessThan(100)
    })
  })

  describe('calculateMotorScore', () => {
    it('calculates score based on response completeness', () => {
      const responses = {
        1: { motionData: [], tremorScore: 10 },
        2: { tapData: [], performance: { accuracy: 80 } },
        3: { drawingData: { points: [] }, metrics: { smoothness: 70 } }
      }

      const score = calculateMotorScore(responses)
      expect(score).toBe(60) // 3 responses * 20 = 60
    })

    it('caps score at 100', () => {
      const responses = {
        1: { motionData: [] },
        2: { tapData: [] },
        3: { drawingData: { points: [] } },
        4: { gaitData: [] },
        5: { coordinationData: [] },
        6: { balanceData: [] }
      }

      const score = calculateMotorScore(responses)
      expect(score).toBe(100)
    })
  })

  describe('calculateSpeechScore', () => {
    it('calculates score based on response completeness', () => {
      const responses = {
        1: { audioData: { duration: 30 }, analysis: { clarity: 80 } },
        2: { audioData: { duration: 60 }, analysis: { fluency: 70 } }
      }

      const score = calculateSpeechScore(responses)
      expect(score).toBe(60) // 2 responses * 30 = 60
    })

    it('caps score at 100', () => {
      const responses = {
        1: { audioData: {} },
        2: { audioData: {} },
        3: { audioData: {} },
        4: { audioData: {} }
      }

      const score = calculateSpeechScore(responses)
      expect(score).toBe(100)
    })
  })

  describe('calculateBehavioralScore', () => {
    it('calculates perfect score for positive responses', () => {
      const responses = {
        1: 'Not at all',
        2: 'Not at all',
        3: 'Excellent',
        4: 'Not at all',
        5: 'No difficulty'
      }

      const score = calculateBehavioralScore(responses)
      expect(score).toBe(100)
    })

    it('reduces score for concerning responses', () => {
      const responses = {
        1: 'Nearly every day',
        2: 'More than half the days',
        3: 'Poor',
        4: 'Very much',
        5: 'Severe difficulty'
      }

      const score = calculateBehavioralScore(responses)
      expect(score).toBe(50) // All responses are concerning (100 - 20 - 10 - 10 - 10 = 50)
    })

    it('calculates moderate score for mixed responses', () => {
      const responses = {
        1: 'Several days',
        2: 'Not at all',
        3: 'Good',
        4: 'A little',
        5: 'Mild difficulty'
      }

      const score = calculateBehavioralScore(responses)
      expect(score).toBeGreaterThan(50)
      expect(score).toBeLessThan(100)
    })

    it('handles empty responses', () => {
      const responses = {}
      const score = calculateBehavioralScore(responses)
      expect(score).toBe(100) // No concerning responses
    })
  })
})
