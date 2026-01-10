const { Client } = require('pg');

// Extract database credentials from the connection string
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:iZFvYnZqkKcaU8UN@db.usrmeumclvoypjmmvnlb.supabase.co:5432/postgres';

async function updatePolicies() {
  console.log('Updating RLS policies to use anon role instead of service_role...');

  const client = new Client({
    connectionString: connectionString,
  });

  try {
    await client.connect();
    console.log('Connected to Supabase database');

    // Drop existing policies
    const dropPoliciesSQL = `
      DROP POLICY IF EXISTS "Allow inserts for contacts" ON contacts;
      DROP POLICY IF EXISTS "Allow inserts for job_applications" ON job_applications;
      DROP POLICY IF EXISTS "Allow inserts for community_requests" ON community_requests;
      DROP POLICY IF EXISTS "Allow inserts for resource_enquiries" ON resource_enquiries;
    `;

    await client.query(dropPoliciesSQL);
    console.log('Old policies dropped');

    // Create new policies for anon role
    const createPoliciesSQL = `
      -- Create policies to allow insertions from anon key
      CREATE POLICY "Allow inserts for contacts" ON contacts
        FOR INSERT TO anon
        WITH CHECK (true);

      CREATE POLICY "Allow inserts for job_applications" ON job_applications
        FOR INSERT TO anon
        WITH CHECK (true);

      CREATE POLICY "Allow inserts for community_requests" ON community_requests
        FOR INSERT TO anon
        WITH CHECK (true);

      CREATE POLICY "Allow inserts for resource_enquiries" ON resource_enquiries
        FOR INSERT TO anon
        WITH CHECK (true);

      -- Grant necessary permissions to anon role
      GRANT USAGE ON SCHEMA public TO anon;
      GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon;
      GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon;
    `;

    await client.query(createPoliciesSQL);
    console.log('New policies created for anon role');

    console.log('\nRLS policies updated successfully!');
    console.log('The application should now be able to insert records using the anon key.');

  } catch (error) {
    console.error('Error updating policies:', error.message);
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  updatePolicies()
    .then(() => {
      console.log('\nPolicy update completed!');
    })
    .catch(error => {
      console.error('Policy update failed:', error);
      process.exit(1);
    });
}

module.exports = { updatePolicies };