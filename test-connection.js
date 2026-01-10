const { supabase } = require('./src/config/supabase.config');

async function testDatabaseConnection() {
  console.log('Testing database connection...');

  if (!supabase) {
    console.log('❌ Supabase is not configured');
    return false;
  }

  try {
    // Test inserting a sample record
    const { data, error } = await supabase
      .from('contacts')
      .insert([{
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message to verify database connection',
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.log('❌ Error inserting test record:', error.message);
      return false;
    }

    console.log('✅ Successfully inserted test record:', data[0].id);
    
    // Test retrieving the record
    const { data: retrievedData, error: selectError } = await supabase
      .from('contacts')
      .select('*')
      .eq('email', 'test@example.com')
      .order('created_at', { ascending: false })
      .limit(1);

    if (selectError) {
      console.log('❌ Error retrieving test record:', selectError.message);
      return false;
    }

    if (retrievedData && retrievedData.length > 0) {
      console.log('✅ Successfully retrieved test record:', retrievedData[0].id);
      console.log('✅ Database connection is working properly!');
      return true;
    } else {
      console.log('❌ Could not retrieve the test record');
      return false;
    }
  } catch (error) {
    console.log('❌ Database connection test failed:', error.message);
    return false;
  }
}

if (require.main === module) {
  testDatabaseConnection()
    .then(success => {
      if (success) {
        console.log('\n🎉 Database connection test passed!');
      } else {
        console.log('\n❌ Database connection test failed!');
      }
      process.exit(success ? 0 : 1);
    });
}

module.exports = { testDatabaseConnection };