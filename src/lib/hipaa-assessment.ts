// HIPAA Risk Assessment - Complete Implementation

export interface HIPAAQuestion {
  id: string;
  section: 'administrative' | 'physical' | 'technical';
  complexity_level: 'basic' | 'intermediate' | 'advanced';
  question: string;
  question_type: 'multiple_choice' | 'yes_no' | 'text' | 'numeric' | 'checkbox';
  options?: string[];
  weight: number; // 1-5 (importance multiplier)
  risk_mapping: {
    [answer: string]: {
      risk_score: number; // 0-100
      reasoning: string;
      action_required?: string;
    };
  };
  help_text?: string;
  regulatory_reference: string;
}

export const HIPAAAssessmentContent: HIPAAQuestion[] = [
  // ADMINISTRATIVE SAFEGUARDS SECTION
  {
    id: "admin_001",
    section: "administrative",
    complexity_level: "basic",
    question: "Does your organization have a designated HIPAA Security Officer?",
    question_type: "yes_no",
    weight: 5,
    risk_mapping: {
      "yes": {
        risk_score: 20,
        reasoning: "Having a designated Security Officer is required and significantly reduces risk"
      },
      "no": {
        risk_score: 95,
        reasoning: "No Security Officer creates major compliance gap and high audit risk",
        action_required: "Immediately designate a HIPAA Security Officer"
      }
    },
    help_text: "The Security Officer is responsible for developing and implementing security policies and procedures",
    regulatory_reference: "45 CFR 164.308(a)(2)"
  },
  
  {
    id: "admin_002",
    section: "administrative",
    complexity_level: "basic",
    question: "How often does your organization conduct HIPAA security training?",
    question_type: "multiple_choice",
    options: ["Never", "Once upon hiring", "Annually", "Semi-annually", "Quarterly"],
    weight: 4,
    risk_mapping: {
      "Never": {
        risk_score: 100,
        reasoning: "No security training creates maximum risk and compliance violation",
        action_required: "Implement immediate security training program"
      },
      "Once upon hiring": {
        risk_score: 70,
        reasoning: "Initial training only is insufficient for ongoing compliance",
        action_required: "Establish annual refresher training"
      },
      "Annually": {
        risk_score: 30,
        reasoning: "Annual training meets minimum requirements but could be improved"
      },
      "Semi-annually": {
        risk_score: 15,
        reasoning: "Semi-annual training demonstrates strong commitment to compliance"
      },
      "Quarterly": {
        risk_score: 5,
        reasoning: "Quarterly training exceeds requirements and minimizes risk"
      }
    },
    regulatory_reference: "45 CFR 164.308(a)(5)"
  },

  {
    id: "admin_003",
    section: "administrative",
    complexity_level: "intermediate",
    question: "Which access control procedures does your organization have in place?",
    question_type: "checkbox",
    options: [
      "Written access authorization procedures",
      "Role-based access controls",
      "Automatic logoff procedures",
      "Regular access reviews and updates",
      "Emergency access procedures",
      "User access monitoring and logging"
    ],
    weight: 4,
    risk_mapping: {
      "0-1": {
        risk_score: 90,
        reasoning: "Minimal access controls create high security risk",
        action_required: "Implement comprehensive access control procedures"
      },
      "2-3": {
        risk_score: 60,
        reasoning: "Basic access controls present but significant gaps remain",
        action_required: "Expand access control procedures"
      },
      "4-5": {
        risk_score: 25,
        reasoning: "Good access controls with minor areas for improvement"
      },
      "6": {
        risk_score: 10,
        reasoning: "Comprehensive access controls demonstrate strong security posture"
      }
    },
    regulatory_reference: "45 CFR 164.308(a)(4)"
  },

  {
    id: "admin_004",
    section: "administrative",
    complexity_level: "advanced",
    question: "Describe your incident response procedure for potential PHI breaches",
    question_type: "text",
    weight: 5,
    risk_mapping: {
      "detailed_procedure": {
        risk_score: 15,
        reasoning: "Comprehensive incident response plan reduces breach impact"
      },
      "basic_procedure": {
        risk_score: 40,
        reasoning: "Basic procedures present but may lack detail for effective response"
      },
      "no_procedure": {
        risk_score: 85,
        reasoning: "No incident response plan creates high risk and compliance violation",
        action_required: "Develop comprehensive incident response procedures"
      }
    },
    help_text: "Include detection, containment, assessment, notification, and remediation steps",
    regulatory_reference: "45 CFR 164.308(a)(6)"
  },

  // PHYSICAL SAFEGUARDS SECTION
  {
    id: "phys_001",
    section: "physical",
    complexity_level: "basic",
    question: "How do you control physical access to facilities containing PHI?",
    question_type: "multiple_choice",
    options: [
      "No specific controls",
      "Locked doors only",
      "Key card access with logging",
      "Biometric access controls",
      "Multi-factor physical authentication"
    ],
    weight: 4,
    risk_mapping: {
      "No specific controls": {
        risk_score: 95,
        reasoning: "No physical access controls create severe security vulnerability",
        action_required: "Implement immediate physical access controls"
      },
      "Locked doors only": {
        risk_score: 70,
        reasoning: "Basic physical security insufficient for PHI protection",
        action_required: "Upgrade to access control system with logging"
      },
      "Key card access with logging": {
        risk_score: 30,
        reasoning: "Good physical access controls with audit trail"
      },
      "Biometric access controls": {
        risk_score: 15,
        reasoning: "Strong physical security measures"
      },
      "Multi-factor physical authentication": {
        risk_score: 5,
        reasoning: "Excellent physical security exceeding requirements"
      }
    },
    regulatory_reference: "45 CFR 164.310(a)(1)"
  },

  {
    id: "phys_002",
    section: "physical",
    complexity_level: "basic",
    question: "Are workstations positioned to prevent unauthorized viewing of PHI?",
    question_type: "yes_no",
    weight: 3,
    risk_mapping: {
      "yes": {
        risk_score: 20,
        reasoning: "Proper workstation positioning reduces unauthorized PHI viewing risk"
      },
      "no": {
        risk_score: 75,
        reasoning: "Poor workstation positioning creates privacy risk",
        action_required: "Reposition workstations or install privacy screens"
      }
    },
    regulatory_reference: "45 CFR 164.310(b)"
  },

  {
    id: "phys_003",
    section: "physical",
    complexity_level: "intermediate",
    question: "What controls are in place for media containing PHI?",
    question_type: "checkbox",
    options: [
      "Media disposal/reuse procedures",
      "Secure media transport procedures",
      "Media access controls and logging",
      "Backup media encryption",
      "Media sanitization procedures",
      "Chain of custody documentation"
    ],
    weight: 4,
    risk_mapping: {
      "0-1": {
        risk_score: 85,
        reasoning: "Insufficient media controls create high data breach risk",
        action_required: "Implement comprehensive media control procedures"
      },
      "2-3": {
        risk_score: 55,
        reasoning: "Basic media controls present but gaps remain"
      },
      "4-5": {
        risk_score: 25,
        reasoning: "Good media controls with minor improvements needed"
      },
      "6": {
        risk_score: 10,
        reasoning: "Comprehensive media controls demonstrate strong security"
      }
    },
    regulatory_reference: "45 CFR 164.310(d)"
  },

  // TECHNICAL SAFEGUARDS SECTION
  {
    id: "tech_001",
    section: "technical",
    complexity_level: "basic",
    question: "Do you use unique user identification for each person accessing PHI?",
    question_type: "yes_no",
    weight: 5,
    risk_mapping: {
      "yes": {
        risk_score: 15,
        reasoning: "Unique user identification enables proper access control and auditing"
      },
      "no": {
        risk_score: 90,
        reasoning: "Shared accounts prevent accountability and audit compliance",
        action_required: "Implement unique user accounts for all PHI access"
      }
    },
    regulatory_reference: "45 CFR 164.312(a)(2)(i)"
  },

  {
    id: "tech_002",
    section: "technical",
    complexity_level: "basic",
    question: "What type of encryption do you use for PHI?",
    question_type: "multiple_choice",
    options: [
      "No encryption used",
      "Basic password protection",
      "AES-128 encryption",
      "AES-256 encryption",
      "End-to-end encryption with key management"
    ],
    weight: 5,
    risk_mapping: {
      "No encryption used": {
        risk_score: 100,
        reasoning: "No encryption creates maximum data breach risk",
        action_required: "Implement immediate PHI encryption"
      },
      "Basic password protection": {
        risk_score: 80,
        reasoning: "Password protection insufficient for PHI security",
        action_required: "Upgrade to proper encryption standards"
      },
      "AES-128 encryption": {
        risk_score: 30,
        reasoning: "Good encryption standard with room for improvement"
      },
      "AES-256 encryption": {
        risk_score: 15,
        reasoning: "Strong encryption standard meeting best practices"
      },
      "End-to-end encryption with key management": {
        risk_score: 5,
        reasoning: "Excellent encryption implementation exceeding requirements"
      }
    },
    regulatory_reference: "45 CFR 164.312(a)(2)(iv)"
  },

  {
    id: "tech_003",
    section: "technical",
    complexity_level: "intermediate",
    question: "How often do you review access logs for PHI systems?",
    question_type: "multiple_choice",
    options: ["Never", "When incidents occur", "Monthly", "Weekly", "Daily", "Real-time monitoring"],
    weight: 4,
    risk_mapping: {
      "Never": {
        risk_score: 95,
        reasoning: "No log review prevents detection of unauthorized access",
        action_required: "Implement regular access log monitoring"
      },
      "When incidents occur": {
        risk_score: 75,
        reasoning: "Reactive monitoring insufficient for proactive security"
      },
      "Monthly": {
        risk_score: 45,
        reasoning: "Monthly reviews provide basic monitoring but gaps exist"
      },
      "Weekly": {
        risk_score: 25,
        reasoning: "Weekly reviews demonstrate good security practices"
      },
      "Daily": {
        risk_score: 15,
        reasoning: "Daily monitoring shows strong commitment to security"
      },
      "Real-time monitoring": {
        risk_score: 5,
        reasoning: "Real-time monitoring provides optimal security oversight"
      }
    },
    regulatory_reference: "45 CFR 164.312(b)"
  },

  {
    id: "tech_004",
    section: "technical",
    complexity_level: "advanced",
    question: "What data integrity measures protect PHI from alteration or destruction?",
    question_type: "checkbox",
    options: [
      "Digital signatures for PHI records",
      "Version control systems",
      "Backup and recovery procedures tested regularly",
      "Checksums or hash verification",
      "Change audit trails",
      "Data loss prevention systems"
    ],
    weight: 4,
    risk_mapping: {
      "0-1": {
        risk_score: 80,
        reasoning: "Insufficient data integrity controls risk PHI corruption",
        action_required: "Implement comprehensive data integrity measures"
      },
      "2-3": {
        risk_score: 50,
        reasoning: "Basic integrity controls present but enhancement needed"
      },
      "4-5": {
        risk_score: 20,
        reasoning: "Good data integrity controls with minor gaps"
      },
      "6": {
        risk_score: 10,
        reasoning: "Comprehensive data integrity measures demonstrate excellence"
      }
    },
    regulatory_reference: "45 CFR 164.312(c)(1)"
  }
];

// Risk Scoring Algorithm
export class HIPAARiskScorer {
  
  static calculateSectionScore(responses: any[], section: string): number {
    const sectionQuestions = HIPAAAssessmentContent.filter(q => q.section === section);
    let totalWeightedScore = 0;
    let totalWeight = 0;
    
    sectionQuestions.forEach(question => {
      const response = responses.find(r => r.question_id === question.id);
      if (response) {
        const riskData = this.getRiskDataForResponse(question, response.answer);
        totalWeightedScore += (riskData.risk_score * question.weight);
        totalWeight += question.weight;
      }
    });
    
    return totalWeight > 0 ? Math.round((100 - (totalWeightedScore / totalWeight))) : 0;
  }
  
  static calculateOverallScore(responses: any[]): {
    overall_score: number;
    section_scores: {
      administrative: number;
      physical: number;
      technical: number;
    };
    risk_level: string;
    critical_issues: string[];
  } {
    const sectionScores = {
      administrative: this.calculateSectionScore(responses, 'administrative'),
      physical: this.calculateSectionScore(responses, 'physical'),
      technical: this.calculateSectionScore(responses, 'technical')
    };
    
    // Weighted overall score (Administrative 40%, Technical 35%, Physical 25%)
    const overallScore = Math.round(
      (sectionScores.administrative * 0.4) +
      (sectionScores.technical * 0.35) +
      (sectionScores.physical * 0.25)
    );
    
    const riskLevel = this.determineRiskLevel(overallScore);
    const criticalIssues = this.identifyCriticalIssues(responses);
    
    return {
      overall_score: overallScore,
      section_scores: sectionScores,
      risk_level: riskLevel,
      critical_issues: criticalIssues
    };
  }
  
  private static getRiskDataForResponse(question: HIPAAQuestion, answer: string) {
    if (question.question_type === 'checkbox') {
      const count = Array.isArray(answer) ? answer.length : 0;
      const range = `${Math.max(0, Math.min(count, Object.keys(question.risk_mapping).length - 1))}`;
      return question.risk_mapping[range] || question.risk_mapping['0'];
    }
    
    return question.risk_mapping[answer] || { risk_score: 50, reasoning: "Unknown response" };
  }
  
  private static determineRiskLevel(score: number): string {
    if (score >= 80) return 'Low Risk';
    if (score >= 60) return 'Medium Risk';
    if (score >= 40) return 'High Risk';
    return 'Critical Risk';
  }
  
  private static identifyCriticalIssues(responses: any[]): string[] {
    const issues: string[] = [];
    
    responses.forEach(response => {
      const question = HIPAAAssessmentContent.find(q => q.id === response.question_id);
      if (question) {
        const riskData = this.getRiskDataForResponse(question, response.answer);
        if (riskData.risk_score >= 85 && riskData.action_required) {
          issues.push(riskData.action_required);
        }
      }
    });
    
    return issues;
  }
}

// Sample Implementation Usage
export const sampleHIPAAResponse = {
  assessment_id: "hipaa_001",
  company_id: "comp_123",
  responses: [
    {
      question_id: "admin_001",
      answer: "yes",
      timestamp: new Date().toISOString(),
      ai_generated: false
    },
    {
      question_id: "admin_002", 
      answer: "Annually",
      timestamp: new Date().toISOString(),
      ai_generated: true,
      ai_confidence: 0.85
    },
    {
      question_id: "phys_001",
      answer: "Key card access with logging",
      timestamp: new Date().toISOString(),
      ai_generated: false
    },
    {
      question_id: "tech_001",
      answer: "yes",
      timestamp: new Date().toISOString(),
      ai_generated: false
    }
  ]
};

// Calculate sample scores
const sampleScoring = HIPAARiskScorer.calculateOverallScore(sampleHIPAAResponse.responses);
console.log("Sample HIPAA Risk Assessment Results:", sampleScoring); 