const { Client } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

async function testDirect() {
    console.log('Testing direct PG connection...');
    if (!connectionString) {
        console.error('❌ DATABASE_URL not found in .env');
        return;
    }

    const client = new Client({ connectionString });
    try {
        await client.connect();
        console.log('✅ Successfully connected to Postgres!');
        const res = await client.query('SELECT current_database();');
        console.log('📊 Current database:', res.rows[0].current_database);
        await client.end();
    } catch (err) {
        console.error('❌ Direct connection failed:');
        console.error(err);
    }
}

testDirect();
