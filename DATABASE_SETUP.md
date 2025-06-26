# PROP.ai Database Setup Guide

This guide will help you set up the complete database infrastructure for the PROP.ai platform using Supabase.

## 🚀 Quick Start

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `prop-ai-platform`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

### 2. Get Your Supabase Credentials

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **Anon Public Key** (starts with `eyJ...`)
   - **Service Role Key** (starts with `eyJ...`)

### 3. Set Up Environment Variables

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Database Initialization
DB_INIT_TOKEN=your_secure_init_token_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Twilio Configuration (for AI phone calls)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Database Schema

1. **Option A: Using Supabase Dashboard**
   - Go to **SQL Editor** in your Supabase dashboard
   - Copy the contents of `supabase-schema.sql`
   - Paste and run the SQL

2. **Option B: Using Supabase CLI**
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Login to Supabase
   supabase login
   
   # Link your project
   supabase link --project-ref your-project-ref
   
   # Run the schema
   supabase db push
   ```

### 5. Initialize Database with Sample Data

After running the schema, initialize the database with default data:

```bash
# Using curl
curl -X POST http://localhost:3000/api/db/init \
  -H "Authorization: Bearer your_secure_init_token_here"

# Or using the API route in your browser
# POST http://localhost:3000/api/db/init
# Headers: Authorization: Bearer your_secure_init_token_here
```

## 📊 Database Schema Overview

### Core Tables

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `companies` | Organization profiles | Industry, size, subscription info |
| `users` | User accounts | Roles, permissions, preferences |
| `assessments` | Assessment instances | Status, scores, completion tracking |
| `assessment_questions` | Question bank | Risk mapping, regulatory references |
| `assessment_responses` | User answers | AI confidence, action items |
| `action_items` | Generated tasks | Priority, assignments, due dates |
| `ai_conversations` | AI chat sessions | Context, extracted data |
| `conversation_messages` | Chat messages | Role, content, metadata |

### Security Features

- **Row Level Security (RLS)** enabled on all tables
- **User isolation** - users can only access their company's data
- **Audit logging** for compliance tracking
- **Encrypted sensitive data** using pgcrypto

### Performance Optimizations

- **Indexed queries** for fast lookups
- **JSONB columns** for flexible data storage
- **Real-time subscriptions** for live updates
- **Connection pooling** for scalability

## 🔧 Database Operations

### Creating a New Company

```typescript
import { DatabaseService } from '@/lib/supabase';

const company = await DatabaseService.createCompany({
  name: "Sample Healthcare Practice",
  industry: "healthcare",
  employee_count: 25,
  business_type: "medical_practice"
});
```

### Starting an Assessment

```typescript
const assessment = await DatabaseService.createAssessment({
  company_id: company.id,
  module_id: "hipaa-module-id",
  user_id: user.id,
  status: "in_progress"
});
```

### Saving Assessment Responses

```typescript
await DatabaseService.saveAssessmentResponse({
  assessment_id: assessment.id,
  question_id: question.id,
  answer: "yes",
  risk_score: 20,
  reasoning: "Good security practice",
  ai_generated: false
});
```

### Getting Company Analytics

```typescript
const analytics = await DatabaseService.getCompanyAnalytics(companyId);
console.log(analytics);
// {
//   completionRate: 0.75,
//   averageScore: 72,
//   criticalActions: 3
// }
```

## 🔐 Security Best Practices

### 1. Environment Variables
- Never commit `.env.local` to version control
- Use different keys for development and production
- Rotate keys regularly

### 2. Database Access
- Use service role key only for server-side operations
- Use anon key for client-side operations
- Implement proper authentication before database access

### 3. Row Level Security
- All tables have RLS policies
- Users can only access their company's data
- Audit logs track all database changes

### 4. Data Encryption
- Sensitive data encrypted at rest
- API keys stored securely
- HTTPS for all communications

## 📈 Monitoring & Analytics

### Database Metrics to Track

1. **Performance**
   - Query response times
   - Connection pool usage
   - Storage growth

2. **Usage**
   - Active companies
   - Assessment completions
   - AI conversation volume

3. **Security**
   - Failed authentication attempts
   - Unusual access patterns
   - Data access logs

### Setting Up Monitoring

```sql
-- Create a view for assessment analytics
CREATE VIEW assessment_analytics AS
SELECT 
  c.name as company_name,
  c.industry,
  COUNT(a.id) as total_assessments,
  AVG(a.overall_score) as avg_score,
  COUNT(CASE WHEN a.status = 'completed' THEN 1 END) as completed_assessments
FROM companies c
LEFT JOIN assessments a ON c.id = a.company_id
GROUP BY c.id, c.name, c.industry;
```

## 🚨 Troubleshooting

### Common Issues

1. **Connection Errors**
   ```bash
   # Check environment variables
   echo $NEXT_PUBLIC_SUPABASE_URL
   echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

2. **Permission Errors**
   ```sql
   -- Check RLS policies
   SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
   FROM pg_policies
   WHERE schemaname = 'public';
   ```

3. **Data Not Loading**
   ```bash
   # Reset and reinitialize database
   curl -X DELETE http://localhost:3000/api/db/init \
     -H "Authorization: Bearer your_token"
   
   curl -X POST http://localhost:3000/api/db/init \
     -H "Authorization: Bearer your_token"
   ```

### Performance Issues

1. **Slow Queries**
   ```sql
   -- Check for slow queries
   SELECT query, calls, total_time, mean_time
   FROM pg_stat_statements
   ORDER BY mean_time DESC
   LIMIT 10;
   ```

2. **Index Optimization**
   ```sql
   -- Check index usage
   SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
   FROM pg_stat_user_indexes
   ORDER BY idx_scan DESC;
   ```

## 🔄 Database Migrations

### Adding New Tables

1. Create migration file:
   ```sql
   -- migrations/001_add_new_table.sql
   CREATE TABLE new_table (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name VARCHAR(255) NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

2. Apply migration:
   ```bash
   supabase db push
   ```

### Updating Existing Tables

1. Create migration:
   ```sql
   -- migrations/002_add_column.sql
   ALTER TABLE companies ADD COLUMN new_field VARCHAR(100);
   ```

2. Apply safely:
   ```bash
   supabase db push --dry-run  # Test first
   supabase db push            # Apply changes
   ```

## 📞 Support

If you encounter issues:

1. Check the [Supabase documentation](https://supabase.com/docs)
2. Review the [PROP.ai GitHub issues](https://github.com/your-repo/issues)
3. Contact the development team

## 🎯 Next Steps

After setting up the database:

1. **Configure Authentication** - Set up Supabase Auth
2. **Set up OpenAI** - Configure AI assistant
3. **Configure Twilio** - Set up phone calls
4. **Deploy to Production** - Use Vercel or similar
5. **Set up Monitoring** - Configure alerts and dashboards

---

**Need help?** Check out our [complete documentation](https://docs.prop-ai.com) or reach out to our support team. 