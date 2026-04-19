'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Link from 'next/link';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      // 로그인 처리
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert('로그인 실패: ' + error.message);
      } else {
        alert('환영합니다!');
        router.push('/');
        router.refresh();
      }
    } else {
      // 회원가입 처리
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          }
        }
      });

      if (error) {
        alert('회원가입 실패: ' + error.message);
      } else {
        // 프로필 테이블 보완 생성
        if (data.user) {
          await supabase.from('profiles').insert([{
            id: data.user.id,
            email: email,
            name: name,
            role: 'normal' // 최초 가입 시 무조건 일반 회원
          }]);
        }
        alert('회원가입이 완료되었습니다! 로그인해 주세요.');
        setIsLogin(true); // 로그인 화면으로 전환
      }
    }
    setLoading(false);
  };

  return (
    <main style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Header />
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div style={{ 
          background: 'white', 
          padding: '3rem', 
          borderRadius: '16px', 
          width: '100%', 
          maxWidth: '400px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
        }}>
          <h1 style={{ textAlign: 'center', margin: '0 0 2rem', fontSize: '1.8rem', fontWeight: 800 }}>
            {isLogin ? '다산어보 로그인' : '다산어보 회원가입'}
          </h1>

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {!isLogin && (
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 600 }}>이름 (필명)</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: 홍길동 기자"
                  required={!isLogin}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 600 }}>이메일</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 주소를 입력하세요"
                required
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 600 }}>비밀번호 (6자리 이상)</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                required
                minLength={6}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{
                marginTop: '1rem',
                background: 'var(--primary-dark)',
                color: 'white',
                padding: '1rem',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? '처리 중...' : (isLogin ? '로그인' : '회원가입')}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}>
            {isLogin ? (
              <>계정이 없으신가요? <span style={{ color: 'var(--primary-dark)', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setIsLogin(false)}>회원가입</span></>
            ) : (
              <>이미 계정이 있으신가요? <span style={{ color: 'var(--primary-dark)', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setIsLogin(true)}>로그인</span></>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
