const { Client } = require('pg');
require('dotenv').config();

const projectRef = 'usrmeumclvoypjmmvnlb';
const password = 'iZFvYnZqkKcaU8UN'; // From fallback
const port = 5432;
const dbName = 'postgres';
const user = 'postgres';

const hosts = [
    `db.${projectRef}.supabase.co`,
    `${projectRef}.supabase.co`,
    `db.${projectRef}.supabase.com`,
    `${projectRef}.supabase.com`,
    `aws-0-us-east-1.pooler.supabase.com`, // Example pooler
];

async function probe() {
    for (const host of hosts) {
        console.log(`Probing ${host}...`);
        const client = new Client({
            host,
            port,
            database: dbName,
            user,
            password,
            connectionTimeoutMillis: 2000,
        });

        try {
            await client.connect();
            console.log(`✅ SUCCESS: Connected to ${host}`);
            await client.end();
            return;
        } catch (err) {
            console.log(`❌ FAILED: ${host} - ${err.message}`);
        }
    }
}

probe();
