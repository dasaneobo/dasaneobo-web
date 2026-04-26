import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { SITE_CONFIG } from '@/constants/siteConfig';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: articles } = await supabase
    .from('articles')
    .select('id, slug, updated_at')
    .eq('status', 'published')
    .order('updated_at', { ascending: false });

  const articleEntries = (articles || []).map(a => ({
    url: `${SITE_CONFIG.url}/article/${a.slug ?? a.id}`,
    lastModified: new Date(a.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const staticEntries = SITE_CONFIG.categories.map(cat => ({
    url: `${SITE_CONFIG.url}${cat.href}`,
    priority: cat.href === '/' || cat.href === '/region' ? 1.0 : 0.9,
  }));

  // Deduplicate staticEntries manually
  const uniqueStaticEntries = Array.from(new Map(staticEntries.map(item => [item.url, item])).values());

  return [
    { url: SITE_CONFIG.url, priority: 1.0 },
    { url: `${SITE_CONFIG.url}/subscribe`, priority: 0.8 },
    { url: `${SITE_CONFIG.url}/guide`, priority: 0.8 },
    ...uniqueStaticEntries,
    ...articleEntries,
  ];
}
