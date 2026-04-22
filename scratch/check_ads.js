const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

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

async function checkAds() {
  const { data, error } = await supabaseAdmin.from('ads').select('*').limit(1);
  if (error) console.error(error);
  else console.log(Object.keys(data[0] || {}));
}

checkAds();
