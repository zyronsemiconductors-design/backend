const { Client } = require('pg');
require('dotenv').config();

const projectRef = 'usrmeumclvoypjmmvnlb';
const password = 'iZFvYnZqkKcaU8UN';
const regions = [
    'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
    'eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3',
    'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'ap-northeast-2',
    'ap-south-1', 'sa-east-1', 'ca-central-1'
];

async function probe() {
    for (const region of regions) {
        const host = `aws-0-${region}.pooler.supabase.com`;
        console.log(`Probing ${host}...`);
        const client = new Client({
            host,
            port: 5432,
            database: 'postgres',
            user: `postgres.${projectRef}`, // Use project ref in user for pooler
            password,
            connectionTimeoutMillis: 2000,
        });

        try {
            await client.connect();
            console.log(`✅ SUCCESS: Connected to ${host}`);
            await client.end();
            return host;
        } catch (err) {
            console.log(`❌ FAILED: ${region} - ${err.message}`);
        }
    }
}

probe().then(host => {
    if (host) console.log(`\nFound host: ${host}`);
    else console.log('\nNo host found.');
});
