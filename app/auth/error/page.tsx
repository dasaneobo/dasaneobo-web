'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { SITE_CONFIG } from '@/constants/siteConfig';

export default function AuthErrorPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`
      }
    });

    if (error) {
      setMessage({ text: '메일 재발송에 실패했습니다: ' + error.message, isError: true });
    } else {
      setMessage({ text: '인증 메일이 재발송되었습니다. 이메일함을 확인해주세요.', isError: false });
    }
    setLoading(false);
  };

  return (
    <main style={{ minHeight: '100vh', background: '#f5f7fa', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem 1rem' }}>
        <div style={{ 
          background: 'white', 
          padding: '3.5rem 2rem', 
          borderRadius: '16px', 
          width: '100%', 
          maxWidth: '500px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          textAlign: 'center'
        }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            background: '#fff5f5', 
            color: '#c0392b', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 1.5rem',
            fontSize: '2rem'
          }}>
            !
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#111', marginBottom: '1rem' }}>
            인증 링크가 유효하지 않습니다
          </h1>
          <p style={{ color: '#555', lineHeight: 1.6, marginBottom: '2.5rem', fontSize: '1rem', wordBreak: 'keep-all' }}>
            인증 링크가 만료되었거나 이미 사용되었습니다. 아래에 이메일을 입력하시면 인증 메일을 다시 보내드립니다.
          </p>

          <form onSubmit={handleResend} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', textAlign: 'left' }}>
            <div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="가입하신 이메일 주소"
                required
                style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem',
                background: '#444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? '발송 중...' : '인증 메일 재발송'}
            </button>
          </form>

          {message && (
            <div style={{ 
              padding: '1rem', 
              borderRadius: '8px', 
              marginBottom: '2rem',
              background: message.isError ? '#fff5f5' : '#f0faf5',
              color: message.isError ? '#c0392b' : 'var(--primary-dark)',
              border: `1px solid ${message.isError ? '#ffcdcd' : '#ACE1AF'}`,
              fontSize: '0.9rem'
            }}>
              {message.text}
            </div>
          )}

          <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem', fontSize: '0.9rem' }}>
            또는 <Link href="/signup" style={{ color: 'var(--primary-dark)', fontWeight: 'bold', textDecoration: 'none' }}>처음부터 다시 가입하기</Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
