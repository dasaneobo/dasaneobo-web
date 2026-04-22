'use client';

import Link from 'next/link';
import { Search, Menu, User, BookOpen, LogOut, LogIn, FileText, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  useEffect(() => {
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

  // Reordered categories based on strategy #2
  const categories = ['지역별', '강진', '보성', '장흥', '고흥', '리포터 수첩', '행정', '정치', '경제', '사회', '문화', '칼럼'];

  return (
    <header className="app-header">
      {/* Top Banner CTA (Strategy #3) */}
      <div style={{ background: '#1a1a1a', color: '#fff', fontSize: '0.65rem', padding: '0.4rem 0', textAlign: 'center', wordBreak: 'keep-all' }}>
        지금 <strong>다산어보 정기구독자</strong>가 되어 지역의 변화를 함께 만드세요! <Link href="/subscribe" style={{ color: 'var(--primary)', marginLeft: '10px', fontWeight: 700, whiteSpace: 'nowrap' }}>구독 신청하기 →</Link>
      </div>

      <div className="container header-container" style={{
        padding: '0.8rem 0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Menu size={28} style={{ cursor: 'pointer', color: '#333' }} />
          <div className="desktop-search" style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #ddd',
            padding: '0.3rem 0.6rem',
            borderRadius: '4px',
            background: '#f8f9fa'
          }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
              <input 
                type="text" 
                placeholder="검색" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '80px', fontSize: '0.8rem' }}
              />
              <button type="submit" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Search size={14} style={{ color: '#666' }} />
              </button>
            </form>
          </div>
        </div>

        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 className="header-logo" style={{ 
              margin: 0, 
              color: 'var(--primary-dark)',
              fontFamily: '"Nanum Myeongjo", serif',
              fontWeight: 900,
              letterSpacing: '-1.5px'
            }}>
              다산어보
            </h1>
            <span className="desktop-only" style={{ fontSize: '0.65rem', color: '#666', letterSpacing: '3px', textTransform: 'uppercase' }}>Local Media Transparency</span>
          </div>
        </Link>

        {/* Action Area (Strategy #3) */}
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {userProfile ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', paddingRight: '1rem', borderRight: '1px solid #eee' }}>
               <div style={{ textAlign: 'right' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end' }}>
                   <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#333' }}>{userProfile.name} 님</div>
                   <Link href="/profile" style={{ fontSize: '0.65rem', color: '#888', textDecoration: 'none', border: '1px solid #ddd', padding: '1px 5px', borderRadius: '4px' }}>정보수정</Link>
                 </div>
                 <div style={{ fontSize: '0.65rem', color: 'var(--primary-dark)', fontWeight: 600 }}>
                   {userProfile.role === 'admin' ? '최고관리자' : userProfile.role === 'editor' ? '편집국 데스크' : userProfile.role === 'reporter' ? '지역 리포터' : '독자 회원'}
                 </div>
               </div>
               
               {/* Admin/Editor Links */}
               {(userProfile.role === 'admin' || userProfile.role === 'editor') && (
                 <Link href="/admin" style={{ textDecoration: 'none', color: '#059669', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: 700, background: '#e6fffa', padding: '0.4rem 0.8rem', borderRadius: '4px' }}>
                   <BookOpen size={16} /> 편집국
                 </Link>
               )}
               {(userProfile.role === 'admin' || userProfile.role === 'editor' || userProfile.role === 'reporter') && (
                 <Link href="/admin/new" style={{ textDecoration: 'none', color: '#333', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: 700, background: '#f8f9fa', padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid #ddd' }}>
                   <FileText size={16} /> 기사작성
                 </Link>
               )}
               
               <button onClick={handleLogout} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#888', fontSize: '0.75rem' }}>로그아웃</button>
            </div>
          ) : (
            <Link href="/login" style={{ fontSize: '0.85rem', color: '#666', textDecoration: 'none', marginRight: '0.5rem' }}>로그인</Link>
          )}
          
          <Link href="/admin/report" style={{ textDecoration: 'none' }}>
            <button className="header-mobile-btn" style={{ 
              background: 'var(--primary-dark)', 
              color: 'white', 
              border: 'none', 
              padding: '0.4rem 0.6rem', 
              borderRadius: '4px', 
              fontSize: '0.75rem', 
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 3px 0 #047857',
              whiteSpace: 'nowrap'
            }}>
              마을제보
            </button>
          </Link>
          <Link href="/subscribe" style={{ textDecoration: 'none' }}>
            <button className="header-mobile-btn" style={{ 
              background: '#ef4444', // Red for CTA
              color: 'white', 
              border: 'none', 
              padding: '0.4rem 0.6rem', 
              borderRadius: '4px', 
              fontSize: '0.75rem', 
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 3px 0 #b91c1c',
              whiteSpace: 'nowrap'
            }}>
              구독 신청
            </button>
          </Link>
        </div>
      </div>
      
      <style jsx>{`
        .header-logo { font-size: 2.4rem; }
        @media (max-width: 768px) {
          .header-logo { font-size: 1.5rem; }
          .header-actions { gap: 0.5rem !important; }
        }
        @global {
          button.header-mobile-btn {
            width: auto !important;
            min-height: auto !important;
            min-width: auto !important;
          }
        }
      `}</style>
      
      {/* Category Navigation Bar */}
      <div style={{ background: '#fff', borderTop: '1px solid #eee' }}>
        <div className="container">
          <ul style={{
            display: 'flex',
            listStyle: 'none',
            justifyContent: 'flex-start',
            margin: 0,
            padding: '0',
            fontSize: '0.95rem',
            fontWeight: 700,
            color: '#333',
            whiteSpace: 'nowrap',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch'
          }}>
            {categories.map((cat, idx) => {
              const categoryLinks: { [key: string]: string } = {
                '지역별': '/region',
                '강진': '/gangjin',
                '보성': '/boseong',
                '장흥': '/jangheung',
                '고흥': '/goheung',
                '리포터 수첩': '/reporter',
                '행정': '/administration',
                '정치': '/politics',
                '경제': '/economy',
                '사회': '/society',
                '문화': '/culture',
                '칼럼': '/column'
              };
              return (
                <Link key={idx} href={categoryLinks[cat] || '#'} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <li style={{ 
                    padding: '1rem 1.2rem', 
                    cursor: 'pointer',
                    color: idx < 5 ? 'var(--primary-dark)' : '#333', // Highlight region menus
                    borderBottom: '3px solid transparent',
                    transition: 'all 0.2s'
                  }} 
                  onMouseEnter={(e) => e.currentTarget.style.borderBottom = '3px solid var(--primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderBottom = '3px solid transparent'}
                  >
                    {cat}
                  </li>
                </Link>
              );
            })}
          </ul>
        </div>
      </div>
    </header>
  );
}

