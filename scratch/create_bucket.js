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

async function createBucket() {
  const { data, error } = await supabaseAdmin.storage.createBucket('images', {
    public: true,
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
    fileSizeLimit: 10485760 // 10MB
  });

  if (error) {
    if (error.message.includes('already exists')) {
      console.log('Bucket "images" already exists.');
    } else {
      console.error('Error creating bucket:', error);
    }
  } else {
    console.log('Bucket "images" created successfully:', data);
  }
}

createBucket();
