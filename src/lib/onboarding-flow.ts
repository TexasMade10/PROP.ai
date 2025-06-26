// User Onboarding Flow - Complete 10-Minute Implementation

export interface OnboardingStep {
  step_number: number;
  step_name: string;
  estimated_time: number; // seconds
  required_data: string[];
  validation_rules: any;
  next_step_condition: string;
}

export interface CompanyIntelligence {
  business_type: string;
  industry: string;
  employee_count: number;
  employee_structure: {
    full_time: number;
    part_time: number;
    contractors: number;
  };
  technology_systems: Array<{
    name: string;
    type: string;
    data_types: string[];
    access_level: string;
  }>;
  data_handling: {
    phi_volume: string;
    storage_locations: string[];
    transmission_methods: string[];
    retention_periods: {
      medical_records: string;
      business_records: string;
    };
  };
  current_security: {
    has_security_officer: boolean;
    has_policies: boolean;
    employee_training: string;
    access_controls: string;
    encryption_status: string;
  };
  compliance_obligations: string[];
  risk_priorities: string[];
  timeline_preferences: {
    review_frequency: string;
    urgent_items: string;
    long_term_planning: string;
  };
  extracted_concerns: string[];
}

export interface AssessmentPopulationData {
  hipaa_assessment: {
    pre_populated_responses: Array<{
      question_id: string;
      suggested_answer: string;
      confidence: number;
      reasoning: string;
    }>;
    risk_areas_identified: Array<{
      area: string;
      issues: string[];
      priority: string;
    }>;
  };
  cybersecurity_assessment: {
    pre_populated_responses: Array<{
      question_id: string;
      suggested_answer: string;
      confidence: number;
      reasoning: string;
    }>;
  };
  quarterly_review: {
    initial_priorities: string[];
    timeline: string;
  };
}

export interface NextStep {
  title: string;
  description: string;
  priority: string;
  estimated_time: string;
  category: string;
}

export interface OnboardingCallResult {
  company_profile: CompanyIntelligence;
  assessment_population: AssessmentPopulationData;
  next_steps: NextStep[];
  confidence_score: number;
}

export interface OnboardingResult {
  success: boolean;
  total_time_ms?: number;
  total_time_minutes?: number;
  steps_completed?: any[];
  user_id?: string;
  onboarding_complete?: boolean;
  error?: string;
  failed_at_step?: number;
}

export const OnboardingFlow: OnboardingStep[] = [
  {
    step_number: 1,
    step_name: "email_signup",
    estimated_time: 60,
    required_data: ["email", "password", "company_name"],
    validation_rules: {
      email: "valid_email",
      password: "min_8_chars",
      company_name: "min_2_chars"
    },
    next_step_condition: "email_verified"
  },
  {
    step_number: 2,
    step_name: "company_profile",
    estimated_time: 90,
    required_data: ["industry", "employee_count", "phone_number"],
    validation_rules: {
      industry: "required_selection",
      employee_count: "positive_integer",
      phone_number: "valid_phone"
    },
    next_step_condition: "profile_complete"
  },
  {
    step_number: 3,
    step_name: "module_selection",
    estimated_time: 45,
    required_data: ["selected_modules"],
    validation_rules: {
      selected_modules: "min_1_max_3"
    },
    next_step_condition: "modules_selected"
  },
  {
    step_number: 4,
    step_name: "ai_phone_call",
    estimated_time: 300, // 5 minutes
    required_data: ["phone_verification", "call_completion"],
    validation_rules: {
      phone_verification: "verified",
      call_completion: "transcript_processed"
    },
    next_step_condition: "call_completed"
  },
  {
    step_number: 5,
    step_name: "data_sync",
    estimated_time: 120,
    required_data: ["ai_extracted_data"],
    validation_rules: {
      ai_extracted_data: "valid_json"
    },
    next_step_condition: "assessments_populated"
  },
  {
    step_number: 6,
    step_name: "dashboard_setup",
    estimated_time: 60,
    required_data: ["risk_scores", "benchmarks"],
    validation_rules: {
      risk_scores: "calculated",
      benchmarks: "loaded"
    },
    next_step_condition: "onboarding_complete"
  }
];

// AI Phone Call Script and Logic
export class OnboardingCallHandler {
  
  static readonly CALL_SCRIPT = {
    introduction: `Hi! I'm your AI assistant from PROP.ai. I'm here to help you set up your compliance platform in just a few minutes. I'll ask you some questions about your business to customize your assessments. This should take about 5-10 minutes. Sound good?`,
    
    company_basics: [
      "First, can you tell me a bit more about what your company does? What's your main business activity?",
      "How many employees do you currently have, including full-time and part-time?",
      "Do you handle any sensitive customer information like health records, financial data, or personal information?"
    ],
    
    current_systems: [
      "What systems do you currently use to store or process customer information? For example, do you use any practice management software, CRM systems, or cloud storage?",
      "How do your employees typically access company information? Do they use company computers, personal devices, or both?",
      "Do you have any existing security policies or procedures in place?"
    ],
    
    compliance_status: [
      "Have you ever had a formal security risk assessment done before?",
      "Do you have someone designated to handle compliance and security matters?",
      "Are there any specific compliance requirements you know you need to meet, like HIPAA, SOX, or industry-specific regulations?"
    ],
    
    priorities: [
      "What are your biggest concerns when it comes to data security and compliance?",
      "Are there any specific projects or changes planned for your business in the next 6 months that might affect your security needs?",
      "How often would you like to review and update your compliance status? We typically recommend quarterly check-ins."
    ],
    
    conclusion: "Perfect! I have all the information I need to set up your personalized assessments. You'll see your dashboard populate with your risk scores and recommendations in just a moment. Thank you for taking the time to get this set up properly!"
  };
  
  static async processOnboardingCall(transcript: string, companyId: string): Promise<OnboardingCallResult> {
    const extractedData = await this.extractCompanyIntelligence(transcript);
    const assessmentData = await this.generateAssessmentData(extractedData);
    
    return {
      company_profile: extractedData,
      assessment_population: assessmentData,
      next_steps: this.generateNextSteps(extractedData),
      confidence_score: this.calculateConfidenceScore(extractedData)
    };
  }
  
  private static async extractCompanyIntelligence(transcript: string): Promise<CompanyIntelligence> {
    // This would integrate with OpenAI API
    const aiPrompt = `
      Extract structured company information from this onboarding call transcript.
      Focus on information relevant to HIPAA compliance, cybersecurity, and business operations.
      
      Transcript: ${transcript}
      
      Extract the following information:
      1. Business type and industry
      2. Employee count and structure
      3. Current technology systems
      4. Data handling practices
      5. Existing security measures
      6. Compliance obligations
      7. Risk priorities
      8. Timeline preferences
    `;
    
    // Mock response - in real implementation this would call OpenAI
    return {
      business_type: "Healthcare Practice",
      industry: "Healthcare",
      employee_count: 25,
      employee_structure: {
        full_time: 20,
        part_time: 5,
        contractors: 2
      },
      technology_systems: [
        {
          name: "Epic EHR",
          type: "Electronic Health Records",
          data_types: ["PHI", "medical records"],
          access_level: "high"
        },
        {
          name: "Office 365",
          type: "Productivity Suite",
          data_types: ["email", "documents"],
          access_level: "medium"
        }
      ],
      data_handling: {
        phi_volume: "high",
        storage_locations: ["cloud", "local_servers"],
        transmission_methods: ["email", "secure_portal"],
        retention_periods: {
          medical_records: "7_years",
          business_records: "3_years"
        }
      },
      current_security: {
        has_security_officer: false,
        has_policies: true,
        employee_training: "annual",
        access_controls: "basic",
        encryption_status: "partial"
      },
      compliance_obligations: ["HIPAA", "State privacy laws"],
      risk_priorities: [
        "data breach prevention",
        "employee training",
        "system security"
      ],
      timeline_preferences: {
        review_frequency: "quarterly",
        urgent_items: "immediate",
        long_term_planning: "annual"
      },
      extracted_concerns: [
        "worried about employee devices accessing patient data",
        "need better incident response plan",
        "want to ensure proper backup procedures"
      ]
    };
  }
  
  private static async generateAssessmentData(intelligence: CompanyIntelligence): Promise<AssessmentPopulationData> {
    return {
      hipaa_assessment: {
        pre_populated_responses: [
          {
            question_id: "admin_001",
            suggested_answer: "no",
            confidence: 0.9,
            reasoning: "Company indicated no designated security officer"
          },
          {
            question_id: "admin_002",
            suggested_answer: "Annually",
            confidence: 0.85,
            reasoning: "Company mentioned annual employee training"
          },
          {
            question_id: "tech_002",
            suggested_answer: "Basic password protection",
            confidence: 0.75,
            reasoning: "Partial encryption mentioned, likely basic protection"
          }
        ],
        risk_areas_identified: [
          {
            area: "Administrative Safeguards",
            issues: ["No designated Security Officer", "Limited access controls"],
            priority: "high"
          },
          {
            area: "Technical Safeguards", 
            issues: ["Incomplete encryption", "Mixed device usage"],
            priority: "medium"
          }
        ]
      },
      cybersecurity_assessment: {
        pre_populated_responses: [
          {
            question_id: "cyber_001",
            suggested_answer: "Basic firewall only",
            confidence: 0.7,
            reasoning: "Small practice likely has basic security infrastructure"
          }
        ]
      },
      quarterly_review: {
        initial_priorities: [
          "Designate HIPAA Security Officer",
          "Implement device encryption policy",
          "Develop incident response procedures"
        ],
        timeline: "Q1 2024 focus areas"
      }
    };
  }
  
  private static generateNextSteps(intelligence: CompanyIntelligence): NextStep[] {
    return [
      {
        title: "Designate HIPAA Security Officer",
        description: "Assign a qualified individual to oversee HIPAA compliance",
        priority: "high",
        estimated_time: "1 week",
        category: "administrative"
      },
      {
        title: "Review Access Controls",
        description: "Audit current user access and implement role-based permissions",
        priority: "high", 
        estimated_time: "2-3 weeks",
        category: "technical"
      },
      {
        title: "Encrypt Mobile Devices",
        description: "Ensure all devices accessing PHI are properly encrypted",
        priority: "medium",
        estimated_time: "1-2 weeks",
        category: "technical"
      }
    ];
  }
  
  private static calculateConfidenceScore(intelligence: CompanyIntelligence): number {
    let score = 0;
    let factors = 0;
    
    // Score based on completeness of extracted data
    if (intelligence.business_type) { score += 20; factors++; }
    if (intelligence.employee_count > 0) { score += 20; factors++; }
    if (intelligence.technology_systems.length > 0) { score += 20; factors++; }
    if (intelligence.current_security) { score += 20; factors++; }
    if (intelligence.compliance_obligations.length > 0) { score += 20; factors++; }
    
    return factors > 0 ? Math.round(score / factors) : 0;
  }
}

// Onboarding Component Implementation
export class OnboardingManager {
  
  static async executeOnboardingFlow(userId: string): Promise<OnboardingResult> {
    const startTime = Date.now();
    let currentStep = 1;
    const stepResults: any[] = [];
    
    try {
      // Step 1: Email signup (handled by Supabase Auth)
      const signupResult = await this.handleEmailSignup(userId);
      stepResults.push({ step: 1, result: signupResult, duration: Date.now() - startTime });
      
      // Step 2: Company profile
      const profileResult = await this.handleCompanyProfile(userId);
      stepResults.push({ step: 2, result: profileResult });
      
      // Step 3: Module selection
      const moduleResult = await this.handleModuleSelection(userId);
      stepResults.push({ step: 3, result: moduleResult });
      
      // Step 4: AI phone call
      const callResult = await this.handleAIPhoneCall(userId);
      stepResults.push({ step: 4, result: callResult });
      
      // Step 5: Data sync
      const syncResult = await this.handleDataSync(userId, callResult);
      stepResults.push({ step: 5, result: syncResult });
      
      // Step 6: Dashboard setup
      const dashboardResult = await this.handleDashboardSetup(userId);
      stepResults.push({ step: 6, result: dashboardResult });
      
      const totalTime = Date.now() - startTime;
      
      return {
        success: true,
        total_time_ms: totalTime,
        total_time_minutes: Math.round(totalTime / 60000),
        steps_completed: stepResults,
        user_id: userId,
        onboarding_complete: true
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message,
        steps_completed: stepResults,
        failed_at_step: currentStep
      };
    }
  }
  
  private static async handleEmailSignup(userId: string): Promise<any> {
    // This would integrate with Supabase Auth
    return { status: "completed", user_id: userId };
  }
  
  private static async handleCompanyProfile(userId: string): Promise<any> {
    // This would save company profile to Supabase
    return { status: "completed", profile_saved: true };
  }
  
  private static async handleModuleSelection(userId: string): Promise<any> {
    // This would save module preferences to Supabase
    return { status: "completed", modules_selected: true };
  }
  
  private static async handleAIPhoneCall(userId: string): Promise<any> {
    // This would initiate Twilio call and process transcript
    const mockTranscript = "We are a healthcare practice with 25 employees...";
    const callResult = await OnboardingCallHandler.processOnboardingCall(mockTranscript, userId);
    return { status: "completed", call_result: callResult };
  }
  
  private static async handleDataSync(userId: string, callResult: any): Promise<any> {
    // This would populate assessments with AI-extracted data
    return { status: "completed", assessments_populated: true };
  }
  
  private static async handleDashboardSetup(userId: string): Promise<any> {
    // This would calculate initial risk scores and load benchmarks
    return { status: "completed", dashboard_ready: true };
  }
} 