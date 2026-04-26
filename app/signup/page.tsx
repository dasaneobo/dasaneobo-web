'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [recommender, setRecommender] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms || !agreedToPrivacy) {
      alert('이용약관 및 개인정보 처리방침에 동의해 주세요.');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name
        },
        emailRedirectTo: `${window.location.origin}/auth/confirm`
      }
    });

    if (error) {
      alert('회원가입 실패: ' + error.message);
    } else {
      if (data.user) {
        await supabase.from('profiles').insert([{
          id: data.user.id,
          email: email,
          name: name,
          recommender: recommender,
          role: 'subscriber'
        }]);
      }
      alert('회원가입이 접수되었습니다! 입력하신 이메일로 발송된 인증 링크를 클릭하여 가입을 완료해 주세요.');
      router.push('/login');
    }
    setLoading(false);
  };

  return (
    <main style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Header />
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5rem 0' }}>
        <div style={{ 
          background: 'white', 
          padding: '3rem', 
          borderRadius: '16px', 
          width: '100%', 
          maxWidth: '450px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
        }}>
          <h1 style={{ textAlign: 'center', margin: '0 0 0.5rem', fontSize: '1.8rem', fontWeight: 800 }}>다산어보 회원가입</h1>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem', fontSize: '0.9rem' }}>지역 소식을 함께 나누는 커뮤니티에 참여하세요.</p>

          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 600 }}>이름 (필명)</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 홍길동 기자"
                required
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 600 }}>이메일 주소</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="인증 가능한 이메일을 입력하세요"
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

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 600 }}>추천인 성함 (선택)</label>
              <input 
                type="text" 
                value={recommender}
                onChange={(e) => setRecommender(e.target.value)}
                placeholder="추천해주신 분이 있다면 적어주세요"
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
              />
            </div>

            <div style={{ marginTop: '0.5rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
                <input 
                  type="checkbox" 
                  id="terms" 
                  checked={agreedToTerms} 
                  onChange={(e) => setAgreedToTerms(e.target.checked)} 
                  style={{ cursor: 'pointer' }}
                />
                <label htmlFor="terms" style={{ fontSize: '0.85rem', color: '#444', cursor: 'pointer' }}>
                  <Link href="/terms" style={{ color: 'var(--primary-dark)', textDecoration: 'underline' }}>이용약관</Link>에 동의합니다. (필수)
                </label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  id="privacy" 
                  checked={agreedToPrivacy} 
                  onChange={(e) => setAgreedToPrivacy(e.target.checked)} 
                  style={{ cursor: 'pointer' }}
                />
                <label htmlFor="privacy" style={{ fontSize: '0.85rem', color: '#444', cursor: 'pointer' }}>
                  <Link href="/privacy" style={{ color: 'var(--primary-dark)', textDecoration: 'underline' }}>개인정보 처리방침</Link>에 동의합니다. (필수)
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{
                marginTop: '1.5rem',
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
              {loading ? '가입 처리 중...' : '회원가입 신청'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.9rem', color: '#666' }}>
            이미 계정이 있으신가요? <Link href="/login" style={{ color: 'var(--primary-dark)', fontWeight: 'bold', textDecoration: 'none' }}>로그인하기</Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
