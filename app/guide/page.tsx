'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { UserPlus, Megaphone, FileText, HelpCircle, ChevronRight } from 'lucide-react';

const GUIDE_DATA = {
  registration: {
    title: '회원가입',
    steps: [
      {
        step: 1,
        title: '홈페이지 접속',
        description: 'www.dasaneobo.kr 에 접속하세요. 모바일, PC 모두 이용 가능합니다.',
      },
      {
        step: 2,
        title: "오른쪽 상단 '로그인' 클릭",
        description: '상단 메뉴에서 로그인 버튼을 누르면 회원가입 화면으로 이동합니다.',
      },
      {
        step: 3,
        title: '이메일·비밀번호 입력 후 가입 완료',
        description: '이름, 이메일 주소, 비밀번호를 입력하고 가입 버튼을 누르면 바로 가입이 완료됩니다.',
        tags: ['무료 가입', '별도 인증 없음']
      },
      {
        step: 4,
        title: '구독 신청 (선택)',
        description: '가입 후 구독 페이지에서 월간·연간·평생 구독을 신청할 수 있습니다. 구독하지 않아도 기사 열람은 가능합니다.',
        tags: ['월 10,000원', '연 100,000원']
      }
    ],
    footer: '개인정보 안내 — 수집된 정보는 다산어보 서비스 제공 목적으로만 사용되며 외부에 제공되지 않습니다.'
  },
  reporter: {
    title: '리포터 신청',
    steps: [
      {
        step: 1,
        title: '회원가입 먼저',
        description: '마을 리포터는 회원가입 후 신청할 수 있습니다.',
      },
      {
        step: 2,
        title: '리포터 모집 페이지 이동',
        description: '리포터 모집 신청 클릭 또는 /reporter-recruit 접속',
      },
      {
        step: 3,
        title: '신청서 작성',
        description: '이름(실명), 거주 지역(군·읍·면·리), 연락처, 간단한 자기소개 작성. 사진 촬영이나 글쓰기 경험이 있으면 기재해 주세요.',
        tags: ['경력 무관', '누구나 환영']
      },
      {
        step: 4,
        title: '편집국 검토 및 승인',
        description: '편집국에서 신청 내용을 검토 후 연락드립니다. 보통 3~5일 이내 안내 드립니다.',
      },
      {
        step: 5,
        title: '리포터 등급 부여',
        description: "승인되면 계정이 '마을 리포터' 등급으로 변경됩니다.",
      }
    ],
    footer: '마을 리포터란? — 기자 자격증이 없어도 됩니다. 우리 마을 소식을 아는 주민이면 누구나 리포터가 될 수 있어요. 스마트폰으로 사진 찍고 육하원칙만 적어 보내주시면 편집장이 기사로 만들어 드립니다.'
  },
  report: {
    title: '마을 제보',
    steps: [
      {
        step: 1,
        title: '리포터 등급으로 로그인',
        description: '제보 시스템은 마을 리포터 이상 등급에서만 이용 가능합니다.',
      },
      {
        step: 2,
        title: '제보 페이지 이동',
        description: '기사제보하기 또는 /admin/report 접속',
      },
      {
        step: 3,
        title: '기사 스타일 선택',
        description: '중립 보도 / 따뜻한 마을 소식 / 공식 공지문 / 짧은 단신 중 선택',
      },
      {
        step: 4,
        title: '육하원칙 입력',
        description: '누가·무엇을·언제·어디서·어떻게·왜 입력',
        tags: ['누가·무엇을·언제는 필수']
      },
      {
        step: 5,
        title: '사진 첨부 (선택)',
        description: '현장 사진 첨부 가능. 기사 제보시 스마트폰 최고 화질 사진 원본으로 첨부',
        tags: ['고화질 원본은 구글 드라이브에 자동 보관']
      },
      {
        step: 6,
        title: "'데스크로 제보 보내기' 클릭",
        description: '편집장이 검토 후 기사로 작성하여 게재합니다.',
      }
    ],
    footer: '제보 팁 — 마을 회관 앞 가로등이 고장났다 · 군청 예산이 이상하게 쓰였다 · 조용히 좋은 일을 하는 이웃이 있다 — 작은 소식도 소중한 제보입니다. 사실에 근거한 내용만 제보해 주세요.'
  },
  faq: {
    title: '자주 묻는 질문',
    questions: [
      {
        q: '구독하지 않으면 기사를 못 보나요?',
        a: '기본 기사는 구독 없이 무료로 열람 가능합니다. 일부 심층 기사나 특집 기사는 구독자 전용으로 제공될 수 있습니다.'
      },
      {
        q: '마을 리포터가 되면 급여를 받나요?',
        a: '현재는 재능나눔으로 운영되며, 정기적인 마을 리포터 모임을 통해 다양한 정보와 교육을 진행할 예정입니다.'
      },
      {
        q: '제보한 내용이 반드시 기사가 되나요?',
        a: '편집국에서 사실 확인 및 공익성을 검토한 후 게재 여부를 결정합니다. 모든 제보가 기사화되지는 않을 수 있습니다.'
      },
      {
        q: '구독을 중간에 해지할 수 있나요?',
        a: '월간·연간 구독은 언제든지 해지 가능합니다. 해지 후에는 구독 기간 만료까지 서비스가 유지됩니다. 평생 구독은 환불이 어렵습니다.'
      },
      {
        q: '비밀 제보도 가능한가요?',
        a: '제보자 정보는 편집국 내부에서만 관리되며 외부에 공개되지 않습니다. 기사 게재 시 제보자 익명 처리를 원하시면 요청해 주세요.'
      },
      {
        q: '강진·고흥·보성·장흥 외 지역도 제보 가능한가요?',
        a: '전남 지역 전체의 소식을 환영합니다. 다만 4개 군 중심으로 취재하고 있어 다른 지역 제보는 편집국 판단에 따라 게재 여부가 결정됩니다.'
      }
    ],
    footer: ''
  }
};

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState<'registration' | 'reporter' | 'report' | 'faq'>('registration');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      <Header />
      
      <main className="container" style={{ flex: 1, padding: '4rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 900, 
            color: '#1a1a1a', 
            marginBottom: '1rem',
            fontFamily: 'var(--font-serif)'
          }}>
            다산어보 이용 안내
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            다산어보를 처음 이용하시는 분들을 위한 단계별 가이드입니다.
          </p>
        </div>

        {/* Tabs Container */}
        <div style={{ 
          background: '#fff', 
          borderRadius: '20px', 
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          border: '1px solid #e2e8f0'
        }}>
          {/* Tabs Navigation */}
          <div style={{ 
            display: 'flex', 
            background: '#f1f5f9', 
            borderBottom: '1px solid #e2e8f0',
            overflowX: 'auto',
            scrollbarWidth: 'none'
          }}>
            <TabButton 
              active={activeTab === 'registration'} 
              onClick={() => setActiveTab('registration')}
              icon={<UserPlus size={18} />}
              label="회원가입"
            />
            <TabButton 
              active={activeTab === 'reporter'} 
              onClick={() => setActiveTab('reporter')}
              icon={<Megaphone size={18} />}
              label="리포터 신청"
            />
            <TabButton 
              active={activeTab === 'report'} 
              onClick={() => setActiveTab('report')}
              icon={<FileText size={18} />}
              label="마을 제보"
            />
            <TabButton 
              active={activeTab === 'faq'} 
              onClick={() => setActiveTab('faq')}
              icon={<HelpCircle size={18} />}
              label="자주 묻는 질문"
            />
          </div>

          {/* Tab Content */}
          <div style={{ padding: '3rem 2rem' }}>
            {activeTab !== 'faq' ? (
              <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {(GUIDE_DATA[activeTab as keyof typeof GUIDE_DATA] as any).steps.map((item: any, idx: number) => (
                    <div key={idx} style={{ 
                      display: 'flex', 
                      gap: '2rem', 
                      position: 'relative',
                      opacity: 1
                    }}>
                      {/* Step Number Circle */}
                      <div style={{ flexShrink: 0 }}>
                        <div style={{ 
                          width: '44px', 
                          height: '44px', 
                          borderRadius: '50%', 
                          background: 'var(--primary)', 
                          color: '#fff', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontWeight: 800,
                          fontSize: '1.2rem',
                          boxShadow: '0 4px 10px rgba(46, 125, 82, 0.3)'
                        }}>
                          {item.step}
                        </div>
                        {idx < (GUIDE_DATA[activeTab as keyof typeof GUIDE_DATA] as any).steps.length - 1 && (
                          <div style={{ 
                            width: '2px', 
                            height: 'calc(100% - 12px)', 
                            background: '#e2e8f0', 
                            position: 'absolute', 
                            left: '21px', 
                            top: '50px' 
                          }} />
                        )}
                      </div>

                      {/* Content Card */}
                      <div style={{ 
                        flex: 1, 
                        background: '#fff', 
                        padding: '1.5rem 2rem', 
                        borderRadius: '16px', 
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                      }} className="guide-card">
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#1e293b' }}>
                          {item.title}
                        </h3>
                        <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '1.05rem', wordBreak: 'keep-all' }}>
                          {item.description}
                        </p>
                        
                        {item.tags && (
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                            {item.tags.map((tag: string, tIdx: number) => (
                              <span key={tIdx} style={{ 
                                padding: '4px 12px', 
                                background: 'var(--primary-light)', 
                                color: 'var(--primary)', 
                                fontSize: '0.8rem', 
                                fontWeight: 600, 
                                borderRadius: '20px' 
                              }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tab Footer Info */}
                <div style={{ 
                  marginTop: '4rem', 
                  padding: '1.5rem 2rem', 
                  background: '#f8fafc', 
                  borderRadius: '12px', 
                  borderLeft: '4px solid var(--primary)',
                  color: '#475569',
                  fontSize: '0.95rem',
                  lineHeight: 1.6
                }}>
                  {GUIDE_DATA[activeTab as keyof typeof GUIDE_DATA].footer}
                </div>
              </div>
            ) : (
              /* FAQ Section */
              <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {GUIDE_DATA.faq.questions.map((item, idx) => (
                    <FAQItem key={idx} question={item.q} answer={item.a} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .guide-card:hover {
          transform: translateX(5px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
          border-color: var(--primary-light);
        }
        
        @media (max-width: 768px) {
          main { padding: 2rem 1rem !important; }
          h1 { font-size: 2.2rem !important; }
          .guide-card { padding: 1.2rem !important; }
        }
      `}</style>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      style={{
        flex: 1,
        padding: '1.25rem 1.5rem',
        border: 'none',
        background: active ? '#fff' : 'transparent',
        color: active ? 'var(--primary)' : '#64748b',
        fontWeight: 700,
        fontSize: '1.1rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        transition: 'all 0.2s ease',
        borderBottom: active ? '3px solid var(--primary)' : '3px solid transparent',
        whiteSpace: 'nowrap',
        minWidth: '150px'
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ 
      border: '1px solid #e2e8f0', 
      borderRadius: '12px', 
      overflow: 'hidden', 
      background: '#fff',
      opacity: 1
    }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left'
        }}
      >
        <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ color: 'var(--primary)', fontSize: '1.4rem' }}>Q.</span> {question}
        </span>
        <ChevronRight 
          size={20} 
          style={{ 
            color: '#94a3b8', 
            transform: isOpen ? 'rotate(90deg)' : 'rotate(0)', 
            transition: 'transform 0.3s ease' 
          }} 
        />
      </button>
      <div style={{ 
        maxHeight: isOpen ? '500px' : '0', 
        overflow: 'hidden', 
        transition: 'all 0.3s ease-in-out',
        background: '#f8fafc'
      }}>
        <div style={{ padding: '1.5rem', borderTop: '1px solid #e2e8f0', color: '#475569', lineHeight: 1.7, fontSize: '1.05rem', display: 'flex', gap: '0.75rem' }}>
           <span style={{ color: '#e11d48', fontWeight: 800, fontSize: '1.4rem' }}>A.</span>
           <span style={{ wordBreak: 'keep-all' }}>{answer}</span>
        </div>
      </div>
    </div>
  );
}
