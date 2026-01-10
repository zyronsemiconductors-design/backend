const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

async function listTables() {
    console.log('Connecting to:', url);
    const supabase = createClient(url, key);

    console.log('Attempting to fetch table list via postgrest root...');
    // We can try to fetch "/" which often returns the Swagger definition or table list in PostgREST
    try {
        const response = await fetch(`${url}/rest/v1/`, {
            headers: {
                'apikey': key,
                'Authorization': `Bearer ${key}`
            }
        });
        const data = await response.json();
        console.log('Available tables/definitions found:', Object.keys(data.definitions || {}));
    } catch (err) {
        console.error('Failed to list tables via root:', err.message);
    }

    console.log('\nTesting "admins" again...');
    const { data, error } = await supabase.from('admins').select('*').limit(1);
    if (error) {
        console.log('❌ admins error:', error.message, error.code);
    } else {
        console.log('✅ admins SUCCESS');
    }
}

listTables();
