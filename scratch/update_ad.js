const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateAd() {
  const { error } = await supabase
    .from('ads')
    .update({ title: '광고주를 모십니다' })
    .eq('location', 'sidebar');
  if (error) console.error(error);
  else console.log('Successfully updated sidebar ad title.');
}

updateAd();
