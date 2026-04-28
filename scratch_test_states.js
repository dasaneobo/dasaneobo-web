const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function main() {
  const { data: articles } = await supabase.from('articles').select('*').eq('is_top', true).limit(1);
  const topArticle = articles?.[0];
  if (!topArticle) {
    console.log("No top article found");
    return;
  }
  
  const state = process.argv[2];
  let imageUrl = topArticle.image_url;

  switch(state) {
    case 'a':
      imageUrl = 'https://via.placeholder.com/400x800.png?text=Document+Screenshot';
      break;
    case 'b':
      imageUrl = '';
      break;
    case 'c':
      imageUrl = 'https://via.placeholder.com/1280x720.png?text=16:9+Valid+Image';
      break;
    case 'd':
      imageUrl = 'https://via.placeholder.com/1024x768.png?text=4:3+Invalid+Image';
      break;
  }

  await supabase.from('articles').update({ image_url: imageUrl }).eq('id', topArticle.id);
  console.log(`Updated top article to state ${state} with image: ${imageUrl}`);
}

main();
