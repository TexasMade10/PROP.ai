// Dashboard Logic - Complete Implementation

export interface DashboardData {
  company_id: string;
  overall_risk_score: number;
  risk_level: 'Low Risk' | 'Medium Risk' | 'High Risk' | 'Critical Risk';
  section_scores: {
    administrative: number;
    physical: number;
    technical: number;
    operational?: number;
    strategic?: number;
  };
  benchmarking: {
    industry_average: number;
    percentile_ranking: number;
    peer_comparison: 'above' | 'below' | 'average';
    improvement_potential: number;
  };
  progress_metrics: {
    completion_percentage: number;
    modules_completed: number;
    total_modules: number;
    last_updated: string;
    next_review_date: string;
  };
  action_items: ActionItem[];
  upcoming_tasks: UpcomingTask[];
}

export class DashboardCalculator {
  
  // Risk Score Calculation with Advanced Weighting
  static calculateRiskScore(assessments: Assessment[]): RiskScoreResult {
    if (!assessments || assessments.length === 0) {
      return this.getDefaultRiskScore();
    }
    
    let totalWeightedScore = 0;
    let totalWeight = 0;
    const sectionScores: Record<string, number> = {};
    
    // Calculate section scores with different weights based on criticality
    const SECTION_WEIGHTS = {
      administrative: 0.35, // Highest weight - policies and procedures
      technical: 0.30,      // High weight - system security
      physical: 0.20,       // Medium weight - physical security
      operational: 0.10,    // Lower weight - day-to-day operations
      strategic: 0.05       // Lowest weight - long-term planning
    };
    
    // Process each assessment
    assessments.forEach(assessment => {
      const moduleScore = this.calculateModuleScore(assessment);
      const section = this.getModuleSection(assessment.module_id);
      const weight = SECTION_WEIGHTS[section] || 0.1;
      
      sectionScores[section] = moduleScore;
      totalWeightedScore += (moduleScore * weight);
      totalWeight += weight;
    });
    
    // Calculate overall score (0-100 scale, higher is better)
    const overallScore = totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0;
    
    // Determine risk level
    const riskLevel = this.determineRiskLevel(overallScore);
    
    // Identify critical issues
    const criticalIssues = this.identifyCriticalIssues(assessments);
    
    return {
      overall_score: overallScore,
      section_scores: sectionScores,
      risk_level: riskLevel,
      critical_issues: criticalIssues,
      score_trend: this.calculateScoreTrend(assessments),
      last_calculated: new Date().toISOString()
    };
  }
  
  private static calculateModuleScore(assessment: Assessment): number {
    if (!assessment.responses || assessment.responses.length === 0) {
      return 0;
    }
    
    let totalRiskPoints = 0;
    let totalQuestions = assessment.responses.length;
    
    assessment.responses.forEach(response => {
      const riskValue = this.getResponseRiskValue(response);
      totalRiskPoints += riskValue;
    });
    
    // Convert risk points to score (invert so higher score = lower risk)
    const averageRisk = totalRiskPoints / totalQuestions;
    return Math.max(0, Math.min(100, 100 - averageRisk));
  }
  
  private static getResponseRiskValue(response: any): number {
    // This would reference the question's risk mapping
    // For now, using simplified logic
    const riskMappings = {
      'high_risk': 80,
      'medium_risk': 50,
      'low_risk': 20,
      'no_risk': 5
    };
    
    return riskMappings[response.risk_category] || 50;
  }
  
  private static determineRiskLevel(score: number): string {
    if (score >= 80) return 'Low Risk';
    if (score >= 60) return 'Medium Risk';
    if (score >= 40) return 'High Risk';
    return 'Critical Risk';
  }
  
  // Industry Benchmarking System
  static async calculateBenchmarking(companyId: string): Promise<BenchmarkingResult> {
    const company = await this.getCompanyProfile(companyId);
    const companyScore = await this.getCompanyRiskScore(companyId);
    
    // Get industry benchmarks
    const industryData = await this.getIndustryBenchmarks(
      company.industry,
      this.getEmployeeSizeCategory(company.employee_count)
    );
    
    // Calculate percentile ranking
    const percentileRanking = this.calculatePercentile(companyScore.overall_score, industryData);
    
    // Determine peer comparison
    const peerComparison = this.determinePeerComparison(
      companyScore.overall_score,
      industryData.industry_average
    );
    
    return {
      company_score: companyScore.overall_score,
      industry_average: industryData.industry_average,
      percentile_ranking: percentileRanking,
      peer_comparison: peerComparison,
      sample_size: industryData.sample_size,
      improvement_potential: Math.max(0, 100 - companyScore.overall_score),
      top_performers: {
        percentile_90: industryData.percentile_90,
        percentile_75: industryData.percentile_75
      },
      comparison_insights: this.generateComparisonInsights(
        companyScore.overall_score,
        industryData
      )
    };
  }
  
  private static calculatePercentile(score: number, industryData: IndustryBenchmarkData): number {
    // Calculate what percentile the company falls into
    if (score >= industryData.percentile_90) return 90;
    if (score >= industryData.percentile_75) return 75;
    if (score >= industryData.percentile_50) return 50;
    if (score >= industryData.percentile_25) return 25;
    return 10;
  }
  
  private static determinePeerComparison(companyScore: number, industryAverage: number): 'above' | 'below' | 'average' {
    const difference = Math.abs(companyScore - industryAverage);
    
    if (difference <= 5) return 'average';
    return companyScore > industryAverage ? 'above' : 'below';
  }
  
  private static generateComparisonInsights(score: number, industryData: IndustryBenchmarkData): string[] {
    const insights: string[] = [];
    
    if (score >= industryData.percentile_90) {
      insights.push("Your security posture is in the top 10% of your industry");
    } else if (score >= industryData.percentile_75) {
      insights.push("You're performing better than 75% of similar companies");
    } else if (score < industryData.percentile_25) {
      insights.push("Significant opportunity to improve compared to industry peers");
    }
    
    const improvementGap = industryData.percentile_75 - score;
    if (improvementGap > 0) {
      insights.push(`${improvementGap} points improvement would put you in top quartile`);
    }
    
    return insights;
  }
  
  // Progress Tracking System
  static calculateProgressMetrics(companyId: string): ProgressMetrics {
    const assessments = this.getCompanyAssessments(companyId);
    const modules = this.getAvailableModules();
    
    let totalQuestions = 0;
    let answeredQuestions = 0;
    let completedModules = 0;
    
    assessments.forEach(assessment => {
      const moduleQuestions = this.getModuleQuestionCount(assessment.module_id);
      totalQuestions += moduleQuestions;
      answeredQuestions += assessment.responses?.length || 0;
      
      if (assessment.completion_percentage >= 80) {
        completedModules++;
      }
    });
    
    const overallCompletion = totalQuestions > 0 ? 
      Math.round((answeredQuestions / totalQuestions) * 100) : 0;
    
    return {
      completion_percentage: overallCompletion,
      modules_completed: completedModules,
      total_modules: assessments.length,
      questions_answered: answeredQuestions,
      total_questions: totalQuestions,
      last_activity: this.getLastActivityDate(assessments),
      next_milestone: this.calculateNextMilestone(overallCompletion),
      completion_trend: this.calculateCompletionTrend(companyId)
    };
  }
  
  // Action Items Generation
  static generateActionItems(assessments: Assessment[]): ActionItem[] {
    const actionItems: ActionItem[] = [];
    
    assessments.forEach(assessment => {
      const criticalResponses = this.findCriticalResponses(assessment);
      
      criticalResponses.forEach(response => {
        const actionItem = this.createActionItem(response, assessment);
        if (actionItem) {
          actionItems.push(actionItem);
        }
      });
    });
    
    // Sort by priority and due date
    return actionItems.sort((a, b) => {
      const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });
  }
  
  private static createActionItem(response: any, assessment: Assessment): ActionItem | null {
    const riskLevel = this.getResponseRiskLevel(response);
    
    if (riskLevel < 70) return null; // Only create action items for high-risk responses
    
    return {
      id: `action_${assessment.id}_${response.question_id}`,
      title: this.generateActionTitle(response),
      description: this.generateActionDescription(response),
      priority: this.mapRiskToPriority(riskLevel),
      category: this.getQuestionCategory(response.question_id),
      due_date: this.calculateDueDate(riskLevel),
      estimated_effort: this.estimateEffort(response),
      module_id: assessment.module_id,
      question_id: response.question_id,
      status: 'pending'
    };
  }
  
  private static mapRiskToPriority(riskLevel: number): 'critical' | 'high' | 'medium' | 'low' {
    if (riskLevel >= 90) return 'critical';
    if (riskLevel >= 80) return 'high';
    if (riskLevel >= 70) return 'medium';
    return 'low';
  }
  
  // Upcoming Tasks and Timeline Management
  static generateUpcomingTasks(companyId: string): UpcomingTask[] {
    const tasks: UpcomingTask[] = [];
    const company = this.getCompanyProfile(companyId);
    
    // Add quarterly review tasks
    const nextQuarterlyReview = this.getNextQuarterlyDate();
    tasks.push({
      id: `quarterly_${companyId}`,
      title: "Quarterly Compliance Review",
      description: "Update your assessments and review progress",
      due_date: nextQuarterlyReview,
      type: 'quarterly_review',
      estimated_duration: 15, // minutes
      priority: 'medium'
    });
    
    // Add overdue assessments
    const overdueAssessments = this.getOverdueAssessments(companyId);
    overdueAssessments.forEach(assessment => {
      tasks.push({
        id: `overdue_${assessment.id}`,
        title: `Complete ${assessment.module_name} Assessment`,
        description: "This assessment is overdue for completion",
        due_date: assessment.due_date,
        type: 'assessment_completion',
        estimated_duration: 30,
        priority: 'high'
      });
    });
    
    // Add action item reminders
    const pendingActions = this.getPendingActionItems(companyId);
    pendingActions.slice(0, 5).forEach(action => { // Top 5 actions
      tasks.push({
        id: `action_reminder_${action.id}`,
        title: action.title,
        description: action.description,
        due_date: action.due_date,
        type: 'action_item',
        estimated_duration: action.estimated_effort,
        priority: action.priority
      });
    });
    
    return tasks.sort((a, b) => 
      new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    );
  }
  
  // Dashboard Summary Generation
  static generateDashboardSummary(companyId: string): DashboardSummary {
    const riskScore = this.calculateRiskScore(this.getCompanyAssessments(companyId));
    const benchmarking = this.calculateBenchmarking(companyId);
    const progress = this.calculateProgressMetrics(companyId);
    const actionItems = this.generateActionItems(this.getCompanyAssessments(companyId));
    const upcomingTasks = this.generateUpcomingTasks(companyId);
    
    return {
      overall_health: this.calculateOverallHealth(riskScore, progress),
      key_metrics: {
        risk_score: riskScore.overall_score,
        completion_rate: progress.completion_percentage,
        critical_issues: actionItems.filter(item => item.priority === 'critical').length,
        days_until_review: this.getDaysUntilNextReview(companyId)
      },
      status_indicators: {
        compliance_status: this.getComplianceStatus(riskScore.overall_score),
        assessment_progress: this.getProgressStatus(progress.completion_percentage),
        action_items_status: this.getActionItemsStatus(actionItems),
        benchmark_performance: this.getBenchmarkStatus(benchmarking)
      },
      quick_wins: this.identifyQuickWins(actionItems),
      priority_focus: this.determinePriorityFocus(riskScore, actionItems)
    };
  }
  
  private static calculateOverallHealth(riskScore: any, progress: any): 'excellent' | 'good' | 'needs_attention' | 'critical' {
    const scoreWeight = 0.6;
    const progressWeight = 0.4;
    
    const combinedScore = (riskScore.overall_score * scoreWeight) + (progress.completion_percentage * progressWeight);
    
    if (combinedScore >= 80) return 'excellent';
    if (combinedScore >= 60) return 'good';
    if (combinedScore >= 40) return 'needs_attention';
    return 'critical';
  }
  
  // Helper methods for mock data (replace with actual database calls)
  private static getDefaultRiskScore(): RiskScoreResult {
    return {
      overall_score: 0,
      section_scores: {},
      risk_level: 'Critical Risk',
      critical_issues: ['No assessments completed'],
      score_trend: 'stable',
      last_calculated: new Date().toISOString()
    };
  }
  
  private static getModuleSection(moduleId: string): string {
    const moduleSections: Record<string, string> = {
      'hipaa': 'administrative',
      'cybersecurity': 'technical',
      'quarterly_review': 'strategic',
      'operations': 'operational'
    };
    return moduleSections[moduleId] || 'operational';
  }
  
  private static calculateScoreTrend(assessments: Assessment[]): 'improving' | 'declining' | 'stable' {
    // This would compare current scores with historical data
    return 'stable';
  }
  
  private static identifyCriticalIssues(assessments: Assessment[]): string[] {
    const issues: string[] = [];
    // Implementation would analyze responses for critical issues
    return issues;
  }
  
  private static async getCompanyProfile(companyId: string): Promise<any> {
    return {
      id: companyId,
      industry: "healthcare",
      employee_count: 25,
      created_at: "2024-01-01"
    };
  }
  
  private static async getCompanyRiskScore(companyId: string): Promise<any> {
    return { overall_score: 65 };
  }
  
  private static async getIndustryBenchmarks(industry: string, sizeCategory: string): Promise<IndustryBenchmarkData> {
    // This would query your benchmarking database
    return {
      industry_average: 65,
      percentile_25: 45,
      percentile_50: 65,
      percentile_75: 80,
      percentile_90: 90,
      sample_size: 150,
      last_updated: new Date().toISOString()
    };
  }
  
  private static getEmployeeSizeCategory(employeeCount: number): string {
    if (employeeCount <= 10) return "1-10";
    if (employeeCount <= 25) return "11-25";
    if (employeeCount <= 50) return "26-50";
    if (employeeCount <= 100) return "51-100";
    if (employeeCount <= 250) return "101-250";
    return "250+";
  }
  
  private static getCompanyAssessments(companyId: string): Assessment[] {
    return []; // Mock data - replace with actual database query
  }
  
  private static getAvailableModules(): any[] {
    return []; // Mock data - replace with actual module data
  }
  
  private static getModuleQuestionCount(moduleId: string): number {
    return 20; // Mock data - replace with actual count
  }
  
  private static getLastActivityDate(assessments: Assessment[]): string {
    return new Date().toISOString();
  }
  
  private static calculateNextMilestone(completion: number): string {
    if (completion < 25) return "25% completion";
    if (completion < 50) return "50% completion";
    if (completion < 75) return "75% completion";
    return "100% completion";
  }
  
  private static calculateCompletionTrend(companyId: string): 'accelerating' | 'steady' | 'slowing' {
    return 'steady';
  }
  
  private static findCriticalResponses(assessment: Assessment): any[] {
    return []; // Mock data - replace with actual critical response logic
  }
  
  private static getResponseRiskLevel(response: any): number {
    return 75; // Mock data - replace with actual risk calculation
  }
  
  private static generateActionTitle(response: any): string {
    return "Action required"; // Mock data - replace with actual title generation
  }
  
  private static generateActionDescription(response: any): string {
    return "Description of required action"; // Mock data - replace with actual description
  }
  
  private static getQuestionCategory(questionId: string): string {
    return "general"; // Mock data - replace with actual category mapping
  }
  
  private static calculateDueDate(riskLevel: number): string {
    const days = riskLevel >= 90 ? 7 : riskLevel >= 80 ? 14 : 30;
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  }
  
  private static estimateEffort(response: any): number {
    return 60; // Mock data - replace with actual effort estimation
  }
  
  private static getNextQuarterlyDate(): string {
    const date = new Date();
    date.setMonth(date.getMonth() + 3);
    return date.toISOString();
  }
  
  private static getOverdueAssessments(companyId: string): Assessment[] {
    return []; // Mock data - replace with actual overdue assessment logic
  }
  
  private static getPendingActionItems(companyId: string): ActionItem[] {
    return []; // Mock data - replace with actual pending action items
  }
  
  private static getDaysUntilNextReview(companyId: string): number {
    return 45; // Mock data - replace with actual calculation
  }
  
  private static getComplianceStatus(score: number): string {
    if (score >= 80) return "Compliant";
    if (score >= 60) return "Mostly Compliant";
    if (score >= 40) return "Needs Improvement";
    return "Non-Compliant";
  }
  
  private static getProgressStatus(completion: number): string {
    if (completion >= 80) return "On Track";
    if (completion >= 50) return "In Progress";
    return "Getting Started";
  }
  
  private static getActionItemsStatus(actionItems: ActionItem[]): string {
    const critical = actionItems.filter(item => item.priority === 'critical').length;
    if (critical > 0) return `${critical} Critical Items`;
    return "All Good";
  }
  
  private static getBenchmarkStatus(benchmarking: any): string {
    return "Above Average"; // Mock data - replace with actual benchmark status
  }
  
  private static identifyQuickWins(actionItems: ActionItem[]): ActionItem[] {
    return actionItems.filter(item => item.estimated_effort <= 30).slice(0, 3);
  }
  
  private static determinePriorityFocus(riskScore: any, actionItems: ActionItem[]): string[] {
    return ["Complete critical action items", "Improve technical safeguards"]; // Mock data
  }
}

// TypeScript Interfaces
export interface Assessment {
  id: string;
  module_id: string;
  module_name: string;
  completion_percentage: number;
  responses: any[];
  due_date: string;
  last_updated: string;
}

export interface RiskScoreResult {
  overall_score: number;
  section_scores: Record<string, number>;
  risk_level: string;
  critical_issues: string[];
  score_trend: 'improving' | 'declining' | 'stable';
  last_calculated: string;
}

export interface BenchmarkingResult {
  company_score: number;
  industry_average: number;
  percentile_ranking: number;
  peer_comparison: 'above' | 'below' | 'average';
  sample_size: number;
  improvement_potential: number;
  top_performers: {
    percentile_90: number;
    percentile_75: number;
  };
  comparison_insights: string[];
}

export interface IndustryBenchmarkData {
  industry_average: number;
  percentile_25: number;
  percentile_50: number;
  percentile_75: number;
  percentile_90: number;
  sample_size: number;
  last_updated: string;
}

export interface ProgressMetrics {
  completion_percentage: number;
  modules_completed: number;
  total_modules: number;
  questions_answered: number;
  total_questions: number;
  last_activity: string;
  next_milestone: string;
  completion_trend: 'accelerating' | 'steady' | 'slowing';
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  due_date: string;
  estimated_effort: number; // minutes
  module_id: string;
  question_id: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface UpcomingTask {
  id: string;
  title: string;
  description: string;
  due_date: string;
  type: 'quarterly_review' | 'assessment_completion' | 'action_item';
  estimated_duration: number; // minutes
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface DashboardSummary {
  overall_health: 'excellent' | 'good' | 'needs_attention' | 'critical';
  key_metrics: {
    risk_score: number;
    completion_rate: number;
    critical_issues: number;
    days_until_review: number;
  };
  status_indicators: {
    compliance_status: string;
    assessment_progress: string;
    action_items_status: string;
    benchmark_performance: string;
  };
  quick_wins: ActionItem[];
  priority_focus: string[];
} 