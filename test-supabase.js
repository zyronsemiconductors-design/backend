const { supabase } = require('./src/config/supabase.config');

async function testConnection() {
    console.log('Testing Supabase Connection...');
    try {
        const { SUPABASE_URL } = require('./src/config/env');
        console.log('🔗 SUPABASE_URL:', SUPABASE_URL);

        if (!supabase) {
            console.error('❌ Supabase client not initialized. Check your environment variables.');
            return;
        }

        const { data, error, count } = await supabase
            .from('admins')
            .select('*', { count: 'exact' });

        if (error) {
            console.error('❌ Error querying "admins" table:');
            console.error('Message:', error.message);
            console.error('Code:', error.code);
            console.error('Details:', error.details);
            console.error('Hint:', error.hint);

            if (error.code === '42P01' || error.code === 'PGRST204') {
                console.log('💡 Tip: The table "admins" might not exist. Run "node setup-database.js".');
            }
        } else {
            console.log('✅ Successfully connected to Supabase!');
            console.log('📊 Admin count:', count);
            console.log('📄 Data:', data);
        }
    } catch (err) {
        console.error('❌ Unexpected error during connection test:');
        console.error(err);
    }
}

testConnection();
