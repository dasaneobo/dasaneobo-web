'use client';

import Link from 'next/link';
import { SITE_CONFIG } from '@/constants/siteConfig';

export default function Footer() {
  return (
    <footer className="np-footer">
      {/* === SITE MAP SECTION === */}
      <div className="np-footer-sitemap">
        <div className="container">
          <div className="np-footer-grid">
            {/* Brand */}
            <div className="np-footer-brand">
              <h3 className="np-footer-logo">{SITE_CONFIG.name}</h3>
              <p className="np-footer-tagline" dangerouslySetInnerHTML={{ __html: SITE_CONFIG.description.replace(/\. /g, '.<br />') }} />
            </div>

            {/* 권역 뉴스 */}
            <div>
              <h4 className="np-footer-heading">4대 권역</h4>
              <ul className="np-footer-links">
                <li><Link href="/gangjin">강진군 소식</Link></li>
                <li><Link href="/goheung">고흥군 소식</Link></li>
                <li><Link href="/boseong">보성군 소식</Link></li>
                <li><Link href="/jangheung">장흥군 소식</Link></li>
              </ul>
            </div>

            {/* 분야별 */}
            <div>
              <h4 className="np-footer-heading">분야별 뉴스</h4>
              <ul className="np-footer-links">
                <li><Link href="/administration">행정</Link></li>
                <li><Link href="/politics">정치</Link></li>
                <li><Link href="/economy">경제</Link></li>
                <li><Link href="/society">사회</Link></li>
                <li><Link href="/culture">문화</Link></li>
                <li><Link href="/column">칼럼/오피니언</Link></li>
              </ul>
            </div>

            {/* 서비스 */}
            <div>
              <h4 className="np-footer-heading">서비스</h4>
              <ul className="np-footer-links">
                <li><Link href="/subscribe">구독 신청</Link></li>
                <li><Link href="/report">기사 제보</Link></li>
                <li><Link href="/reporter-apply">리포터 신청</Link></li>
                <li><Link href="/ad-apply">광고 문의</Link></li>
                <li><Link href="/search">기사 검색</Link></li>
              </ul>
            </div>

            {/* 연락처 */}
            <div>
              <h4 className="np-footer-heading">연락처</h4>
              <ul className="np-footer-links">
                <li>📍 {SITE_CONFIG.contact.address}</li>
                <li>📞 {SITE_CONFIG.contact.phone}</li>
                <li>📠 {SITE_CONFIG.contact.fax}</li>
                <li>✉ {SITE_CONFIG.contact.email}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* === LEGAL SECTION === */}
      <div className="np-footer-legal">
        <div className="container">
          <div className="np-footer-legal-info">
            <p>
              <strong>{SITE_CONFIG.name}</strong> · 등록번호: {SITE_CONFIG.contact.registrationNumber} · 등록일: {SITE_CONFIG.contact.registrationDate} · 
              발행인: {SITE_CONFIG.contact.publisher} · 편집인: {SITE_CONFIG.contact.editor} · 청소년보호책임자: {SITE_CONFIG.contact.youthProtector} · 
              법인명: {SITE_CONFIG.contact.corporation} · 제호: {SITE_CONFIG.name}
            </p>
            <p>
              {SITE_CONFIG.contact.address} · 대표전화: {SITE_CONFIG.contact.phone} · 팩스: {SITE_CONFIG.contact.fax} · 
              이메일: {SITE_CONFIG.contact.email}
            </p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.72rem', opacity: 0.7 }}>
              다산어보 모든 콘텐츠(영상, 기사, 사진)는 저작권법의 보호를 받는 바, 무단 전재와 복사, 배포 등을 금합니다.
            </p>
          </div>
          <div className="np-footer-legal-links">
            <Link href="/ethics">윤리규정</Link>
            <Link href="/terms">이용약관</Link>
            <Link href="/privacy" className="np-highlight">개인정보처리방침</Link>
            <Link href="/refund-policy">환불정책</Link>
            <Link href="/youth">청소년보호정책</Link>
            <Link href="/copyright">저작권보호정책</Link>
            <Link href="/no-email-collect">이메일무단수집거부</Link>
          </div>
          <div className="np-footer-copyright">
            Copyright © {new Date().getFullYear()} {SITE_CONFIG.name}({SITE_CONFIG.englishName}). All rights reserved.
          </div>
        </div>
      </div>

      <style jsx>{`
        .np-footer {
          background: #1a1a1a;
          color: #aaa;
          margin-top: 4rem;
          font-family: 'Noto Sans KR', sans-serif;
        }

        /* Sitemap */
        .np-footer-sitemap {
          padding: 3.5rem 0 2.5rem;
          border-bottom: 1px solid #333;
        }
        .np-footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
          gap: 2.5rem;
        }
        @media (max-width: 900px) {
          .np-footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 480px) {
          .np-footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
          }
          .np-footer-brand {
            grid-column: span 2;
          }
        }

        .np-footer-logo {
          font-family: 'Noto Serif KR', serif;
          font-size: 1.8rem;
          font-weight: 900;
          color: #2E7D52;
          margin: 0 0 0.8rem;
          letter-spacing: -1px;
        }
        .np-footer-tagline {
          font-size: 0.82rem;
          color: #888;
          line-height: 1.7;
          margin: 0 0 1.2rem;
        }
        .np-footer-sns {
          display: flex;
          gap: 1rem;
          font-size: 0.72rem;
          font-weight: 700;
          color: #666;
          cursor: pointer;
        }
        .np-footer-sns span:hover { color: #2E7D52; }

        .np-footer-heading {
          font-size: 0.85rem;
          font-weight: 800;
          color: #ddd;
          margin: 0 0 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #333;
          font-family: 'Noto Serif KR', serif;
        }

        .np-footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          font-size: 0.82rem;
        }
        .np-footer-links a {
          color: #888;
          text-decoration: none;
          transition: color 0.15s;
        }
        .np-footer-links a:hover { color: #2E7D52; }

        /* Legal */
        .np-footer-legal {
          padding: 1.5rem 0;
          font-size: 0.75rem;
          color: #666;
        }
        .np-footer-legal-info p {
          line-height: 1.8;
          margin: 0 0 0.3rem;
        }
        .np-footer-legal-info strong { color: #aaa; }
        .np-footer-legal-links {
          display: flex;
          flex-wrap: wrap;
          gap: 1.2rem;
          margin: 1.2rem 0;
          font-size: 0.75rem;
        }
        .np-footer-legal-links a,
        .np-footer-legal-links span {
          color: #777;
          text-decoration: none;
          cursor: pointer;
          transition: color 0.15s;
        }
        .np-footer-legal-links a:hover,
        .np-footer-legal-links span:hover { color: #2E7D52; }
        .np-highlight { font-weight: 700; color: #aaa !important; }
        .np-footer-copyright {
          font-size: 0.72rem;
          color: #555;
          padding-top: 1rem;
          border-top: 1px solid #333;
        }
      `}</style>
    </footer>
  );
}
