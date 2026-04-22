'use client';

import Link from 'next/link';
import { Search, LogIn, UserPlus, BookOpen, FileText, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
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

    // Placeholder weather
    setWeather({ temp: '18°C', desc: '맑음' });

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

  const navCategories: { label: string; href: string; region?: boolean; accent?: boolean }[] = [
    { label: '전체기사', href: '/region' },
    { label: '강진', href: '/gangjin', region: true },
    { label: '고흥', href: '/goheung', region: true },
    { label: '보성', href: '/boseong', region: true },
    { label: '장흥', href: '/jangheung', region: true },
    { label: '행정', href: '/administration' },
    { label: '정치', href: '/politics' },
    { label: '경제', href: '/economy' },
    { label: '사회', href: '/society' },
    { label: '문화', href: '/culture' },
    { label: '칼럼', href: '/column' },
    { label: '기획연재', href: '/region' },
    { label: '포토', href: '/region' },
    { label: '기사제보', href: '/admin/report', accent: true },
  ];

  return (
    <header className="np-header">
      {/* === TOP BAR: Date + Weather + Auth === */}
      <div className="np-topbar">
        <div className="container np-topbar-inner">
          <div className="np-topbar-left">
            <span className="np-date">{currentDate}</span>
            {weather && (
              <span className="np-weather">
                <span className="np-weather-icon">☀</span>
                {weather.temp} {weather.desc}
              </span>
            )}
          </div>
          <div className="np-topbar-right">
            {userProfile ? (
              <>
                <span className="np-user-name">{userProfile.name} 님</span>
                {(userProfile.role === 'admin' || userProfile.role === 'editor') && (
                  <Link href="/admin" className="np-topbar-link">
                    <BookOpen size={12} /> 편집국
                  </Link>
                )}
                {(userProfile.role === 'admin' || userProfile.role === 'editor' || userProfile.role === 'reporter') && (
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
                <Link href="/login" className="np-topbar-link">
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
            <Link href="/ad-apply">
              <div style={{ position: 'relative', width: '380px', height: '60px', overflow: 'hidden', borderRadius: '4px', border: '1px solid #eee' }}>
                <Image src="/ads/gold_fishery.png" alt="황금어장 광고" fill style={{ objectFit: 'cover' }} />
              </div>
            </Link>
          </div>

          <Link href="/" className="np-logo-link">
            <h1 className="np-logo-title">다산어보</h1>
            <div className="np-logo-sub">DASANEOBO · 전남 독립언론 · Local Media</div>
          </Link>

          <div className="np-logo-right">
            <form onSubmit={handleSearch} className="np-search-form" style={{ marginRight: '1rem' }}>
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
              <Link href="/admin/report" className="np-report-btn">
                기사 제보
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
          padding: 1.2rem 0;
          border-bottom: 1px solid #ddd;
        }
        .np-logo-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .np-logo-link {
          text-decoration: none;
          text-align: center;
          flex-shrink: 0;
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
          font-size: 0.6rem;
          color: #888;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        /* Search */
        .np-logo-left {
          display: flex;
          align-items: center;
          min-width: 380px;
        }
        @media (max-width: 1024px) {
          .np-logo-left, .np-logo-right { min-width: auto; }
          .np-logo-left { display: none; } /* Hide ad on smaller tablets to keep logo centered */
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
          width: 160px;
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

        /* Right area */
        .np-logo-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 380px;
          justify-content: flex-end;
        }
        .np-logo-btns {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .np-subscribe-btn {
          background: #2E7D52;
          color: white;
          border: none;
          padding: 0.4rem 1rem;
          border-radius: 3px;
          font-size: 0.8rem;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          font-family: inherit;
          text-align: center;
          width: 100px;
          display: block;
        }
        .np-report-btn {
          background: white;
          color: #2E7D52;
          border: 1.5px solid #2E7D52;
          padding: 0.35rem 1rem;
          border-radius: 3px;
          font-size: 0.8rem;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          font-family: inherit;
          text-align: center;
          width: 100px;
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
        @media (max-width: 768px) {
          .np-topbar { display: none; }
          .np-logo-title { font-size: 2rem; }
          .np-logo-inner { flex-direction: column; gap: 0.8rem; text-align: center; }
          .np-logo-left { min-width: unset; justify-content: center; }
          .np-search-input { width: 120px; }
          .np-logo-right { flex-direction: row; min-width: unset; align-items: center; justify-content: center; }
          .np-logo-right a { width: auto; }
          .np-logo-section { padding: 0.8rem 0; }
        }
      `}</style>
    </header>
  );
}
