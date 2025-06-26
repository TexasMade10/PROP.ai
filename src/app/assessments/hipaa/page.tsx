'use client';

import { useState, useEffect } from 'react';
import { AssessmentFramework } from '@/lib/assessment-framework';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Brain, 
  TrendingUp,
  Shield,
  Users,
  FileText,
  Settings,
  Play,
  Pause,
  Save
} from 'lucide-react';

interface HIPAAQuestion {
  id: string;
  category: string;
  question: string;
  question_type: 'yes_no' | 'multiple_choice' | 'text' | 'rating';
  options?: string[];
  complexity_level: number;
  weight: number;
  risk_factors: string[];
  compliance_requirements: string[];
}

interface AssessmentResponse {
  question_id: string;
  answer: string;
  confidence?: number;
  reasoning?: string;
  has_comments: boolean;
  comments?: string;
  ai_generated: boolean;
  timestamp: string;
}

const HIPAA_QUESTIONS: HIPAAQuestion[] = [
  // Administrative Safeguards
  {
    id: 'admin_001',
    category: 'Administrative Safeguards',
    question: 'Do you have a designated Security Officer responsible for developing and implementing security policies?',
    question_type: 'yes_no',
    complexity_level: 1,
    weight: 10,
    risk_factors: ['No security oversight', 'Unclear responsibilities'],
    compliance_requirements: ['164.308(a)(2) - Security Officer']
  },
  {
    id: 'admin_002',
    category: 'Administrative Safeguards',
    question: 'How often do you provide security awareness training to workforce members?',
    question_type: 'multiple_choice',
    options: ['Never', 'Once upon hiring', 'Annually', 'Semi-annually', 'Quarterly'],
    complexity_level: 1,
    weight: 8,
    risk_factors: ['Untrained workforce', 'Security incidents'],
    compliance_requirements: ['164.308(a)(5) - Security Awareness Training']
  },
  {
    id: 'admin_003',
    category: 'Administrative Safeguards',
    question: 'Do you have documented procedures for responding to security incidents?',
    question_type: 'yes_no',
    complexity_level: 2,
    weight: 9,
    risk_factors: ['Unprepared for incidents', 'Delayed response'],
    compliance_requirements: ['164.308(a)(6) - Security Incident Procedures']
  },
  
  // Physical Safeguards
  {
    id: 'phys_001',
    category: 'Physical Safeguards',
    question: 'What type of physical access controls do you have in place for areas containing PHI?',
    question_type: 'multiple_choice',
    options: ['No specific controls', 'Locked doors only', 'Key card access with logging', 'Biometric access with audit trail'],
    complexity_level: 1,
    weight: 7,
    risk_factors: ['Unauthorized physical access', 'Theft of devices'],
    compliance_requirements: ['164.310(a)(1) - Facility Access Controls']
  },
  {
    id: 'phys_002',
    category: 'Physical Safeguards',
    question: 'Do you have policies for workstation use and security?',
    question_type: 'yes_no',
    complexity_level: 1,
    weight: 6,
    risk_factors: ['Unsecured workstations', 'Unauthorized access'],
    compliance_requirements: ['164.310(b) - Workstation Use and Security']
  },
  
  // Technical Safeguards
  {
    id: 'tech_001',
    category: 'Technical Safeguards',
    question: 'Do you assign unique user identification to each workforce member?',
    question_type: 'yes_no',
    complexity_level: 1,
    weight: 8,
    risk_factors: ['Shared accounts', 'No accountability'],
    compliance_requirements: ['164.312(a)(2)(i) - Unique User Identification']
  },
  {
    id: 'tech_002',
    category: 'Technical Safeguards',
    question: 'What level of encryption do you use for PHI in transit and at rest?',
    question_type: 'multiple_choice',
    options: ['No encryption', 'Basic password protection', 'AES-128 encryption', 'AES-256 encryption', 'End-to-end encryption'],
    complexity_level: 2,
    weight: 10,
    risk_factors: ['Data breaches', 'Unauthorized access'],
    compliance_requirements: ['164.312(c)(1) - Transmission Security']
  },
  {
    id: 'tech_003',
    category: 'Technical Safeguards',
    question: 'Do you have automatic logoff capabilities for systems containing PHI?',
    question_type: 'yes_no',
    complexity_level: 2,
    weight: 6,
    risk_factors: ['Unauthorized access', 'Session hijacking'],
    compliance_requirements: ['164.312(a)(2)(iii) - Automatic Logoff']
  }
];

export default function HIPAAAssessmentPage() {
  const [currentComplexity, setCurrentComplexity] = useState<'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'COMPREHENSIVE'>('BASIC');
  const [responses, setResponses] = useState<{ [key: string]: AssessmentResponse }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [assessmentStatus, setAssessmentStatus] = useState<'not_started' | 'in_progress' | 'paused' | 'completed'>('not_started');
  const [timeSpent, setTimeSpent] = useState(0);
  const [aiInteractions, setAiInteractions] = useState(0);
  const [showAutoPopulate, setShowAutoPopulate] = useState(false);
  const [autoPopulateResults, setAutoPopulateResults] = useState<any>(null);

  // Filter questions based on current complexity level
  const filteredQuestions = HIPAA_QUESTIONS.filter(q => {
    const complexityLevels = {
      'BASIC': 1,
      'INTERMEDIATE': 2,
      'ADVANCED': 3,
      'COMPREHENSIVE': 4
    };
    return q.complexity_level <= complexityLevels[currentComplexity];
  });

  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const completionPercentage = Math.round((Object.keys(responses).length / filteredQuestions.length) * 100);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (assessmentStatus === 'in_progress') {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 60000); // Update every minute
    }
    return () => clearInterval(interval);
  }, [assessmentStatus]);

  const handleResponse = (questionId: string, answer: string, comments?: string) => {
    const response: AssessmentResponse = {
      question_id: questionId,
      answer,
      has_comments: !!comments,
      comments,
      ai_generated: false,
      timestamp: new Date().toISOString()
    };

    setResponses(prev => ({
      ...prev,
      [questionId]: response
    }));

    // Auto-advance to next question
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 500);
    }
  };

  const handleAutoPopulate = async () => {
    setShowAutoPopulate(true);
    
    // Mock company intelligence data
    const companyIntelligence = {
      business_type: 'Healthcare Provider',
      industry: 'healthcare',
      employee_count: 50,
      technology_systems: [
        { name: 'Epic EHR', type: 'EHR', deployment_type: 'cloud', security_features: ['encryption', 'user_management'] },
        { name: 'Microsoft 365', type: 'productivity', deployment_type: 'cloud' }
      ],
      current_security: {
        has_security_officer: true,
        employee_training: 'annual'
      },
      compliance_obligations: ['HIPAA', 'HITECH']
    };

    try {
      const results = await AssessmentFramework.autoPopulateAssessment(
        'mock-assessment-id',
        companyIntelligence
      );
      
      setAutoPopulateResults(results);
      
      // Apply populated responses
      results.populated_responses.forEach((populated: any) => {
        handleResponse(populated.question_id, populated.suggested_answer, `AI populated with ${Math.round(populated.confidence * 100)}% confidence`);
      });
      
    } catch (error) {
      console.error('Auto-population failed:', error);
    }
  };

  const startAssessment = () => {
    setAssessmentStatus('in_progress');
    setCurrentQuestionIndex(0);
  };

  const pauseAssessment = () => {
    setAssessmentStatus('paused');
  };

  const resumeAssessment = () => {
    setAssessmentStatus('in_progress');
  };

  const completeAssessment = () => {
    setAssessmentStatus('completed');
  };

  const getRiskLevel = (question: HIPAAQuestion, answer: string): 'low' | 'medium' | 'high' => {
    if (question.question_type === 'yes_no') {
      return answer === 'yes' ? 'low' : 'high';
    }
    if (question.question_type === 'multiple_choice') {
      const riskMap: { [key: string]: 'low' | 'medium' | 'high' } = {
        'Never': 'high',
        'Once upon hiring': 'medium',
        'Annually': 'medium',
        'Semi-annually': 'low',
        'Quarterly': 'low',
        'No specific controls': 'high',
        'Locked doors only': 'medium',
        'Key card access with logging': 'low',
        'Biometric access with audit trail': 'low',
        'No encryption': 'high',
        'Basic password protection': 'high',
        'AES-128 encryption': 'medium',
        'AES-256 encryption': 'low',
        'End-to-end encryption': 'low'
      };
      return riskMap[answer] || 'medium';
    }
    return 'medium';
  };

  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
    }
  };

  const getRiskIcon = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return <CheckCircle className="w-4 h-4" />;
      case 'medium': return <AlertCircle className="w-4 h-4" />;
      case 'high': return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (assessmentStatus === 'not_started') {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">HIPAA Risk Assessment</h1>
          <p className="text-gray-600 mb-6">
            Complete a comprehensive assessment of your organization's HIPAA compliance posture.
            This assessment will help identify potential risks and provide actionable recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Assessment Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Complexity Level:</span>
                  <Badge variant="outline">{currentComplexity}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Questions:</span>
                  <span>{filteredQuestions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Time:</span>
                  <span>{AssessmentFramework.COMPLEXITY_LEVELS[currentComplexity].estimated_time} minutes</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI-Powered Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Auto-population from company data</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Progressive complexity adjustment</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Real-time risk analysis</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4">
          <Button onClick={startAssessment} className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            Start Assessment
          </Button>
          <Button onClick={handleAutoPopulate} variant="outline" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Auto-Populate with AI
          </Button>
        </div>
      </div>
    );
  }

  if (assessmentStatus === 'completed') {
    const highRiskCount = Object.values(responses).filter(r => 
      getRiskLevel(HIPAA_QUESTIONS.find(q => q.id === r.question_id)!, r.answer) === 'high'
    ).length;
    
    const mediumRiskCount = Object.values(responses).filter(r => 
      getRiskLevel(HIPAA_QUESTIONS.find(q => q.id === r.question_id)!, r.answer) === 'medium'
    ).length;

    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Assessment Complete!</h1>
          <p className="text-gray-600">Your HIPAA risk assessment has been completed successfully.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{highRiskCount}</div>
                <div className="text-sm text-gray-600">High Risk Areas</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{mediumRiskCount}</div>
                <div className="text-sm text-gray-600">Medium Risk Areas</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{Object.keys(responses).length - highRiskCount - mediumRiskCount}</div>
                <div className="text-sm text-gray-600">Low Risk Areas</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Assessment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Questions:</span>
                <span>{filteredQuestions.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Time Spent:</span>
                <span>{timeSpent} minutes</span>
              </div>
              <div className="flex justify-between">
                <span>AI Interactions:</span>
                <span>{aiInteractions}</span>
              </div>
              <div className="flex justify-between">
                <span>Complexity Level:</span>
                <Badge variant="outline">{currentComplexity}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">HIPAA Risk Assessment</h1>
          <div className="flex gap-2">
            {assessmentStatus === 'paused' ? (
              <Button onClick={resumeAssessment} variant="outline" size="sm">
                <Play className="w-4 h-4 mr-2" />
                Resume
              </Button>
            ) : (
              <Button onClick={pauseAssessment} variant="outline" size="sm">
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
            <Button onClick={completeAssessment} size="sm">
              Complete
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress: {completionPercentage}%</span>
            <span>Question {currentQuestionIndex + 1} of {filteredQuestions.length}</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold">{timeSpent}</div>
            <div className="text-xs text-gray-600">Minutes</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold">{aiInteractions}</div>
            <div className="text-xs text-gray-600">AI Interactions</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold">{currentComplexity}</div>
            <div className="text-xs text-gray-600">Complexity</div>
          </div>
        </div>
      </div>

      {/* Current Question */}
      {currentQuestion && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <Badge variant="outline" className="mb-2">{currentQuestion.category}</Badge>
                <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
              </div>
              <Badge className={getRiskColor(getRiskLevel(currentQuestion, responses[currentQuestion.id]?.answer || ''))}>
                {getRiskIcon(getRiskLevel(currentQuestion, responses[currentQuestion.id]?.answer || ''))}
                {getRiskLevel(currentQuestion, responses[currentQuestion.id]?.answer || '').toUpperCase()} RISK
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Question Options */}
              {currentQuestion.question_type === 'yes_no' && (
                <div className="flex gap-4">
                  <Button
                    onClick={() => handleResponse(currentQuestion.id, 'yes')}
                    variant={responses[currentQuestion.id]?.answer === 'yes' ? 'default' : 'outline'}
                    className="flex-1"
                  >
                    Yes
                  </Button>
                  <Button
                    onClick={() => handleResponse(currentQuestion.id, 'no')}
                    variant={responses[currentQuestion.id]?.answer === 'no' ? 'default' : 'outline'}
                    className="flex-1"
                  >
                    No
                  </Button>
                </div>
              )}

              {currentQuestion.question_type === 'multiple_choice' && currentQuestion.options && (
                <div className="space-y-2">
                  {currentQuestion.options.map((option) => (
                    <Button
                      key={option}
                      onClick={() => handleResponse(currentQuestion.id, option)}
                      variant={responses[currentQuestion.id]?.answer === option ? 'default' : 'outline'}
                      className="w-full justify-start"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              )}

              {/* Comments Section */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Comments (Optional)
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Add any additional context or notes..."
                  value={responses[currentQuestion.id]?.comments || ''}
                  onChange={(e) => {
                    const currentResponse = responses[currentQuestion.id];
                    if (currentResponse) {
                      handleResponse(currentQuestion.id, currentResponse.answer, e.target.value);
                    }
                  }}
                />
              </div>

              {/* Risk Factors */}
              <div className="mt-4 p-4 bg-red-50 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">Risk Factors:</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {currentQuestion.risk_factors.map((factor, index) => (
                    <li key={index}>• {factor}</li>
                  ))}
                </ul>
              </div>

              {/* Compliance Requirements */}
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Compliance Requirements:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  {currentQuestion.compliance_requirements.map((req, index) => (
                    <li key={index}>• {req}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
          variant="outline"
        >
          Previous
        </Button>
        <Button
          onClick={() => setCurrentQuestionIndex(prev => Math.min(filteredQuestions.length - 1, prev + 1))}
          disabled={currentQuestionIndex === filteredQuestions.length - 1}
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
  );
} 