// AI Agent Training - Complete Implementation

export class AIAgentTraining {
  
  // Core conversation flows for different scenarios
  static readonly CONVERSATION_FLOWS = {
    
    // Initial onboarding conversation
    ONBOARDING: {
      system_prompt: `You are a HIPAA compliance expert helping a new user set up their compliance platform. 
      Your goal is to gather key information about their business to auto-populate their assessments.
      Be conversational, friendly, and efficient. Ask one question at a time and extract specific data points.
      
      Key information to gather:
      - Business type and industry
      - Employee count and structure  
      - Current technology systems
      - Data handling practices
      - Existing security measures
      - Compliance requirements
      - Priority concerns
      
      Keep the conversation to 5-10 minutes maximum.`,
      
      conversation_states: {
        greeting: {
          prompts: [
            "Hi! I'm your AI compliance assistant. I'll help you set up your personalized assessments by asking a few questions about your business. This should take about 5-10 minutes. Ready to get started?",
            "Great! Let's begin with the basics..."
          ],
          expected_responses: ["yes", "ready", "sure", "let's go"],
          data_extraction: [],
          next_state: "business_basics"
        },
        
        business_basics: {
          prompts: [
            "First, what type of business do you run? For example, are you a medical practice, law firm, consulting company, etc.?",
            "How many people work for your company, including full-time, part-time, and contractors?",
            "Do you handle any sensitive information like medical records, financial data, or personal customer information?"
          ],
          expected_responses: ["medical", "healthcare", "legal", "consulting", "retail", "manufacturing"],
          data_extraction: ["business_type", "industry", "employee_count", "sensitive_data_types"],
          next_state: "technology_systems"
        },
        
        technology_systems: {
          prompts: [
            "What software or systems do you use to manage your business? For example, any practice management software, CRM systems, or cloud storage?",
            "How do your employees typically access company information? Do they use company computers, personal devices, or a mix of both?",
            "Are you using any cloud services like Google Workspace, Microsoft 365, or Dropbox?"
          ],
          data_extraction: ["software_systems", "access_methods", "cloud_services", "device_types"],
          next_state: "security_current_state"
        },
        
        security_current_state: {
          prompts: [
            "Do you currently have any security policies or procedures in place?",
            "Has anyone in your organization been designated to handle security and compliance matters?",
            "Have you ever had a security assessment or audit done before?"
          ],
          data_extraction: ["existing_policies", "security_officer", "previous_assessments"],
          next_state: "compliance_requirements"
        },
        
        compliance_requirements: {
          prompts: [
            "Are there specific regulations you know you need to comply with? For example, HIPAA for healthcare, SOX for financial reporting, or state privacy laws?",
            "Have you ever received any compliance-related inquiries or audits from regulators?",
            "Do you work with any clients or partners who have specific security requirements?"
          ],
          data_extraction: ["regulatory_requirements", "audit_history", "client_security_requirements"],
          next_state: "priorities_and_concerns"
        },
        
        priorities_and_concerns: {
          prompts: [
            "What are your biggest concerns when it comes to data security and compliance?",
            "Are there any specific incidents or close calls that have made you more aware of security risks?",
            "What would you say is your top priority: preventing data breaches, meeting regulatory requirements, or improving operational efficiency?"
          ],
          data_extraction: ["primary_concerns", "security_incidents", "priority_focus"],
          next_state: "timeline_and_preferences"
        },
        
        timeline_and_preferences: {
          prompts: [
            "How often would you like to review and update your compliance status? We typically recommend quarterly check-ins.",
            "Are there any major changes or projects planned for your business that might affect your security needs?",
            "Would you prefer to handle compliance tasks gradually over time, or tackle everything at once?"
          ],
          data_extraction: ["review_frequency", "planned_changes", "implementation_approach"],
          next_state: "conclusion"
        },
        
        conclusion: {
          prompts: [
            "Perfect! I have all the information I need to customize your assessments.",
            "Based on what you've told me, I'll set up your HIPAA assessment and recommend some additional modules that would be valuable for your business.",
            "You'll see your personalized dashboard in just a moment. Thanks for taking the time to get this set up properly!"
          ],
          data_extraction: [],
          next_state: "complete"
        }
      }
    },
    
    // Ongoing support conversation
    ONGOING_SUPPORT: {
      system_prompt: `You are an ongoing compliance assistant helping users with their assessments and compliance questions.
      You have access to their company profile, current assessment status, and risk scores.
      Provide specific, actionable advice based on their current situation.
      
      Context available:
      - Company profile and industry
      - Current assessment completion status
      - Risk scores and identified issues
      - Previous conversations and actions taken
      
      Be helpful, specific, and focused on improving their compliance posture.`,
      
      conversation_types: {
        assessment_help: {
          trigger_phrases: ["help with assessment", "don't understand question", "what does this mean"],
          response_pattern: `Based on your question about [SPECIFIC_QUESTION], here's what this means for your [INDUSTRY] business:
          
          [EXPLANATION]
          
          For your situation, I'd recommend: [SPECIFIC_RECOMMENDATION]
          
          Would you like me to help you answer this question based on what I know about your systems?`
        },
        
        risk_explanation: {
          trigger_phrases: ["why is my score low", "what's wrong", "how to improve"],
          response_pattern: `Looking at your current risk score of [SCORE], the main areas for improvement are:
          
          1. [TOP_RISK_AREA] - [SPECIFIC_ISSUE]
          2. [SECOND_RISK_AREA] - [SPECIFIC_ISSUE]
          
          Your biggest quick win would be: [QUICK_WIN_RECOMMENDATION]
          
          Would you like me to walk you through addressing any of these issues?`
        },
        
        compliance_guidance: {
          trigger_phrases: ["what do I need to do", "compliance requirements", "regulations"],
          response_pattern: `For your [INDUSTRY] business with [EMPLOYEE_COUNT] employees, your main compliance requirements are:
          
          [RELEVANT_REGULATIONS]
          
          Based on your current assessment, you're [COMPLIANCE_STATUS]. 
          
          The most critical next steps are:
          1. [PRIORITY_ACTION_1]
          2. [PRIORITY_ACTION_2]
          
          Should we focus on one of these areas first?`
        }
      }
    },
    
    // Quarterly review conversation
    QUARTERLY_REVIEW: {
      system_prompt: `You are conducting a quarterly compliance review. Your goal is to:
      1. Update the user on changes since last review
      2. Identify new risks or improvements
      3. Adjust priorities based on business changes
      4. Set goals for the next quarter
      
      Be efficient but thorough. Focus on what's changed and what needs attention.`,
      
      review_stages: {
        status_update: {
          prompts: [
            "Welcome back for your quarterly compliance review! Let's start by checking what's happened since our last review.",
            "I can see you've made progress on [COMPLETED_ACTIONS]. How did those go?",
            "Have there been any changes to your business, systems, or staff since we last spoke?"
          ],
          data_extraction: ["business_changes", "system_updates", "staff_changes", "completed_actions_feedback"]
        },
        
        risk_reassessment: {
          prompts: [
            "Based on the changes you've mentioned, let me ask a few quick questions to update your risk profile.",
            "Are you still using the same systems we discussed? Any new software or services added?",
            "Any security incidents or close calls since our last review?"
          ],
          data_extraction: ["new_systems", "security_incidents", "process_changes"]
        },
        
        priority_setting: {
          prompts: [
            "Looking at your updated risk profile, here are the areas I'd recommend focusing on this quarter:",
            "What feels most manageable for you to tackle in the next 3 months?",
            "Would you prefer to focus on one major improvement or several smaller fixes?"
          ],
          data_extraction: ["quarterly_priorities", "capacity_assessment", "preference_approach"]
        }
      }
    }
  };
  
  // Context-aware response patterns
  static readonly CONTEXT_PATTERNS = {
    
    // Industry-specific responses
    industry_context: {
      healthcare: {
        common_concerns: ["PHI protection", "HIPAA compliance", "patient data access"],
        typical_systems: ["EHR", "practice management", "patient portal"],
        key_risks: ["data breach", "unauthorized access", "audit failure"],
        regulatory_focus: "HIPAA Security Rule compliance is your top priority",
        quick_wins: ["designate Security Officer", "encrypt all devices", "implement access controls"]
      },
      
      legal: {
        common_concerns: ["client confidentiality", "attorney-client privilege", "data retention"],
        typical_systems: ["case management", "document management", "billing systems"],
        key_risks: ["confidentiality breach", "privilege waiver", "regulatory sanctions"],
        regulatory_focus: "State bar requirements and client confidentiality rules",
        quick_wins: ["secure client communications", "implement retention policies", "train staff on confidentiality"]
      },
      
      financial_services: {
        common_concerns: ["customer financial data", "fraud prevention", "regulatory compliance"],
        typical_systems: ["trading platforms", "customer databases", "reporting systems"],
        key_risks: ["data breach", "fraud", "regulatory violations"],
        regulatory_focus: "SEC, FINRA, and state financial regulations",
        quick_wins: ["implement fraud monitoring", "encrypt sensitive data", "establish incident response"]
      }
    },
    
    // Company size-based responses
    size_context: {
      small_business: {
        capacity_considerations: "I know resources are limited, so let's focus on the highest-impact, lowest-effort improvements first.",
        recommended_approach: "gradual implementation over 3-6 months",
        typical_challenges: ["limited IT resources", "budget constraints", "competing priorities"],
        quick_wins_focus: true
      },
      
      medium_business: {
        capacity_considerations: "With your team size, you can probably tackle multiple improvements simultaneously.",
        recommended_approach: "structured 90-day improvement cycles",
        typical_challenges: ["coordination across departments", "policy enforcement", "system integration"],
        quick_wins_focus: false
      }
    },
    
    // Risk level-based responses
    risk_context: {
      critical_risk: {
        urgency: "immediate",
        tone: "serious but supportive",
        response_pattern: "Your current risk level requires immediate attention. Let's prioritize the most critical issues first.",
        follow_up_frequency: "weekly check-ins recommended"
      },
      
      high_risk: {
        urgency: "within 30 days",
        tone: "concerned but encouraging",
        response_pattern: "There are some important gaps we need to address soon. The good news is they're very manageable.",
        follow_up_frequency: "bi-weekly check-ins"
      },
      
      medium_risk: {
        urgency: "within 90 days",
        tone: "positive and strategic",
        response_pattern: "You're in a good position overall. Let's focus on continuous improvement and prevention.",
        follow_up_frequency: "monthly check-ins"
      },
      
      low_risk: {
        urgency: "ongoing maintenance",
        tone: "congratulatory and forward-looking",
        response_pattern: "Excellent work! Your compliance posture is strong. Let's focus on staying current and planning ahead.",
        follow_up_frequency: "quarterly reviews"
      }
    }
  };
  
  // Data extraction patterns for different conversation types
  static readonly DATA_EXTRACTION_PATTERNS = {
    
    business_profile_extraction: {
      business_type: {
        patterns: ["we are a", "we're a", "I run a", "it's a", "we do"],
        expected_values: ["medical practice", "law firm", "consulting", "retail", "manufacturing", "restaurant"],
        extraction_function: (text: string) => {
          const businessTypes = {
            "medical|healthcare|clinic|doctor|physician": "healthcare",
            "law|legal|attorney|lawyer": "legal_services", 
            "consulting|consultant|advisory": "professional_services",
            "retail|store|shop|restaurant": "retail",
            "manufacturing|factory|production": "manufacturing"
          };
          
          for (const [pattern, type] of Object.entries(businessTypes)) {
            if (new RegExp(pattern, 'i').test(text)) {
              return type;
            }
          }
          return "other";
        }
      },
      
      employee_count: {
        patterns: ["we have", "about", "around", "roughly", "approximately"],
        extraction_function: (text: string) => {
          const numbers = text.match(/\d+/g);
          if (numbers) {
            return parseInt(numbers[0]);
          }
          
          const wordNumbers = {
            "few": 3, "several": 5, "handful": 5, "dozen": 12,
            "twenty": 20, "thirty": 30, "forty": 40, "fifty": 50
          };
          
          for (const [word, num] of Object.entries(wordNumbers)) {
            if (text.toLowerCase().includes(word)) {
              return num;
            }
          }
          return null;
        }
      },
      
      technology_systems: {
        patterns: ["we use", "we have", "we're using", "our system"],
        common_systems: {
          "epic|cerner|allscripts": "EHR",
          "salesforce|hubspot": "CRM",
          "quickbooks|sage": "Accounting",
          "office 365|google workspace": "Productivity Suite",
          "dropbox|box|onedrive": "Cloud Storage"
        },
        extraction_function: (text: string) => {
          const systems = [];
          const commonSystems = {
            "epic|cerner|allscripts": "EHR",
            "salesforce|hubspot": "CRM",
            "quickbooks|sage": "Accounting",
            "office 365|google workspace": "Productivity Suite",
            "dropbox|box|onedrive": "Cloud Storage"
          };
          
          for (const [pattern, systemType] of Object.entries(commonSystems)) {
            if (new RegExp(pattern, 'i').test(text)) {
              systems.push(systemType);
            }
          }
          return systems;
        }
      }
    },
    
    sentiment_analysis: {
      confidence_indicators: {
        high_confidence: ["yes", "definitely", "absolutely", "for sure", "certainly"],
        medium_confidence: ["probably", "likely", "I think so", "pretty sure"],
        low_confidence: ["maybe", "not sure", "I don't know", "possibly"],
        negative: ["no", "not really", "don't think so", "unlikely"]
      },
      
      urgency_indicators: {
        high_urgency: ["immediately", "right away", "as soon as possible", "urgent", "critical"],
        medium_urgency: ["soon", "within a month", "fairly quickly", "reasonably soon"],
        low_urgency: ["eventually", "when we get time", "not a priority", "down the road"]
      },
      
      concern_level: {
        high_concern: ["worried", "concerned", "scared", "anxious", "afraid"],
        medium_concern: ["unsure", "uncertain", "cautious", "careful"],
        low_concern: ["confident", "comfortable", "not worried", "fine"]
      }
    }
  };
  
  // Response generation engine
  static generateContextualResponse(userInput: string, context: ConversationContext): AIResponse {
    const extractedData = this.extractDataFromInput(userInput, context);
    const responseContext = this.buildResponseContext(context, extractedData);
    const responsePattern = this.selectResponsePattern(responseContext);
    
    return {
      message: this.buildResponse(responsePattern, responseContext),
      extracted_data: extractedData,
      confidence_score: this.calculateConfidence(extractedData),
      next_questions: this.generateFollowUpQuestions(responseContext),
      suggested_actions: this.generateSuggestedActions(responseContext)
    };
  }
  
  private static extractDataFromInput(input: string, context: ConversationContext): ExtractedData {
    const data: ExtractedData = {};
    
    // Apply relevant extraction patterns based on conversation state
    const currentPatterns = this.DATA_EXTRACTION_PATTERNS[context.conversation_type];
    
    if (currentPatterns) {
      Object.entries(currentPatterns).forEach(([key, pattern]) => {
        if (pattern.extraction_function) {
          const extracted = pattern.extraction_function(input);
          if (extracted) {
            data[key] = extracted;
          }
        }
      });
    }
    
    return data;
  }
  
  private static buildResponseContext(context: ConversationContext, extractedData: ExtractedData): ResponseContext {
    return {
      company_profile: context.company_profile,
      conversation_history: context.conversation_history,
      current_assessment_status: context.current_assessment_status,
      extracted_data: extractedData,
      industry_context: this.CONTEXT_PATTERNS.industry_context[context.company_profile?.industry],
      size_context: this.getSizeContext(context.company_profile?.employee_count),
      risk_context: this.CONTEXT_PATTERNS.risk_context[context.current_risk_level]
    };
  }
  
  private static selectResponsePattern(context: ResponseContext): ResponsePattern {
    // Select appropriate response pattern based on context
    if (context.risk_context?.urgency === 'immediate') {
      return this.CONTEXT_PATTERNS.risk_context.critical_risk;
    }
    
    if (context.conversation_history?.length === 0) {
      return this.CONVERSATION_FLOWS.ONBOARDING.conversation_states.greeting;
    }
    
    // Default to contextual support pattern
    return this.CONVERSATION_FLOWS.ONGOING_SUPPORT.conversation_types.assessment_help;
  }
  
  private static buildResponse(pattern: any, context: ResponseContext): string {
    let response = pattern.response_pattern || pattern.prompts[0];
    
    // Replace template variables with context data
    const replacements = {
      '[INDUSTRY]': context.company_profile?.industry || 'your industry',
      '[EMPLOYEE_COUNT]': context.company_profile?.employee_count?.toString() || 'your team size',
      '[SCORE]': context.current_assessment_status?.overall_score?.toString() || 'current',
      '[COMPLIANCE_STATUS]': this.getComplianceStatusText(context.current_assessment_status?.risk_level),
      '[QUICK_WIN_RECOMMENDATION]': this.getQuickWinRecommendation(context)
    };
    
    Object.entries(replacements).forEach(([placeholder, value]) => {
      response = response.replace(new RegExp(placeholder, 'g'), value);
    });
    
    return response;
  }
  
  private static getQuickWinRecommendation(context: ResponseContext): string {
    const industryContext = context.industry_context;
    if (industryContext?.quick_wins?.length > 0) {
      return industryContext.quick_wins[0];
    }
    return "implementing basic access controls";
  }
  
  private static getSizeContext(employeeCount: number): any {
    if (employeeCount <= 25) {
      return this.CONTEXT_PATTERNS.size_context.small_business;
    }
    return this.CONTEXT_PATTERNS.size_context.medium_business;
  }
  
  private static calculateConfidence(extractedData: ExtractedData): number {
    // Calculate confidence based on data quality and completeness
    const dataPoints = Object.keys(extractedData).length;
    const qualityScore = dataPoints * 10; // Simple scoring
    return Math.min(100, Math.max(0, qualityScore));
  }
  
  private static generateFollowUpQuestions(context: ResponseContext): string[] {
    // Generate contextual follow-up questions based on conversation state
    const questions = [];
    
    if (!context.company_profile?.industry) {
      questions.push("What industry are you in?");
    }
    
    if (!context.company_profile?.employee_count) {
      questions.push("How many employees do you have?");
    }
    
    return questions.slice(0, 3); // Limit to 3 questions
  }
  
  private static generateSuggestedActions(context: ResponseContext): string[] {
    // Generate suggested actions based on context
    const actions = [];
    
    if (context.risk_context?.urgency === 'immediate') {
      actions.push("Schedule immediate security review");
      actions.push("Implement critical security controls");
    }
    
    return actions;
  }
  
  private static getComplianceStatusText(riskLevel: string): string {
    const statusMap = {
      'Low Risk': 'Compliant',
      'Medium Risk': 'Mostly Compliant',
      'High Risk': 'Needs Improvement',
      'Critical Risk': 'Non-Compliant'
    };
    return statusMap[riskLevel] || 'Unknown';
  }
}

// TypeScript Interfaces
export interface ConversationContext {
  company_profile?: {
    industry: string;
    employee_count: number;
    business_type: string;
  };
  conversation_history: any[];
  current_assessment_status?: {
    overall_score: number;
    risk_level: string;
    completion_percentage: number;
  };
  conversation_type: string;
  current_risk_level: string;
}

export interface ExtractedData {
  [key: string]: any;
}

export interface ResponseContext {
  company_profile?: any;
  conversation_history: any[];
  current_assessment_status?: any;
  extracted_data: ExtractedData;
  industry_context?: any;
  size_context?: any;
  risk_context?: any;
}

export interface ResponsePattern {
  response_pattern?: string;
  prompts?: string[];
  urgency?: string;
  tone?: string;
  follow_up_frequency?: string;
}

export interface AIResponse {
  message: string;
  extracted_data: ExtractedData;
  confidence_score: number;
  next_questions: string[];
  suggested_actions: string[];
} 