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
import { BarChart3, Users, HandCoins, TreePalm, ShieldCheck, PieChart, TrendingUp, Info, CloudSun, Thermometer, ShoppingBag, Tags } from 'lucide-react';

export function InfographicDashboard({ settings }: { settings?: any }) {
  // Weather Simulation (Can be connected to API later)
  const weather = { temp: 22, status: '맑음', location: '강진군' };
  
  // Agri Prices (Example items)
  const agriPrices = [
    { name: '햇쌀(20kg)', price: '52,400', diff: '+1,200' },
    { name: '대서마늘(1kg)', price: '6,800', diff: '-200' },
  ];

  return (
    <section style={{ margin: '3rem 0', background: '#f9fafb', padding: '2.5rem', borderRadius: '12px', border: '1px solid #eee' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#111' }}>실시간 지역 데이터 대시보드</h3>
          <p style={{ margin: '0.4rem 0 0', fontSize: '0.9rem', color: '#666' }}>다산어보가 데이터로 본 4개 권역 현황입니다.</p>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#888', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Info size={14} /> 매시간 자동 업데이트
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Weather Card */}
        <div style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', color: 'white', padding: '1.5rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.9 }}>현재 지역 날씨 ({weather.location})</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '0.5rem' }}>{weather.temp}°C</div>
            <div style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CloudSun size={20} /> {weather.status}
            </div>
          </div>
          <Thermometer size={60} style={{ opacity: 0.2 }} />
        </div>

        {/* Agri Price Card */}
        <div style={{ background: 'white', border: '1px solid #ddd', padding: '1.5rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#111' }}>
             <ShoppingBag size={18} /> <span style={{ fontWeight: 800 }}>산지 가격 동향</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {agriPrices.map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: i === 0 ? '1px solid #eee' : 'none', paddingBottom: i === 0 ? '0.5rem' : '0' }}>
                 <span style={{ fontSize: '0.9rem', color: '#555' }}>{p.name}</span>
                 <div>
                   <span style={{ fontWeight: 700 }}>{p.price}원</span>
                   <span style={{ fontSize: '0.75rem', marginLeft: '0.5rem', color: p.diff.startsWith('+') ? '#ef4444' : '#3b82f6' }}>{p.diff}</span>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
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
          <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>유리알 보도 원칙</h4>
        </div>
        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', opacity: 0.9, marginBottom: '1.5rem' }}>
          다산어보는 자본의 논리에 휘둘리지 않는 독립 언론입니다.<br />
          모든 후원금과 운영비는 매월 투명하게 공개됩니다.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', opacity: 0.7, marginBottom: '0.3rem' }}>누적 환원금</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>₩{donation}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', opacity: 0.7, marginBottom: '0.3rem' }}>독자 주주 수</div>
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

