// Database Initialization Script for PROP.ai
// This script sets up initial data and configuration

import { supabase } from './supabase';

export class DatabaseInitializer {
  
  // Initialize the database with default data
  static async initializeDatabase() {
    try {
      console.log('🚀 Initializing PROP.ai database...');
      
      // Insert default assessment modules
      await this.insertDefaultModules();
      
      // Insert default HIPAA questions
      await this.insertHIPAAQuestions();
      
      // Insert system configuration
      await this.insertSystemConfig();
      
      // Insert feature flags
      await this.insertFeatureFlags();
      
      // Insert sample industry benchmarks
      await this.insertSampleBenchmarks();
      
      console.log('✅ Database initialization completed successfully!');
      
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }
  
  // Insert default assessment modules
  private static async insertDefaultModules() {
    const modules = [
      {
        name: 'hipaa',
        display_name: 'HIPAA Risk Assessment',
        description: 'Comprehensive HIPAA Security Rule compliance assessment covering Administrative, Physical, and Technical safeguards.',
        category: 'administrative',
        complexity_level: 'intermediate',
        estimated_duration: 45,
        sort_order: 1
      },
      {
        name: 'cybersecurity',
        display_name: 'Cybersecurity Assessment',
        description: 'NIST Cybersecurity Framework assessment for comprehensive security posture evaluation.',
        category: 'technical',
        complexity_level: 'intermediate',
        estimated_duration: 60,
        sort_order: 2
      },
      {
        name: 'quarterly_review',
        display_name: 'Quarterly Business Review',
        description: 'Strategic planning and performance analysis with AI-powered insights and trend analysis.',
        category: 'strategic',
        complexity_level: 'basic',
        estimated_duration: 30,
        sort_order: 3
      },
      {
        name: 'operations',
        display_name: 'Operations Assessment',
        description: 'Day-to-day operational efficiency and process optimization assessment.',
        category: 'operational',
        complexity_level: 'basic',
        estimated_duration: 30,
        sort_order: 4
      }
    ];
    
    for (const module of modules) {
      const { error } = await supabase
        .from('assessment_modules')
        .upsert(module, { onConflict: 'name' });
      
      if (error) {
        console.error(`Error inserting module ${module.name}:`, error);
      }
    }
    
    console.log('📋 Assessment modules initialized');
  }
  
  // Insert HIPAA assessment questions
  private static async insertHIPAAQuestions() {
    const hipaaModule = await this.getModuleByName('hipaa');
    if (!hipaaModule) {
      console.error('HIPAA module not found');
      return;
    }
    
    const questions = [
      {
        module_id: hipaaModule.id,
        question_text: "Does your organization have a designated HIPAA Security Officer?",
        question_type: "yes_no",
        weight: 5,
        risk_mapping: {
          "yes": {
            "risk_score": 20,
            "reasoning": "Having a designated Security Officer is required and significantly reduces risk"
          },
          "no": {
            "risk_score": 95,
            "reasoning": "No Security Officer creates major compliance gap and high audit risk",
            "action_required": "Immediately designate a HIPAA Security Officer"
          }
        },
        help_text: "The Security Officer is responsible for developing and implementing security policies and procedures",
        regulatory_reference: "45 CFR 164.308(a)(2)",
        complexity_level: "basic",
        sort_order: 1
      },
      {
        module_id: hipaaModule.id,
        question_text: "How often does your organization conduct HIPAA security training?",
        question_type: "multiple_choice",
        options: ["Never", "Once upon hiring", "Annually", "Semi-annually", "Quarterly"],
        weight: 4,
        risk_mapping: {
          "Never": {
            "risk_score": 100,
            "reasoning": "No security training creates maximum risk and compliance violation",
            "action_required": "Implement immediate security training program"
          },
          "Once upon hiring": {
            "risk_score": 70,
            "reasoning": "Initial training only is insufficient for ongoing compliance",
            "action_required": "Establish annual refresher training"
          },
          "Annually": {
            "risk_score": 30,
            "reasoning": "Annual training meets minimum requirements but could be improved"
          },
          "Semi-annually": {
            "risk_score": 15,
            "reasoning": "Semi-annual training demonstrates strong commitment to compliance"
          },
          "Quarterly": {
            "risk_score": 5,
            "reasoning": "Quarterly training exceeds requirements and minimizes risk"
          }
        },
        regulatory_reference: "45 CFR 164.308(a)(5)",
        complexity_level: "basic",
        sort_order: 2
      },
      {
        module_id: hipaaModule.id,
        question_text: "Which access control procedures does your organization have in place?",
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
            "risk_score": 90,
            "reasoning": "Minimal access controls create high security risk",
            "action_required": "Implement comprehensive access control procedures"
          },
          "2-3": {
            "risk_score": 60,
            "reasoning": "Basic access controls present but significant gaps remain",
            "action_required": "Expand access control procedures"
          },
          "4-5": {
            "risk_score": 25,
            "reasoning": "Good access controls with minor areas for improvement"
          },
          "6": {
            "risk_score": 10,
            "reasoning": "Comprehensive access controls demonstrate strong security posture"
          }
        },
        regulatory_reference: "45 CFR 164.308(a)(4)",
        complexity_level: "intermediate",
        sort_order: 3
      },
      {
        module_id: hipaaModule.id,
        question_text: "How do you control physical access to facilities containing PHI?",
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
            "risk_score": 95,
            "reasoning": "No physical access controls create severe security vulnerability",
            "action_required": "Implement immediate physical access controls"
          },
          "Locked doors only": {
            "risk_score": 70,
            "reasoning": "Basic physical security insufficient for PHI protection",
            "action_required": "Upgrade to access control system with logging"
          },
          "Key card access with logging": {
            "risk_score": 30,
            "reasoning": "Good physical access controls with audit trail"
          },
          "Biometric access controls": {
            "risk_score": 15,
            "reasoning": "Strong physical security measures"
          },
          "Multi-factor physical authentication": {
            "risk_score": 5,
            "reasoning": "Excellent physical security exceeding requirements"
          }
        },
        regulatory_reference: "45 CFR 164.310(a)(1)",
        complexity_level: "basic",
        sort_order: 4
      },
      {
        module_id: hipaaModule.id,
        question_text: "What type of encryption do you use for PHI?",
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
            "risk_score": 100,
            "reasoning": "No encryption creates maximum data breach risk",
            "action_required": "Implement immediate PHI encryption"
          },
          "Basic password protection": {
            "risk_score": 80,
            "reasoning": "Password protection insufficient for PHI security",
            "action_required": "Upgrade to proper encryption standards"
          },
          "AES-128 encryption": {
            "risk_score": 30,
            "reasoning": "Good encryption standard with room for improvement"
          },
          "AES-256 encryption": {
            "risk_score": 15,
            "reasoning": "Strong encryption standard meeting best practices"
          },
          "End-to-end encryption with key management": {
            "risk_score": 5,
            "reasoning": "Excellent encryption implementation exceeding requirements"
          }
        },
        regulatory_reference: "45 CFR 164.312(a)(2)(iv)",
        complexity_level: "basic",
        sort_order: 5
      }
    ];
    
    for (const question of questions) {
      const { error } = await supabase
        .from('assessment_questions')
        .upsert(question, { onConflict: 'module_id,question_text' });
      
      if (error) {
        console.error(`Error inserting question:`, error);
      }
    }
    
    console.log('❓ HIPAA questions initialized');
  }
  
  // Insert system configuration
  private static async insertSystemConfig() {
    const configs = [
      {
        key: 'onboarding_flow',
        value: {
          steps: [
            'email_signup',
            'company_profile', 
            'module_selection',
            'ai_phone_call',
            'data_sync',
            'dashboard_setup'
          ],
          estimated_total_time: 600 // 10 minutes
        },
        description: 'Onboarding flow configuration',
        is_public: true
      },
      {
        key: 'ai_assistant_settings',
        value: {
          enabled: true,
          response_timeout: 30,
          max_conversation_length: 50,
          supported_languages: ['en'],
          conversation_types: ['onboarding', 'support', 'quarterly_review']
        },
        description: 'AI assistant configuration',
        is_public: true
      },
      {
        key: 'assessment_settings',
        value: {
          auto_save_interval: 30,
          completion_threshold: 80,
          retake_limit: 3,
          scoring_algorithm: 'weighted_average',
          risk_levels: {
            low: { min: 80, max: 100 },
            medium: { min: 60, max: 79 },
            high: { min: 40, max: 59 },
            critical: { min: 0, max: 39 }
          }
        },
        description: 'Assessment configuration',
        is_public: true
      },
      {
        key: 'notification_settings',
        value: {
          email_enabled: true,
          in_app_enabled: true,
          reminder_frequency: 'weekly',
          critical_alerts: true,
          quarterly_review_reminders: true
        },
        description: 'Notification configuration',
        is_public: true
      }
    ];
    
    for (const config of configs) {
      const { error } = await supabase
        .from('system_config')
        .upsert(config, { onConflict: 'key' });
      
      if (error) {
        console.error(`Error inserting config ${config.key}:`, error);
      }
    }
    
    console.log('⚙️ System configuration initialized');
  }
  
  // Insert feature flags
  private static async insertFeatureFlags() {
    const flags = [
      {
        feature_name: 'ai_phone_calls',
        is_enabled: true,
        enabled_for_tiers: ['premium', 'enterprise']
      },
      {
        feature_name: 'advanced_analytics',
        is_enabled: true,
        enabled_for_tiers: ['premium', 'enterprise']
      },
      {
        feature_name: 'custom_assessments',
        is_enabled: false,
        enabled_for_tiers: ['enterprise']
      },
      {
        feature_name: 'api_access',
        is_enabled: false,
        enabled_for_tiers: ['enterprise']
      },
      {
        feature_name: 'white_label',
        is_enabled: false,
        enabled_for_tiers: ['enterprise']
      },
      {
        feature_name: 'advanced_reporting',
        is_enabled: true,
        enabled_for_tiers: ['premium', 'enterprise']
      }
    ];
    
    for (const flag of flags) {
      const { error } = await supabase
        .from('feature_flags')
        .upsert(flag, { onConflict: 'feature_name' });
      
      if (error) {
        console.error(`Error inserting flag ${flag.feature_name}:`, error);
      }
    }
    
    console.log('🚩 Feature flags initialized');
  }
  
  // Insert sample industry benchmarks
  private static async insertSampleBenchmarks() {
    const hipaaModule = await this.getModuleByName('hipaa');
    if (!hipaaModule) return;
    
    const benchmarks = [
      {
        industry: 'healthcare',
        company_size_category: '1-10',
        module_id: hipaaModule.id,
        average_score: 65.5,
        percentile_25: 45.0,
        percentile_50: 65.5,
        percentile_75: 80.0,
        percentile_90: 90.0,
        sample_size: 150
      },
      {
        industry: 'healthcare',
        company_size_category: '11-25',
        module_id: hipaaModule.id,
        average_score: 72.3,
        percentile_25: 55.0,
        percentile_50: 72.3,
        percentile_75: 85.0,
        percentile_90: 92.0,
        sample_size: 200
      },
      {
        industry: 'healthcare',
        company_size_category: '26-50',
        module_id: hipaaModule.id,
        average_score: 78.1,
        percentile_25: 65.0,
        percentile_50: 78.1,
        percentile_75: 88.0,
        percentile_90: 94.0,
        sample_size: 120
      },
      {
        industry: 'legal_services',
        company_size_category: '1-10',
        module_id: hipaaModule.id,
        average_score: 58.2,
        percentile_25: 40.0,
        percentile_50: 58.2,
        percentile_75: 75.0,
        percentile_90: 85.0,
        sample_size: 80
      },
      {
        industry: 'financial_services',
        company_size_category: '1-10',
        module_id: hipaaModule.id,
        average_score: 70.8,
        percentile_25: 55.0,
        percentile_50: 70.8,
        percentile_75: 82.0,
        percentile_90: 90.0,
        sample_size: 100
      }
    ];
    
    for (const benchmark of benchmarks) {
      const { error } = await supabase
        .from('industry_benchmarks')
        .upsert(benchmark, { 
          onConflict: 'industry,company_size_category,module_id' 
        });
      
      if (error) {
        console.error(`Error inserting benchmark:`, error);
      }
    }
    
    console.log('📊 Sample benchmarks initialized');
  }
  
  // Helper method to get module by name
  private static async getModuleByName(name: string) {
    const { data, error } = await supabase
      .from('assessment_modules')
      .select('*')
      .eq('name', name)
      .single();
    
    if (error) {
      console.error(`Error getting module ${name}:`, error);
      return null;
    }
    
    return data;
  }
  
  // Reset database (for development/testing)
  static async resetDatabase() {
    try {
      console.log('🔄 Resetting database...');
      
      // Delete all data (in reverse order of dependencies)
      const tables = [
        'audit_logs',
        'notifications',
        'email_communications',
        'conversation_messages',
        'ai_phone_calls',
        'ai_conversations',
        'upcoming_tasks',
        'action_items',
        'assessment_responses',
        'assessments',
        'assessment_questions',
        'assessment_modules',
        'company_performance',
        'industry_benchmarks',
        'company_profiles',
        'users',
        'companies'
      ];
      
      for (const table of tables) {
        const { error } = await supabase
          .from(table)
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000'); // Keep system records
        
        if (error) {
          console.error(`Error clearing table ${table}:`, error);
        }
      }
      
      console.log('✅ Database reset completed');
      
      // Re-initialize
      await this.initializeDatabase();
      
    } catch (error) {
      console.error('❌ Database reset failed:', error);
      throw error;
    }
  }
}

// Export for use in scripts
export default DatabaseInitializer; 