import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import { generateSlug } from '../lib/utils/slugify';
import * as path from 'path';

// Load environment variables manually
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateSlugs() {
  console.log('Starting slug migration...');
  
  // Get all articles without a slug
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, created_at')
    .is('slug', null);
    
  if (error) {
    console.error('Error fetching articles:', error);
    process.exit(1);
  }
  
  if (!articles || articles.length === 0) {
    console.log('No articles found needing a slug.');
    return;
  }
  
  console.log(`Found ${articles.length} articles to migrate.`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const article of articles) {
    const baseSlug = generateSlug(article.title);
    
    // Check if base slug exists
    let newSlug = baseSlug;
    let isUnique = false;
    let suffix = 2;
    
    while (!isUnique) {
      const { count } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('slug', newSlug);
        
      if (count === 0) {
        isUnique = true;
      } else {
        newSlug = `${baseSlug}-${suffix}`;
        suffix++;
      }
    }
    
    // Update article with new slug
    const { error: updateError } = await supabase
      .from('articles')
      .update({ slug: newSlug })
      .eq('id', article.id);
      
    if (updateError) {
      console.error(`Failed to update article ${article.id}:`, updateError);
      errorCount++;
    } else {
      console.log(`Updated [${article.id}] -> ${newSlug}`);
      successCount++;
    }
  }
  
  console.log(`\nMigration completed.`);
  console.log(`Success: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
}

migrateSlugs().catch(console.error);
