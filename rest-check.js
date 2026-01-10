const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

async function check() {
    console.log('URL:', url);
    const supabase = createClient(url, key);

    console.log('Testing REST connectivity to "admins"...');
    const { data, error } = await supabase.from('admins').select('*').limit(1);

    if (error) {
        console.error('REST Error:', error);
    } else {
        console.log('REST Success! Table exists. Data:', data);
    }
}

check();
