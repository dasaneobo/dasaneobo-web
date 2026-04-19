const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTable() {
  const { data, error } = await supabase.from('local_news').select('*').limit(1);
  if (error) {
    console.error('ERROR:', error.message);
  } else {
    console.log('SUCCESS: Table exists. Count:', data.length);
  }
}

checkTable();
