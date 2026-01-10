const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials. Please check your .env file.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
    try {
        console.log('🚀 Starting CMS tables migration...\n');

        // Read the migration SQL file
        const migrationPath = path.join(__dirname, 'migrations', '001_create_cms_tables.sql');
        const sqlContent = fs.readFileSync(migrationPath, 'utf8');

        // Split SQL into individual statements (basic split by semicolon)
        const statements = sqlContent
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const stmt = statements[i];
            console.log(`Executing statement ${i + 1}/${statements.length}...`);

            const { error } = await supabase.rpc('exec_sql', { sql_query: stmt });

            if (error) {
                console.error(`❌ Error executing statement ${i + 1}:`, error.message);
                // Continue with other statements instead of exiting
            } else {
                console.log(`✅ Statement ${i + 1} executed successfully`);
            }
        }

        console.log('\n✨ Migration completed!\n');

        // Verify tables were created
        console.log('🔍 Verifying table creation...\n');

        const tablesToVerify = ['page_content', 'social_links', 'navigation_items', 'seo_metadata'];

        for (const table of tablesToVerify) {
            const { data, error } = await supabase.from(table).select('*').limit(1);
            if (error) {
                console.log(`❌ Table '${table}' verification failed:`, error.message);
            } else {
                console.log(`✅ Table '${table}' exists and is accessible`);
            }
        }

        console.log('\n🎉 CMS database setup complete!\n');
        console.log('Next steps:');
        console.log('  1. Start the backend server: npm start (in backend directory)');
        console.log('  2. Start the frontend: npm run dev (in frontend directory)');
        console.log('  3. Login to admin panel and navigate to CMS pages\n');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
