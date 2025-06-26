'use client';

import { useState, useEffect } from 'react';
import { AIAgentTraining } from '@/lib/ai-agent-training';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Brain, 
  MessageSquare, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Settings,
  Send,
  RefreshCw,
  Download,
  Share2,
  Zap,
  Target,
  BarChart3,
  Lightbulb
} from 'lucide-react';

interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  context?: any;
  confidence?: number;
  action_items?: string[];
  insights?: string[];
}

interface AIAnalysis {
  id: string;
  type: 'compliance' | 'risk' | 'operations' | 'strategy';
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  created_at: string;
  completed_at?: string;
  insights: string[];
  recommendations: string[];
  risk_score: number;
  confidence: number;
  data_sources: string[];
}

export default function AIAnalysisPage() {
  const [conversations, setConversations] = useState<ConversationMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<AIAnalysis | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AIAnalysis[]>([]);
  const [selectedContext, setSelectedContext] = useState<'onboarding' | 'ongoing' | 'quarterly' | 'custom'>('ongoing');

  // Mock analysis history
  useEffect(() => {
    setAnalysisHistory([
      {
        id: '1',
        type: 'compliance',
        title: 'HIPAA Compliance Review',
        description: 'Comprehensive analysis of current HIPAA compliance posture',
        status: 'completed',
        created_at: '2024-01-15T10:00:00Z',
        completed_at: '2024-01-15T10:15:00Z',
        insights: [
          'Strong administrative safeguards in place',
          'Technical safeguards need improvement',
          'Physical access controls are adequate'
        ],
        recommendations: [
          'Implement automatic logoff for all systems',
          'Enhance encryption for data in transit',
          'Conduct quarterly security training'
        ],
        risk_score: 65,
        confidence: 0.85,
        data_sources: ['assessment_responses', 'company_profile', 'industry_benchmarks']
      },
      {
        id: '2',
        type: 'risk',
        title: 'Cybersecurity Risk Assessment',
        description: 'Analysis of current cybersecurity risks and vulnerabilities',
        status: 'completed',
        created_at: '2024-01-10T14:00:00Z',
        completed_at: '2024-01-10T14:20:00Z',
        insights: [
          'Medium risk level overall',
          'Employee training is a key vulnerability',
          'System patching is up to date'
        ],
        recommendations: [
          'Implement phishing simulation training',
          'Add multi-factor authentication',
          'Regular vulnerability scanning'
        ],
        risk_score: 45,
        confidence: 0.78,
        data_sources: ['security_scan', 'training_records', 'incident_reports']
      }
    ]);
  }, []);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date().toISOString()
    };

    setConversations(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      // Simulate AI response using the AI Agent Training framework
      const aiResponse = await simulateAIResponse(currentMessage, selectedContext);
      
      const assistantMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse.content,
        timestamp: new Date().toISOString(),
        context: aiResponse.context,
        confidence: aiResponse.confidence,
        action_items: aiResponse.action_items,
        insights: aiResponse.insights
      };

      setConversations(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI response error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateAIResponse = async (message: string, context: string): Promise<any> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock AI responses based on context and message content
    const responses = {
      onboarding: {
        content: "Welcome to PROP.ai! I'm here to help you navigate your compliance and risk management journey. Based on your company profile, I can see you're a healthcare provider with 50 employees. Let me help you get started with a comprehensive HIPAA assessment.",
        confidence: 0.92,
        action_items: [
          "Complete initial HIPAA assessment",
          "Set up security officer designation",
          "Schedule employee training"
        ],
        insights: [
          "Healthcare industry requires specific compliance measures",
          "Employee count suggests moderate complexity requirements"
        ]
      },
      ongoing: {
        content: "I've analyzed your current compliance status. You're making good progress, but there are some areas that need attention. Your technical safeguards are strong, but administrative procedures could be enhanced.",
        confidence: 0.87,
        action_items: [
          "Review and update security policies",
          "Conduct quarterly training sessions",
          "Implement incident response procedures"
        ],
        insights: [
          "Strong technical foundation",
          "Administrative processes need refinement",
          "Training frequency is adequate"
        ]
      },
      quarterly: {
        content: "Based on your quarterly review data, I can see significant improvements in your compliance posture. Your risk score has decreased by 15% since the last quarter. However, there are emerging trends that require attention.",
        confidence: 0.89,
        action_items: [
          "Address new regulatory requirements",
          "Update risk assessment procedures",
          "Enhance monitoring systems"
        ],
        insights: [
          "Positive trend in compliance metrics",
          "New regulations require attention",
          "Monitoring systems need enhancement"
        ]
      }
    };

    return responses[context as keyof typeof responses] || responses.ongoing;
  };

  const startNewAnalysis = async (type: AIAnalysis['type']) => {
    const newAnalysis: AIAnalysis = {
      id: Date.now().toString(),
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Analysis`,
      description: `Comprehensive ${type} analysis and recommendations`,
      status: 'in_progress',
      created_at: new Date().toISOString(),
      insights: [],
      recommendations: [],
      risk_score: 0,
      confidence: 0,
      data_sources: []
    };

    setActiveAnalysis(newAnalysis);
    setAnalysisHistory(prev => [newAnalysis, ...prev]);

    // Simulate analysis completion
    setTimeout(() => {
      const completedAnalysis = {
        ...newAnalysis,
        status: 'completed' as const,
        completed_at: new Date().toISOString(),
        insights: [
          'Analysis completed successfully',
          'Key risk areas identified',
          'Recommendations generated'
        ],
        recommendations: [
          'Implement suggested controls',
          'Monitor key metrics',
          'Schedule follow-up review'
        ],
        risk_score: Math.floor(Math.random() * 40) + 30,
        confidence: 0.85,
        data_sources: ['assessment_data', 'company_profile', 'industry_data']
      };

      setActiveAnalysis(completedAnalysis);
      setAnalysisHistory(prev => 
        prev.map(a => a.id === newAnalysis.id ? completedAnalysis : a)
      );
    }, 5000);
  };

  const getAnalysisTypeIcon = (type: string) => {
    switch (type) {
      case 'compliance': return <Shield className="w-4 h-4" />;
      case 'risk': return <AlertTriangle className="w-4 h-4" />;
      case 'operations': return <Settings className="w-4 h-4" />;
      case 'strategy': return <Target className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Analysis & Insights</h1>
        <p className="text-gray-600">
          Get intelligent insights and recommendations powered by AI analysis of your compliance, risk, and operational data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Conversation Panel */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Assistant
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={() => setSelectedContext('onboarding')}
                  variant={selectedContext === 'onboarding' ? 'default' : 'outline'}
                  size="sm"
                >
                  Onboarding
                </Button>
                <Button
                  onClick={() => setSelectedContext('ongoing')}
                  variant={selectedContext === 'ongoing' ? 'default' : 'outline'}
                  size="sm"
                >
                  Ongoing
                </Button>
                <Button
                  onClick={() => setSelectedContext('quarterly')}
                  variant={selectedContext === 'quarterly' ? 'default' : 'outline'}
                  size="sm"
                >
                  Quarterly
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Conversation Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {conversations.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Start a conversation with your AI assistant</p>
                    <p className="text-sm">Ask about compliance, risks, or operations</p>
                  </div>
                ) : (
                  conversations.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p>{message.content}</p>
                        {message.action_items && message.action_items.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium mb-2">Action Items:</p>
                            <ul className="text-sm space-y-1">
                              {message.action_items.map((item, index) => (
                                <li key={index}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {message.insights && message.insights.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium mb-2">Insights:</p>
                            <ul className="text-sm space-y-1">
                              {message.insights.map((insight, index) => (
                                <li key={index}>💡 {insight}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <p className="text-xs opacity-70 mt-2">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <Textarea
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Ask your AI assistant about compliance, risks, or operations..."
                  className="flex-1"
                  rows={2}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || isLoading}
                  className="self-end"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Panel */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => startNewAnalysis('compliance')}
                className="w-full justify-start"
                variant="outline"
              >
                <Shield className="w-4 h-4 mr-2" />
                Compliance Review
              </Button>
              <Button
                onClick={() => startNewAnalysis('risk')}
                className="w-full justify-start"
                variant="outline"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Risk Assessment
              </Button>
              <Button
                onClick={() => startNewAnalysis('operations')}
                className="w-full justify-start"
                variant="outline"
              >
                <Settings className="w-4 h-4 mr-2" />
                Operations Analysis
              </Button>
              <Button
                onClick={() => startNewAnalysis('strategy')}
                className="w-full justify-start"
                variant="outline"
              >
                <Target className="w-4 h-4 mr-2" />
                Strategic Planning
              </Button>
            </CardContent>
          </Card>

          {/* Active Analysis */}
          {activeAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getAnalysisTypeIcon(activeAnalysis.type)}
                  Active Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">{activeAnalysis.title}</h4>
                    <p className="text-sm text-gray-600">{activeAnalysis.description}</p>
                  </div>
                  <Badge className={getStatusColor(activeAnalysis.status)}>
                    {activeAnalysis.status.replace('_', ' ')}
                  </Badge>
                  {activeAnalysis.status === 'in_progress' && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Processing...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analysis History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Recent Analyses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysisHistory.slice(0, 5).map((analysis) => (
                  <div key={analysis.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getAnalysisTypeIcon(analysis.type)}
                        <span className="font-medium text-sm">{analysis.title}</span>
                      </div>
                      <Badge className={getStatusColor(analysis.status)} size="sm">
                        {analysis.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{analysis.description}</p>
                    {analysis.status === 'completed' && (
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Risk: {analysis.risk_score}</span>
                        <span>Confidence: {Math.round(analysis.confidence * 100)}%</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Analysis Results */}
      {activeAnalysis && activeAnalysis.status === 'completed' && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Key Insights</h4>
                  <ul className="space-y-2">
                    {activeAnalysis.insights.map((insight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5" />
                        <span className="text-sm">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Recommendations</h4>
                  <ul className="space-y-2">
                    {activeAnalysis.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Results
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 