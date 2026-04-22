const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envContent = fs.readFileSync('.env.local', 'utf-8');
const envVariables = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVariables[match[1].trim()] = match[2].trim().replace(/^"|"$/g, '');
  }
});

const supabaseAdmin = createClient(
  envVariables['NEXT_PUBLIC_SUPABASE_URL'],
  envVariables['SUPABASE_SERVICE_ROLE_KEY']
);

async function checkData() {
  const { count: newsCount, error: newsError } = await supabaseAdmin
    .from('local_news')
    .select('*', { count: 'exact', head: true });
    
  const { count: farmCount, error: farmError } = await supabaseAdmin
    .from('farm_prices')
    .select('*', { count: 'exact', head: true });

  console.log('local_news count:', newsCount, 'error:', newsError?.message);
  console.log('farm_prices count:', farmCount, 'error:', farmError?.message);
}

checkData();
