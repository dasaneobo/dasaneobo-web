import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { SITE_CONFIG } from '@/constants/siteConfig';

export async function GET() {
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(30);

  let profileMap: Record<string, string> = {};
  if (articles && articles.length > 0) {
    const authorIds = [...new Set(articles.map(a => a.author_id).filter(Boolean))];
    if (authorIds.length > 0) {
      const { data: profiles } = await supabase.from('profiles').select('id, name').in('id', authorIds);
      profileMap = (profiles || []).reduce((acc: any, p: any) => ({ ...acc, [p.id]: p.name }), {});
    }
  }

  const itemsXml = (articles || []).map(article => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${SITE_CONFIG.url}/article/${article.slug ?? article.id}</link>
      <guid isPermaLink="true">${SITE_CONFIG.url}/article/${article.slug ?? article.id}</guid>
      <pubDate>${new Date(article.created_at).toUTCString()}</pubDate>
      <description><![CDATA[${article.content ? article.content.replace(/<[^>]*>/g, '').replace(/[#*`~]/g, '').substring(0, 300) : ''}]]></description>
      <category><![CDATA[${article.category}]]></category>
      <author><![CDATA[${profileMap[article.author_id] || SITE_CONFIG.contact.publisher}]]></author>
    </item>
  `).join('');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title><![CDATA[${SITE_CONFIG.name}]]></title>
      <link>${SITE_CONFIG.url}</link>
      <description><![CDATA[${SITE_CONFIG.description}]]></description>
      <language>ko</language>
      <atom:link href="${SITE_CONFIG.url}/feed.xml" rel="self" type="application/rss+xml" />
      ${itemsXml}
    </channel>
  </rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
