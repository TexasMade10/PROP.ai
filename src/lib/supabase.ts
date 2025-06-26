import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types based on our schema
export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          name: string;
          industry: string;
          employee_count: number;
          business_type: string | null;
          phone_number: string | null;
          website: string | null;
          address: string | null;
          created_at: string;
          updated_at: string;
          subscription_tier: string;
          subscription_status: string;
          onboarding_completed: boolean;
          onboarding_completed_at: string | null;
          ai_assistant_enabled: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          industry: string;
          employee_count: number;
          business_type?: string | null;
          phone_number?: string | null;
          website?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
          subscription_tier?: string;
          subscription_status?: string;
          onboarding_completed?: boolean;
          onboarding_completed_at?: string | null;
          ai_assistant_enabled?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          industry?: string;
          employee_count?: number;
          business_type?: string | null;
          phone_number?: string | null;
          website?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
          subscription_tier?: string;
          subscription_status?: string;
          onboarding_completed?: boolean;
          onboarding_completed_at?: string | null;
          ai_assistant_enabled?: boolean;
        };
      };
      users: {
        Row: {
          id: string;
          company_id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          role: string;
          permissions: any;
          phone_number: string | null;
          job_title: string | null;
          department: string | null;
          is_primary_contact: boolean;
          created_at: string;
          updated_at: string;
          last_login: string | null;
          preferences: any;
        };
        Insert: {
          id: string;
          company_id: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          role?: string;
          permissions?: any;
          phone_number?: string | null;
          job_title?: string | null;
          department?: string | null;
          is_primary_contact?: boolean;
          created_at?: string;
          updated_at?: string;
          last_login?: string | null;
          preferences?: any;
        };
        Update: {
          id?: string;
          company_id?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          role?: string;
          permissions?: any;
          phone_number?: string | null;
          job_title?: string | null;
          department?: string | null;
          is_primary_contact?: boolean;
          created_at?: string;
          updated_at?: string;
          last_login?: string | null;
          preferences?: any;
        };
      };
      assessments: {
        Row: {
          id: string;
          company_id: string;
          module_id: string;
          user_id: string | null;
          status: string;
          completion_percentage: number;
          overall_score: number | null;
          risk_level: string | null;
          section_scores: any;
          critical_issues: string[] | null;
          started_at: string;
          completed_at: string | null;
          due_date: string | null;
          last_updated: string;
          version: string;
          metadata: any;
        };
        Insert: {
          id?: string;
          company_id: string;
          module_id: string;
          user_id?: string | null;
          status?: string;
          completion_percentage?: number;
          overall_score?: number | null;
          risk_level?: string | null;
          section_scores?: any;
          critical_issues?: string[] | null;
          started_at?: string;
          completed_at?: string | null;
          due_date?: string | null;
          last_updated?: string;
          version?: string;
          metadata?: any;
        };
        Update: {
          id?: string;
          company_id?: string;
          module_id?: string;
          user_id?: string | null;
          status?: string;
          completion_percentage?: number;
          overall_score?: number | null;
          risk_level?: string | null;
          section_scores?: any;
          critical_issues?: string[] | null;
          started_at?: string;
          completed_at?: string | null;
          due_date?: string | null;
          last_updated?: string;
          version?: string;
          metadata?: any;
        };
      };
      assessment_responses: {
        Row: {
          id: string;
          assessment_id: string;
          question_id: string;
          answer: string;
          risk_score: number | null;
          reasoning: string | null;
          action_required: string | null;
          ai_generated: boolean;
          ai_confidence: number | null;
          answered_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          assessment_id: string;
          question_id: string;
          answer: string;
          risk_score?: number | null;
          reasoning?: string | null;
          action_required?: string | null;
          ai_generated?: boolean;
          ai_confidence?: number | null;
          answered_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          assessment_id?: string;
          question_id?: string;
          answer?: string;
          risk_score?: number | null;
          reasoning?: string | null;
          action_required?: string | null;
          ai_generated?: boolean;
          ai_confidence?: number | null;
          answered_at?: string;
          updated_at?: string;
        };
      };
      action_items: {
        Row: {
          id: string;
          company_id: string;
          assessment_id: string | null;
          question_id: string | null;
          title: string;
          description: string | null;
          priority: string;
          category: string | null;
          status: string;
          assigned_to: string | null;
          due_date: string | null;
          estimated_effort: number | null;
          actual_effort: number | null;
          completion_notes: string | null;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          company_id: string;
          assessment_id?: string | null;
          question_id?: string | null;
          title: string;
          description?: string | null;
          priority: string;
          category?: string | null;
          status?: string;
          assigned_to?: string | null;
          due_date?: string | null;
          estimated_effort?: number | null;
          actual_effort?: number | null;
          completion_notes?: string | null;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          company_id?: string;
          assessment_id?: string | null;
          question_id?: string | null;
          title?: string;
          description?: string | null;
          priority?: string;
          category?: string | null;
          status?: string;
          assigned_to?: string | null;
          due_date?: string | null;
          estimated_effort?: number | null;
          actual_effort?: number | null;
          completion_notes?: string | null;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
      };
      ai_conversations: {
        Row: {
          id: string;
          company_id: string;
          user_id: string | null;
          conversation_type: string;
          status: string;
          context: any;
          extracted_data: any;
          confidence_score: number | null;
          started_at: string;
          completed_at: string | null;
          duration_seconds: number | null;
          metadata: any;
        };
        Insert: {
          id?: string;
          company_id: string;
          user_id?: string | null;
          conversation_type: string;
          status?: string;
          context?: any;
          extracted_data?: any;
          confidence_score?: number | null;
          started_at?: string;
          completed_at?: string | null;
          duration_seconds?: number | null;
          metadata?: any;
        };
        Update: {
          id?: string;
          company_id?: string;
          user_id?: string | null;
          conversation_type?: string;
          status?: string;
          context?: any;
          extracted_data?: any;
          confidence_score?: number | null;
          started_at?: string;
          completed_at?: string | null;
          duration_seconds?: number | null;
          metadata?: any;
        };
      };
    };
  };
}

// Database utility functions
export class DatabaseService {
  
  // Company operations
  static async createCompany(companyData: Database['public']['Tables']['companies']['Insert']) {
    const { data, error } = await supabase
      .from('companies')
      .insert(companyData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  static async getCompany(companyId: string) {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single();
    
    if (error) throw error;
    return data;
  }
  
  static async updateCompany(companyId: string, updates: Database['public']['Tables']['companies']['Update']) {
    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', companyId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  // User operations
  static async createUser(userData: Database['public']['Tables']['users']['Insert']) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('users')
      .select('*, companies(*)')
      .eq('id', user.id)
      .single();
    
    if (error) throw error;
    return data;
  }
  
  // Assessment operations
  static async createAssessment(assessmentData: Database['public']['Tables']['assessments']['Insert']) {
    const { data, error } = await supabase
      .from('assessments')
      .insert(assessmentData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  static async getCompanyAssessments(companyId: string) {
    const { data, error } = await supabase
      .from('assessments')
      .select(`
        *,
        assessment_modules (*),
        assessment_responses (*)
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
  
  static async updateAssessment(assessmentId: string, updates: Database['public']['Tables']['assessments']['Update']) {
    const { data, error } = await supabase
      .from('assessments')
      .update(updates)
      .eq('id', assessmentId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  // Assessment response operations
  static async saveAssessmentResponse(responseData: Database['public']['Tables']['assessment_responses']['Insert']) {
    const { data, error } = await supabase
      .from('assessment_responses')
      .upsert(responseData, { onConflict: 'assessment_id,question_id' })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  static async getAssessmentResponses(assessmentId: string) {
    const { data, error } = await supabase
      .from('assessment_responses')
      .select('*')
      .eq('assessment_id', assessmentId);
    
    if (error) throw error;
    return data;
  }
  
  // Action item operations
  static async createActionItem(actionItemData: Database['public']['Tables']['action_items']['Insert']) {
    const { data, error } = await supabase
      .from('action_items')
      .insert(actionItemData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  static async getCompanyActionItems(companyId: string) {
    const { data, error } = await supabase
      .from('action_items')
      .select('*')
      .eq('company_id', companyId)
      .order('due_date', { ascending: true });
    
    if (error) throw error;
    return data;
  }
  
  // AI conversation operations
  static async createConversation(conversationData: Database['public']['Tables']['ai_conversations']['Insert']) {
    const { data, error } = await supabase
      .from('ai_conversations')
      .insert(conversationData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  static async saveConversationMessage(messageData: {
    conversation_id: string;
    role: string;
    content: string;
    message_type?: string;
    metadata?: any;
    ai_confidence?: number;
    extracted_entities?: any;
  }) {
    const { data, error } = await supabase
      .from('conversation_messages')
      .insert(messageData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  // Analytics and reporting
  static async getCompanyAnalytics(companyId: string) {
    // Get assessment completion rates
    const { data: assessments, error: assessmentError } = await supabase
      .from('assessments')
      .select('status, completion_percentage, overall_score')
      .eq('company_id', companyId);
    
    if (assessmentError) throw assessmentError;
    
    // Get action item statistics
    const { data: actionItems, error: actionError } = await supabase
      .from('action_items')
      .select('status, priority')
      .eq('company_id', companyId);
    
    if (actionError) throw actionError;
    
    return {
      assessments,
      actionItems,
      completionRate: assessments.filter(a => a.status === 'completed').length / assessments.length,
      averageScore: assessments.reduce((sum, a) => sum + (a.overall_score || 0), 0) / assessments.length,
      criticalActions: actionItems.filter(a => a.priority === 'critical' && a.status !== 'completed').length
    };
  }
}

// Auth utilities
export class AuthService {
  static async signUp(email: string, password: string, userData: any) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    if (error) throw error;
    return data;
  }
  
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  }
  
  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
  
  static async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  }
  
  static async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) throw error;
  }
}

// Real-time subscriptions
export class RealtimeService {
  static subscribeToAssessments(companyId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`assessments:${companyId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'assessments',
        filter: `company_id=eq.${companyId}`
      }, callback)
      .subscribe();
  }
  
  static subscribeToActionItems(companyId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`action_items:${companyId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'action_items',
        filter: `company_id=eq.${companyId}`
      }, callback)
      .subscribe();
  }
  
  static subscribeToNotifications(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`notifications:${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe();
  }
} 