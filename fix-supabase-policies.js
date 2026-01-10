const { Client } = require('pg');

// Use the direct PostgreSQL connection string
const connectionString = 'postgresql://postgres:iZFvYnZqkKcaU8UN@db.usrmeumclvoypjmmvnlb.supabase.co:5432/postgres';

async function fixPolicies() {
  console.log('Fixing Supabase RLS policies...');

  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log('Connected to Supabase database');

    // First, let's check the current policies
    console.log('Checking current policies...');
    const checkResult = await client.query(`
      SELECT policyname, tablename, permissive, roles 
      FROM pg_policies 
      WHERE tablename IN ('contacts', 'job_applications', 'community_requests', 'resource_enquiries');
    `);
    
    console.log('Current policies:', checkResult.rows);

    // Drop existing policies if they exist
    console.log('Dropping existing policies...');
    await client.query('DROP POLICY IF EXISTS "Allow inserts for contacts" ON contacts;');
    await client.query('DROP POLICY IF EXISTS "Allow inserts for job_applications" ON job_applications;');
    await client.query('DROP POLICY IF EXISTS "Allow inserts for community_requests" ON community_requests;');
    await client.query('DROP POLICY IF EXISTS "Allow inserts for resource_enquiries" ON resource_enquiries;');

    // Create new policies that allow the anon key to insert records
    console.log('Creating new policies for anon key...');
    await client.query(`
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
      GRANT INSERT ON ALL TABLES IN SCHEMA public TO anon;
      GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT INSERT ON TABLES TO anon;
    `);
    
    console.log('✅ Policies updated successfully!');

    // Verify the policies were created
    console.log('Verifying updated policies...');
    const verifyResult = await client.query(`
      SELECT policyname, tablename, permissive, roles 
      FROM pg_policies 
      WHERE tablename IN ('contacts', 'job_applications', 'community_requests', 'resource_enquiries');
    `);
    
    console.log('Updated policies:', verifyResult.rows);

    console.log('\n🎉 Supabase RLS policies have been configured correctly!');
    console.log('The application should now be able to insert records using the anon key.');

  } catch (error) {
    console.error('❌ Error updating policies:', error.message);
    console.error('Full error:', error);
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  fixPolicies()
    .then(() => {
      console.log('\nPolicy fix completed!');
    })
    .catch(error => {
      console.error('Policy fix failed:', error);
      process.exit(1);
    });
}

module.exports = { fixPolicies };