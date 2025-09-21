import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_CONFIG, getGeminiApiKey } from '../config/gemini';

// Initialize Gemini AI
const apiKey = getGeminiApiKey();
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const model = genAI ? genAI.getGenerativeModel({ model: GEMINI_CONFIG.model }) : null;

export interface TestResult {
  id: string;
  type: string;
  score: number;
  riskLevel: 'low' | 'moderate' | 'high';
  completedAt: string;
  duration: number;
  responses: Record<string, any>;
}

export interface AIInsights {
  overallAssessment: string;
  strengths: string[];
  areasForImprovement: string[];
  recommendations: string[];
  riskFactors: string[];
  nextSteps: string[];
  personalizedAdvice: string;
}

export interface AITestQuestion {
  question: string;
  options?: string[];
  correctAnswer?: string;
  explanation: string;
  difficulty: number;
  category: string;
}

class GeminiService {
  private async generateContent(prompt: string): Promise<string> {
    if (!model) {
      throw new Error('Gemini API not configured. Please set your VITE_GEMINI_API_KEY environment variable.');
    }
    
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate AI insights. Please check your API key.');
    }
  }

  async analyzeTestResults(results: TestResult[]): Promise<AIInsights> {
    const prompt = `
You are a neurological assessment AI specialist. Analyze the following test results and provide comprehensive insights:

Test Results:
${JSON.stringify(results, null, 2)}

Please provide a detailed analysis including:
1. Overall assessment of neurological health
2. Key strengths identified
3. Areas that need improvement
4. Specific recommendations for each area
5. Potential risk factors to monitor
6. Next steps for continued assessment
7. Personalized advice based on the results

Format your response as a JSON object with these exact keys:
{
  "overallAssessment": "string",
  "strengths": ["string1", "string2", "string3"],
  "areasForImprovement": ["string1", "string2", "string3"],
  "recommendations": ["string1", "string2", "string3"],
  "riskFactors": ["string1", "string2"],
  "nextSteps": ["string1", "string2", "string3"],
  "personalizedAdvice": "string"
}

Be specific, actionable, and empathetic in your analysis. Focus on neurological health and cognitive function.
`;

    try {
      const response = await this.generateContent(prompt);
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Invalid response format from AI');
    } catch (error) {
      console.error('Error analyzing test results:', error);
      return this.getFallbackInsights(results);
    }
  }

  async generatePersonalizedQuestions(testType: string, userHistory: TestResult[]): Promise<AITestQuestion[]> {
    const prompt = `
You are a neurological test question generator. Create 5 personalized test questions for ${testType} assessment based on the user's test history:

User History:
${JSON.stringify(userHistory, null, 2)}

Generate questions that:
1. Are appropriate for the user's current level
2. Address areas that need improvement
3. Build on their strengths
4. Are clinically relevant for neurological assessment
5. Vary in difficulty appropriately

For each question, provide:
- The question text
- Multiple choice options (if applicable)
- Correct answer
- Explanation of why this question is important
- Difficulty level (1-10)
- Category/subtype

Format as JSON array:
[
  {
    "question": "string",
    "options": ["option1", "option2", "option3", "option4"],
    "correctAnswer": "string",
    "explanation": "string",
    "difficulty": number,
    "category": "string"
  }
]

Make questions specific to ${testType} assessment and neurological health.
`;

    try {
      const response = await this.generateContent(prompt);
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Invalid response format from AI');
    } catch (error) {
      console.error('Error generating questions:', error);
      return this.getFallbackQuestions(testType);
    }
  }

  async generateRecommendations(score: number, testType: string, responses: Record<string, any>): Promise<string[]> {
    const prompt = `
You are a neurological health specialist. Based on a ${testType} test score of ${score}/100 and the following responses, provide 5 specific, actionable recommendations:

Test Responses:
${JSON.stringify(responses, null, 2)}

Provide recommendations that are:
1. Specific to the test type and score
2. Actionable and practical
3. Evidence-based
4. Appropriate for the user's level
5. Focused on neurological health improvement

Return as a JSON array of strings:
["recommendation1", "recommendation2", "recommendation3", "recommendation4", "recommendation5"]
`;

    try {
      const response = await this.generateContent(prompt);
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Invalid response format from AI');
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return this.getFallbackRecommendations(score, testType);
    }
  }

  async analyzePerformanceTrends(results: TestResult[]): Promise<string> {
    const prompt = `
Analyze the performance trends in these neurological test results:

${JSON.stringify(results, null, 2)}

Provide insights on:
1. Overall performance trajectory
2. Specific areas showing improvement or decline
3. Patterns in performance across different test types
4. Recommendations based on trends
5. Potential concerns or positive indicators

Return a comprehensive analysis as a single paragraph.
`;

    try {
      return await this.generateContent(prompt);
    } catch (error) {
      console.error('Error analyzing trends:', error);
      return 'Unable to analyze performance trends at this time.';
    }
  }

  private getFallbackInsights(results: TestResult[]): AIInsights {
    const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
    
    return {
      overallAssessment: `Based on your test results, you have an average score of ${Math.round(avgScore)}/100. This indicates ${avgScore >= 80 ? 'good' : avgScore >= 60 ? 'moderate' : 'room for improvement'} neurological health.`,
      strengths: ['Consistent test completion', 'Good engagement with assessments'],
      areasForImprovement: ['Continue regular testing', 'Focus on areas with lower scores'],
      recommendations: ['Maintain regular assessment schedule', 'Consider consulting a healthcare provider'],
      riskFactors: avgScore < 60 ? ['Low test scores may indicate need for evaluation'] : [],
      nextSteps: ['Schedule follow-up tests', 'Monitor progress over time'],
      personalizedAdvice: 'Continue with regular neurological assessments to track your health over time.'
    };
  }

  private getFallbackQuestions(testType: string): AITestQuestion[] {
    const baseQuestions = {
      cognitive: [
        {
          question: "What is 7 + 8?",
          options: ["14", "15", "16", "17"],
          correctAnswer: "15",
          explanation: "Basic arithmetic tests working memory and calculation ability.",
          difficulty: 3,
          category: "arithmetic"
        }
      ],
      motor: [
        {
          question: "Tap the screen as quickly as possible for 10 seconds.",
          options: [],
          correctAnswer: "Multiple taps",
          explanation: "Tests reaction time and motor coordination.",
          difficulty: 4,
          category: "reaction_time"
        }
      ],
      speech: [
        {
          question: "Read this sentence aloud: 'The quick brown fox jumps over the lazy dog.'",
          options: [],
          correctAnswer: "Clear pronunciation",
          explanation: "Tests speech clarity and fluency.",
          difficulty: 3,
          category: "reading"
        }
      ],
      behavioral: [
        {
          question: "How often do you feel anxious or worried?",
          options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
          correctAnswer: "Varies",
          explanation: "Assesses emotional well-being and stress levels.",
          difficulty: 2,
          category: "mood"
        }
      ]
    };

    return baseQuestions[testType as keyof typeof baseQuestions] || baseQuestions.cognitive;
  }

  private getFallbackRecommendations(score: number, testType: string): string[] {
    const recommendations = {
      cognitive: [
        "Practice memory exercises daily",
        "Engage in puzzles and brain games",
        "Maintain a regular sleep schedule",
        "Stay mentally active with reading",
        "Consider cognitive training programs"
      ],
      motor: [
        "Practice fine motor skills exercises",
        "Engage in regular physical activity",
        "Try coordination-based activities",
        "Maintain good posture",
        "Consider occupational therapy if needed"
      ],
      speech: [
        "Practice reading aloud daily",
        "Engage in conversations regularly",
        "Try tongue twisters and pronunciation exercises",
        "Consider speech therapy if needed",
        "Maintain vocal health"
      ],
      behavioral: [
        "Practice stress management techniques",
        "Maintain regular social connections",
        "Engage in enjoyable activities",
        "Consider counseling or therapy",
        "Maintain a healthy lifestyle"
      ]
    };

    return recommendations[testType as keyof typeof recommendations] || recommendations.cognitive;
  }
}

export const geminiService = new GeminiService();
