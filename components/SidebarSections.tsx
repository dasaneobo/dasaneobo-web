'use client';

import { Users, BookOpen, CreditCard, MessageCircle, Mic, Cpu } from 'lucide-react';

export function CitizenParticipation() {
  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem' }}>
        <Users style={{ color: 'var(--primary-dark)' }} />
        <h3 style={{ margin: 0 }}>비취 리포터</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="data-card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <h4 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageCircle size={18} /> 제보 가이드
          </h4>
          <p style={{ fontSize: '0.85rem', color: '#666', margin: '0.5rem 0' }}>
            카카오톡 채널 '다산어보'를 추가하고 실시간 제보를 시작해보세요.
          </p>
          <button className="btn btn-primary" style={{ width: '100%', fontSize: '0.85rem' }}>
            카카오톡 연결하기
          </button>
        </div>

        <div className="data-card">
          <h4 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mic size={18} /> 마을 기록관
          </h4>
          <p style={{ fontSize: '0.85rem', color: '#666', margin: '0.5rem 0' }}>
            우리 동네 향토사, 인물 인터뷰 아카이브를 확인하세요.
          </p>
          <div style={{ fontSize: '0.8rem', color: 'var(--primary-dark)', fontWeight: 600, cursor: 'pointer' }}>
            최신 기록 보기 →
          </div>
        </div>
      </div>
    </section>
  );
}

export function DigitalDasan() {
  return (
    <section style={{ marginTop: '3rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <Cpu style={{ color: 'var(--primary-dark)' }} />
        <h2 style={{ margin: 0 }}>디지털 다산 (AI 기획)</h2>
      </div>
      <div className="grid grid-cols-1 grid-cols-2">
        <div className="data-card" style={{ background: 'linear-gradient(135deg, #f0f7f1, #ffffff)' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--primary-dark)', fontWeight: 700 }}>AI SERIALS</span>
          <h4 style={{ margin: '0.5rem 0' }}>"다산의 지혜로 본 2026년"</h4>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            실사구시 정신을 현대 기술로 재해석하여 지역 소멸 대안을 제시합니다.
          </p>
        </div>
        <div className="data-card">
          <span style={{ fontSize: '0.7rem', color: '#666', fontWeight: 700 }}>LIFE-LONG LEARNING</span>
          <h4 style={{ margin: '0.5rem 0' }}>스마트폰 리포터 교육</h4>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            4월 개강: 로컬 크리에이터를 위한 단편 영상 제작 강의 모집 중.
          </p>
        </div>
      </div>
    </section>
  );
}

export function Subscriptions() {
  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem' }}>
        <CreditCard style={{ color: 'var(--primary-dark)' }} />
        <h3 style={{ margin: 0 }}>뉴스 구독</h3>
      </div>
      <div className="data-card" style={{ background: 'var(--secondary)', color: 'white' }}>
        <h4 style={{ margin: 0, color: 'var(--primary)' }}>디지털 프리미엄</h4>
        <div style={{ margin: '1rem 0' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>₩9,900</span>
          <span style={{ fontSize: '0.8rem', opacity: 0.7 }}> / 월</span>
        </div>
        <ul style={{ fontSize: '0.8rem', opacity: 0.8, paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
          <li>AI 심층 분석 리포트 무제한</li>
          <li>지역별 행정 예산 실시간 알림</li>
          <li>광고 없는 뉴스레터 발송</li>
        </ul>
        <button className="btn btn-primary" style={{ width: '100%' }}>구독 시작하기</button>
      </div>
    </section>
  );
}
