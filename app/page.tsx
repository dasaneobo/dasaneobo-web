import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BreakingTicker, NewspaperMain } from '@/components/NewspaperHome';
import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export default async function Home() {
  // Fetch all published articles
  const { data: recentArticles } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(60);

  // Fetch popular articles separately
  const { data: popularArticles } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('view_count', { ascending: false })
    .limit(5);

  const safeArticles = recentArticles || [];

  // Fetch ads
  const { data: adsData } = await supabase.from('ads').select('*').eq('is_active', true);
  const sidebarAd = adsData?.find((a: any) => a.location === 'sidebar');

  // Fetch farm prices
  const { data: farmPrices } = await supabase
    .from('farm_prices')
    .select('*')
    .order('item_name', { ascending: true });

  // Fetch site settings
  const { data: settingsData } = await supabase.from('site_settings').select('*');
  const settings = settingsData?.reduce((acc: any, curr: any) => ({ ...acc, [curr.id]: curr.value }), {}) || {};

  return (
    <main style={{ background: '#fff', minHeight: '100vh' }}>
      <Header />
      {/* Breaking news ticker */}
      <BreakingTicker articles={safeArticles} />

      {/* Main 3-column newspaper layout */}
      <NewspaperMain
        articles={safeArticles}
        popularArticles={popularArticles || []}
        farmPrices={farmPrices || []}
        sidebarAd={sidebarAd}
        settings={settings}
      />

      <Footer />

      {/* Mobile FAB */}
      <div className="fab-container">
        <a href="/report" style={{ textDecoration: 'none' }}>
          <button className="fab-button">제보<br />하기</button>
        </a>
      </div>
    </main>
  );
}
