# PROP.ai Database Setup Guide

## Step 1: Create Environment File
1. Create `.env.local` in your project root
2. Copy contents from `env-template.txt`

## Step 2: Run Database Schema
1. Go to: https://supabase.com/dashboard/project/ohgguwscbtlsoojtkhwg/sql
2. Click "New Query"
3. Copy the entire contents from `setup-supabase.sql`
4. Paste into the SQL editor
5. Click "Run" to execute

## Step 3: Verify Setup
After running the schema, you should see:
- "PROP.ai database setup completed successfully!" message
- New tables created in the Table Editor
- Sample HIPAA questions loaded

## Step 4: Test Connection
Once the schema is run, we can test the database connection from your Next.js app.

## Database Tables Created:
- companies
- users  
- assessment_modules
- assessment_questions
- assessments
- assessment_responses
- action_items
- ai_conversations
- conversation_messages

## Sample Data Loaded:
- HIPAA Risk Assessment module
- Cybersecurity Assessment module
- Quarterly Business Review module
- Sample HIPAA questions with risk scoring 