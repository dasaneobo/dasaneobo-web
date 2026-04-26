'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('로그인 실패: ' + error.message);
    } else {
      // Check if email is confirmed
      const { data: { user } } = await supabase.auth.getUser();
      if (user && !user.email_confirmed_at) {
        alert('이메일 인증이 완료되지 않았습니다. 메일함을 확인해 주세요.');
        await supabase.auth.signOut();
      } else {
        router.push('/');
        router.refresh();
      }
    }
    setLoading(false);
  };

  return (
    <main style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Header />
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', padding: '2rem 0' }}>
        <div style={{ 
          background: 'white', 
          padding: '3.5rem 3rem', 
          borderRadius: '16px', 
          width: '100%', 
          maxWidth: '420px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h1 style={{ margin: '0 0 0.6rem', fontSize: '2rem', fontWeight: 900, color: '#2E7D52', fontFamily: 'Noto Serif KR, serif' }}>다산어보</h1>
            <p style={{ color: '#888', fontSize: '0.9rem', fontWeight: 500 }}>로그인하여 지역 소식을 만나보세요.</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 700, color: '#444' }}>이메일</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                style={{ width: '100%', padding: '0.9rem', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', transition: 'border-color 0.2s' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#444' }}>비밀번호</label>
                <Link href="/auth/reset-password" style={{ fontSize: '0.75rem', color: '#888', textDecoration: 'none' }}>비밀번호 찾기</Link>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                style={{ width: '100%', padding: '0.9rem', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{
                marginTop: '1.2rem',
                background: '#2E7D52',
                color: 'white',
                padding: '1rem',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: 800,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.9rem', color: '#777', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
            다산어보가 처음이신가요? <Link href="/signup" style={{ color: '#2E7D52', fontWeight: 800, textDecoration: 'none', marginLeft: '0.5rem' }}>회원가입</Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
