// Quick test to verify Supabase connection
const { supabase } = require('./src/config/supabase.config');

async function quickTest() {
  console.log('Quick test of Supabase connection...');

  if (!supabase) {
    console.log('❌ Supabase is not configured properly');
    return;
  }

  try {
    // Test inserting a record
    console.log('Testing insert...');
    const { data: insertData, error: insertError } = await supabase
      .from('contacts')
      .insert([{
        name: 'Quick Test',
        email: 'quicktest@example.com',
        message: 'Quick test message',
        created_at: new Date().toISOString()
      }]);

    if (insertError) {
      console.log('❌ Insert failed:', insertError.message);
      return;
    }
    
    console.log('✅ Insert successful');

    // Test a simple select to verify the table is accessible
    console.log('Testing select...');
    const { data: selectData, error: selectError } = await supabase
      .from('contacts')
      .select('id, name, email')
      .limit(1);

    if (selectError) {
      console.log('❌ Select failed:', selectError.message);
      return;
    }

    console.log('✅ Select successful, got', selectData ? selectData.length : 0, 'records');
    console.log('✅ Supabase connection is working correctly!');
    
  } catch (error) {
    console.log('❌ Test failed with error:', error.message);
  }
}

quickTest();