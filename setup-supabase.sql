-- PROP.ai Database Setup for Supabase
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================================
-- CORE TABLES
-- ========================================

-- Companies table
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

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'user',
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

-- Assessment modules
CREATE TABLE assessment_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    complexity_level VARCHAR(20) DEFAULT 'basic',
    estimated_duration INTEGER,
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
    question_type VARCHAR(50) NOT NULL,
    options JSONB,
    weight INTEGER DEFAULT 1,
    risk_mapping JSONB NOT NULL,
    help_text TEXT,
    regulatory_reference VARCHAR(255),
    complexity_level VARCHAR(20) DEFAULT 'basic',
    sort_order INTEGER DEFAULT 0,
    is_required BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessments
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    module_id UUID REFERENCES assessment_modules(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'in_progress',
    completion_percentage INTEGER DEFAULT 0,
    overall_score INTEGER,
    risk_level VARCHAR(50),
    section_scores JSONB,
    critical_issues TEXT[],
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    due_date TIMESTAMP WITH TIME ZONE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version VARCHAR(20) DEFAULT '1.0',
    metadata JSONB DEFAULT '{}'
);

-- Assessment responses
CREATE TABLE assessment_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    question_id UUID REFERENCES assessment_questions(id) ON DELETE CASCADE,
    answer TEXT NOT NULL,
    risk_score INTEGER,
    reasoning TEXT,
    action_required TEXT,
    ai_generated BOOLEAN DEFAULT FALSE,
    ai_confidence DECIMAL(3,2),
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Action items
CREATE TABLE action_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    assessment_id UUID REFERENCES assessments(id) ON DELETE SET NULL,
    question_id UUID REFERENCES assessment_questions(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(20) NOT NULL,
    category VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    estimated_effort INTEGER,
    actual_effort INTEGER,
    completion_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- AI conversations
CREATE TABLE ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    conversation_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    context JSONB,
    extracted_data JSONB,
    confidence_score INTEGER,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    metadata JSONB DEFAULT '{}'
);

-- Conversation messages
CREATE TABLE conversation_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text',
    metadata JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ai_confidence DECIMAL(3,2),
    extracted_entities JSONB
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

CREATE INDEX idx_companies_industry ON companies(industry);
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_assessments_company_id ON assessments(company_id);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_assessment_responses_assessment_id ON assessment_responses(assessment_id);
CREATE INDEX idx_action_items_company_id ON action_items(company_id);
CREATE INDEX idx_action_items_status ON action_items(status);
CREATE INDEX idx_ai_conversations_company_id ON ai_conversations(company_id);
CREATE INDEX idx_conversation_messages_conversation_id ON conversation_messages(conversation_id);

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;

-- Company policies
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
-- SAMPLE DATA
-- ========================================

-- Insert default assessment modules
INSERT INTO assessment_modules (name, display_name, description, category, complexity_level, estimated_duration, sort_order) VALUES
('hipaa', 'HIPAA Risk Assessment', 'Comprehensive HIPAA Security Rule compliance assessment', 'administrative', 'intermediate', 45, 1),
('cybersecurity', 'Cybersecurity Assessment', 'NIST Cybersecurity Framework assessment', 'technical', 'intermediate', 60, 2),
('quarterly_review', 'Quarterly Business Review', 'Strategic planning and performance analysis', 'strategic', 'basic', 30, 3);

-- Insert sample HIPAA questions
INSERT INTO assessment_questions (module_id, question_text, question_type, weight, risk_mapping, help_text, regulatory_reference, complexity_level, sort_order) 
SELECT 
    m.id,
    'Does your organization have a designated HIPAA Security Officer?',
    'yes_no',
    5,
    '{"yes": {"risk_score": 20, "reasoning": "Having a designated Security Officer is required and significantly reduces risk"}, "no": {"risk_score": 95, "reasoning": "No Security Officer creates major compliance gap and high audit risk", "action_required": "Immediately designate a HIPAA Security Officer"}}',
    'The Security Officer is responsible for developing and implementing security policies and procedures',
    '45 CFR 164.308(a)(2)',
    'basic',
    1
FROM assessment_modules m WHERE m.name = 'hipaa';

INSERT INTO assessment_questions (module_id, question_text, question_type, options, weight, risk_mapping, regulatory_reference, complexity_level, sort_order)
SELECT 
    m.id,
    'How often does your organization conduct HIPAA security training?',
    'multiple_choice',
    '["Never", "Once upon hiring", "Annually", "Semi-annually", "Quarterly"]',
    4,
    '{"Never": {"risk_score": 100, "reasoning": "No security training creates maximum risk and compliance violation", "action_required": "Implement immediate security training program"}, "Once upon hiring": {"risk_score": 70, "reasoning": "Initial training only is insufficient for ongoing compliance", "action_required": "Establish annual refresher training"}, "Annually": {"risk_score": 30, "reasoning": "Annual training meets minimum requirements but could be improved"}, "Semi-annually": {"risk_score": 15, "reasoning": "Semi-annual training demonstrates strong commitment to compliance"}, "Quarterly": {"risk_score": 5, "reasoning": "Quarterly training exceeds requirements and minimizes risk"}}',
    '45 CFR 164.308(a)(5)',
    'basic',
    2
FROM assessment_modules m WHERE m.name = 'hipaa';

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

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_action_items_updated_at BEFORE UPDATE ON action_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'PROP.ai database setup completed successfully!' as status; 