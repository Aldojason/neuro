import React, { useState } from 'react';
import { Brain, Heart, Activity, BookOpen, Users, ArrowRight, ExternalLink } from 'lucide-react';

const conditions = [
  {
    id: 'alzheimers',
    name: "Alzheimer's Disease",
    icon: Brain,
    description: 'Progressive brain disorder affecting memory, thinking, and behavior',
    prevalence: '6.5 million Americans',
    color: 'blue',
    symptoms: [
      'Memory loss that disrupts daily life',
      'Challenges in planning or solving problems',
      'Difficulty completing familiar tasks',
      'Confusion with time or place',
      'Changes in mood and personality'
    ],
    riskFactors: [
      'Age (65 and older)',
      'Family history',
      'Head trauma',
      'Cardiovascular disease',
      'Diabetes'
    ],
    prevention: [
      'Regular physical exercise',
      'Healthy diet (Mediterranean)',
      'Mental stimulation',
      'Quality sleep',
      'Social engagement'
    ]
  },
  {
    id: 'parkinsons',
    name: "Parkinson's Disease",
    icon: Activity,
    description: 'Progressive nervous system disorder affecting movement',
    prevalence: '1 million Americans',
    color: 'teal',
    symptoms: [
      'Tremor, usually in hands',
      'Slowed movement (bradykinesia)',
      'Rigid muscles',
      'Impaired posture and balance',
      'Changes in speech and writing'
    ],
    riskFactors: [
      'Age (risk increases with age)',
      'Heredity (rare genetic mutations)',
      'Sex (men more likely)',
      'Exposure to toxins',
      'Head trauma'
    ],
    prevention: [
      'Regular aerobic exercise',
      'Caffeine consumption (moderate)',
      'Green tea consumption',
      'Avoiding pesticide exposure',
      'Maintaining healthy weight'
    ]
  },
  {
    id: 'stroke',
    name: 'Stroke',
    icon: Heart,
    description: 'Brain attack caused by interrupted blood supply',
    prevalence: '795,000 Americans annually',
    color: 'red',
    symptoms: [
      'Sudden numbness or weakness',
      'Confusion or trouble speaking',
      'Vision problems',
      'Trouble walking or dizziness',
      'Severe headache'
    ],
    riskFactors: [
      'High blood pressure',
      'Smoking',
      'Diabetes',
      'High cholesterol',
      'Heart disease'
    ],
    prevention: [
      'Control blood pressure',
      'Quit smoking',
      'Manage diabetes',
      'Exercise regularly',
      'Healthy diet'
    ]
  },
  {
    id: 'epilepsy',
    name: 'Epilepsy',
    icon: Brain,
    description: 'Neurological disorder causing recurrent seizures',
    prevalence: '3.4 million Americans',
    color: 'purple',
    symptoms: [
      'Temporary confusion',
      'Staring spells',
      'Uncontrollable jerking',
      'Loss of consciousness',
      'Psychic symptoms'
    ],
    riskFactors: [
      'Age (young children and older adults)',
      'Family history',
      'Head trauma',
      'Stroke and vascular diseases',
      'Brain infections'
    ],
    prevention: [
      'Prevent head injuries',
      'Lower stroke and heart disease risk',
      'Get vaccinated',
      'Wash hands frequently',
      'Practice safe behaviors'
    ]
  }
];

const resources = [
  {
    title: 'Alzheimer\'s Association',
    description: 'Comprehensive resources for patients and families',
    url: 'https://www.alz.org',
    category: 'Organization'
  },
  {
    title: 'Parkinson\'s Foundation',
    description: 'Support and education for Parkinson\'s disease',
    url: 'https://www.parkinson.org',
    category: 'Organization'
  },
  {
    title: 'National Institute of Mental Health',
    description: 'Research and information on brain health',
    url: 'https://www.nimh.nih.gov',
    category: 'Research'
  },
  {
    title: 'Brain Health Initiative',
    description: 'Tips and strategies for maintaining brain health',
    url: 'https://www.brainhealthinitiative.org',
    category: 'Education'
  }
];

const tips = [
  {
    icon: Activity,
    title: 'Stay Physically Active',
    description: 'Regular exercise improves blood flow to the brain and promotes new brain cell growth.',
    tips: ['Aim for 150 minutes of moderate exercise weekly', 'Include both cardio and strength training', 'Try activities like walking, swimming, or dancing']
  },
  {
    icon: Brain,
    title: 'Keep Your Mind Active',
    description: 'Mental stimulation helps build brain reserves and may delay cognitive decline.',
    tips: ['Learn new skills or hobbies', 'Do puzzles, crosswords, or brain games', 'Read regularly and engage in discussions']
  },
  {
    icon: Users,
    title: 'Stay Socially Connected',
    description: 'Social interaction stimulates brain activity and reduces stress.',
    tips: ['Maintain relationships with family and friends', 'Join clubs or volunteer organizations', 'Participate in group activities']
  },
  {
    icon: Heart,
    title: 'Eat a Healthy Diet',
    description: 'Proper nutrition supports brain health and cognitive function.',
    tips: ['Follow a Mediterranean-style diet', 'Eat plenty of fruits and vegetables', 'Include omega-3 rich foods like fish']
  }
];

export default function EducationPage() {
  const [selectedCondition, setSelectedCondition] = useState(conditions[0]);
  const [activeTab, setActiveTab] = useState<'symptoms' | 'risk' | 'prevention'>('symptoms');

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'border-blue-200 bg-blue-50 text-blue-800',
      teal: 'border-teal-200 bg-teal-50 text-teal-800',
      red: 'border-red-200 bg-red-50 text-red-800',
      purple: 'border-purple-200 bg-purple-50 text-purple-800'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Neurological Health Education
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn about neurological conditions, symptoms, risk factors, and prevention strategies 
            to make informed decisions about your brain health.
          </p>
        </div>

        {/* Brain Health Tips */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Maintaining Brain Health
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition-shadow">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{tip.title}</h3>
                    <p className="text-gray-600 text-sm">{tip.description}</p>
                  </div>
                  <ul className="space-y-2">
                    {tip.tips.map((tipItem, tipIndex) => (
                      <li key={tipIndex} className="text-sm text-gray-700 flex items-start">
                        <ArrowRight className="h-3 w-3 text-blue-600 mt-1 mr-2 flex-shrink-0" />
                        {tipItem}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Conditions Overview */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Understanding Neurological Conditions
          </h2>
          
          {/* Condition Selector */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {conditions.map((condition) => {
              const Icon = condition.icon;
              return (
                <button
                  key={condition.id}
                  onClick={() => setSelectedCondition(condition)}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-lg border-2 transition-all ${
                    selectedCondition.id === condition.id
                      ? getColorClasses(condition.color)
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{condition.name}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Condition Details */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-8 border-b">
              <div className="flex items-center space-x-4 mb-4">
                <div className={`p-3 rounded-lg ${getColorClasses(selectedCondition.color)}`}>
                  <selectedCondition.icon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedCondition.name}</h3>
                  <p className="text-gray-600">{selectedCondition.description}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                <strong>Affects:</strong> {selectedCondition.prevalence}
              </p>
            </div>

            {/* Tabs */}
            <div className="border-b">
              <div className="flex space-x-8 px-8">
                {[
                  { key: 'symptoms', label: 'Symptoms' },
                  { key: 'risk', label: 'Risk Factors' },
                  { key: 'prevention', label: 'Prevention' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as typeof activeTab)}
                    className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                      activeTab === tab.key
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'symptoms' && (
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">Common Symptoms</h4>
                  <ul className="space-y-3">
                    {selectedCondition.symptoms.map((symptom, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <ArrowRight className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'risk' && (
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">Risk Factors</h4>
                  <ul className="space-y-3">
                    {selectedCondition.riskFactors.map((factor, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <ArrowRight className="h-4 w-4 text-orange-600 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'prevention' && (
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">Prevention Strategies</h4>
                  <ul className="space-y-3">
                    {selectedCondition.prevention.map((strategy, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <ArrowRight className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* External Resources */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Additional Resources
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {resources.map((resource, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {resource.category}
                    </span>
                  </div>
                  <BookOpen className="h-6 w-6 text-gray-400 flex-shrink-0" />
                </div>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  Visit Resource
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-blue-600 rounded-xl text-white p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Monitoring?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Use our AI-powered assessments to track your neurological health and get personalized insights.
          </p>
          <button
            onClick={() => window.location.href = '/register'}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Start Your Assessment
          </button>
        </div>
      </div>
    </div>
  );
}