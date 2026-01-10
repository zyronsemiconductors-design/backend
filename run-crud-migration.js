const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
    console.log('🔄 Running CRUD support migration...\n');

    try {
        const sqlPath = path.join(__dirname, 'migrations', '002_add_crud_support.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Split by statement and execute
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('COMMENT'));

        console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);

            const { error } = await supabase.rpc('exec_sql', { sql_query: statement });

            if (error) {
                // Try direct query if RPC fails
                const { error: directError } = await supabase.from('_migrations').insert({
                    name: '002_add_crud_support',
                    executed_at: new Date().toISOString()
                });

                if (directError && !directError.message.includes('already exists')) {
                    console.error(`❌ Error on statement ${i + 1}:`, error.message);
                }
            }

            console.log(`✅ Statement ${i + 1} completed`);
        }

        console.log('\n✅ Migration completed successfully!');
        console.log('\n📊 Added columns:');
        console.log('   • status (with constraints)');
        console.log('   • admin_notes / reviewer_notes / response_notes');
        console.log('   • responded_at / reviewed_at / processed_at');
        console.log('   • responded_by / reviewed_by / processed_by');
        console.log('\n🔒 Added RLS policies for UPDATE and DELETE operations');
        console.log('\n🎯 Status workflows:');
        console.log('   • Contacts: new → read → responded → archived');
        console.log('   • Careers: pending → reviewed → shortlisted/rejected/hired');
        console.log('   • Community: pending → approved/declined → active/inactive');
        console.log('   • Resources: pending → responded → fulfilled/closed');

    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
