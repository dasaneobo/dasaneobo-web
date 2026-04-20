import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const REGIONS = ['강진군', '고흥군', '보성군', '장흥군'];

export async function GET(req: Request) {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'Naver API credentials missing' }, { status: 500 });
  }

  try {
    const allNews: any[] = [];

    for (const region of REGIONS) {
      const url = `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(region)}&display=5&sort=sim`;
      
      const res = await fetch(url, {
        headers: {
          'X-Naver-Client-Id': clientId,
          'X-Naver-Client-Secret': clientSecret,
        },
      });

      const data = await res.json();

      if (data.items) {
        data.items.forEach((item: any) => {
          allNews.push({
            region: region.replace('군', ''), // '강진군' -> '강진'
            title: item.title.replace(/<\/?[^>]+(>|$)/g, ""), // Remove HTML tags
            source: item.originallink ? new URL(item.originallink).hostname.replace('www.', '') : '네이버뉴스',
            link: item.link,
            pub_date: new Date(item.pubDate).toISOString(), // RFC 2822 → ISO 8601
            updated_at: new Date().toISOString()
          });
        });
      }
    }

    if (allNews.length > 0) {
      // Clear old news for these regions and insert new ones
      // Or just upsert by title+region? Titles can change. Better to clear and insert for per-region 5 news.
      const { error: deleteError } = await supabaseAdmin
        .from('local_news')
        .delete()
        .in('region', REGIONS.map(r => r.replace('군', '')));
      
      if (deleteError) throw deleteError;

      const { error: insertError } = await supabaseAdmin
        .from('local_news')
        .insert(allNews);
      
      if (insertError) throw insertError;
    }

    return NextResponse.json({ success: true, count: allNews.length });

  } catch (error: any) {
    console.error('News Update Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
