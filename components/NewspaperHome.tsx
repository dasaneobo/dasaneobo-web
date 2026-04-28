'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Eye } from 'lucide-react';
import { SITE_CONFIG } from '@/constants/siteConfig';
import HeroFocusBox from '@/components/home/HeroFocusBox';
import CategoryBadge from '@/components/ui/CategoryBadge';

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
function ArticleDate({ dateStr, viewCount }: { dateStr: string, viewCount?: number }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.72rem', color: '#888' }}>
      <span>{new Date(dateStr).toLocaleDateString('ko-KR')}</span>
      {viewCount !== undefined && (
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          <Eye size={11} /> {viewCount.toLocaleString()}
        </span>
      )}
    </div>
  );
}

function ArticleImg({ src, alt, width = 80, height = 60 }: { src: string; alt: string; width?: number; height?: number }) {
  const imgSrc = src || '/fallback/article-default.svg';
  return (
    <div style={{ width, height, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
      <Image 
        src={imgSrc} 
        alt={src ? alt : `${alt} - 다산어보`} 
        fill 
        style={{ objectFit: 'cover' }} 
        onError={(e) => { 
          (e.target as HTMLImageElement).src = '/fallback/article-default.svg'; 
          (e.target as HTMLImageElement).srcset = '';
        }}
      />
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
      padding: '2px', 
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
function LeftSidebar({ popularArticles, articles }: { popularArticles: any[]; articles: any[] }) {
  // Only show articles that are likely to have a real photo (have image_url and not fallback)
  const photoArticles = articles.filter((a) => a.image_url && !a.image_url.includes('fallback') && !a.image_url.includes('default')).slice(0, 4);

  return (
    <aside className="np-sidebar np-left-sidebar">
      {/* 많이 본 뉴스 */}
      <div className="np-sidebar-item">
        <SectionHeader title="많이 본 뉴스" />
        <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {popularArticles.map((art, i) => (
            <li key={art.id}>
              <Link href={`/article/${art.slug ?? art.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', gap: '0.7rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 900, color: i < 3 ? '#2E7D52' : '#ccc', flexShrink: 0, lineHeight: 1.2, minWidth: '1.2rem' }}>{i + 1}</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.4, color: '#222', wordBreak: 'keep-all' }}>{art.title}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>

        {/* 최신 포토 - 2 columns on mobile */}
        {photoArticles.length >= 2 && (
          <div className="np-sidebar-item">
            <SectionHeader title="포토 뉴스" />
            <div className="np-sidebar-photo-grid">
              {photoArticles.map((art) => (
                <Link key={art.id} href={`/article/${art.slug ?? art.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '3/2', overflow: 'hidden', marginBottom: '0.3rem', background: '#f5f5f5' }}>
                    <Image src={art.image_url} alt={art.title} fill style={{ objectFit: 'cover' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                  <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 600, color: '#333', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{art.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="np-sidebar-services-grid">
          {/* Service items moved to right sidebar for better grouping */}
        </div>
    </aside>
  );
}

/* =========================================
   CENTER MAIN
   ========================================= */
function CenterMain({ articles, featured }: { articles: any[]; featured: any }) {
  // Filter the featured article out of the important news list
  const importantNews = articles.filter((a) => a.id !== featured?.id).slice(0, 5);
  const regions = ['강진', '고흥', '보성', '장흥'];
  const regionRoutes: Record<string, string> = { 강진: '/gangjin', 고흥: '/goheung', 보성: '/boseong', 장흥: '/jangheung' };

  return (
    <div>
      {/* TOP NEWS */}
      {featured && (
        <div style={{ marginBottom: '1.8rem' }}>
          <div style={{ borderBottom: '3px solid #2E7D52', paddingBottom: '0.4rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ background: '#2E7D52', color: '#fff', fontSize: '0.72rem', fontWeight: 900, padding: '0.2rem 0.7rem', letterSpacing: '1px' }}>{SITE_CONFIG.labels.topNews}</span>
          </div>
          <HeroFocusBox article={featured} />
        </div>
      )}

      {/* IMPORTANT NEWS */}
      <div style={{ marginBottom: '1.8rem' }}>
        <div style={{ borderBottom: '2px solid #333', paddingBottom: '0.4rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 900, letterSpacing: '1px', background: '#333', color: '#fff', padding: '0.2rem 0.7rem' }}>{SITE_CONFIG.labels.importantNews}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {importantNews.map((art) => (
            <Link key={art.id} href={`/article/${art.slug ?? art.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', gap: '0.8rem', alignItems: 'flex-start', paddingBottom: '0.8rem', borderBottom: '1px solid #f0f0f0' }}>
              <ArticleImg src={art.image_url} alt={art.title} width={90} height={65} />
              <div>
                <CategoryBadge category={art.category} />
                <h4 style={{ margin: '0.2rem 0 0.3rem', fontSize: '0.92rem', fontWeight: 700, lineHeight: 1.35, wordBreak: 'keep-all', color: '#111' }}>{art.title}</h4>
                <ArticleDate dateStr={art.created_at} viewCount={art.view_count} />
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
    <div className="np-region-section">
      <SectionHeader title="4대 권역 소식" />
      <div className="np-region-grid">
        {regions.map((region) => {
          const regionArticles = articles.filter((a) => a.region === region).slice(0, 3);
          return (
            <div key={region} className="np-region-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.7rem' }}>
                <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 900, color: '#2E7D52', fontFamily: 'Noto Serif KR, serif' }}>● {region}</h4>
                <Link href={regionRoutes[region]} style={{ fontSize: '0.68rem', color: '#888', textDecoration: 'none' }}>더보기</Link>
              </div>
              {regionArticles.length > 0 ? regionArticles.map((art, i) => (
                <Link key={art.id} href={`/article/${art.slug ?? art.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: i < regionArticles.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                  <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.4, color: '#222', wordBreak: 'keep-all' }}>{art.title}</p>
                  <ArticleDate dateStr={art.created_at} viewCount={art.view_count} />
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
    <aside className="np-sidebar np-right-sidebar">
      {/* 농산물 가격 */}
      <div className="np-sidebar-item">
        <SectionHeader title="오늘의 농산물 가격" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {prices.map((p: any, i: number) => {
            const diff = parseInt(p.diff || '0');
            return (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0.6rem', background: i % 2 === 0 ? '#f9f9f9' : '#fff', borderRadius: '2px' }}>
                <span style={{ fontSize: '0.78rem', color: '#444' }}>{p.item_name} <span style={{ fontSize: '0.65rem', color: '#999' }}>({p.unit})</span></span>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#111' }}>{parseInt(p.price).toLocaleString()}원</span>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.8rem' }}>
          <span style={{ fontSize: '0.6rem', color: '#bbb' }}>출처: KAMIS (농산물유통정보)</span>
          <a href="https://www.kamis.or.kr" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.65rem', color: '#2E7D52', textDecoration: 'none', fontWeight: 700 }}>다른 품목 가격 확인 →</a>
        </div>
      </div>

      <div className="np-sidebar-services-grid">
        {/* 서비스 공통 스타일 상수 (인라인으로 적용하거나 별도 컴포넌트화 가능하지만 현재 구조 유지하며 스타일만 통일) */}
        
        {/* 광고 배너 */}
        <div className="np-sidebar-item">
          {sidebarAd ? (
            <Link href={sidebarAd.link_url || "/ad-apply"} style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{ background: '#fff', border: '1px solid #2E7D52', padding: '1rem 0.8rem', textAlign: 'center', borderRadius: '4px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '0.6rem', color: '#2E7D52', fontWeight: 900, marginBottom: '0.2rem' }}>{SITE_CONFIG.labels.ad}</div>
                <h5 style={{ margin: '0 0 0.8rem', fontSize: '0.85rem', fontWeight: 800, color: '#333' }}>{sidebarAd.title}</h5>
                <div style={{ background: '#2E7D52', color: '#fff', padding: '0.5rem 0', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>보기</div>
              </div>
            </Link>
          ) : (
            <Link href="/ad-apply" style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{ background: '#fff', border: '1px solid #2E7D52', padding: '1rem 0.8rem', textAlign: 'center', borderRadius: '4px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '0.6rem', color: '#2E7D52', fontWeight: 900, marginBottom: '0.2rem' }}>{SITE_CONFIG.labels.ad}</div>
                <h5 style={{ margin: '0 0 0.8rem', fontSize: '0.85rem', fontWeight: 800, color: '#333' }}>광고 신청</h5>
                <div style={{ background: '#2E7D52', color: '#fff', padding: '0.5rem 0', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>신청하기</div>
              </div>
            </Link>
          )}
        </div>

        {/* 마을 리포터 모집 */}
        <div className="np-sidebar-item">
          <Link href="/reporter-apply" style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{ background: '#fff', border: '1px solid #2E7D52', padding: '1rem 0.8rem', textAlign: 'center', borderRadius: '4px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '0.6rem', color: '#2E7D52', fontWeight: 700, marginBottom: '0.2rem' }}>{SITE_CONFIG.labels.community}</div>
              <h4 style={{ margin: '0 0 0.8rem', fontSize: '0.85rem', fontWeight: 800, color: '#333' }}>리포터 모집</h4>
              <div style={{ background: '#2E7D52', color: '#fff', padding: '0.5rem 0', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>신청하기</div>
            </div>
          </Link>
        </div>

        {/* 구독 신청 */}
        <div className="np-sidebar-item">
          <Link href="/subscribe" style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{ background: '#fff', border: '1px solid #2E7D52', padding: '1rem 0.8rem', textAlign: 'center', borderRadius: '4px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '0.6rem', color: '#2E7D52', fontWeight: 700, marginBottom: '0.2rem' }}>{SITE_CONFIG.labels.subscription}</div>
              <h4 style={{ margin: '0 0 0.8rem', fontSize: '0.85rem', fontWeight: 800, color: '#333' }}>구독 신청</h4>
              <div style={{ background: '#2E7D52', color: '#fff', padding: '0.5rem 0', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>신청하기</div>
            </div>
          </Link>
        </div>

        {/* 기사 제보 */}
        <div className="np-sidebar-item">
          <Link href="/report" style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{ background: '#fff', border: '1px solid #2E7D52', padding: '1rem 0.8rem', textAlign: 'center', borderRadius: '4px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '0.6rem', color: '#2E7D52', fontWeight: 700, marginBottom: '0.2rem' }}>{SITE_CONFIG.labels.report}</div>
              <h4 style={{ margin: '0 0 0.8rem', fontSize: '0.85rem', fontWeight: 800, color: '#333' }}>기사 제보</h4>
              <div style={{ background: '#2E7D52', color: '#fff', padding: '0.5rem 0', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>제보하기</div>
            </div>
          </Link>
        </div>
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
      <div className="np-bottom-latest">
        <SectionHeader title="최신 기사" href="/region" />
        <div className="np-bottom-latest-grid">
          {latest.map((art) => (
            <Link key={art.id} href={`/article/${art.slug ?? art.id}`} className="np-bottom-latest-item">
              <span className="np-bottom-latest-title">{art.title}</span>
              <ArticleDate dateStr={art.created_at} viewCount={art.view_count} />
            </Link>
          ))}
        </div>
      </div>

      {/* 오피니언/칼럼 + 기획연재 */}
      <div className="np-bottom-split">
        <div className="np-bottom-split-section">
          <SectionHeader title="오피니언 · 칼럼" href="/column" />
          {columns.length > 0 ? columns.map((art) => (
            <Link key={art.id} href={`/article/${art.slug ?? art.id}`} className="np-bottom-split-item">
              <ArticleImg src={art.image_url} alt={art.title} width={70} height={52} />
              <div>
                <h5 style={{ margin: '0 0 0.2rem', fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.35, wordBreak: 'keep-all' }}>{art.title}</h5>
                <ArticleDate dateStr={art.created_at} viewCount={art.view_count} />
              </div>
            </Link>
          )) : <p style={{ color: '#ccc', fontSize: '0.82rem' }}>등록된 칼럼이 없습니다.</p>}
        </div>
        {planned.length > 0 && (
          <div className="np-bottom-split-section">
            <SectionHeader title="기획 · 연재" href="/region" />
            {planned.map((art) => (
              <Link key={art.id} href={`/article/${art.slug ?? art.id}`} className="np-bottom-split-item">
                <ArticleImg src={art.image_url} alt={art.title} width={70} height={52} />
                <div>
                  <h5 style={{ margin: '0 0 0.2rem', fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.35, wordBreak: 'keep-all' }}>{art.title}</h5>
                  <ArticleDate dateStr={art.created_at} viewCount={art.view_count} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 포토뉴스: 이미지 있는 기사만, 2개 이상일 때 노출 */}
      {photos.filter(a => !a.image_url.includes('fallback') && !a.image_url.includes('default')).length >= 2 && (
        <div className="np-bottom-photos">
          <SectionHeader title="포토 뉴스" href="/region" />
          <div className="np-bottom-photos-grid">
            {photos.filter(a => !a.image_url.includes('fallback') && !a.image_url.includes('default')).map((art) => (
              <Link key={art.id} href={`/article/${art.slug ?? art.id}`} className="np-bottom-photo-item">
                <div className="np-bottom-photo-img-wrap" style={{ background: '#f5f5f5' }}>
                  <Image src={art.image_url} alt={art.title} fill style={{ objectFit: 'cover' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <p className="np-bottom-photo-title">{art.title}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================
   MAIN EXPORT
   ========================================= */
export function NewspaperMain({ articles, popularArticles, farmPrices, sidebarAd, settings, featured }: { articles: any[]; popularArticles: any[]; farmPrices: any[]; sidebarAd: any; settings: any; featured?: any }) {
  return (
    <div className="container np-main-container">
      {/* 3-column layout */}
      <div className="np-three-col">
        {/* Mobile order: Center(1) -> Left(2) -> Right(3) */}
        <div className="np-col-center">
          {/* 모바일 띠배너 슬롯 — 새 이미지 업로드 후 복원 예정 */}
          <CenterMain articles={articles} featured={featured} />
        </div>
        
        <div className="np-col-left">
          <LeftSidebar popularArticles={popularArticles} articles={articles} />
        </div>

        <div className="np-col-right">
          <RightSidebar farmPrices={farmPrices} sidebarAd={sidebarAd} />
        </div>
      </div>

      <RegionalNews articles={articles} />

      <BottomSections articles={articles} />

    </div>
  );
}
