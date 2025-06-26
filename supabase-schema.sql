-- PROP.ai Database Schema for Supabase
-- Complete schema for compliance, risk management, and AI-powered business intelligence platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================================
-- AUTHENTICATION & USER MANAGEMENT
-- ========================================

-- Companies table (organizations using the platform)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    employee_count INTEGER NOT NULL,
    business_type VARCHAR(100),
    phone_number VARCHAR(20),
    website VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    subscription_tier VARCHAR(50) DEFAULT 'starter',
    subscription_status VARCHAR(50) DEFAULT 'active',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    onboarding_completed_at TIMESTAMP WITH TIME ZONE,
    ai_assistant_enabled BOOLEAN DEFAULT TRUE
);

-- Company profiles with detailed business intelligence
CREATE TABLE company_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    technology_systems JSONB, -- Array of systems used
    data_handling_practices JSONB, -- Data storage, transmission, retention
    current_security_measures JSONB, -- Existing security policies and procedures
    compliance_obligations TEXT[], -- Array of applicable regulations
    risk_priorities TEXT[], -- Primary concerns and focus areas
    timeline_preferences JSONB, -- Review frequency, implementation approach
    extracted_concerns TEXT[], -- Concerns identified during onboarding
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'user', -- admin, user, viewer
    permissions JSONB DEFAULT '{}',
    phone_number VARCHAR(20),
    job_title VARCHAR(100),
    department VARCHAR(100),
    is_primary_contact BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    preferences JSONB DEFAULT '{}'
);

-- ========================================
-- ASSESSMENT MODULES & QUESTIONS
-- ========================================

-- Assessment modules (HIPAA, Cybersecurity, Quarterly Review, etc.)
CREATE TABLE assessment_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- administrative, physical, technical, operational, strategic
    complexity_level VARCHAR(20) DEFAULT 'basic', -- basic, intermediate, advanced
    estimated_duration INTEGER, -- minutes
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment questions
CREATE TABLE assessment_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES assessment_modules(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL, -- yes_no, multiple_choice, text, numeric, checkbox
    options JSONB, -- Array of options for multiple choice/checkbox
    weight INTEGER DEFAULT 1, -- 1-5 importance multiplier
    risk_mapping JSONB NOT NULL, -- Risk scores and reasoning for each answer
    help_text TEXT,
    regulatory_reference VARCHAR(255),
    complexity_level VARCHAR(20) DEFAULT 'basic',
    sort_order INTEGER DEFAULT 0,
    is_required BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- ASSESSMENT RESPONSES & RESULTS
-- ========================================

-- Assessment instances (when a company takes an assessment)
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    module_id UUID REFERENCES assessment_modules(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'in_progress', -- in_progress, completed, abandoned
    completion_percentage INTEGER DEFAULT 0,
    overall_score INTEGER, -- 0-100
    risk_level VARCHAR(50), -- Low Risk, Medium Risk, High Risk, Critical Risk
    section_scores JSONB, -- Scores for each section
    critical_issues TEXT[], -- Array of critical issues identified
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    due_date TIMESTAMP WITH TIME ZONE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version VARCHAR(20) DEFAULT '1.0',
    metadata JSONB DEFAULT '{}'
);

-- Individual question responses
CREATE TABLE assessment_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    question_id UUID REFERENCES assessment_questions(id) ON DELETE CASCADE,
    answer TEXT NOT NULL, -- JSON for checkbox, string for others
    risk_score INTEGER, -- Calculated risk score for this response
    reasoning TEXT, -- AI-generated reasoning
    action_required TEXT, -- Required action if high risk
    ai_generated BOOLEAN DEFAULT FALSE,
    ai_confidence DECIMAL(3,2), -- 0.00-1.00 confidence score
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment history (for tracking changes over time)
CREATE TABLE assessment_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL, -- started, completed, updated, abandoned
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    changes JSONB, -- What changed
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- AI CONVERSATIONS & ASSISTANT
-- ========================================

-- AI conversation sessions
CREATE TABLE ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    conversation_type VARCHAR(50) NOT NULL, -- onboarding, support, quarterly_review
    status VARCHAR(50) DEFAULT 'active', -- active, completed, abandoned
    context JSONB, -- Conversation context and extracted data
    extracted_data JSONB, -- Structured data extracted from conversation
    confidence_score INTEGER, -- Overall confidence in extracted data
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    metadata JSONB DEFAULT '{}'
);

-- Individual conversation messages
CREATE TABLE conversation_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL, -- user, assistant, system
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text', -- text, audio, file
    metadata JSONB, -- Additional message data
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ai_confidence DECIMAL(3,2), -- For AI-generated messages
    extracted_entities JSONB -- Named entities extracted from message
);

-- AI phone call records (for onboarding calls)
CREATE TABLE ai_phone_calls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
    phone_number VARCHAR(20) NOT NULL,
    call_status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, in_progress, completed, failed
    twilio_call_sid VARCHAR(100), -- Twilio call identifier
    duration_seconds INTEGER,
    recording_url VARCHAR(500),
    transcript TEXT,
    transcript_processed BOOLEAN DEFAULT FALSE,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'
);

-- ========================================
-- ACTION ITEMS & TASK MANAGEMENT
-- ========================================

-- Action items generated from assessments
CREATE TABLE action_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    assessment_id UUID REFERENCES assessments(id) ON DELETE SET NULL,
    question_id UUID REFERENCES assessment_questions(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(20) NOT NULL, -- critical, high, medium, low
    category VARCHAR(50), -- administrative, physical, technical, operational
    status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed, cancelled
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    estimated_effort INTEGER, -- minutes
    actual_effort INTEGER, -- minutes
    completion_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Upcoming tasks and reminders
CREATE TABLE upcoming_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    task_type VARCHAR(50) NOT NULL, -- quarterly_review, assessment_completion, action_item
    priority VARCHAR(20) DEFAULT 'medium',
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    estimated_duration INTEGER, -- minutes
    related_assessment_id UUID REFERENCES assessments(id) ON DELETE SET NULL,
    related_action_item_id UUID REFERENCES action_items(id) ON DELETE SET NULL,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern JSONB, -- For recurring tasks
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- BENCHMARKING & ANALYTICS
-- ========================================

-- Industry benchmarks
CREATE TABLE industry_benchmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    industry VARCHAR(100) NOT NULL,
    company_size_category VARCHAR(50) NOT NULL, -- 1-10, 11-25, 26-50, etc.
    module_id UUID REFERENCES assessment_modules(id) ON DELETE CASCADE,
    average_score DECIMAL(5,2),
    percentile_25 DECIMAL(5,2),
    percentile_50 DECIMAL(5,2),
    percentile_75 DECIMAL(5,2),
    percentile_90 DECIMAL(5,2),
    sample_size INTEGER,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(industry, company_size_category, module_id)
);

-- Company performance tracking
CREATE TABLE company_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    module_id UUID REFERENCES assessment_modules(id) ON DELETE CASCADE,
    overall_score INTEGER,
    industry_percentile INTEGER,
    peer_comparison VARCHAR(20), -- above, below, average
    improvement_potential INTEGER,
    benchmark_data JSONB,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- NOTIFICATIONS & COMMUNICATIONS
-- ========================================

-- System notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- assessment_due, action_item, quarterly_review, system
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium',
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(500), -- URL to relevant page
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- Email communications log
CREATE TABLE email_communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    email_type VARCHAR(50) NOT NULL, -- welcome, assessment_reminder, quarterly_review
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT,
    status VARCHAR(50) DEFAULT 'sent', -- sent, delivered, opened, failed
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    opened_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'
);

-- ========================================
-- SYSTEM CONFIGURATION
-- ========================================

-- Platform settings and configuration
CREATE TABLE system_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feature flags
CREATE TABLE feature_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feature_name VARCHAR(100) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT FALSE,
    enabled_for_companies UUID[], -- Specific companies that have access
    enabled_for_tiers TEXT[], -- Subscription tiers that have access
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- AUDIT LOGS
-- ========================================

-- Audit trail for compliance and security
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50), -- assessment, user, company, etc.
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Performance indexes
CREATE INDEX idx_companies_industry ON companies(industry);
CREATE INDEX idx_companies_subscription_status ON companies(subscription_status);
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_assessments_company_id ON assessments(company_id);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_assessments_completed_at ON assessments(completed_at);
CREATE INDEX idx_assessment_responses_assessment_id ON assessment_responses(assessment_id);
CREATE INDEX idx_action_items_company_id ON action_items(company_id);
CREATE INDEX idx_action_items_status ON action_items(status);
CREATE INDEX idx_action_items_due_date ON action_items(due_date);
CREATE INDEX idx_ai_conversations_company_id ON ai_conversations(company_id);
CREATE INDEX idx_conversation_messages_conversation_id ON conversation_messages(conversation_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_audit_logs_company_id ON audit_logs(company_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);

-- ========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Company policies (users can only access their own company data)
CREATE POLICY "Users can view own company" ON companies
    FOR SELECT USING (id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
    ));

CREATE POLICY "Users can update own company" ON companies
    FOR UPDATE USING (id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
    ));

-- Assessment policies
CREATE POLICY "Users can view company assessments" ON assessments
    FOR SELECT USING (company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
    ));

CREATE POLICY "Users can create assessments" ON assessments
    FOR INSERT WITH CHECK (company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
    ));

-- Action items policies
CREATE POLICY "Users can view company action items" ON action_items
    FOR SELECT USING (company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
    ));

-- AI conversations policies
CREATE POLICY "Users can view company conversations" ON ai_conversations
    FOR SELECT USING (company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
    ));

-- ========================================
-- TRIGGERS FOR AUTOMATION
-- ========================================

-- Update timestamps automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_action_items_updated_at BEFORE UPDATE ON action_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- SAMPLE DATA INSERTION
-- ========================================

-- Insert default assessment modules
INSERT INTO assessment_modules (name, display_name, description, category, complexity_level, estimated_duration) VALUES
('hipaa', 'HIPAA Risk Assessment', 'Comprehensive HIPAA Security Rule compliance assessment', 'administrative', 'intermediate', 45),
('cybersecurity', 'Cybersecurity Assessment', 'NIST Cybersecurity Framework assessment', 'technical', 'intermediate', 60),
('quarterly_review', 'Quarterly Business Review', 'Strategic planning and performance analysis', 'strategic', 'basic', 30);

-- Insert system configuration
INSERT INTO system_config (key, value, description, is_public) VALUES
('onboarding_flow', '{"steps": ["email_signup", "company_profile", "module_selection", "ai_phone_call", "data_sync", "dashboard_setup"]}', 'Onboarding flow configuration', true),
('ai_assistant_settings', '{"enabled": true, "response_timeout": 30, "max_conversation_length": 50}', 'AI assistant configuration', true),
('assessment_settings', '{"auto_save_interval": 30, "completion_threshold": 80, "retake_limit": 3}', 'Assessment configuration', true);

-- Insert feature flags
INSERT INTO feature_flags (feature_name, is_enabled, enabled_for_tiers) VALUES
('ai_phone_calls', true, ARRAY['premium', 'enterprise']),
('advanced_analytics', true, ARRAY['premium', 'enterprise']),
('custom_assessments', false, ARRAY['enterprise']),
('api_access', false, ARRAY['enterprise']); 