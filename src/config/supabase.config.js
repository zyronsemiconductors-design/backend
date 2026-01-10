const { createClient } = require('@supabase/supabase-js');
const { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } = require('./env');

// Create Supabase client
let supabase = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  // Use service role key if available for backend operations, otherwise use anon key
  const supabaseKey = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
  supabase = createClient(SUPABASE_URL, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        'X-Client-Info': 'zyron-backend/1.0',
      },
    },
  });
  console.log('✅ Supabase client initialized');
} else {
  console.warn('⚠️  Supabase configuration missing. Database functionality will be disabled.');
}

module.exports = { supabase };