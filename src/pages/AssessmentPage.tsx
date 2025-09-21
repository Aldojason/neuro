import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, Brain, Activity, Users, TrendingUp } from 'lucide-react';
import { useAssessment } from '../contexts/AssessmentContext';
import MotionSensorTest from '../components/tests/MotionSensorTest';
import TapTest from '../components/tests/TapTest';
import DrawingTest from '../components/tests/DrawingTest';
import AudioRecordingTest from '../components/tests/AudioRecordingTest';
import ReactionTimeTest from '../components/tests/ReactionTimeTest';
import SpatialMemoryTest from '../components/tests/SpatialMemoryTest';
import ExecutiveFunctionTest from '../components/tests/ExecutiveFunctionTest';
import MemoryGame from '../components/tests/MemoryGame';
import NumberSequenceGame from '../components/tests/NumberSequenceGame';
import WordAssociationGame from '../components/tests/WordAssociationGame';
import PatternRecognitionGame from '../components/tests/PatternRecognitionGame';
import { calculateCognitiveScore, calculateMotorScore, calculateSpeechScore, calculateBehavioralScore } from '../test/utils';

const assessmentData = {
  cognitive: {
    name: 'Cognitive Assessment',
    icon: Brain,
    description: 'Evaluates memory, attention, and processing speed',
    questions: [
      {
        id: 1,
        type: 'memory',
        question: 'Please remember these three words: Apple, Chair, Penny. We\'ll ask about them later.',
        instruction: 'Click "Continue" when you\'ve memorized the three words.',
        responseType: 'continue'
      },
      {
        id: 2,
        type: 'attention',
        question: 'Count backwards from 100 by 7s. Enter the first 5 numbers:',
        instruction: 'Example: 100, 93, 86...',
        responseType: 'text',
        placeholder: 'Enter numbers separated by commas'
      },
      {
        id: 3,
        type: 'recall',
        question: 'What were the three words from the beginning?',
        instruction: 'Enter the three words you were asked to remember.',
        responseType: 'text',
        placeholder: 'Enter the three words'
      },
      {
        id: 4,
        type: 'orientation',
        question: 'What is today\'s date?',
        instruction: 'Please enter the current date.',
        responseType: 'date'
      },
      {
        id: 5,
        type: 'language',
        question: 'Name as many animals as you can in 1 minute:',
        instruction: 'Type animal names separated by commas. You have 60 seconds.',
        responseType: 'timed_text',
        timeLimit: 60
      },
      {
        id: 6,
        type: 'memory_game',
        question: 'Play a memory game to test your visual memory and concentration',
        instruction: 'Match pairs of symbols by remembering their positions. Complete the game to continue.',
        responseType: 'memory_game',
        difficulty: 'medium'
      },
      {
        id: 7,
        type: 'number_sequence',
        question: 'Test your logical thinking with number sequence patterns',
        instruction: 'Find the pattern in the number sequence and predict the next number.',
        responseType: 'number_sequence',
        difficulty: 'medium'
      },
      {
        id: 8,
        type: 'word_association',
        question: 'Test your verbal reasoning and word association skills',
        instruction: 'Choose the word that best associates with the given word.',
        responseType: 'word_association',
        difficulty: 'medium'
      },
      {
        id: 9,
        type: 'pattern_recognition',
        question: 'Test your visual pattern recognition abilities',
        instruction: 'Identify the pattern in the sequence and choose what comes next.',
        responseType: 'pattern_recognition',
        difficulty: 'medium'
      },
      {
        id: 10,
        type: 'reaction_time',
        question: 'Test your reaction speed by clicking targets as quickly as possible',
        instruction: 'Click targets when they appear. Test duration: 30 seconds.',
        responseType: 'reaction_time',
        duration: 30
      },
      {
        id: 11,
        type: 'spatial_memory',
        question: 'Test your spatial memory by memorizing and recreating position sequences',
        instruction: 'Watch the sequence of highlighted positions, then click them in the same order.',
        responseType: 'spatial_memory'
      },
      {
        id: 12,
        type: 'executive_function',
        question: 'Test your executive function with the Stroop test',
        instruction: 'Click the color of the text, not the word meaning. Test duration: 60 seconds.',
        responseType: 'executive_function',
        duration: 60
      }
    ]
  },
  motor: {
    name: 'Motor Function Assessment',
    icon: Activity,
    description: 'Analyzes tremor, coordination, and movement patterns',
    questions: [
      {
        id: 1,
        type: 'tremor',
        question: 'Hold your device steady for 30 seconds',
        instruction: 'We\'ll measure any involuntary movements or tremors.',
        responseType: 'motion_sensor',
        duration: 30
      },
      {
        id: 2,
        type: 'coordination',
        question: 'Tap the screen alternating between your index fingers',
        instruction: 'Tap as quickly and accurately as possible for 20 seconds.',
        responseType: 'tap_test',
        duration: 20
      },
      {
        id: 3,
        type: 'fine_motor',
        question: 'Draw a spiral by following the guide',
        instruction: 'Try to stay on the line and maintain smooth movement.',
        responseType: 'drawing',
        drawingType: 'spiral'
      },
      {
        id: 4,
        type: 'gait',
        question: 'Walk 10 steps and return to starting position',
        instruction: 'Keep your device in your pocket during this test.',
        responseType: 'walking_test',
        steps: 10
      }
    ]
  },
  speech: {
    name: 'Speech Analysis',
    icon: Users,
    description: 'Evaluates voice patterns, clarity, and speech timing',
    questions: [
      {
        id: 1,
        type: 'reading',
        question: 'Read this passage aloud:',
        text: 'The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet.',
        instruction: 'Read clearly and at your normal pace.',
        responseType: 'audio_recording',
        duration: 30
      },
      {
        id: 2,
        type: 'spontaneous',
        question: 'Describe your morning routine',
        instruction: 'Speak for about 1 minute describing what you typically do each morning.',
        responseType: 'audio_recording',
        duration: 60
      },
      {
        id: 3,
        type: 'naming',
        question: 'Name these objects as quickly as possible:',
        images: ['clock', 'book', 'car', 'tree', 'house'],
        instruction: 'Say the name of each object you see.',
        responseType: 'audio_recording',
        duration: 30
      }
    ]
  },
  behavioral: {
    name: 'Behavioral Assessment',
    icon: TrendingUp,
    description: 'Evaluates mood, behavior patterns, and mental health',
    questions: [
      {
        id: 1,
        type: 'mood',
        question: 'Over the past two weeks, how often have you felt down, depressed, or hopeless?',
        options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
        responseType: 'radio'
      },
      {
        id: 2,
        type: 'anxiety',
        question: 'How often do you feel nervous, anxious, or on edge?',
        options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
        responseType: 'radio'
      },
      {
        id: 3,
        type: 'sleep',
        question: 'How would you rate your sleep quality over the past month?',
        options: ['Excellent', 'Good', 'Fair', 'Poor'],
        responseType: 'radio'
      },
      {
        id: 4,
        type: 'memory_concern',
        question: 'Are you concerned about changes in your memory or thinking?',
        options: ['Not at all', 'A little', 'Moderately', 'Very much'],
        responseType: 'radio'
      },
      {
        id: 5,
        type: 'daily_activities',
        question: 'Do you have difficulty with daily activities due to memory or thinking problems?',
        options: ['No difficulty', 'Mild difficulty', 'Moderate difficulty', 'Severe difficulty'],
        responseType: 'radio'
      }
    ]
  }
};

export default function AssessmentPage() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { addResult } = useAssessment();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [startTime] = useState<number>(Date.now());
  
  const assessment = type ? assessmentData[type as keyof typeof assessmentData] : null;

  if (!assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Assessment Not Found</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQ = assessment.questions[currentQuestion];
  const isLastQuestion = currentQuestion === assessment.questions.length - 1;
  const Icon = assessment.icon;

  const handleResponse = (value: any) => {
    setResponses(prev => ({
      ...prev,
      [currentQ.id]: value
    }));
  };

  const nextQuestion = () => {
    if (isLastQuestion) {
      completeAssessment();
    } else {
      setCurrentQuestion(prev => prev + 1);
      setTimeRemaining(null);
    }
  };

  const completeAssessment = () => {
    // Calculate actual score based on assessment type and responses
    let score = 0;
    let recommendations: string[] = [];
    
    switch (type) {
      case 'cognitive':
        score = calculateCognitiveScore(responses);
        recommendations = getCognitiveRecommendations(score);
        break;
      case 'motor':
        score = calculateMotorScore(responses);
        recommendations = getMotorRecommendations(score);
        break;
      case 'speech':
        score = calculateSpeechScore(responses);
        recommendations = getSpeechRecommendations(score);
        break;
      case 'behavioral':
        score = calculateBehavioralScore(responses);
        recommendations = getBehavioralRecommendations(score);
        break;
      default:
        score = 75; // Default score
        recommendations = ['Continue regular monitoring'];
    }
    
    const riskLevel = score >= 85 ? 'low' : score >= 70 ? 'moderate' : 'high';

    addResult({
      type: type!,
      score,
      riskLevel,
      recommendations,
      responses,
      duration: Date.now() - startTime,
      questionCount: assessment.questions.length,
      skippedQuestions: [],
      validationErrors: {}
    });

    navigate('/dashboard');
  };

  const getCognitiveRecommendations = (score: number): string[] => {
    if (score >= 85) {
      return [
        'Continue regular monitoring with monthly assessments',
        'Maintain a healthy lifestyle with regular exercise',
        'Practice brain-training exercises and mental stimulation',
        'Consider annual comprehensive cognitive evaluations'
      ];
    } else if (score >= 70) {
      return [
        'Increase physical activity and brain training exercises',
        'Maintain a balanced diet rich in omega-3 fatty acids',
        'Consider discussing results with your healthcare provider',
        'Schedule follow-up assessments in 3-6 months'
      ];
    } else {
      return [
        'Schedule an appointment with your healthcare provider',
        'Consider comprehensive neurological evaluation',
        'Bring these results to your medical consultation',
        'Implement lifestyle modifications as recommended by your doctor'
      ];
    }
  };

  const getMotorRecommendations = (score: number): string[] => {
    if (score >= 85) {
      return [
        'Continue regular physical activity',
        'Maintain fine motor skill exercises',
        'Monitor for any changes in coordination',
        'Consider regular movement assessments'
      ];
    } else if (score >= 70) {
      return [
        'Increase physical therapy and coordination exercises',
        'Consider occupational therapy evaluation',
        'Practice fine motor skill activities daily',
        'Discuss results with your healthcare provider'
      ];
    } else {
      return [
        'Seek immediate evaluation by a neurologist',
        'Consider comprehensive movement disorder assessment',
        'Implement safety measures for daily activities',
        'Follow up with healthcare provider promptly'
      ];
    }
  };

  const getSpeechRecommendations = (score: number): string[] => {
    if (score >= 85) {
      return [
        'Continue regular speech practice',
        'Maintain vocal exercises and breathing techniques',
        'Monitor for any changes in speech clarity',
        'Consider annual speech evaluations'
      ];
    } else if (score >= 70) {
      return [
        'Practice speech exercises daily',
        'Consider speech therapy evaluation',
        'Focus on articulation and breathing exercises',
        'Discuss results with your healthcare provider'
      ];
    } else {
      return [
        'Seek immediate speech therapy evaluation',
        'Consider comprehensive communication assessment',
        'Implement communication aids if needed',
        'Follow up with healthcare provider promptly'
      ];
    }
  };

  const getBehavioralRecommendations = (score: number): string[] => {
    if (score >= 85) {
      return [
        'Continue current lifestyle and stress management',
        'Maintain regular social connections',
        'Practice mindfulness and relaxation techniques',
        'Monitor mood and behavior patterns'
      ];
    } else if (score >= 70) {
      return [
        'Increase social activities and mental stimulation',
        'Consider counseling or therapy services',
        'Implement stress reduction techniques',
        'Discuss results with your healthcare provider'
      ];
    } else {
      return [
        'Seek immediate mental health evaluation',
        'Consider comprehensive psychological assessment',
        'Implement crisis intervention if needed',
        'Follow up with healthcare provider promptly'
      ];
    }
  };

  const startTimer = (seconds: number) => {
    setTimeRemaining(seconds);
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev && prev <= 1) {
          clearInterval(timer);
          nextQuestion();
          return 0;
        }
        return prev ? prev - 1 : 0;
      });
    }, 1000);
  };

  const renderQuestion = () => {
    switch (currentQ.responseType) {
      case 'continue':
        return (
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-6">{currentQ.question}</p>
            <p className="text-gray-600 mb-8">{(currentQ as any).instruction || currentQ.question}</p>
            <button
              onClick={nextQuestion}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Continue
            </button>
          </div>
        );

      case 'text':
        return (
          <div>
            <p className="text-lg text-gray-700 mb-4">{currentQ.question}</p>
            <p className="text-gray-600 mb-6">{(currentQ as any).instruction || currentQ.question}</p>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
                  placeholder={(currentQ as any).placeholder}
              onChange={(e) => handleResponse(e.target.value)}
            />
          </div>
        );

      case 'date':
        return (
          <div>
            <p className="text-lg text-gray-700 mb-4">{currentQ.question}</p>
            <p className="text-gray-600 mb-6">{(currentQ as any).instruction || currentQ.question}</p>
            <input
              type="date"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => handleResponse(e.target.value)}
            />
          </div>
        );

      case 'timed_text':
        return (
          <div>
            <p className="text-lg text-gray-700 mb-4">{currentQ.question}</p>
            <p className="text-gray-600 mb-6">{(currentQ as any).instruction || currentQ.question}</p>
            {timeRemaining !== null && (
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-blue-600">{timeRemaining}s</div>
              </div>
            )}
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Type your answers here..."
              onChange={(e) => handleResponse(e.target.value)}
              disabled={timeRemaining === 0}
            />
            {timeRemaining === null && (
              <button
                onClick={() => startTimer((currentQ as any).timeLimit || 60)}
                className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
              >
                Start Timer
              </button>
            )}
          </div>
        );

      case 'radio':
        return (
          <div>
            <p className="text-lg text-gray-700 mb-6">{currentQ.question}</p>
            <div className="space-y-3">
              {(currentQ as any).options?.map((option: string, index: number) => (
                <label key={index} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${currentQ.id}`}
                    value={option}
                    onChange={(e) => handleResponse(e.target.value)}
                    className="mr-3 text-blue-600"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'motion_sensor':
        return (
          <MotionSensorTest
            duration={(currentQ as any).duration || 30}
            onComplete={(data) => {
              handleResponse({
                motionData: data,
                tremorScore: data.reduce((acc, point) => {
                  const variance = Math.sqrt(
                    Math.pow(point.acceleration.x, 2) + 
                    Math.pow(point.acceleration.y, 2) + 
                    Math.pow(point.acceleration.z, 2)
                  );
                  return acc + variance;
                }, 0) / data.length
              });
              nextQuestion();
            }}
            onError={(error) => {
              console.error('Motion sensor error:', error);
              handleResponse({ error });
              nextQuestion();
            }}
          />
        );

      case 'tap_test':
        return (
          <TapTest
            duration={(currentQ as any).duration || 20}
            onComplete={(data) => {
              const performance = {
                tapsPerSecond: data.length / ((currentQ as any).duration || 20),
                accuracy: data.reduce((acc, tap) => acc + tap.accuracy, 0) / data.length,
                coordination: data.length > 1 ? 
                  (data.reduce((acc, tap, i) => {
                    if (i === 0) return acc;
                    const interval = tap.timestamp - data[i-1].timestamp;
                    return acc + interval;
                  }, 0) / (data.length - 1)) : 0
              };
              handleResponse({ tapData: data, performance });
              nextQuestion();
            }}
          />
        );

      case 'drawing':
        return (
          <DrawingTest
            drawingType={(currentQ as any).drawingType || 'spiral'}
            onComplete={(data) => {
              const metrics = {
                smoothness: data.points.length > 2 ? 
                  (() => {
                    let totalAngleChange = 0;
                    for (let i = 2; i < data.points.length; i++) {
                      const p1 = data.points[i - 2];
                      const p2 = data.points[i - 1];
                      const p3 = data.points[i];
                      const angle1 = Math.atan2(p2.y - p1.y, p2.x - p1.x);
                      const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
                      totalAngleChange += Math.abs(angle2 - angle1);
                    }
                    return Math.max(0, 100 - (totalAngleChange / data.points.length) * 50);
                  })() : 0,
                pathLength: data.pathLength,
                totalTime: data.totalTime,
                strokeCount: data.strokes.length
              };
              handleResponse({ drawingData: data, metrics });
              nextQuestion();
            }}
          />
        );

      case 'walking_test':
        return (
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-4">{currentQ.question}</p>
            <p className="text-gray-600 mb-8">{(currentQ as any).instruction || currentQ.question}</p>
            <div className="bg-gray-100 p-8 rounded-lg mb-6">
              <p className="text-gray-600">Walking test simulation would appear here</p>
              <p className="text-sm text-gray-500 mt-2">
                This would use device accelerometer and gyroscope to analyze gait patterns
              </p>
            </div>
            <button
              onClick={() => {
                handleResponse({ 
                  steps: (currentQ as any).steps || 10,
                  simulated: true,
                  gaitMetrics: {
                    stepLength: Math.random() * 0.5 + 0.6,
                    stepTime: Math.random() * 0.2 + 0.5,
                    variability: Math.random() * 0.1 + 0.05
                  }
                });
                nextQuestion();
              }}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Complete Test
            </button>
          </div>
        );

      case 'audio_recording':
        return (
          <AudioRecordingTest
            duration={(currentQ as any).duration || 60}
            text={(currentQ as any).text}
            onComplete={(data) => {
              handleResponse({
                audioData: data,
                analysis: data.analysis
              });
              nextQuestion();
            }}
            onError={(error) => {
              console.error('Audio recording error:', error);
              handleResponse({ error });
              nextQuestion();
            }}
          />
        );

      case 'reaction_time':
        return (
          <ReactionTimeTest
            duration={(currentQ as any).duration || 30}
            onComplete={(data) => {
              const performance = {
                averageReactionTime: data.reduce((sum, d) => sum + d.reactionTime, 0) / data.length,
                fastestReaction: Math.min(...data.map(d => d.reactionTime)),
                slowestReaction: Math.max(...data.map(d => d.reactionTime)),
                accuracy: (data.filter(d => d.accuracy === 'hit').length / data.length) * 100,
                totalAttempts: data.length
              };
              handleResponse({ reactionData: data, performance });
              nextQuestion();
            }}
          />
        );

      case 'spatial_memory':
        return (
          <SpatialMemoryTest
            onComplete={(data) => {
              const performance = {
                accuracy: data.accuracy,
                averageTime: data.averageTime,
                correct: data.correct,
                total: data.total,
                levelsCompleted: Math.floor(data.total / 3) + 1
              };
              handleResponse({ spatialData: data, performance });
              nextQuestion();
            }}
          />
        );

      case 'executive_function':
        return (
          <ExecutiveFunctionTest
            duration={(currentQ as any).duration || 60}
            onComplete={(data) => {
              const performance = {
                accuracy: (data.filter(d => d.isCorrect).length / data.length) * 100,
                averageReactionTime: data.reduce((sum, d) => sum + d.reactionTime, 0) / data.length,
                congruentAccuracy: data.filter(d => d.color === d.correctColor).length > 0 ? 
                  (data.filter(d => d.color === d.correctColor && d.isCorrect).length / 
                   data.filter(d => d.color === d.correctColor).length) * 100 : 0,
                incongruentAccuracy: data.filter(d => d.color !== d.correctColor).length > 0 ? 
                  (data.filter(d => d.color !== d.correctColor && d.isCorrect).length / 
                   data.filter(d => d.color !== d.correctColor).length) * 100 : 0,
                totalTrials: data.length
              };
              handleResponse({ stroopData: data, performance });
              nextQuestion();
            }}
          />
        );

      case 'memory_game':
        return (
          <MemoryGame
            difficulty={(currentQ as any).difficulty || 'medium'}
            onComplete={(data) => {
              handleResponse({ 
                gameData: data,
                score: data.score,
                accuracy: data.accuracy,
                moves: data.moves,
                matches: data.matches,
                timeLeft: data.timeLeft
              });
              nextQuestion();
            }}
          />
        );

      case 'number_sequence':
        return (
          <NumberSequenceGame
            difficulty={(currentQ as any).difficulty || 'medium'}
            onComplete={(data) => {
              handleResponse({ 
                gameData: data,
                score: data.score,
                accuracy: data.accuracy,
                correctAnswers: data.correctAnswers,
                totalQuestions: data.totalQuestions
              });
              nextQuestion();
            }}
          />
        );

      case 'word_association':
        return (
          <WordAssociationGame
            difficulty={(currentQ as any).difficulty || 'medium'}
            onComplete={(data) => {
              handleResponse({ 
                gameData: data,
                score: data.score,
                accuracy: data.accuracy,
                correctAnswers: data.correctAnswers,
                totalQuestions: data.totalQuestions
              });
              nextQuestion();
            }}
          />
        );

      case 'pattern_recognition':
        return (
          <PatternRecognitionGame
            difficulty={(currentQ as any).difficulty || 'medium'}
            onComplete={(data) => {
              handleResponse({ 
                gameData: data,
                score: data.score,
                accuracy: data.accuracy,
                correctAnswers: data.correctAnswers,
                totalQuestions: data.totalQuestions
              });
              nextQuestion();
            }}
          />
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Icon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{assessment.name}</h1>
              <p className="text-gray-600">{assessment.description}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / assessment.questions.length) * 100}%` }}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {assessment.questions.length}
            </span>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Est. {Math.ceil((assessment.questions.length - currentQuestion) * 2)} min remaining</span>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-sm border p-8">
          {renderQuestion()}
          
          {currentQ.responseType !== 'continue' && currentQ.responseType !== 'timed_text' && (
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </button>
              
              <button
                onClick={nextQuestion}
                disabled={!responses[currentQ.id]}
                className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLastQuestion ? 'Complete Assessment' : 'Next'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}