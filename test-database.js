// Test Database Connection Script
// Run this after creating .env.local and running the database schema

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testDatabaseConnection() {
  console.log('🔍 Testing PROP.ai Database Connection...\n');

  try {
    // Test Supabase connection
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials in .env.local');
    }

    console.log('✅ Supabase URL:', supabaseUrl);
    console.log('✅ Supabase Key:', supabaseKey.substring(0, 20) + '...');

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test basic connection
    console.log('\n🔗 Testing connection...');
    const { data, error } = await supabase
      .from('assessment_modules')
      .select('*')
      .limit(1);

    if (error) {
      throw error;
    }

    console.log('✅ Database connection successful!');
    console.log('✅ Found', data.length, 'assessment modules');

    // Test service role connection
    console.log('\n🔐 Testing service role connection...');
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceRoleKey) {
      const adminSupabase = createClient(supabaseUrl, serviceRoleKey);
      const { data: adminData, error: adminError } = await adminSupabase
        .from('companies')
        .select('*')
        .limit(1);

      if (adminError) {
        console.log('⚠️  Service role test failed:', adminError.message);
      } else {
        console.log('✅ Service role connection successful!');
      }
    }

    console.log('\n🎉 PROP.ai database setup is working correctly!');
    console.log('\nNext steps:');
    console.log('1. Start your development server: npm run dev');
    console.log('2. Visit http://localhost:3003');
    console.log('3. Test the authentication and assessment features');

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure .env.local exists with correct credentials');
    console.log('2. Verify the database schema was run in Supabase');
    console.log('3. Check that your Supabase project is active');
  }
}

testDatabaseConnection(); 