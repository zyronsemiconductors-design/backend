const { Client } = require('pg');

// Use the direct PostgreSQL connection string
const connectionString = 'postgresql://postgres:iZFvYnZqkKcaU8UN@db.usrmeumclvoypjmmvnlb.supabase.co:5432/postgres';

async function addSelectPolicies() {
  console.log('Adding select policies to Supabase tables...');

  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log('Connected to Supabase database');

    // Create select policies for anon role
    await client.query(`
      -- Create policies to allow selections from anon key
      DO $$
      BEGIN
        -- Check if policy exists before creating (to avoid duplicate errors)
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies 
          WHERE schemaname = 'public' 
          AND tablename = 'contacts' 
          AND policyname = 'Allow selects for contacts'
        ) THEN
          CREATE POLICY "Allow selects for contacts" ON contacts
            FOR SELECT TO anon
            USING (true);
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_policies 
          WHERE schemaname = 'public' 
          AND tablename = 'job_applications' 
          AND policyname = 'Allow selects for job_applications'
        ) THEN
          CREATE POLICY "Allow selects for job_applications" ON job_applications
            FOR SELECT TO anon
            USING (true);
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_policies 
          WHERE schemaname = 'public' 
          AND tablename = 'community_requests' 
          AND policyname = 'Allow selects for community_requests'
        ) THEN
          CREATE POLICY "Allow selects for community_requests" ON community_requests
            FOR SELECT TO anon
            USING (true);
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_policies 
          WHERE schemaname = 'public' 
          AND tablename = 'resource_enquiries' 
          AND policyname = 'Allow selects for resource_enquiries'
        ) THEN
          CREATE POLICY "Allow selects for resource_enquiries" ON resource_enquiries
            FOR SELECT TO anon
            USING (true);
        END IF;
      END $$;
    `);
    
    console.log('✅ Select policies created successfully!');

    // Verify the policies
    const verifyResult = await client.query(`
      SELECT policyname, tablename, permissive, roles, cmd 
      FROM pg_policies 
      WHERE tablename IN ('contacts', 'job_applications', 'community_requests', 'resource_enquiries')
      ORDER BY tablename, cmd;
    `);
    
    console.log('Updated policies:');
    verifyResult.rows.forEach(row => {
      console.log(`  - ${row.policyname} on ${row.tablename} for ${row.cmd} to ${row.roles[0]}`);
    });

  } catch (error) {
    console.error('❌ Error adding select policies:', error.message);
    console.error('Full error:', error);
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  addSelectPolicies()
    .then(() => {
      console.log('\nPolicy addition completed!');
    })
    .catch(error => {
      console.error('Policy addition failed:', error);
      process.exit(1);
    });
}

module.exports = { addSelectPolicies };