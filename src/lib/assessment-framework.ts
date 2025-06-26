// Assessment Framework - Complete Implementation

export class AssessmentFramework {
  
  // Progressive Complexity Structure
  static readonly COMPLEXITY_LEVELS = {
    BASIC: {
      level: 1,
      name: "Basic",
      description: "Essential questions for initial assessment",
      question_count: "10-15",
      estimated_time: 10, // minutes
      required_for_score: true,
      triggers: ["first_time_user", "quick_assessment", "initial_setup"]
    },
    
    INTERMEDIATE: {
      level: 2,
      name: "Intermediate", 
      description: "Detailed questions for comprehensive coverage",
      question_count: "20-30",
      estimated_time: 20,
      required_for_score: false,
      triggers: ["basic_completed", "user_engaged", "quarterly_review"]
    },
    
    ADVANCED: {
      level: 3,
      name: "Advanced",
      description: "Specialized questions for complex scenarios",
      question_count: "15-25",
      estimated_time: 25,
      required_for_score: false,
      triggers: ["intermediate_completed", "high_risk_identified", "comprehensive_audit"]
    },
    
    COMPREHENSIVE: {
      level: 4,
      name: "Comprehensive",
      description: "Complete assessment for audit readiness",
      question_count: "40-60",
      estimated_time: 45,
      required_for_score: false,
      triggers: ["advanced_completed", "audit_preparation", "annual_review"]
    }
  };
  
  // Assessment progression logic
  static determineNextComplexityLevel(currentAssessment: Assessment): ComplexityLevel {
    const currentLevel = currentAssessment.complexity_level;
    const completionRate = currentAssessment.completion_percentage;
    const timeSpent = currentAssessment.time_spent_minutes;
    const userEngagement = this.calculateEngagementScore(currentAssessment);
    
    // Progression rules
    if (currentLevel === 'BASIC') {
      if (completionRate >= 80 && userEngagement > 0.7) {
        return 'INTERMEDIATE';
      }
    } else if (currentLevel === 'INTERMEDIATE') {
      if (completionRate >= 70 && timeSpent >= 15) {
        return 'ADVANCED';
      }
    } else if (currentLevel === 'ADVANCED') {
      if (completionRate >= 60 && this.hasHighRiskAreas(currentAssessment)) {
        return 'COMPREHENSIVE';
      }
    }
    
    return currentLevel; // Stay at current level
  }
  
  private static calculateEngagementScore(assessment: Assessment): number {
    let score = 0;
    
    // Factors that indicate engagement
    if (assessment.ai_interactions > 0) score += 0.3;
    if (assessment.time_spent_minutes > 5) score += 0.2;
    if (assessment.responses.some(r => r.has_comments)) score += 0.2;
    if (assessment.responses.some(r => !r.ai_generated)) score += 0.3;
    
    return Math.min(1.0, score);
  }
  
  private static hasHighRiskAreas(assessment: Assessment): boolean {
    return assessment.responses.some(response => {
      const question = this.getQuestionById(response.question_id);
      return question && this.getResponseRiskScore(question, response.answer) >= 80;
    });
  }
  
  // Auto-population Engine
  static async autoPopulateAssessment(
    assessmentId: string, 
    companyIntelligence: CompanyIntelligence,
    previousAssessments: Assessment[] = []
  ): Promise<AutoPopulationResult> {
    
    const assessment = await this.getAssessment(assessmentId);
    const module = await this.getModule(assessment.module_id);
    const populationRules = this.getPopulationRules(module.name);
    
    const results: AutoPopulationResult = {
      assessment_id: assessmentId,
      populated_responses: [],
      confidence_scores: {},
      population_summary: {
        total_questions: 0,
        populated_questions: 0,
        high_confidence: 0,
        medium_confidence: 0,
        low_confidence: 0
      }
    };
    
    // Process each question in the assessment
    for (const question of module.questions) {
      const populationResult = await this.populateQuestion(
        question, 
        companyIntelligence, 
        previousAssessments,
        populationRules
      );
      
      if (populationResult.success) {
        results.populated_responses.push({
          question_id: question.id,
          suggested_answer: populationResult.answer,
          confidence: populationResult.confidence,
          reasoning: populationResult.reasoning,
          data_sources: populationResult.data_sources
        });
        
        results.confidence_scores[question.id] = populationResult.confidence;
        
        // Update summary counts
        if (populationResult.confidence >= 0.8) {
          results.population_summary.high_confidence++;
        } else if (populationResult.confidence >= 0.6) {
          results.population_summary.medium_confidence++;
        } else {
          results.population_summary.low_confidence++;
        }
        
        results.population_summary.populated_questions++;
      }
      
      results.population_summary.total_questions++;
    }
    
    // Save populated responses to assessment
    await this.savePopulatedResponses(assessmentId, results.populated_responses);
    
    return results;
  }
  
  private static async populateQuestion(
    question: Question,
    intelligence: CompanyIntelligence,
    previousAssessments: Assessment[],
    rules: PopulationRules
  ): Promise<PopulationResult> {
    
    // Try multiple population strategies in order of preference
    const strategies = [
      () => this.populateFromExplicitData(question, intelligence),
      () => this.populateFromSystemAnalysis(question, intelligence),
      () => this.populateFromIndustryDefaults(question, intelligence),
      () => this.populateFromPreviousAssessments(question, previousAssessments),
      () => this.populateFromAIInference(question, intelligence)
    ];
    
    for (const strategy of strategies) {
      const result = await strategy();
      if (result.success && result.confidence >= 0.5) {
        return result;
      }
    }
    
    return { success: false, confidence: 0 };
  }
  
  private static async populateFromExplicitData(
    question: Question, 
    intelligence: CompanyIntelligence
  ): Promise<PopulationResult> {
    
    // Direct mapping from company intelligence to questions
    const explicitMappings = {
      'admin_001': { // Security Officer question
        data_path: 'current_security.has_security_officer',
        mapping: { true: 'yes', false: 'no' },
        confidence: 0.95
      },
      'admin_002': { // Training frequency
        data_path: 'current_security.employee_training',
        mapping: { 
          'never': 'Never',
          'onboarding': 'Once upon hiring',
          'annual': 'Annually',
          'quarterly': 'Quarterly'
        },
        confidence: 0.9
      },
      'tech_001': { // Unique user identification
        data_path: 'technology_systems',
        evaluation: (systems: any[]) => {
          const hasUserManagement = systems.some(s => 
            s.features?.includes('user_management') || 
            s.type === 'EHR' || 
            s.type === 'CRM'
          );
          return hasUserManagement ? 'yes' : 'no';
        },
        confidence: 0.8
      }
    };
    
    const mapping = explicitMappings[question.id];
    if (!mapping) {
      return { success: false, confidence: 0 };
    }
    
    const dataValue = this.getNestedValue(intelligence, mapping.data_path);
    
    if (mapping.evaluation) {
      const answer = mapping.evaluation(dataValue);
      return {
        success: true,
        answer,
        confidence: mapping.confidence,
        reasoning: `Determined from company systems analysis`,
        data_sources: ['company_systems']
      };
    }
    
    if (mapping.mapping && dataValue !== undefined) {
      const answer = mapping.mapping[dataValue];
      if (answer) {
        return {
          success: true,
          answer,
          confidence: mapping.confidence,
          reasoning: `Directly mapped from company profile`,
          data_sources: ['company_profile']
        };
      }
    }
    
    return { success: false, confidence: 0 };
  }
  
  private static async populateFromSystemAnalysis(
    question: Question,
    intelligence: CompanyIntelligence
  ): Promise<PopulationResult> {
    
    // Analyze technology systems to infer answers
    const systems = intelligence.technology_systems || [];
    const industryType = intelligence.industry;
    
    const systemAnalysisRules = {
      'phys_001': { // Physical access controls
        analysis: () => {
          const hasCloudOnly = systems.every(s => s.deployment_type === 'cloud');
          const hasOnPremise = systems.some(s => s.deployment_type === 'on_premise');
          
          if (hasCloudOnly) return 'Key card access with logging';
          if (hasOnPremise) return 'Locked doors only';
          return 'No specific controls';
        },
        confidence: 0.7
      },
      
      'tech_002': { // Encryption
        analysis: () => {
          const hasModernSystems = systems.some(s => 
            s.security_features?.includes('encryption') ||
            s.type === 'EHR' ||
            s.name?.includes('365') ||
            s.name?.includes('Google')
          );
          
          if (hasModernSystems) return 'AES-256 encryption';
          return 'Basic password protection';
        },
        confidence: 0.75
      }
    };
    
    const rule = systemAnalysisRules[question.id];
    if (rule) {
      const answer = rule.analysis();
      return {
        success: true,
        answer,
        confidence: rule.confidence,
        reasoning: `Inferred from technology systems configuration`,
        data_sources: ['technology_systems']
      };
    }
    
    return { success: false, confidence: 0 };
  }
  
  private static async populateFromIndustryDefaults(
    question: Question,
    intelligence: CompanyIntelligence
  ): Promise<PopulationResult> {
    
    const industry = intelligence.industry;
    const employeeCount = intelligence.employee_count;
    
    const industryDefaults = {
      healthcare: {
        'admin_002': { // Training frequency
          default: employeeCount <= 25 ? 'Annually' : 'Semi-annually',
          confidence: 0.6,
          reasoning: 'Healthcare industry standard based on organization size'
        },
        'tech_002': { // Encryption
          default: 'AES-256 encryption',
          confidence: 0.7,
          reasoning: 'HIPAA requires strong encryption for PHI'
        }
      },
      
      legal: {
        'admin_002': {
          default: 'Annually',
          confidence: 0.6,
          reasoning: 'Legal industry standard for confidentiality training'
        }
      },
      
      financial_services: {
        'tech_002': {
          default: 'AES-256 encryption',
          confidence: 0.8,
          reasoning: 'Financial services require strong encryption standards'
        }
      }
    };
    
    const industryData = industryDefaults[industry];
    if (industryData && industryData[question.id]) {
      const defaultData = industryData[question.id];
      return {
        success: true,
        answer: defaultData.default,
        confidence: defaultData.confidence,
        reasoning: defaultData.reasoning,
        data_sources: ['industry_standards']
      };
    }
    
    return { success: false, confidence: 0 };
  }
  
  private static async populateFromAIInference(
    question: Question,
    intelligence: CompanyIntelligence
  ): Promise<PopulationResult> {
    
    // Use AI to infer answers based on company context
    const prompt = `
      Based on this company profile, what would be the most likely answer to this compliance question?
      
      Company: ${intelligence.business_type} with ${intelligence.employee_count} employees
      Industry: ${intelligence.industry}
      Systems: ${intelligence.technology_systems?.map(s => s.name).join(', ')}
      
      Question: ${question.question}
      Options: ${question.options?.join(', ') || 'Yes/No'}
      
      Provide the most likely answer and confidence level (0-1).
    `;
    
    // Mock AI response - in production, this would call OpenAI API
    const aiResponse = await this.callAIInference(prompt);
    
    return {
      success: aiResponse.confidence > 0.5,
      answer: aiResponse.answer,
      confidence: aiResponse.confidence,
      reasoning: `AI inference based on company profile and industry patterns`,
      data_sources: ['ai_inference']
    };
  }
  
  private static async callAIInference(prompt: string): Promise<{ answer: string; confidence: number }> {
    // Mock implementation - replace with actual OpenAI API call
    return {
      answer: "Annually",
      confidence: 0.6
    };
  }

  // Custom Schedule Management
  static createCustomSchedule(
    companyId: string,
    preferences: SchedulePreferences
  ): CustomSchedule {
    
    const baseSchedule = this.getBaseSchedule(preferences.frequency);
    const customSchedule: CustomSchedule = {
      company_id: companyId,
      frequency: preferences.frequency,
      custom_intervals: [],
      milestone_reminders: [],
      priority_adjustments: {},
      notification_preferences: preferences.notifications
    };
    
    // Create custom intervals based on preferences
    if (preferences.custom_dates && preferences.custom_dates.length > 0) {
      customSchedule.custom_intervals = preferences.custom_dates.map(date => ({
        date: date,
        type: 'custom_review',
        description: 'Scheduled compliance review',
        modules_to_review: preferences.priority_modules || []
      }));
    } else {
      // Generate standard intervals
      customSchedule.custom_intervals = this.generateStandardIntervals(
        preferences.frequency,
        preferences.start_date
      );
    }
    
    // Add milestone reminders
    customSchedule.milestone_reminders = this.generateMilestones(
      customSchedule.custom_intervals,
      preferences.milestone_triggers
    );
    
    // Set priority adjustments based on risk levels
    customSchedule.priority_adjustments = this.calculatePriorityAdjustments(
      companyId,
      preferences
    );
    
    return customSchedule;
  }
  
  private static generateStandardIntervals(
    frequency: 'monthly' | 'quarterly' | 'semi_annual' | 'annual',
    startDate: Date
  ): ScheduleInterval[] {
    
    const intervals: ScheduleInterval[] = [];
    const intervalMonths = {
      monthly: 1,
      quarterly: 3,
      semi_annual: 6,
      annual: 12
    };
    
    const monthIncrement = intervalMonths[frequency];
    const currentDate = new Date(startDate);
    
    // Generate next 2 years of intervals
    for (let i = 0; i < (24 / monthIncrement); i++) {
      const intervalDate = new Date(currentDate);
      intervalDate.setMonth(currentDate.getMonth() + (i * monthIncrement));
      
      intervals.push({
        date: intervalDate.toISOString(),
        type: `${frequency}_review`,
        description: `${frequency.charAt(0).toUpperCase() + frequency.slice(1)} compliance review`,
        modules_to_review: ['all'], // Review all active modules
        estimated_duration: this.getEstimatedDuration(frequency)
      });
    }
    
    return intervals;
  }
  
  private static generateMilestones(
    intervals: ScheduleInterval[],
    triggers: MilestoneTrigger[]
  ): MilestoneReminder[] {
    
    const milestones: MilestoneReminder[] = [];
    
    triggers.forEach(trigger => {
      intervals.forEach(interval => {
        const milestoneDate = new Date(interval.date);
        milestoneDate.setDate(milestoneDate.getDate() - trigger.days_before);
        
        milestones.push({
          id: `milestone_${interval.date}_${trigger.type}`,
          title: trigger.title,
          description: trigger.description,
          date: milestoneDate.toISOString(),
          type: trigger.type,
          related_interval: interval.date,
          notification_methods: trigger.notification_methods
        });
      });
    });
    
    return milestones.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }
  
  // Assessment State Management
  static manageAssessmentState(assessmentId: string): AssessmentStateManager {
    return new AssessmentStateManager(assessmentId);
  }
  
  // Utility methods
  private static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
  
  private static getEstimatedDuration(frequency: string): number {
    const durations = {
      monthly: 10,
      quarterly: 20,
      semi_annual: 30,
      annual: 45
    };
    return durations[frequency] || 20;
  }
  
  // Mock methods for database operations
  private static async getAssessment(id: string): Promise<Assessment> {
    // Mock implementation
    return {
      id,
      module_id: 'hipaa',
      complexity_level: 'BASIC',
      completion_percentage: 0,
      responses: [],
      time_spent_minutes: 0,
      ai_interactions: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
  
  private static async getModule(id: string): Promise<any> {
    // Mock implementation
    return {
      id,
      name: 'hipaa',
      questions: []
    };
  }
  
  private static getPopulationRules(moduleName: string): any {
    // Mock implementation
    return {};
  }
  
  private static async populateFromPreviousAssessments(
    question: Question,
    previousAssessments: Assessment[]
  ): Promise<PopulationResult> {
    // Mock implementation
    return { success: false, confidence: 0 };
  }
  
  private static async savePopulatedResponses(
    assessmentId: string,
    responses: PopulatedResponse[]
  ): Promise<void> {
    // Mock implementation
    console.log('Saving populated responses:', responses);
  }
  
  private static getQuestionById(id: string): Question | null {
    // Mock implementation
    return null;
  }
  
  private static getResponseRiskScore(question: Question, answer: string): number {
    // Mock implementation
    return 50;
  }
  
  private static getBaseSchedule(frequency: string): any {
    // Mock implementation
    return {};
  }
  
  private static calculatePriorityAdjustments(
    companyId: string,
    preferences: SchedulePreferences
  ): { [moduleId: string]: number } {
    // Mock implementation
    return {};
  }
}

// Assessment State Manager Class
class AssessmentStateManager {
  private assessmentId: string;
  private currentState: AssessmentState;
  
  constructor(assessmentId: string) {
    this.assessmentId = assessmentId;
    this.currentState = this.loadCurrentState();
  }
  
  async saveProgress(responses: any[]): Promise<void> {
    const updatedState = {
      ...this.currentState,
      responses,
      last_updated: new Date().toISOString(),
      completion_percentage: this.calculateCompletion(responses)
    };
    
    await this.persistState(updatedState);
    this.currentState = updatedState;
  }
  
  async pauseAssessment(reason: string): Promise<void> {
    const pausedState = {
      ...this.currentState,
      status: 'paused',
      pause_reason: reason,
      pause_timestamp: new Date().toISOString()
    };
    
    await this.persistState(pausedState);
    this.currentState = pausedState;
  }
  
  async resumeAssessment(): Promise<void> {
    const resumedState = {
      ...this.currentState,
      status: 'in_progress',
      resume_timestamp: new Date().toISOString(),
      pause_reason: null
    };
    
    await this.persistState(resumedState);
    this.currentState = resumedState;
  }
  
  getRecommendedNextSteps(): NextStep[] {
    const completion = this.currentState.completion_percentage;
    const timeSpent = this.calculateTimeSpent();
    
    if (completion < 25) {
      return [{
        action: 'continue_basic_questions',
        description: 'Complete the essential questions first',
        estimated_time: 10,
        priority: 'high'
      }];
    } else if (completion < 75) {
      return [{
        action: 'complete_current_section',
        description: 'Finish the current section to maintain momentum',
        estimated_time: 5,
        priority: 'medium'
      }];
    }
    
    return [{
      action: 'review_and_finalize',
      description: 'Review your responses and finalize the assessment',
      estimated_time: 5,
      priority: 'low'
    }];
  }
  
  private loadCurrentState(): AssessmentState {
    // Mock implementation - load from database
    return {
      assessment_id: this.assessmentId,
      status: 'in_progress',
      completion_percentage: 0,
      responses: [],
      last_updated: new Date().toISOString(),
      time_spent_minutes: 0
    };
  }
  
  private async persistState(state: AssessmentState): Promise<void> {
    // Mock implementation - save to database
    console.log('Saving assessment state:', state);
  }
  
  private calculateCompletion(responses: any[]): number {
    // Implementation depends on total questions available
    const totalQuestions = 50; // Mock value
    return Math.round((responses.length / totalQuestions) * 100);
  }
  
  private calculateTimeSpent(): number {
    const startTime = new Date(this.currentState.created_at || Date.now());
    const currentTime = new Date();
    return Math.round((currentTime.getTime() - startTime.getTime()) / (1000 * 60));
  }
}

// TypeScript Interfaces
interface Assessment {
  id: string;
  module_id: string;
  complexity_level: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'COMPREHENSIVE';
  completion_percentage: number;
  responses: any[];
  time_spent_minutes: number;
  ai_interactions: number;
  created_at: string;
  updated_at: string;
}

interface Question {
  id: string;
  question: string;
  question_type: string;
  options?: string[];
  complexity_level: number;
  weight: number;
}

interface CompanyIntelligence {
  business_type: string;
  industry: string;
  employee_count: number;
  technology_systems: any[];
  current_security: any;
  compliance_obligations: string[];
}

interface AutoPopulationResult {
  assessment_id: string;
  populated_responses: PopulatedResponse[];
  confidence_scores: { [questionId: string]: number };
  population_summary: {
    total_questions: number;
    populated_questions: number;
    high_confidence: number;
    medium_confidence: number;
    low_confidence: number;
  };
}

interface PopulatedResponse {
  question_id: string;
  suggested_answer: string;
  confidence: number;
  reasoning: string;
  data_sources: string[];
}

interface PopulationResult {
  success: boolean;
  answer?: string;
  confidence: number;
  reasoning?: string;
  data_sources?: string[];
}

interface SchedulePreferences {
  frequency: 'monthly' | 'quarterly' | 'semi_annual' | 'annual';
  start_date: Date;
  custom_dates?: Date[];
  priority_modules?: string[];
  notifications: NotificationPreferences;
  milestone_triggers: MilestoneTrigger[];
}

interface CustomSchedule {
  company_id: string;
  frequency: string;
  custom_intervals: ScheduleInterval[];
  milestone_reminders: MilestoneReminder[];
  priority_adjustments: { [moduleId: string]: number };
  notification_preferences: NotificationPreferences;
}

interface ScheduleInterval {
  date: string;
  type: string;
  description: string;
  modules_to_review: string[];
  estimated_duration?: number;
}

interface MilestoneReminder {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  related_interval: string;
  notification_methods: string[];
}

interface MilestoneTrigger {
  type: string;
  title: string;
  description: string;
  days_before: number;
  notification_methods: string[];
}

interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  platform: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
}

interface AssessmentState {
  assessment_id: string;
  status: 'not_started' | 'in_progress' | 'paused' | 'completed';
  completion_percentage: number;
  responses: any[];
  last_updated: string;
  time_spent_minutes: number;
  created_at?: string;
  pause_reason?: string;
  pause_timestamp?: string;
  resume_timestamp?: string;
}

interface NextStep {
  action: string;
  description: string;
  estimated_time: number;
  priority: 'high' | 'medium' | 'low';
}

type ComplexityLevel = 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'COMPREHENSIVE';

// Example Usage
export const assessmentFrameworkExample = {
  // Create a new assessment with progressive complexity
  createProgressiveAssessment: async (companyId: string, moduleId: string) => {
    const assessment = await AssessmentFramework.createAssessment({
      company_id: companyId,
      module_id: moduleId,
      complexity_level: 'BASIC', // Start basic
      auto_populate: true
    });
    
    return assessment;
  },
  
  // Auto-populate with company intelligence
  populateWithAI: async (assessmentId: string, companyData: any) => {
    const result = await AssessmentFramework.autoPopulateAssessment(
      assessmentId,
      companyData
    );
    
    console.log(`Populated ${result.population_summary.populated_questions} out of ${result.population_summary.total_questions} questions`);
    console.log(`High confidence: ${result.population_summary.high_confidence}`);
    
    return result;
  },
  
  // Set up custom schedule
  setupCustomSchedule: (companyId: string) => {
    const schedule = AssessmentFramework.createCustomSchedule(companyId, {
      frequency: 'quarterly',
      start_date: new Date(),
      notifications: {
        email: true,
        sms: false,
        platform: true,
        frequency: 'weekly'
      },
      milestone_triggers: [
        {
          type: 'reminder',
          title: 'Upcoming Compliance Review',
          description: 'Your quarterly review is coming up in one week',
          days_before: 7,
          notification_methods: ['email', 'platform']
        }
      ]
    });
    
    return schedule;
  }
}; 