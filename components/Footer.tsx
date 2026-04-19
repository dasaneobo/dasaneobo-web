'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#f8f9fa', borderTop: '1px solid #eee', padding: '4rem 0 2rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          {/* Brand Info */}
          <div>
            <h3 style={{ 
              fontSize: '1.8rem', 
              color: 'var(--primary-dark)', 
              fontFamily: '"Nanum Myeongjo", serif', 
              fontWeight: 900, 
              marginBottom: '1rem',
              letterSpacing: '-1px'
            }}>
              다산어보
            </h3>
            <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              지역 미디어의 투명성을 높이고,<br />
              지역 주민의 목소리를 담는<br />
              독립형 지역 기반 뉴스 플랫폼입니다.
            </p>
            <div style={{ display: 'flex', gap: '1.2rem', fontSize: '0.85rem', fontWeight: 700, color: '#666' }}>
              <span style={{ cursor: 'pointer' }}>FACEBOOK</span>
              <span style={{ cursor: 'pointer' }}>INSTAGRAM</span>
              <span style={{ cursor: 'pointer' }}>YOUTUBE</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', color: '#111' }}>주요 링크</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem' }}>
              <li><Link href="/region" style={{ color: '#666', textDecoration: 'none' }}>지역별 뉴스</Link></li>
              <li><Link href="/reporter" style={{ color: '#666', textDecoration: 'none' }}>리포터 수첩</Link></li>
              <li><Link href="/subscribe" style={{ color: '#666', textDecoration: 'none' }}>정기구독 신청</Link></li>
              <li><Link href="/admin/report" style={{ color: '#666', textDecoration: 'none' }}>마을 제보하기</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', color: '#111' }}>고객 지원</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: '#666' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={18} /> 전라남도 강진군 강진읍 오감길
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={18} /> 061-000-0000
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={18} /> contact@dasannews.com
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontSize: '0.85rem', color: '#999' }}>
            © 2026 다산어보(Dasan-Eobo). All rights reserved. 
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#999' }}>
            <span style={{ cursor: 'pointer' }}>이용약관</span>
            <span style={{ cursor: 'pointer', fontWeight: 700 }}>개인정보처리방침</span>
            <span style={{ cursor: 'pointer' }}>청소년보호정책</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
