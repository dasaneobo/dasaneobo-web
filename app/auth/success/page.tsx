import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE_CONFIG } from '@/constants/siteConfig';

export const metadata = {
  title: `인증 완료 | ${SITE_CONFIG.name}`,
};

export default function AuthSuccessPage() {
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
            background: 'var(--primary-light)', 
            color: 'var(--primary-dark)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 1.5rem',
            fontSize: '2rem'
          }}>
            ✓
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#111', marginBottom: '0.8rem' }}>
            이메일 인증이 완료되었습니다
          </h1>
          <h2 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', fontWeight: 700, marginBottom: '2rem' }}>
            다산어보에 가입해주셔서 감사합니다
          </h2>
          <p style={{ color: '#555', lineHeight: 1.6, marginBottom: '2.5rem', fontSize: '1.05rem', wordBreak: 'keep-all' }}>
            아래 버튼을 눌러 로그인하시면 다산어보의 모든 콘텐츠를 이용하실 수 있습니다.
          </p>
          <Link href="/login?verified=true" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%',
              padding: '1.2rem',
              background: 'var(--primary-dark)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}>
              로그인하기
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
