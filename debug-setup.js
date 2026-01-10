const { createClient } = require('@supabase/supabase-js');
const { Client } = require('pg');
require('dotenv').config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const DATABASE_URL = 'postgresql://postgres:iZFvYnZqkKcaU8UN@db.usrmeumclvoypjmmvnlb.supabase.co:5432/postgres';

async function setup() {
    console.log('--- Database Setup Debug ---');
    console.log('Supabase URL:', SUPABASE_URL);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    console.log('\n1. Checking "admins" table via REST API...');
    const { data: adminCheck, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .limit(1);

    if (adminError) {
        console.error('❌ REST API Error:', adminError.message, '(' + adminError.code + ')');
        if (adminError.code === 'PGRST204' || adminError.message.includes('relation "public.admins" does not exist')) {
            console.log('Result: The "admins" table DOES NOT exist.');
        }
    } else {
        console.log('✅ REST API Success: "admins" table exists.');
        console.log('Row count check (limit 1):', adminCheck.length);
    }

    console.log('\n2. Attempting direct PG connection to create tables...');
    const client = new Client({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('✅ PG Success: Connected to Postgres!');

        const createSQL = `
            CREATE TABLE IF NOT EXISTS admins (
                id SERIAL PRIMARY KEY,
                full_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role VARCHAR(50) DEFAULT 'admin',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            -- Site Settings
            CREATE TABLE IF NOT EXISTS site_settings (
                id VARCHAR(50) PRIMARY KEY,
                value JSONB NOT NULL,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `;

        await client.query(createSQL);
        console.log('✅ SQL Success: Tables created/verified.');
    } catch (err) {
        console.error('❌ PG Error:', err.message);
        if (err.code === 'ENOTFOUND') {
            console.log('Possible Fix: Your network cannot resolve "db.usrmeumclvoypjmmvnlb.supabase.co".');
            console.log('Try using the connection string with the IP address if you can find it, or use the connection pooling host from Supabase dashboard.');
        }
    } finally {
        await client.end();
    }
}

setup();
