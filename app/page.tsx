import Header from '@/components/Header';
import { NewsTicker, InfographicDashboard, TransparencyBanner } from '@/components/HomeElements';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 0;

export default async function Home() {
  const { data: recentArticles } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(30);

  const safeArticles = recentArticles || [];
  
  // Fetch Site Settings & Ads
  const { data: settingsData } = await supabase.from('site_settings').select('*');
  const settings = settingsData?.reduce((acc: any, curr: any) => ({ ...acc, [curr.id]: curr.value }), {}) || {};
  
  const { data: adsData } = await supabase.from('ads').select('*').eq('is_active', true);
  const billboardAd = adsData?.find(a => a.location === 'billboard');
  const sidebarAd = adsData?.find(a => a.location === 'sidebar');
  
  // Designate Top Story
  const topStory = safeArticles.find(a => a.is_top) || safeArticles[0];
  const subStories = safeArticles.filter(a => a.id !== topStory?.id).slice(0, 3);

  // Region filtering
  const regions = ['강진', '보성', '장흥', '고흥'];

  return (
    <main style={{ paddingBottom: '5rem', background: '#fff' }}>
      <Header />
      <div style={{ borderBottom: '1px solid #eee' }}>
        <NewsTicker />
      </div>

      {/* 1. Top Billboard Ad (Strategy #1) */}
      {billboardAd && (
        <div className="container" style={{ marginTop: '1.5rem' }}>
          <Link href={billboardAd.link_url || '#'} style={{ textDecoration: 'none' }} target={billboardAd.link_url?.startsWith('http') ? '_blank' : '_self'}>
            <div style={{ 
              width: '100%', 
              height: '110px', 
              background: '#f8fafc', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s'
            }}>
              {billboardAd.image_url ? (
                <img src={billboardAd.image_url} alt={billboardAd.title || '광고'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <>
                  <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '0.6rem', color: '#94a3b8', border: '1px solid #e2e8f0', padding: '1px 4px', borderRadius: '2px', fontWeight: 700 }}>AD</div>
                  <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', fontFamily: 'serif', marginBottom: '0.3rem' }}>
                        {billboardAd.title}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{billboardAd.description}</div>
                  </div>
                </>
              )}
            </div>
          </Link>
        </div>
      )}
      
      <div className="container" style={{ marginTop: '2rem' }}>
        
        {/* TOP SECTION: Headline + Regions (Strategy #2) */}
        <div className="main-headline-grid" style={{ marginBottom: '3rem' }}>
          
          {/* Main Headline */}
          <section>
            {topStory && (
              <Link href={`/article/${topStory.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
                  <div style={{ width: '100%', aspectRatio: '16/8.5', overflow: 'hidden', borderRadius: '8px', background: '#f5f5f5', position: 'relative' }}>
                    {topStory.image_url ? (
                      <Image src={topStory.image_url} alt={topStory.title} fill style={{ objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>No Image</div>
                    )}
                  </div>
                  <div style={{ paddingTop: '1.5rem' }}>
                    <span style={{ color: 'var(--primary-dark)', fontWeight: 800, fontSize: '0.9rem', background: '#e6fffa', padding: '4px 12px', borderRadius: '4px', marginBottom: '0.8rem', display: 'inline-block' }}>{topStory.category}</span>
                    <h2 style={{ fontSize: '3rem', fontWeight: 900, margin: '0 0 1rem', fontFamily: '"Nanum Myeongjo", serif', letterSpacing: '-1.5px', lineHeight: '1.15' }}>
                      {topStory.title}
                    </h2>
                    <p style={{ fontSize: '1.2rem', color: '#444', lineHeight: '1.7', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {topStory.content.replace(/<[^>]*>?/gm, '').substring(0, 180)}...
                    </p>
                  </div>
                </div>
              </Link>
            )}

            {/* Sub-Headline list below main */}
            <div className="sub-story-grid" style={{ gap: '1.5rem' }}>
               {subStories.slice(0, 2).map(art => (
                 <Link key={art.id} href={`/article/${art.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                   <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                      <div style={{ width: '100px', aspectRatio: '1', flexShrink: 0, overflow: 'hidden', borderRadius: '6px', position: 'relative' }}>
                        <Image src={art.image_url || 'https://via.placeholder.com/100'} alt={art.title} fill style={{ objectFit: 'cover' }} />
                      </div>
                      <div>
                        <h4 style={{ margin: '0 0 0.4rem', fontSize: '1.1rem', fontWeight: 700, lineHeight: '1.3' }}>{art.title}</h4>
                        <span style={{ fontSize: '0.75rem', color: '#888' }}>{art.category} | {new Date(art.created_at).toLocaleDateString()}</span>
                      </div>
                   </div>
                 </Link>
               ))}
            </div>
          </section>

          {/* Sidebar CTA & Transparency (Strategy #3, #4) */}
          <aside>
             <TransparencyBanner settings={settings} />

             <div style={{ background: '#fff7ed', padding: '1.8rem', borderRadius: '12px', border: '1px solid #ffedd5', marginBottom: '1.5rem', marginTop: '1.5rem' }}>
                <h4 style={{ margin: '0 0 0.8rem', fontSize: '1.2rem', fontWeight: 800, color: '#c2410c' }}>마을의 목소리가 되어주세요</h4>
                <p style={{ margin: '0 0 1.5rem', fontSize: '0.9rem', color: '#9a3412', lineHeight: '1.5' }}>누구나 리포터가 될 수 있습니다. 현장의 소식을 다산어보에 전할 리포터를 모집합니다.</p>
                <Link href="/reporter-apply">
                  <button style={{ width: '100%', padding: '0.8rem', background: '#ea580c', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>리포터 신청하기</button>
                </Link>
             </div>

             {/* Ad / Sponsorship Inquiry (Strategy #1-3) */}
             {sidebarAd && (
               <Link href={sidebarAd.link_url || '#'} style={{ textDecoration: 'none', color: 'inherit' }} target={sidebarAd.link_url?.startsWith('http') ? '_blank' : '_self'}>
                 <div style={{ 
                   marginTop: '1.5rem', 
                   padding: '1.5rem', 
                   border: '2px dashed var(--primary)', 
                   borderRadius: '12px',
                   textAlign: 'center',
                   background: '#fff',
                   cursor: 'pointer'
                 }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--primary-dark)', fontWeight: 800, marginBottom: '0.4rem', border: '1px solid var(--primary)', display: 'inline-block', padding: '1px 6px', borderRadius: '4px' }}>PARTNERSHIP</div>
                    <h5 style={{ margin: '0.5rem 0 1rem', fontSize: '1.1rem', fontWeight: 800 }}>{sidebarAd.title}</h5>
                    <p style={{ fontSize: '0.8rem', color: '#666', lineHeight: '1.5', marginBottom: '1.2rem' }}>{sidebarAd.description}</p>
                    <button style={{ 
                      width: '100%', 
                      padding: '0.7rem', 
                      background: 'white', 
                      color: 'var(--primary-dark)', 
                      border: '1px solid var(--primary-dark)', 
                      borderRadius: '4px', 
                      fontWeight: 'bold', 
                      pointerEvents: 'none',
                      fontSize: '0.85rem'
                    }}>자세히 보기</button>
                 </div>
               </Link>
             )}
          </aside>
        </div>

        {/* RECENT BY REGIONS (Strategy #2) */}
        <section style={{ margin: '4rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900 }}>4대 권역 밀착 소식</h3>
            <div style={{ flex: 1, height: '2px', background: '#eee' }}></div>
          </div>
          <div className="region-grid" style={{ gap: '1.5rem' }}>
            {regions.map(region => (
              <div key={region} style={{ borderRight: region !== '고흥' ? '1px solid #eee' : 'none', paddingRight: region !== '고흥' ? '1.5rem' : '0' }}>
                <h4 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', fontWeight: 800, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }}></span> {region}
                </h4>
                {safeArticles.filter(a => a.region === region).slice(0, 3).map((art, idx) => (
                  <Link key={art.id} href={`/article/${art.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ marginBottom: '1.2rem' }}>
                      <h5 style={{ margin: '0 0 0.4rem', fontSize: '1.05rem', fontWeight: 600, lineHeight: '1.4', wordBreak: 'keep-all' }}>{art.title}</h5>
                      <span style={{ fontSize: '0.75rem', color: '#999' }}>{idx === 0 ? art.content.replace(/<[^>]*>?/gm, '').substring(0, 40) + '...' : ''}</span>
                    </div>
                  </Link>
                ))}
                {safeArticles.filter(a => a.region === region).length === 0 && <p style={{ color: '#ccc', fontSize: '0.8rem' }}>최신 소식이 없습니다.</p>}
                <Link href={`/${region === '강진' ? 'gangjin' : region === '보성' ? 'boseong' : region === '장흥' ? 'jangheung' : 'goheung'}`} style={{ fontSize: '0.8rem', color: '#666', textDecoration: 'none', fontWeight: 700 }}>{region} 소식 더보기 +</Link>
              </div>
            ))}
          </div>
        </section>

        {/* INFOGRAPHIC CENTER SECTION (Strategy #1) */}
        <InfographicDashboard settings={settings} />

        {/* CATEGORY GRID (SOCIAL, CULTURE, ETC) */}
        <div className="category-grid" style={{ marginTop: '4rem' }}>
          {['행정/정치', '경제/산업', '사회/문화'].map((group, gIdx) => (
            <div key={group}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '2px solid #333' }}>{group}</h3>
              {safeArticles.filter(a => {
                if(gIdx === 0) return a.category === '행정' || a.category === '정치';
                if(gIdx === 1) return a.category === '경제';
                return a.category === '사회' || a.category === '문화';
              }).slice(0, 5).map(art => (
                <Link key={art.id} href={`/article/${art.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ padding: '0.8rem 0', borderBottom: '1px solid #f0f0f0' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 500, lineHeight: '1.4' }}>{art.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER SAME AS BEFORE */}
      <footer style={{ background: '#111', color: '#888', padding: '5rem 0', marginTop: '6rem' }}>
        <div className="container">
          <div className="footer-flex" style={{ marginBottom: '3rem' }}>
             <div>
                <h2 style={{ color: '#fff', fontSize: '2.2rem', fontFamily: 'serif', margin: '0 0 1.5rem' }}>다산어보</h2>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
                  전남 4개 권역(고흥·보성·장흥·강진) 밀착 독립언론<br />
                  투명한 보도와 주민 참여로 지역의 미래를 씁니다.
                </p>
             </div>
             <div style={{ display: 'flex', gap: '5rem' }}>
                <div>
                   <h5 style={{ color: '#eee', marginBottom: '1.2rem' }}>주요 권역</h5>
                   <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
                      <li><Link href="/gangjin" style={{color: 'inherit', textDecoration: 'none'}}>강진군 소식</Link></li>
                      <li><Link href="/boseong" style={{color: 'inherit', textDecoration: 'none'}}>보성군 소식</Link></li>
                      <li><Link href="/jangheung" style={{color: 'inherit', textDecoration: 'none'}}>장흥군 소식</Link></li>
                      <li><Link href="/goheung" style={{color: 'inherit', textDecoration: 'none'}}>고흥군 소식</Link></li>
                   </ul>
                </div>
                <div>
                   <h5 style={{ color: '#eee', marginBottom: '1.2rem' }}>참여 안내</h5>
                   <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
                      <li><Link href="/subscribe" style={{color: 'inherit', textDecoration: 'none'}}>구독 신청</Link></li>
                      <li><Link href="/admin/report" style={{color: 'inherit', textDecoration: 'none'}}>마을 리포터 지원</Link></li>
                      <li><Link href="/ethics" style={{color: 'inherit', textDecoration: 'none'}}>윤리규정</Link></li>
                   </ul>
                </div>
             </div>
          </div>
          <div style={{ borderTop: '1px solid #222', paddingTop: '2rem', fontSize: '0.75rem', textAlign: 'center' }}>
            © 2026 Dasaneobo News. All Rights Reserved. 투명성 리포트 (2026-Q1)
          </div>
        </div>
      </footer>

      {/* Floating Action Button (Mobile) */}
      <div className="fab-container">
        <Link href="/admin/report" style={{ textDecoration: 'none' }}>
          <button className="fab-button">제보<br/>하기</button>
        </Link>
      </div>
    </main>
  );
}

