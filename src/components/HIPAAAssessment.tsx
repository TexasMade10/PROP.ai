'use client';

import React, { useState, useEffect } from 'react';
import { HIPAAAssessmentContent, HIPAARiskScorer } from '@/lib/hipaa-assessment';

interface AssessmentResponse {
  question_id: string;
  answer: string | string[];
  timestamp: string;
  ai_generated: boolean;
  ai_confidence?: number;
}

interface AssessmentState {
  currentSection: 'administrative' | 'physical' | 'technical';
  responses: AssessmentResponse[];
  currentQuestionIndex: number;
  isComplete: boolean;
  score: any;
}

export default function HIPAAAssessment() {
  const [assessment, setAssessment] = useState<AssessmentState>({
    currentSection: 'administrative',
    responses: [],
    currentQuestionIndex: 0,
    isComplete: false,
    score: null
  });

  const [showResults, setShowResults] = useState(false);

  const currentQuestions = HIPAAAssessmentContent.filter(
    q => q.section === assessment.currentSection
  );

  const currentQuestion = currentQuestions[assessment.currentQuestionIndex];

  const handleAnswer = (answer: string | string[]) => {
    const newResponse: AssessmentResponse = {
      question_id: currentQuestion.id,
      answer,
      timestamp: new Date().toISOString(),
      ai_generated: false
    };

    const updatedResponses = [...assessment.responses];
    const existingIndex = updatedResponses.findIndex(r => r.question_id === currentQuestion.id);
    
    if (existingIndex >= 0) {
      updatedResponses[existingIndex] = newResponse;
    } else {
      updatedResponses.push(newResponse);
    }

    setAssessment(prev => ({
      ...prev,
      responses: updatedResponses
    }));

    // Move to next question or section
    if (assessment.currentQuestionIndex < currentQuestions.length - 1) {
      setAssessment(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    } else {
      // Move to next section or complete
      const sections: ('administrative' | 'physical' | 'technical')[] = ['administrative', 'physical', 'technical'];
      const currentSectionIndex = sections.indexOf(assessment.currentSection);
      
      if (currentSectionIndex < sections.length - 1) {
        setAssessment(prev => ({
          ...prev,
          currentSection: sections[currentSectionIndex + 1],
          currentQuestionIndex: 0
        }));
      } else {
        // Assessment complete
        const score = HIPAARiskScorer.calculateOverallScore(updatedResponses);
        setAssessment(prev => ({
          ...prev,
          isComplete: true,
          score
        }));
        setShowResults(true);
      }
    }
  };

  const getProgressPercentage = () => {
    const totalQuestions = HIPAAAssessmentContent.length;
    const answeredQuestions = assessment.responses.length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  const getSectionProgress = (section: string) => {
    const sectionQuestions = HIPAAAssessmentContent.filter(q => q.section === section);
    const sectionResponses = assessment.responses.filter(r => 
      sectionQuestions.some(q => q.id === r.question_id)
    );
    return Math.round((sectionResponses.length / sectionQuestions.length) * 100);
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    return (
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {currentQuestion.question}
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentQuestion.complexity_level === 'basic' ? 'bg-green-100 text-green-800' :
              currentQuestion.complexity_level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {currentQuestion.complexity_level}
            </span>
          </div>
          
          {currentQuestion.help_text && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">{currentQuestion.help_text}</p>
            </div>
          )}

          <p className="text-sm text-gray-600">
            Regulatory Reference: {currentQuestion.regulatory_reference}
          </p>
        </div>

        <div className="space-y-4">
          {currentQuestion.question_type === 'yes_no' && (
            <div className="flex space-x-4">
              <button
                onClick={() => handleAnswer('yes')}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Yes
              </button>
              <button
                onClick={() => handleAnswer('no')}
                className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                No
              </button>
            </div>
          )}

          {currentQuestion.question_type === 'multiple_choice' && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="w-full text-left p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {currentQuestion.question_type === 'checkbox' && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <label key={index} className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    onChange={(e) => {
                      const currentAnswers = assessment.responses.find(r => r.question_id === currentQuestion.id)?.answer as string[] || [];
                      const newAnswers = e.target.checked 
                        ? [...currentAnswers, option]
                        : currentAnswers.filter(a => a !== option);
                      handleAnswer(newAnswers);
                    }}
                  />
                  <span className="text-gray-900">{option}</span>
                </label>
              ))}
            </div>
          )}

          {currentQuestion.question_type === 'text' && (
            <div>
              <textarea
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Please provide your response..."
                onBlur={(e) => {
                  if (e.target.value.trim()) {
                    handleAnswer(e.target.value);
                  }
                }}
              />
              <button
                onClick={() => {
                  const textarea = document.querySelector('textarea');
                  if (textarea && textarea.value.trim()) {
                    handleAnswer(textarea.value);
                  }
                }}
                className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!assessment.score) return null;

    return (
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Assessment Results</h2>
        
        {/* Overall Score */}
        <div className="mb-8">
          <div className={`text-center p-8 rounded-lg ${
            assessment.score.overall_score >= 80 ? 'bg-green-50 border border-green-200' :
            assessment.score.overall_score >= 60 ? 'bg-yellow-50 border border-yellow-200' :
            assessment.score.overall_score >= 40 ? 'bg-orange-50 border border-orange-200' :
            'bg-red-50 border border-red-200'
          }`}>
            <div className="text-6xl font-bold mb-2">
              {assessment.score.overall_score}
            </div>
            <div className="text-xl font-medium mb-2">
              {assessment.score.risk_level}
            </div>
            <p className="text-gray-600">
              Overall HIPAA Compliance Score
            </p>
          </div>
        </div>

        {/* Section Scores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Object.entries(assessment.score.section_scores).map(([section, score]: [string, any]) => (
            <div key={section} className="text-center p-6 border border-gray-200 rounded-lg">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                score >= 80 ? 'bg-green-100' :
                score >= 60 ? 'bg-yellow-100' :
                'bg-red-100'
              }`}>
                <span className={`text-xl font-bold ${
                  score >= 80 ? 'text-green-600' :
                  score >= 60 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {score}
                </span>
              </div>
              <h3 className="font-medium text-gray-900 capitalize">
                {section.replace('_', ' ')}
              </h3>
            </div>
          ))}
        </div>

        {/* Critical Issues */}
        {assessment.score.critical_issues.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Critical Issues Requiring Attention</h3>
            <div className="space-y-3">
              {assessment.score.critical_issues.map((issue: string, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <p className="text-red-800">{issue}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Items */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recommended Actions</h3>
          <div className="space-y-3">
            {assessment.responses
              .filter(response => {
                const question = HIPAAAssessmentContent.find(q => q.id === response.question_id);
                if (!question) return false;
                const riskData = question.risk_mapping[response.answer as string];
                return riskData?.action_required;
              })
              .map((response, index) => {
                const question = HIPAAAssessmentContent.find(q => q.id === response.question_id);
                const riskData = question?.risk_mapping[response.answer as string];
                return (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-blue-900">{question?.question}</p>
                      <p className="text-blue-800">{riskData?.action_required}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => {
              setAssessment(prev => ({
                ...prev,
                currentSection: 'administrative',
                currentQuestionIndex: 0,
                isComplete: false,
                score: null
              }));
              setShowResults(false);
            }}
            className="bg-gray-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Retake Assessment
          </button>
          <button
            onClick={() => {
              // Navigate to dashboard or save results
              console.log('Saving results...');
            }}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Save Results
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">HIPAA Risk Assessment</h1>
            <span className="text-sm text-gray-600">
              {getProgressPercentage()}% Complete
            </span>
          </div>
          
          {/* Overall Progress */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>

          {/* Section Progress */}
          <div className="grid grid-cols-3 gap-4">
            {(['administrative', 'physical', 'technical'] as const).map(section => (
              <div key={section} className="text-center">
                <div className="text-sm font-medium text-gray-900 capitalize mb-2">
                  {section.replace('_', ' ')}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full transition-all duration-300 ${
                      section === assessment.currentSection ? 'bg-blue-600' : 'bg-gray-400'
                    }`}
                    style={{ width: `${getSectionProgress(section)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {getSectionProgress(section)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Question or Results */}
      {showResults ? renderResults() : renderQuestion()}
    </div>
  );
} 