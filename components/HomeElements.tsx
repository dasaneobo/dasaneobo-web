'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const SLIDES = [
  {
    id: 1,
    title: '강진군, 청자 축제 성료... 경제 파급효과 100억 기대',
    region: '강진',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=1200&auto=format&fit=crop',
    badgeClass: 'badge-gangjin'
  },
  {
    id: 2,
    title: '보성군, 녹차 산업 스마트화 추진... 세계 시장 공략',
    region: '보성',
    image: 'https://images.unsplash.com/photo-1594494424759-645688a22bc1?q=80&w=1200&auto=format&fit=crop',
    badgeClass: 'badge-boseong'
  },
  {
    id: 3,
    title: '장흥군, 정남진 수산물 시장 현대화 완료',
    region: '장흥',
    image: 'https://images.unsplash.com/photo-1534939561126-30219672824a?q=80&w=1200&auto=format&fit=crop',
    badgeClass: 'badge-jangheung'
  },
  {
    id: 4,
    title: '고흥군, 나로우주센터 관광 벨트 조성 본격화',
    region: '고흥',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    badgeClass: 'badge-goheung'
  }
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-slider">
      {SLIDES.map((slide, index) => (
        <div 
          key={slide.id}
          className="hero-slide"
          style={{ 
            backgroundImage: `url(${slide.image})`,
            opacity: index === current ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            zIndex: index === current ? 1 : 0
          }}
        >
          <div className="hero-overlay" />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <span style={{ 
              padding: '0.4rem 0.8rem', 
              borderRadius: '20px', 
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '1rem',
              display: 'inline-block'
            }} className={slide.badgeClass}>
              {slide.region} TOP NEWS
            </span>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', maxWidth: '800px' }}>
              {slide.title}
            </h2>
          </div>
        </div>
      ))}
      <div style={{ 
        position: 'absolute', 
        bottom: '2rem', 
        right: '2rem', 
        zIndex: 10,
        display: 'flex',
        gap: '0.5rem'
      }}>
        {SLIDES.map((_, i) => (
          <div 
            key={i}
            onClick={() => setCurrent(i)}
            style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              background: i === current ? 'var(--primary)' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer'
            }}
          />
        ))}
      </div>
    </div>
  );
}

import { supabase } from '@/lib/supabase';
import { BarChart3, Users, HandCoins, TreePalm, ShieldCheck, PieChart, TrendingUp, Info, CloudSun, Thermometer, ShoppingBag, Tags, Newspaper, ExternalLink, MapPin } from 'lucide-react';

export function InfographicDashboard({ settings }: { settings?: any }) {
  const [selectedRegion, setSelectedRegion] = useState('강진');
  const [agriPrices, setAgriPrices] = useState<any[]>([]);
  const [localNews, setLocalNews] = useState<any[]>([]);

  useEffect(() => {
    const fetchPrices = async () => {
      const { data } = await supabase
        .from('farm_prices')
        .select('*')
        .order('item_name', { ascending: true });
      if (data) setAgriPrices(data);
    };

    const fetchNews = async () => {
      const { data } = await supabase
        .from('local_news')
        .select('*')
        .order('pub_date', { ascending: false });
      if (data) setLocalNews(data);
    };

    fetchPrices();
    fetchNews();
  }, []);

  const filteredNews = localNews.filter(n => n.region === selectedRegion).slice(0, 5);

  return (
    <section style={{ margin: '3rem 0', background: '#f9fafb', padding: '2.5rem', borderRadius: '12px', border: '1px solid #eee' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#111' }}>실시간 지역 데이터 대시보드</h3>
        <p style={{ margin: '0.4rem 0 0', fontSize: '0.9rem', color: '#666' }}>다산어보가 전하는 4개 권역 최신 소식과 물가 정보입니다.</p>
      </div>

      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Left: Regional News */}
        <div style={{ background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Newspaper size={18} color="var(--primary-dark)" />
              <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>지역 뉴스</span>
            </div>
            
            {/* Region Filters */}
            <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto' }}>
              {['강진', '고흥', '보성', '장흥'].map(region => (
                <button 
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  style={{ 
                    padding: '0.4rem 0.8rem', borderRadius: '99px', border: '1px solid', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                    borderColor: selectedRegion === region ? 'var(--primary-dark)' : '#f1f5f9',
                    background: selectedRegion === region ? 'var(--primary-dark)' : '#f8fafc',
                    color: selectedRegion === region ? 'white' : '#64748b'
                  }}
                >
                  {region}군
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {filteredNews.length > 0 ? filteredNews.map((news, i) => (
              <a 
                key={i} 
                href={news.link} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderRadius: '8px', border: '1px solid #f1f5f9', background: '#fcfcfc', textDecoration: 'none', transition: 'all 0.2s'
                }}
                className="news-hover-item"
              >
                <div style={{ flex: 1, marginRight: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.65rem', padding: '2px 6px', background: '#e5e7eb', color: '#4b5563', borderRadius: '4px', fontWeight: 700 }}>외부뉴스</span>
                    <span style={{ fontSize: '0.75rem', color: '#9ba3af' }}>{news.source} · {new Date(news.pub_date).toLocaleDateString()}</span>
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1f2937', lineHeight: '1.4' }}>{news.title}</div>
                </div>
                <ExternalLink size={18} color="#cbd5e1" />
              </a>
            )) : (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>
                <Newspaper size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <p>표시할 뉴스가 없습니다. 1시간마다 자동 갱신됩니다.</p>
              </div>
            )}
          </div>
          <div style={{ marginTop: '1.5rem', fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center' }}>
            네이버 지역 뉴스 결과 (1시간 주기 자동 갱신)
          </div>
        </div>

        {/* Right: Agri Prices */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: 'white', border: '1px solid #ddd', padding: '1.5rem', borderRadius: '12px', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem', color: '#111', justifyContent: 'space-between' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <ShoppingBag size={18} color="var(--primary-dark)" /> <span style={{ fontWeight: 800 }}>오늘의 농산물 가격</span>
               </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.8rem' }}>
              {(agriPrices.length > 0 ? agriPrices : [
                { item_name: '쌀', price: '52400', diff: '1200', unit: '20kg' },
                { item_name: '배추', price: '4500', diff: '-300', unit: '1포기' },
                { item_name: '마늘', price: '12500', diff: '0', unit: '1kg' },
                { item_name: '고구마', price: '8900', diff: '400', unit: '1kg' },
              ]).slice(0, 5).map((p, i) => {
                const diffNum = parseInt(p.diff || '0');
                return (
                  <div key={i} style={{ padding: '0.8rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.3rem' }}>{p.item_name} ({p.unit})</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>{parseInt(p.price).toLocaleString()}원</span>
                      <span style={{ fontSize: '0.75rem', color: diffNum > 0 ? '#ef4444' : diffNum < 0 ? '#3b82f6' : '#999', fontWeight: 700 }}>
                        {diffNum > 0 ? '▲' : diffNum < 0 ? '▼' : '-'} {Math.abs(diffNum).toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', fontSize: '0.65rem', color: '#94a3b8', lineHeight: '1.4' }}>
              출처: KAMIS (농산물유통정보)<br />
              광주 각화동 경락가 매일 09시 기준
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 992px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
        .news-hover-item:hover { border-color: var(--primary); background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.03); transform: translateX(4px); }
      `}</style>
    </section>
  );
}

export function TransparencyBanner({ settings }: { settings?: any }) {
  const donation = settings?.donation_amount || '12,450,000';
  const subscribers = settings?.subscriber_count || '4,521';

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, var(--primary-dark), #064e3b)', 
      color: 'white', 
      padding: '2rem', 
      borderRadius: '12px',
      position: 'relative',
      overflow: 'hidden',
      marginTop: '2rem'
    }}>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <ShieldCheck size={24} color="var(--primary)" />
          <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>유리알 보도원칙</h4>
        </div>
        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', opacity: 0.9, marginBottom: '1.5rem', whiteSpace: 'pre-line' }}>
          강진·고흥·보성·장흥의 이야기,{"\n"}
          우리가 직접 씁니다.{"\n\n"}
          광고주도, 보조금도, 큰손도 없습니다.{"\n"}
          오직 구독자 여러분의 힘으로 운영되는{"\n"}
          독립 지역 언론입니다.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', opacity: 0.7, marginBottom: '0.3rem' }}>누적 독립언론 기금</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>₩{donation}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', opacity: 0.7, marginBottom: '0.3rem' }}>정기 구독자 수</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{subscribers}명</div>
          </div>
        </div>
      </div>
      <PieChart size={180} style={{ position: 'absolute', right: '-40px', bottom: '-40px', opacity: 0.1, color: 'white' }} />
    </div>
  );
}

export function NewsTicker() {
  const [headlines, setHeadlines] = useState<string[]>([]);

  useEffect(() => {
    const fetchHeadlines = async () => {
      const { data } = await supabase
        .from('articles')
        .select('title, category')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(8);

      if (data && data.length > 0) {
        setHeadlines(data.map(a => `[${a.category}] ${a.title}`));
      } else {
        setHeadlines([
          "[안내] 다산어보 뉴스 플랫폼이 정식 오픈하였습니다.",
          "[모집] 주민 리포터 1기 활동가를 선발합니다. 기사작성 메뉴를 확인하세요."
        ]);
      }
    };
    fetchHeadlines();
  }, []);

  return (
    <div className="ticker-container">
      <div className="ticker-content">
        {headlines.map((item, i) => (
          <span key={i} className="ticker-item">{item}</span>
        ))}
        {/* Duplicate for seamless loop */}
        {headlines.map((item, i) => (
          <span key={`dup-${i}`} className="ticker-item">{item}</span>
        ))}
      </div>
    </div>
  );
}

