'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, LogIn, UserPlus, BookOpen, FileText, LogOut, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import { SITE_CONFIG } from '@/constants/siteConfig';
import BannerAd from '@/components/ads/BannerAd';

export default function Header() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();
  const [currentDate, setCurrentDate] = useState('');
  const [weather, setWeather] = useState<{ temp: string; desc: string } | null>(null);
  const router = useRouter();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  useEffect(() => {
    // Set current date in Korean newspaper format
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = days[now.getDay()];
    setCurrentDate(`${year}년 ${month}월 ${day}일 (${dayOfWeek}요일)`);

    const fetchWeather = async () => {
      try {
        const res = await fetch(`https://wttr.in/${SITE_CONFIG.location.city}?format=j1`);
        const data = await res.json();
        const current = data.current_condition[0];
        const temp = current.temp_C;
        const desc = current.weatherDesc[0].value;
        
        // 날씨 설명 한글 매핑
        const descMap: { [key: string]: string } = {
          'Sunny': '맑음',
          'Clear': '맑음',
          'Partly cloudy': '구름조금',
          'Cloudy': '흐림',
          'Overcast': '흐림',
          'Mist': '안개',
          'Patchy rain nearby': '곳에 따라 비',
          'Patchy rain possible': '비 가능성',
          'Light rain': '가랑비',
          'Moderate rain': '비',
          'Heavy rain': '강한 비',
          'Thunderstorm': '뇌우',
          'Snow': '눈',
        };
        
        setWeather({ 
          temp: `${temp}°C`, 
          desc: descMap[desc] || desc 
        });
      } catch (err) {
        console.error('Weather fetch error:', err);
        setWeather({ temp: '18°C', desc: '맑음' }); // Fallback
      }
    };

    fetchWeather();

    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase.from('profiles').select('name, role').eq('id', session.user.id).single();
        if (data) setUserProfile(data);
      } else {
        setUserProfile(null);
      }
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navCategories: { label: string; href: string; region?: boolean; accent?: boolean }[] = SITE_CONFIG.categories;

  return (
    <header className="np-header">
      {/* === TOP BAR: Date + Weather + Auth === */}
      <div className="np-topbar">
        <div className="container np-topbar-inner">
          <div className="np-topbar-left">
            <span className="np-date">{currentDate}</span>
            {weather && (
              <span className="np-weather">
                <span className="np-weather-icon">
                  {weather.desc.includes('비') ? '🌧️' : 
                   weather.desc.includes('흐림') ? '☁️' : 
                   weather.desc.includes('눈') ? '❄️' : 
                   weather.desc.includes('구름') ? '⛅' : '☀️'}
                </span>
                {weather.temp} {weather.desc}
              </span>
            )}
          </div>
          <div className="np-topbar-right">
            {userProfile ? (
              <>
                <Link href="/profile" className="np-user-name" style={{ color: '#fff', textDecoration: 'none' }}>
                  {userProfile.name} 님
                </Link>
                {(userProfile.role === 'admin' || userProfile.role === 'editor' || userProfile.role === 'member') && (
                  <Link href="/admin" className="np-topbar-link">
                    <BookOpen size={12} /> 편집국
                  </Link>
                )}
                {(userProfile.role === 'admin' || userProfile.role === 'editor' || userProfile.role === 'reporter' || userProfile.role === 'member') && (
                  <Link href="/admin/new" className="np-topbar-link">
                    <FileText size={12} /> 기사작성
                  </Link>
                )}
                <button onClick={handleLogout} className="np-topbar-link np-topbar-btn">
                  <LogOut size={12} /> 로그아웃
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="np-topbar-link">
                  <LogIn size={12} /> 로그인
                </Link>
                <Link href="/signup" className="np-topbar-link">
                  <UserPlus size={12} /> 회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* === LOGO SECTION === */}
      <div className="np-logo-section">
        <div className="container np-logo-inner">
          <div className="np-logo-left">
            <Link href="/" className="np-logo-link">
              <h1 className="np-logo-title">{SITE_CONFIG.name}</h1>
              <div className="np-logo-sub" style={{ whiteSpace: 'nowrap' }}>
                다산어보 <span className="np-subtitle-hanja">茶山語報</span> — 강진·고흥·보성·장흥 밀착 독립언론
              </div>
            </Link>
          </div>

          <div className="np-mobile-hamburger desktop-hide">
            <button onClick={() => setIsDrawerOpen(true)} className="np-hamburger-btn">
              <Menu size={28} />
            </button>
          </div>

          <div className="np-logo-center">
            <Link href="/" className="np-logo-hanja-link" title="다산어보 한자 제호">
              <Image 
                src="/images/hanja-logo.png" 
                alt="茶山語報" 
                width={200} 
                height={55} 
                className="np-logo-hanja-img"
                priority 
              />
            </Link>
          </div>

          <div className="np-logo-right">
            <form onSubmit={handleSearch} className="np-search-form">
              <input
                type="text"
                placeholder="검색어 입력"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="np-search-input"
              />
              <button type="submit" className="np-search-btn">
                <Search size={16} />
              </button>
            </form>
            <div className="np-logo-btns">
              <Link href="/subscribe" className="np-subscribe-btn">
                구독 신청
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* === MAIN NAVIGATION === */}
      <nav className="np-nav">
        <div className="container">
          <ul className="np-nav-list">
            {navCategories.map((cat, idx) => {
              const isActive = pathname === cat.href || (cat.href !== '/' && pathname.startsWith(cat.href) && cat.href !== '/region');
              return (
                <li key={idx} className={`np-nav-item${idx > 0 ? ' np-nav-divider' : ''}`}>
                  <Link
                    href={cat.href}
                    className={[
                      'np-nav-link',
                      cat.region ? 'np-nav-region' : '',
                      cat.accent ? 'np-nav-accent' : '',
                      isActive ? 'np-nav-active' : '',
                    ].filter(Boolean).join(' ')}
                  >
                    {cat.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* === MOBILE DRAWER === */}
      {isDrawerOpen && (
        <div className="np-mobile-drawer">
          <div className="np-drawer-overlay" onClick={() => setIsDrawerOpen(false)} />
          <div className="np-drawer-content">
            <div className="np-drawer-header">
              <Link href="/subscribe" className="np-subscribe-btn np-drawer-subscribe" onClick={() => setIsDrawerOpen(false)}>
                구독 신청
              </Link>
              <button onClick={() => setIsDrawerOpen(false)} className="np-drawer-close">
                <X size={24} />
              </button>
            </div>
            <ul className="np-drawer-nav">
              {navCategories.map((cat, idx) => (
                <li key={idx} className="np-drawer-nav-item">
                  <Link
                    href={cat.href}
                    className="np-drawer-link"
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 띠배너 광고 슬롯 — 새 이미지 업로드 후 BannerAd 복원 예정
      <BannerAd
        slot="header-bottom"
        fallbackSrc="/ads/banner_leaderboard.png"
        href="/ad-apply"
        alt="광고"
      />
      */}

      <style jsx>{`
        .np-header {
          background: #fff;
          border-bottom: 2px solid #2E7D52;
        }

        /* === TOP BAR === */
        .np-topbar {
          background: #2E7D52;
          color: #fff;
          font-size: 0.72rem;
          padding: 0.35rem 0;
        }
        .np-topbar-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .np-topbar-left {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }
        .np-date { font-family: 'Noto Serif KR', 'Nanum Myeongjo', serif; }
        .np-weather { display: flex; align-items: center; gap: 0.3rem; opacity: 0.9; }
        .np-weather-icon { font-size: 0.9rem; }
        .np-topbar-right {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
        .np-user-name { font-weight: 700; font-size: 0.72rem; }
        .np-topbar-link {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: rgba(255,255,255,0.85);
          text-decoration: none;
          font-size: 0.72rem;
          transition: color 0.15s;
          cursor: pointer;
        }
        .np-topbar-link:hover { color: #fff; }
        .np-topbar-btn {
          background: none;
          border: none;
          padding: 0;
          font-family: inherit;
          cursor: pointer;
        }

        /* === LOGO === */
        .np-logo-section {
          padding: 0.8rem 0;
          border-bottom: 1px solid #ddd;
        }
        .np-logo-inner {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 1rem;
        }
        .np-logo-link {
          text-decoration: none;
          text-align: left;
          display: block;
        }
        .np-logo-title {
          font-family: 'Noto Serif KR', 'Nanum Myeongjo', 'KoPubWorldBatang', serif;
          font-size: 3.2rem;
          font-weight: 900;
          color: #2E7D52;
          letter-spacing: -2px;
          line-height: 1;
          margin: 0 0 0.3rem;
        }
        .np-logo-sub {
          font-size: 0.75rem;
          color: #666;
          letter-spacing: 0px;
          font-weight: 600;
        }
        .np-subtitle-hanja {
          font-size: 0.85em;
          color: rgba(20, 50, 42, 0.7);
          letter-spacing: 0.05em;
          font-family: 'Batang', serif;
        }

        /* Center Hanja Area */
        .np-logo-center {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .np-logo-hanja-link {
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .np-logo-hanja-img {
          height: 48px;
          width: auto;
          object-fit: contain;
        }

        /* Search & Right Area */
        .np-logo-left {
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
        .np-logo-right {
          display: flex;
          align-items: center;
          gap: 1rem;
          justify-content: flex-end;
        }
        .np-search-form {
          display: flex;
          align-items: center;
          border: 1px solid #ccc;
          border-radius: 3px;
          overflow: hidden;
          background: #fafafa;
        }
        .np-search-input {
          border: none;
          background: transparent;
          padding: 0.45rem 0.7rem;
          font-size: 0.85rem;
          outline: none;
          width: 180px;
          font-family: inherit;
        }
        .np-search-btn {
          background: #2E7D52;
          color: white;
          border: none;
          padding: 0.45rem 0.7rem;
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        .np-logo-btns {
          display: flex;
          align-items: center;
        }
        .np-subscribe-btn {
          background: #2E7D52;
          color: white;
          border: none;
          padding: 0.45rem 1.2rem;
          border-radius: 3px;
          font-size: 0.85rem;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          font-family: inherit;
          text-align: center;
          display: block;
        }

        /* === NAVIGATION === */
        .np-nav {
          background: #fff;
          border-top: 3px solid #2E7D52;
          border-bottom: 1px solid #ddd;
        }
        .np-nav-list {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          justify-content: space-between;
        }
        .np-nav-list::-webkit-scrollbar { display: none; }
        .np-nav-item { flex: 1; text-align: center; }
        /* 구분선 */
        .np-nav-divider {
          border-left: 1px solid #e0e0e0;
          margin-left: 0.3rem;
          padding-left: 0.3rem;
        }
        .np-nav-link {
          display: block;
          padding: 0.78rem 0;
          font-size: 0.85rem;
          font-weight: 700;
          color: #333;
          text-decoration: none;
          border-bottom: 3px solid transparent;
          transition: color 0.15s, background 0.15s, border-color 0.15s;
          font-family: 'Noto Serif KR', 'Nanum Myeongjo', serif;
          white-space: nowrap;
          cursor: pointer;
          text-align: center;
        }
        .np-nav-link:hover {
          color: #2E7D52;
          border-bottom-color: #2E7D52;
          background: #f5fdf9;
        }
        /* 현재 페이지 */
        .np-nav-active {
          color: #2E7D52 !important;
          border-bottom-color: #2E7D52 !important;
          background: #f0faf5;
        }
        /* 권역 메뉴 */
        .np-nav-region { color: #2E7D52; font-weight: 800; }
        /* 기사제보 강조 */
        .np-nav-accent {
          color: #c0392b !important;
          font-weight: 800;
        }
        .np-nav-accent:hover {
          background: #fff5f5 !important;
          border-bottom-color: #c0392b !important;
        }

        /* === MOBILE === */
        .desktop-hide { display: none; }
        .np-mobile-hamburger { display: none; }
        
        .np-mobile-drawer { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999; display: flex; }
        .np-drawer-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); }
        .np-drawer-content { position: relative; width: 80%; max-width: 320px; height: 100%; background: #fff; display: flex; flex-direction: column; animation: slideIn 0.3s ease; }
        .np-drawer-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid #eee; }
        .np-drawer-subscribe { width: auto; flex: 1; margin-right: 1rem; padding: 0.6rem; font-size: 0.9rem; }
        .np-drawer-close { background: none; border: none; padding: 0.5rem; cursor: pointer; color: #333; }
        .np-drawer-nav { list-style: none; padding: 0; margin: 0; overflow-y: auto; flex: 1; }
        .np-drawer-nav-item { border-bottom: 1px solid #f5f5f5; }
        .np-drawer-link { display: block; padding: 1rem; font-size: 1rem; font-weight: 700; color: #333; text-decoration: none; }
        
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }

        @media (max-width: 768px) {
          .desktop-hide { display: block; }
          .np-topbar { display: block; padding: 0.2rem 0; }
          .np-topbar-left { display: none; }
          .np-topbar-inner { justify-content: center; }
          .np-topbar-right { gap: 0.6rem; width: 100%; justify-content: center; }
          
          /* Header Layout: 1행(로고/햄버거), 2행(검색) */
          .np-logo-section { padding: 0.5rem 0 !important; border-bottom: none !important; }
          .np-logo-inner { 
            display: grid !important; 
            grid-template-columns: 1fr auto; 
            grid-template-rows: auto auto; 
            gap: 0.8rem 0.5rem !important; 
            align-items: center;
          }
          .np-logo-left { grid-column: 1 / 2; grid-row: 1 / 2; width: 100%; display: flex; align-items: center; }
          .np-logo-link { text-align: left; }
          .np-logo-title { font-size: 1.8rem; margin-bottom: 0.1rem; text-align: left; }
          .np-logo-sub { font-size: 0.55rem; letter-spacing: 0; text-align: left; white-space: normal !important; }
          .np-subtitle-hanja { display: none; }
          
          .np-logo-center { display: none; } /* Hide Hanja on mobile to save space */
          
          .np-mobile-hamburger { grid-column: 2 / 3; grid-row: 1 / 2; display: flex; align-items: center; justify-content: flex-end; }
          .np-hamburger-btn { background: none; border: none; padding: 0.2rem; cursor: pointer; color: #2E7D52; display: flex; align-items: center; }
          
          .np-logo-right { grid-column: 1 / 3; grid-row: 2 / 3; width: 100%; justify-content: center; margin-bottom: 0.2rem; }
          .np-search-form { width: 100%; max-width: none; justify-content: space-between; }
          .np-search-input { width: 100%; padding: 0.4rem 0.6rem; font-size: 0.85rem; }
          .np-search-btn { padding: 0.4rem 0.8rem; }
          
          .np-logo-btns { display: none; } /* Hide subscribe button on mobile header */
          .np-nav { border-top: 1.5px solid #2E7D52 !important; }
          .np-nav-link { padding: 0.45rem 0 !important; font-size: 0.72rem; }
          .np-nav-item { margin-left: 0.1rem; padding-left: 0.1rem; }
        }
      `}</style>
    </header>
  );
}
