'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

/* =========================================
   BREAKING NEWS TICKER
   ========================================= */
export function BreakingTicker({ articles }: { articles: any[] }) {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    if (articles.length > 0) {
      setItems(articles.slice(0, 8).map((a) => `[${a.category || '종합'}] ${a.title}`));
    } else {
      setItems(['[안내] 다산어보 뉴스 플랫폼이 정식 오픈하였습니다.', '[모집] 주민 리포터 1기 활동가를 선발합니다.']);
    }
  }, [articles]);

  return (
    <div style={{ background: '#2E7D52', color: '#fff', display: 'flex', alignItems: 'center', overflow: 'hidden', borderBottom: '2px solid #1a5c38' }}>
      <div style={{ background: '#1a5c38', padding: '0.5rem 1.2rem', fontWeight: 900, fontSize: '0.8rem', flexShrink: 0, fontFamily: 'Noto Serif KR, serif', letterSpacing: '1px', whiteSpace: 'nowrap' }}>
        ◈ 속 보
      </div>
      <div style={{ overflow: 'hidden', flex: 1, position: 'relative' }}>
        <div className="np-ticker-track">
          {[...items, ...items].map((item, i) => (
            <span key={i} style={{ padding: '0.5rem 2rem', display: 'inline-block', fontSize: '0.83rem', fontWeight: 500, whiteSpace: 'nowrap', borderRight: '1px solid rgba(255,255,255,0.2)' }}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================
   ARTICLE HELPERS
   ========================================= */
function ArticleDate({ dateStr }: { dateStr: string }) {
  return <span style={{ fontSize: '0.72rem', color: '#888' }}>{new Date(dateStr).toLocaleDateString('ko-KR')}</span>;
}

function ArticleImg({ src, alt, width = 80, height = 60 }: { src: string; alt: string; width?: number; height?: number }) {
  if (!src) return <div style={{ width, height, background: '#e8e8e8', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#bbb' }}>NO IMG</div>;
  return (
    <div style={{ width, height, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
      <Image src={src} alt={alt} fill style={{ objectFit: 'cover' }} />
    </div>
  );
}

function SectionHeader({ title, href }: { title: string; href?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #2E7D52', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#2E7D52', fontFamily: 'Noto Serif KR, serif' }}>{title}</h3>
      {href && <Link href={href} style={{ fontSize: '0.72rem', color: '#888', textDecoration: 'none' }}>더보기 +</Link>}
    </div>
  );
}


/* =========================================
   FOUNDING NOTICE COMPONENT
   ========================================= */
function NoticeFounding() {
  return (
    <div style={{ 
      background: '#fff', 
      border: '1.5px solid #2E7D52', 
      padding: '0.4rem', 
      borderRadius: '2px', 
      boxShadow: '0 4px 12px rgba(46, 125, 82, 0.08)',
      marginBottom: '1rem',
    }}>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1.4', overflow: 'hidden' }}>
        <Image 
          src="/images/notice_founding.png" 
          alt="창립총회 공고문" 
          fill 
          style={{ objectFit: 'contain' }}
          unoptimized
        />
      </div>
    </div>
  );
}

/* =========================================
   LEFT SIDEBAR
   ========================================= */
function LeftSidebar({ articles }: { articles: any[] }) {
  const popularArticles = articles.slice(0, 5);
  const photoArticles = articles.filter((a) => a.image_url).slice(0, 3);

  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
      {/* 창립총회 공고 */}
      <NoticeFounding />

      {/* 많이 본 뉴스 */}
      <div>
        <SectionHeader title="많이 본 뉴스" />
        <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {popularArticles.map((art, i) => (
            <li key={art.id}>
              <Link href={`/article/${art.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', gap: '0.7rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 900, color: i < 3 ? '#2E7D52' : '#ccc', flexShrink: 0, lineHeight: 1.2, minWidth: '1.2rem' }}>{i + 1}</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.4, color: '#222', wordBreak: 'keep-all' }}>{art.title}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>

      {/* 최신 포토 */}
      {photoArticles.length > 0 && (
        <div>
          <SectionHeader title="포토 뉴스" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {photoArticles.map((art) => (
              <Link key={art.id} href={`/article/${art.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '3/2', overflow: 'hidden', marginBottom: '0.3rem' }}>
                  <Image src={art.image_url} alt={art.title} fill style={{ objectFit: 'cover' }} />
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 600, color: '#333', lineHeight: 1.3 }}>{art.title}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 구독 배너 */}
      <div style={{ background: '#f5fdf9', border: '1.5px solid #2E7D52', borderRadius: '4px', padding: '1.2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.72rem', color: '#2E7D52', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '1px' }}>◈ 다산어보 구독</div>
        <p style={{ fontSize: '0.78rem', color: '#555', lineHeight: 1.5, margin: '0 0 1rem', wordBreak: 'keep-all' }}>지역 독립언론을 응원해 주세요. 정기구독으로 지역 저널리즘을 지킵니다.</p>
        <Link href="/subscribe" style={{ display: 'block', background: '#2E7D52', color: '#fff', padding: '0.5rem', borderRadius: '3px', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>구독 신청하기</Link>
      </div>

    </aside>
  );
}

/* =========================================
   CENTER MAIN
   ========================================= */
function CenterMain({ articles }: { articles: any[] }) {
  const topStory = articles.find((a) => a.is_top) || articles[0];
  const importantNews = articles.filter((a) => a.id !== topStory?.id).slice(0, 5);
  const regions = ['강진', '고흥', '보성', '장흥'];
  const regionRoutes: Record<string, string> = { 강진: '/gangjin', 고흥: '/goheung', 보성: '/boseong', 장흥: '/jangheung' };

  return (
    <div>
      {/* TOP NEWS */}
      <div style={{ marginBottom: '1.8rem' }}>
        <div style={{ borderBottom: '3px solid #2E7D52', paddingBottom: '0.4rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span style={{ background: '#2E7D52', color: '#fff', fontSize: '0.72rem', fontWeight: 900, padding: '0.2rem 0.7rem', letterSpacing: '1px' }}>TOP NEWS</span>
        </div>
        {topStory && (
          <Link href={`/article/${topStory.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            {topStory.image_url && (
              <div style={{ width: '100%', aspectRatio: '16/7', position: 'relative', overflow: 'hidden', marginBottom: '1rem' }}>
                <Image src={topStory.image_url} alt={topStory.title} fill style={{ objectFit: 'cover' }} />
              </div>
            )}
            <span style={{ fontSize: '0.72rem', color: '#2E7D52', fontWeight: 700 }}>{topStory.category}</span>
            <h2 style={{ margin: '0.4rem 0 0.6rem', fontSize: '1.6rem', fontWeight: 900, fontFamily: 'Noto Serif KR, serif', lineHeight: 1.3, letterSpacing: '-0.5px', wordBreak: 'keep-all', color: '#111' }}>{topStory.title}</h2>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#555', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {topStory.content?.replace(/<[^>]*>/g, '').replace(/[#*`~]/g, '').substring(0, 160)}...
            </p>
            <div style={{ marginTop: '0.5rem' }}><ArticleDate dateStr={topStory.created_at} /></div>
          </Link>
        )}
      </div>

      {/* IMPORTANT NEWS */}
      <div style={{ marginBottom: '1.8rem' }}>
        <div style={{ borderBottom: '2px solid #333', paddingBottom: '0.4rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 900, letterSpacing: '1px', background: '#333', color: '#fff', padding: '0.2rem 0.7rem' }}>IMPORTANT NEWS</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {importantNews.map((art) => (
            <Link key={art.id} href={`/article/${art.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', gap: '0.8rem', alignItems: 'flex-start', paddingBottom: '0.8rem', borderBottom: '1px solid #f0f0f0' }}>
              <ArticleImg src={art.image_url} alt={art.title} width={90} height={65} />
              <div>
                <span style={{ fontSize: '0.68rem', color: '#2E7D52', fontWeight: 700 }}>{art.category}</span>
                <h4 style={{ margin: '0.2rem 0 0.3rem', fontSize: '0.92rem', fontWeight: 700, lineHeight: 1.35, wordBreak: 'keep-all', color: '#111' }}>{art.title}</h4>
                <ArticleDate dateStr={art.created_at} />
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}

/* =========================================
   REGIONAL NEWS SECTION (Full Width)
   ========================================= */
function RegionalNews({ articles }: { articles: any[] }) {
  const regions = ['강진', '고흥', '보성', '장흥'];
  const regionRoutes: Record<string, string> = { 강진: '/gangjin', 고흥: '/goheung', 보성: '/boseong', 장흥: '/jangheung' };

  return (
    <div style={{ marginTop: '2.5rem', marginBottom: '1.5rem' }}>
      <SectionHeader title="4대 권역 소식" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0', borderTop: '2px solid #2E7D52' }}>
        {regions.map((region) => {
          const regionArticles = articles.filter((a) => a.region === region).slice(0, 3);
          return (
            <div key={region} style={{ borderRight: region !== '장흥' ? '1px solid #e5e5e5' : 'none', padding: '0.8rem 1rem 0', paddingLeft: region === '강진' ? 0 : '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.7rem' }}>
                <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 900, color: '#2E7D52', fontFamily: 'Noto Serif KR, serif' }}>● {region}</h4>
                <Link href={regionRoutes[region]} style={{ fontSize: '0.68rem', color: '#888', textDecoration: 'none' }}>더보기</Link>
              </div>
              {regionArticles.length > 0 ? regionArticles.map((art, i) => (
                <Link key={art.id} href={`/article/${art.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: i < regionArticles.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                  <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.4, color: '#222', wordBreak: 'keep-all' }}>{art.title}</p>
                  <ArticleDate dateStr={art.created_at} />
                </Link>
              )) : <p style={{ fontSize: '0.78rem', color: '#ccc' }}>최신 소식이 없습니다.</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================
   RIGHT SIDEBAR
   ========================================= */
function RightSidebar({ farmPrices, sidebarAd }: { farmPrices: any[]; sidebarAd: any }) {
  const defaultPrices = [
    { item_name: '쌀', price: '59000', diff: '0', unit: '20kg' },
    { item_name: '배추', price: '12200', diff: '0', unit: '1포기' },
    { item_name: '마늘', price: '154000', diff: '0', unit: '20kg' },
    { item_name: '고구마', price: '494000', diff: '0', unit: '100kg' },
    { item_name: '양파', price: '12600', diff: '0', unit: '15kg' },
  ];
  const prices = farmPrices.length > 0 ? farmPrices.slice(0, 6) : defaultPrices;

  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
      {/* 농산물 가격 */}
      <div>
        <SectionHeader title="오늘의 농산물 가격(소매)" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {prices.map((p: any, i: number) => {
            const diff = parseInt(p.diff || '0');
            return (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.6rem', background: i % 2 === 0 ? '#f9f9f9' : '#fff', borderRadius: '2px' }}>
                <span style={{ fontSize: '0.82rem', color: '#444' }}>{p.item_name} <span style={{ fontSize: '0.68rem', color: '#999' }}>({p.unit})</span></span>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#111' }}>{parseInt(p.price).toLocaleString()}원</span>
                  <span style={{ marginLeft: '0.4rem', fontSize: '0.7rem', fontWeight: 700, color: diff > 0 ? '#e03030' : diff < 0 ? '#2E7D52' : '#aaa' }}>
                    {diff > 0 ? '▲' : diff < 0 ? '▼' : '-'}{diff !== 0 ? Math.abs(diff).toLocaleString() : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <p style={{ fontSize: '0.65rem', color: '#bbb', marginTop: '0.5rem' }}>출처: 한국농수산식품유통공사(KAMIS)</p>
      </div>

      {/* 광고 배너 */}
      {sidebarAd ? (
        <Link href={sidebarAd.link_url || "/ad-apply"} style={{ textDecoration: 'none', display: 'block' }}>
          <div style={{ border: '1.5px solid #2E7D52', padding: '1.2rem', textAlign: 'center', borderRadius: '4px', background: '#fff' }}>
            <div style={{ fontSize: '0.65rem', color: '#2E7D52', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '1px' }}>PARTNERSHIP</div>
            <h5 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 800, color: '#111' }}>{sidebarAd.title}</h5>
            <p style={{ fontSize: '0.8rem', color: '#555', lineHeight: 1.5, margin: '0 0 1rem' }}>{sidebarAd.description}</p>
            <div style={{ background: '#2E7D52', color: '#fff', padding: '0.5rem 0', borderRadius: '3px', fontSize: '0.8rem', fontWeight: 800 }}>자세히 보기 →</div>
          </div>
        </Link>
      ) : (
        <Link href="/ad-apply" style={{ textDecoration: 'none', display: 'block' }}>
          <div style={{ border: '2px solid #2E7D52', padding: '1.4rem', textAlign: 'center', borderRadius: '4px', background: '#fff', cursor: 'pointer', transition: 'all 0.2s' }} className="ad-hover">
            <div style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>📣</div>
            <div style={{ fontSize: '0.72rem', color: '#2E7D52', fontWeight: 900, letterSpacing: '1px', marginBottom: '0.5rem' }}>PARTNERSHIP</div>
            <h5 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 800, color: '#111' }}>광고주가 되어주세요</h5>
            <p style={{ fontSize: '0.8rem', color: '#555', lineHeight: 1.5, margin: '0 0 1rem', wordBreak: 'keep-all' }}>
              지속가능한 독립언론을 위한 자리입니다.<br />
              다산어보와 함께 지역을 빛내주세요.
            </p>
            <div style={{ background: '#2E7D52', color: '#fff', padding: '0.5rem 0', borderRadius: '3px', fontSize: '0.8rem', fontWeight: 800 }}>
              광고 신청하기 →
            </div>
          </div>
        </Link>
      )}

      {/* 마을 리포터 모집 배너 */}
      <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '4px', padding: '1.2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>✍️</div>
        <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', fontWeight: 800, color: '#111' }}>마을 리포터 모집</h4>
        <p style={{ fontSize: '0.75rem', color: '#666', lineHeight: 1.5, margin: '0 0 1rem', wordBreak: 'keep-all' }}>내가 사는 마을의 이야기를 직접 전해주세요. 다산어보와 함께할 리포터를 찾습니다.</p>
        <Link href="/reporter-apply" style={{ display: 'block', border: '1.5px solid #2E7D52', color: '#2E7D52', padding: '0.45rem', borderRadius: '3px', fontSize: '0.8rem', fontWeight: 900, textDecoration: 'none' }}>지금 신청하기</Link>
      </div>

      {/* 기사 제보 */}
      <div style={{ background: '#2E7D52', color: '#fff', padding: '1.2rem', borderRadius: '4px', textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📢</div>
        <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.95rem', fontWeight: 800, fontFamily: 'Noto Serif KR, serif' }}>기사 제보</h4>
        <p style={{ fontSize: '0.78rem', lineHeight: 1.5, opacity: 0.9, margin: '0 0 0.8rem', wordBreak: 'keep-all' }}>현장의 소식을 다산어보에 제보해 주세요.</p>
        <Link href="/admin/report" style={{ display: 'block', background: '#fff', color: '#2E7D52', padding: '0.5rem', borderRadius: '3px', fontSize: '0.82rem', fontWeight: 900, textDecoration: 'none' }}>제보하기</Link>
      </div>
    </aside>
  );
}

/* =========================================
   BOTTOM SECTIONS
   ========================================= */
function BottomSections({ articles }: { articles: any[] }) {
  const latest = articles.slice(0, 30);
  const columns = articles.filter((a) => a.category === '칼럼' || a.category === '오피니언').slice(0, 5);
  const planned = articles.filter((a) => a.category === '기획연재').slice(0, 4);
  const photos = articles.filter((a) => a.image_url).slice(0, 8);

  return (
    <div style={{ marginTop: '3rem' }}>
      <hr style={{ border: 'none', borderTop: '3px solid #2E7D52', marginBottom: '2rem' }} />

      {/* 최신기사 목록 */}
      <div style={{ marginBottom: '3rem' }}>
        <SectionHeader title="최신 기사" href="/region" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 2rem' }}>
          {latest.map((art) => (
            <Link key={art.id} href={`/article/${art.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', padding: '0.6rem 0', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 500, color: '#222', lineHeight: 1.35, wordBreak: 'keep-all', flex: 1 }}>{art.title}</span>
              <ArticleDate dateStr={art.created_at} />
            </Link>
          ))}
        </div>
      </div>

      {/* 오피니언/칼럼 + 기획연재 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
        <div>
          <SectionHeader title="오피니언 · 칼럼" href="/column" />
          {columns.length > 0 ? columns.map((art) => (
            <Link key={art.id} href={`/article/${art.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', gap: '0.7rem', alignItems: 'flex-start', paddingBottom: '0.8rem', marginBottom: '0.8rem', borderBottom: '1px solid #f0f0f0' }}>
              <ArticleImg src={art.image_url} alt={art.title} width={70} height={52} />
              <div>
                <h5 style={{ margin: '0 0 0.2rem', fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.35, wordBreak: 'keep-all' }}>{art.title}</h5>
                <ArticleDate dateStr={art.created_at} />
              </div>
            </Link>
          )) : <p style={{ color: '#ccc', fontSize: '0.82rem' }}>등록된 칼럼이 없습니다.</p>}
        </div>
        <div>
          <SectionHeader title="기획 · 연재" href="/region" />
          {planned.length > 0 ? planned.map((art) => (
            <Link key={art.id} href={`/article/${art.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', gap: '0.7rem', alignItems: 'flex-start', paddingBottom: '0.8rem', marginBottom: '0.8rem', borderBottom: '1px solid #f0f0f0' }}>
              <ArticleImg src={art.image_url} alt={art.title} width={70} height={52} />
              <div>
                <h5 style={{ margin: '0 0 0.2rem', fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.35, wordBreak: 'keep-all' }}>{art.title}</h5>
                <ArticleDate dateStr={art.created_at} />
              </div>
            </Link>
          )) : <p style={{ color: '#ccc', fontSize: '0.82rem' }}>등록된 기획기사가 없습니다.</p>}
        </div>
      </div>

      {/* 포토뉴스 */}
      <div>
        <SectionHeader title="포토 뉴스" href="/region" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8rem' }}>
          {photos.map((art) => (
            <Link key={art.id} href={`/article/${art.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden', marginBottom: '0.4rem' }}>
                <Image src={art.image_url} alt={art.title} fill style={{ objectFit: 'cover' }} />
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: '#333', lineHeight: 1.3, wordBreak: 'keep-all' }}>{art.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================
   MAIN EXPORT
   ========================================= */
export function NewspaperMain({ articles, farmPrices, sidebarAd, settings }: { articles: any[]; farmPrices: any[]; sidebarAd: any; settings: any }) {
  return (
    <div className="container np-main-container">
      {/* 3-column layout */}
      <div className="np-three-col">
        <LeftSidebar articles={articles} />
        
        <div className="mobile-gold-ad">
          <Link href="/ad-apply">
            <div style={{ position: 'relative', width: '100%', aspectRatio: '460/100', overflow: 'hidden', borderRadius: '4px', border: '1px solid #ddd' }}>
              <Image 
                src="/ads/gold_fisher_v2.png" 
                alt="황금어장 광고" 
                fill
                style={{ objectFit: 'cover' }} 
              />
            </div>
          </Link>
        </div>

        <CenterMain articles={articles} />
        <RightSidebar farmPrices={farmPrices} sidebarAd={sidebarAd} />
      </div>

      <RegionalNews articles={articles} />

      <BottomSections articles={articles} />

      <style jsx global>{`
        .np-three-col {
          display: grid;
          grid-template-columns: 200px 1fr 200px;
          gap: 2rem;
          border-top: 3px double #2E7D52;
          padding-top: 1.5rem;
        }
        @media (max-width: 1024px) {
          .np-three-col { grid-template-columns: 180px 1fr 180px; gap: 1.2rem; }
        }
        @media (max-width: 768px) {
          .np-three-col { grid-template-columns: 1fr; gap: 1rem; }
        }
        @media (max-width: 480px) {
          .np-three-col { grid-template-columns: 1fr; }
        }
        .mobile-gold-ad {
          display: none;
        }
        @media (max-width: 768px) {
          .mobile-gold-ad {
            display: block;
          }
        }
        .np-main-container {
          padding-top: 1.5rem;
          padding-bottom: 2rem;
        }
        @media (max-width: 768px) {
          .np-main-container {
            padding-top: 0.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
