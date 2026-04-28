import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { NewspaperMain, BreakingTicker } from '@/components/NewspaperHome';
import { supabase } from '@/lib/supabase';
import { getFeaturedArticle } from '@/lib/queries/getFeaturedArticle';
import MainHeroSlider from '@/components/home/MainHeroSlider';

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
  const featured = await getFeaturedArticle();

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

  // Build Hero Articles Array
  const heroArticles: any[] = [];
  if (featured) heroArticles.push(featured);
  
  for (const art of safeArticles) {
    if (heroArticles.length >= 5) break;
    // Don't duplicate the featured article and ensure it has an image
    if (featured && featured.id === art.id) continue;
    if (art.image_url) heroArticles.push(art);
  }

  return (
    <main style={{ background: '#fff', minHeight: '100vh' }}>
      <Header />
      {/* Breaking news ticker */}
      <BreakingTicker articles={safeArticles} />

      <div className="container" style={{ paddingTop: '1rem' }}>
        <MainHeroSlider articles={heroArticles} />
      </div>

      {/* Main 3-column newspaper layout */}
      <NewspaperMain
        articles={safeArticles}
        popularArticles={popularArticles || []}
        farmPrices={farmPrices || []}
        sidebarAd={sidebarAd}
        settings={settings}
        featured={null} /* HeroFocusBox is replaced by MainHeroSlider, so pass null here */
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
