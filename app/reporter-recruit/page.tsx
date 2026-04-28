'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import emailjs from '@emailjs/browser';
import { ChevronDown, ChevronUp, CheckCircle, Upload } from 'lucide-react';
import Link from 'next/link';

const FAQ_ITEMS = [
  {
    q: "글을 못 써도 정말 괜찮나요?",
    a: "네. 마을 리포터는 글을 쓰지 않습니다. 동네에서 일어난 일을 누가·언제·어디서·무엇을·왜·어떻게 — 이 여섯 가지로 정리해 사진 한두 장과 함께 보내주시면, 다산어보 편집국이 사실 확인을 거쳐 기사로 작성·발행합니다."
  },
  {
    q: "보수가 있나요?",
    a: "정기 보수와 취재 실비 정산은 없습니다. 다산어보 마을 리포터는 재능나눔 모델로 운영됩니다. 대신 누적 활동에 따른 단계별 혜택(평생 구독·명함·정기 교육·조합원 우대)과 연 1회 다산어보의 날 시상이 있습니다."
  },
  {
    q: "얼마나 자주 알려야 하나요?",
    a: "자유입니다. 매주 한 번이어도 좋고, 한 달에 한 번 또는 계절에 한 번이어도 됩니다. 다만 입회 자격 유지를 위해 1년에 최소 1회는 부탁드립니다."
  },
  {
    q: "정기 교육은 어떤 내용인가요?",
    a: "글쓰기 강의가 아닙니다. 스마트폰으로 보기 좋게 사진 찍는 법, 동네에서 좋은 제보거리를 알아보는 법, 짧은 인터뷰를 따는 법 같은 — 마을 리포터 활동에 직접 도움이 되는 실용 교육입니다. 분기 1회 정기 + 비정기 특강."
  },
  {
    q: "익명으로 활동할 수 있나요?",
    a: "발행 기사에는 필명 사용이 가능합니다. 다만 편집국 내부에는 본명을 등록해주셔야 법적 보호와 단계별 혜택이 가능합니다. 본명은 외부에 공개되지 않습니다. 완전 익명으로 한 번만 알리고 싶으시면 일반 기사 제보 페이지(/report)를 이용해주세요 — 등록 없이 익명 제보 가능합니다."
  },
  {
    q: "미성년자도 가능한가요?",
    a: "16세 이상이면 가능합니다. 18세 미만은 보호자 동의서가 필수이며, 동네에서 안전한 범위 내 활동을 권장드립니다."
  }
];

export default function ReporterRecruitPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    pen_name: '',
    contact_phone: '',
    email: '',
    birth_date: '',
    region: '강진',
    interests: [] as string[],
    intro: '',
    frequency: 'flexible',
    referrer: '',
    guardian_name: '',
    guardian_phone: '',
    guardian_consent: null as File | null,
    agree: false
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Calculate age to check if minor
  const isMinor = () => {
    if (!formData.birth_date) return false;
    const birthDate = new Date(formData.birth_date);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 16 && age < 18;
  };

  const isTooYoung = () => {
    if (!formData.birth_date) return false;
    const birthDate = new Date(formData.birth_date);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age < 16;
  };

  const handleInterestChange = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) 
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isTooYoung()) {
      alert("16세 이상만 마을 리포터로 신청 가능합니다.");
      return;
    }

    if (formData.intro.length < 100 || formData.intro.length > 300) {
      alert(`자기소개는 100자에서 300자 사이로 작성해주세요. (현재 ${formData.intro.length}자)`);
      return;
    }

    if (formData.interests.length === 0) {
      alert("관심 분야를 최소 1개 이상 선택해주세요.");
      return;
    }

    if (isMinor() && (!formData.guardian_name || !formData.guardian_phone)) {
      alert("만 18세 미만의 경우 보호자 정보가 필수입니다.");
      return;
    }

    setSubmitting(true);
    try {
      let guardian_consent_url = '';
      
      // Upload consent file if exists
      if (formData.guardian_consent) {
        const fileExt = formData.guardian_consent.name.split('.').pop();
        const fileName = `${Date.now()}-consent.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('reporter-applications')
          .upload(fileName, formData.guardian_consent);
          
        if (!uploadError) {
          const { data } = supabase.storage.from('reporter-applications').getPublicUrl(fileName);
          guardian_consent_url = data.publicUrl;
        }
      }

      // Insert to DB
      const { error: dbError } = await supabase
        .from('village_reporters')
        .insert([{
          full_name: formData.full_name,
          pen_name: formData.pen_name,
          email: formData.email,
          contact_phone: formData.contact_phone,
          birth_date: formData.birth_date,
          region: formData.region,
          interests: formData.interests,
          intro: formData.intro,
          frequency: formData.frequency,
          referrer: formData.referrer,
          is_minor: isMinor(),
          guardian_name: formData.guardian_name,
          guardian_phone: formData.guardian_phone,
          guardian_consent_url,
          status: 'pending'
        }]);

      if (dbError) throw dbError;

      // Try EmailJS (Legacy notification)
      try {
        await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
          process.env.NEXT_PUBLIC_EMAILJS_REPORTER_TEMPLATE_ID || '',
          {
            name: formData.full_name,
            phone: formData.contact_phone,
            email: formData.email,
            region: formData.region,
            motivation: formData.intro,
            submitted_at: new Date().toLocaleString()
          },
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
        );
      } catch (e) {
        console.error("EmailJS notification failed, but DB insert succeeded.");
      }

      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (error: any) {
      console.error('Submission Error:', error);
      alert('신청 중 오류가 발생했습니다. 이메일 중복 여부를 확인해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 2rem' }}>
          <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center', background: 'white', padding: '4rem 2rem', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
            <CheckCircle size={80} color="#1F5946" style={{ margin: '0 auto 1.5rem' }} />
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#1F5946', marginBottom: '1rem', fontFamily: '"Nanum Myeongjo", serif' }}>
              신청이 접수되었습니다
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.6, marginBottom: '2rem' }}>
              다산어보 마을 리포터에 지원해주셔서 진심으로 감사드립니다.<br />
              입력하신 이메일로 안내 메일을 발송해 드렸습니다.<br/>
              편집국에서 내용을 확인한 후 1주일 내로 연락드리겠습니다.
            </p>
            <Link href="/" style={{ display: 'inline-block', background: '#1F5946', color: 'white', padding: '1rem 2rem', borderRadius: '8px', fontWeight: 700, textDecoration: 'none' }}>
              메인으로 돌아가기
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main style={{ background: '#f8fafc' }}>
      <Header />
      
      {/* § 1. 히어로 */}
      <section style={{ background: '#1F5946', color: 'white', padding: '6rem 2rem', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem', fontFamily: '"Nanum Myeongjo", serif', wordBreak: 'keep-all', lineHeight: 1.3 }}>
            우리 동네 이야기,<br/>알려만 주세요
          </h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.9, lineHeight: 1.6, wordBreak: 'keep-all' }}>
            글은 다산어보가 씁니다. 마을 리포터 모집 —<br/>
            누가·언제·어디서·무엇을·왜·어떻게 한 줄과 사진 한두 장이면 충분합니다.
          </p>
        </div>
      </section>

      {/* § 2. 왜 만드나 */}
      <section style={{ padding: '5rem 2rem', background: 'white' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#334155', marginBottom: '1.5rem', wordBreak: 'keep-all' }}>
            전국 뉴스는 서울 이야기로 가득하고, 포털에서는 우리 지역 소식을 찾기 어렵습니다. 군청 보도자료는 그대로 올라오고, 불편한 진실은 외면받기 일쑤입니다.
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#334155', wordBreak: 'keep-all' }}>
            다산어보는 강진·고흥·보성·장흥 <strong>4개 군</strong>의 이야기를 직접 기록하고, 잘못된 것을 바로잡기 위해 만들어진 협동조합 언론입니다. 강진에서 <strong>18년</strong>간 유배 생활을 하며 <strong>499권</strong>의 책을 쓰신 다산 정약용 선생의 정신처럼 — 백성의 삶을 기록하고, 잘못된 것을 바로잡는 신문을 함께 만들어가려 합니다.
          </p>
        </div>
      </section>

      {/* § 3. 마을 리포터란 */}
      <section style={{ padding: '5rem 2rem', background: '#f1f5f9' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', color: '#0f172a', textAlign: 'center' }}>마을 리포터란?</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#334155', marginBottom: '1.5rem', wordBreak: 'keep-all' }}>
            마을 리포터는 다산어보에 동네 일을 정기적으로 알려주시는 등록 통신원입니다.
          </p>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', borderLeft: '4px solid #1F5946', marginBottom: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: '1.15rem', lineHeight: 1.8, color: '#1e293b', fontWeight: 600, margin: 0, wordBreak: 'keep-all' }}>
              기사를 쓰시는 게 아닙니다. 동네에서 일어난 일을 누가·언제·어디서·무엇을·왜·어떻게 — 이 여섯 가지로 정리해 사진 한두 장과 함께 보내주시면 됩니다. 사실 확인·기사 작성·교정·발행은 다산어보 편집국이 모두 처리합니다.
            </p>
          </div>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#334155', wordBreak: 'keep-all' }}>
            기자 경력도, 글쓰기 능력도 필요 없습니다. 우리 동네에서 일어나는 일을 가장 먼저 보고, 다산어보에 알려주실 수 있는 분이면 됩니다 — 청년·중장년·은퇴자, 농민·교사·자영업자·주부 누구나 환영합니다. 16세 이상이면 가능하며, 18세 미만은 보호자 동의서를 받습니다.
          </p>
        </div>
      </section>

      {/* § 4. 무엇을 알려주나 */}
      <section style={{ padding: '5rem 2rem', background: 'white' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '3rem', color: '#0f172a', textAlign: 'center' }}>무엇을 알려주나요?</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
            {/* 제보거리 */}
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1F5946' }}>어떤 것이든 좋습니다</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {['동네 행사·축제·작은 사건 ("우리 동네에 이런 일이 있었다")', '군청·의회 게시판, 공고, 정책 변경', '사라져가는 풍경·기억의 기록', '지역에서 활동하시는 분들 이야기', '불편한 점, 잘못된 것, 시민이 알아야 할 것'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', fontSize: '1.05rem', color: '#334155', lineHeight: 1.5 }}>
                    <CheckCircle size={20} color="#1F5946" style={{ flexShrink: 0, marginTop: '2px' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 육하원칙 슬롯 */}
            <div style={{ background: '#f8fafc', padding: '2.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1F5946' }}>이 두 가지만 보내주세요</h3>
              <div style={{ marginBottom: '2rem' }}>
                <p style={{ fontWeight: 700, marginBottom: '1rem', color: '#1e293b' }}>1. 육하원칙 (각 한두 줄)</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.8rem' }}>
                  {[
                    { title: '누가', desc: '인물·기관' },
                    { title: '언제', desc: '날짜·시간' },
                    { title: '어디서', desc: '장소' },
                    { title: '무엇을', desc: '사건·내용' },
                    { title: '왜', desc: '배경·이유' },
                    { title: '어떻게', desc: '전개·결과' }
                  ].map((w, i) => (
                    <div key={i} style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.3rem' }}>{w.title}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{w.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#1e293b' }}>2. 사진 1~5장 (스마트폰 사진으로 충분)</p>
                <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0 }}>추가 메모는 자유롭게 남겨주시면 편집국이 기사로 풀어내는 데 도움이 됩니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* § 5. 혜택 — 단계별 */}
      <section style={{ padding: '6rem 2rem', background: '#f1f5f9' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '1rem', color: '#0f172a', textAlign: 'center' }}>단계별 혜택</h2>
          <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#64748b', marginBottom: '3rem' }}>
            꾸준히 알려주시는 분들께 다산어보가 드리는 감사의 마음입니다.
          </p>

          <style jsx>{`
            .benefits-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 3rem; }
            @media (max-width: 900px) { .benefits-grid { grid-template-columns: repeat(2, 1fr); } }
            @media (max-width: 600px) { .benefits-grid { grid-template-columns: 1fr; } }
          `}</style>
          
          <div className="benefits-grid">
            <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ background: '#1F5946', color: 'white', padding: '1.5rem', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>입회</h3>
                <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>첫 제보 발행 시점부터</span>
              </div>
              <ul style={{ padding: '1.5rem', margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem', color: '#334155' }}>
                <li>• 본인 이름/필명 기명 게재</li>
                <li>• 다산어보 1년 무상 구독</li>
                <li>• 분기 1회 모임 초대</li>
                <li>• 발행 기사 법적 책임 보호</li>
              </ul>
            </div>

            <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ background: '#5C7548', color: 'white', padding: '1.5rem', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>활동</h3>
                <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>누적 5회 제보 게재</span>
              </div>
              <ul style={{ padding: '1.5rem', margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem', color: '#334155' }}>
                <li>• 마을 리포터 명함 발급</li>
                <li>• 다산어보 실물 뱃지 증정</li>
                <li>• 평생 구독으로 자동 전환</li>
                <li>• 정기 실무 교육 우선 신청권</li>
              </ul>
            </div>

            <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ background: '#8C6328', color: 'white', padding: '1.5rem', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>고문</h3>
                <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>누적 12회 또는 1년 이상</span>
              </div>
              <ul style={{ padding: '1.5rem', margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem', color: '#334155' }}>
                <li>• 조합원 출자금 50% 우대</li>
                <li>• 제보 우선 처리 (24시간 내)</li>
                <li>• 편집 방향 자문 회의 참석</li>
                <li>• 우수 리포터 후보 자동 등록</li>
              </ul>
            </div>

            <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ background: '#B22222', color: 'white', padding: '1.5rem', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, fontFamily: '"Nanum Myeongjo", serif' }}>茶山語報</h3>
                <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>연례 시상 (다산어보의 날)</span>
              </div>
              <ul style={{ padding: '1.5rem', margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem', color: '#334155' }}>
                <li>• 우수 리포터 표창</li>
                <li>• 4대 권역 지역 특산물 박스</li>
                <li>• 한지 인쇄 특별 감사패</li>
              </ul>
            </div>
          </div>

          {/* 솔직한 안내 */}
          <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', padding: '2rem', borderRadius: '12px', textAlign: 'center' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#92400e', marginBottom: '1rem' }}>솔직한 안내</h4>
            <p style={{ margin: 0, color: '#92400e', lineHeight: 1.6, fontSize: '0.95rem', wordBreak: 'keep-all' }}>
              다산어보 마을 리포터는 재능나눔으로 운영되며, <strong>정기 보수(월급)와 취재 실비 정산은 없습니다.</strong><br className="hidden md:block"/>
              위 혜택은 보수의 대체가 아니라, 함께 신문을 만드시는 분에게 다산어보가 드릴 수 있는 도구·연결·인정의 표시입니다.
            </p>
          </div>
        </div>
      </section>

      {/* § 6. 다산어보가 책임집니다 */}
      <section style={{ padding: '5rem 2rem', background: 'white' }}>
        <div className="container" style={{ maxWidth: '700px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem', color: '#0f172a' }}>다산어보가 책임집니다</h2>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#334155', wordBreak: 'keep-all' }}>
            여러분이 보내주신 제보를 바탕으로 편집국이 사실 확인을 거쳐 기사를 작성·발행합니다. 발행된 기사에 대한 모든 법적 책임 — 명예훼손 항의, 손해배상 청구, 정정 요청 등 — 은 다산어보 편집국이 집니다. 마을 리포터께서는 동네에서 일어난 일을 사실대로 알려주시기만 하면 됩니다.<br/><br/>
            <span style={{ fontSize: '0.95rem', color: '#64748b' }}>다만 의도적으로 허위 사실을 알려주신 경우는 보호 대상이 아닙니다. 정직한 제보에는 정직한 보호가 따릅니다.</span>
          </p>
        </div>
      </section>

      {/* § 7. 신청·제보 절차 */}
      <section style={{ padding: '5rem 2rem', background: '#f8fafc' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '3rem', color: '#0f172a', textAlign: 'center' }}>신청 절차</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { step: '1', title: '5분, 온라인 신청', desc: '이 페이지 하단의 신청 폼을 작성합니다. 자기소개 100~300자.' },
              { step: '2', title: '10분, 전화 또는 카톡 확인', desc: '편집국에서 1주 내로 연락드립니다. 활동 동기·관심 분야·연락 방식을 가볍게 확인합니다.' },
              { step: '3', title: '등록 완료', desc: '다산어보 마을 리포터로 정식 등록됩니다. 다산어보 제보 페이지에서 본인 정보 자동 입력으로 빠르고 편하게 제보하실 수 있습니다.' },
              { step: '4', title: '첫 제보 → 첫 게재', desc: '첫 제보를 보내주시면 편집국이 확인 후 기사로 발행합니다. 이 순간부터 입회 혜택이 시작됩니다.' }
            ].map((item) => (
              <div key={item.step} style={{ display: 'flex', gap: '1.5rem', background: 'white', padding: '1.5rem 2rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ width: '40px', height: '40px', background: '#1F5946', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 900, flexShrink: 0 }}>
                  {item.step}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>{item.title}</h3>
                  <p style={{ margin: 0, color: '#475569', lineHeight: 1.6, fontSize: '0.95rem' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* § 8. 자주 묻는 질문 */}
      <section style={{ padding: '5rem 2rem', background: 'white' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '3rem', color: '#0f172a', textAlign: 'center' }}>자주 묻는 질문</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {FAQ_ITEMS.map((faq, i) => (
              <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: '#f8fafc', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 700, color: '#1e293b', fontSize: '1.05rem' }}
                >
                  {faq.q}
                  {openFaq === i ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </button>
                {openFaq === i && (
                  <div style={{ padding: '1.5rem', background: 'white', borderTop: '1px solid #e2e8f0', color: '#475569', lineHeight: 1.6, fontSize: '0.95rem', wordBreak: 'keep-all' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* § 9. 신청 폼 */}
      <section style={{ padding: '5rem 2rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }} id="apply-form">
        <div className="container" style={{ maxWidth: '600px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', color: '#0f172a', textAlign: 'center' }}>마을 리포터 등록</h2>
          
          <form onSubmit={handleSubmit} style={{ background: 'white', padding: '3rem 2.5rem', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', display: 'grid', gap: '1.5rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>이름 (본명) *</label>
                <input type="text" required value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} minLength={2} maxLength={10} style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>필명 (선택)</label>
                <input type="text" value={formData.pen_name} onChange={e => setFormData({...formData, pen_name: e.target.value})} maxLength={10} placeholder="기사에 표시될 이름" style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>연락처 *</label>
                <input type="tel" required value={formData.contact_phone} onChange={e => setFormData({...formData, contact_phone: e.target.value})} pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}" placeholder="010-0000-0000" style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>이메일 *</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>생년월일 *</label>
                <input type="date" required value={formData.birth_date} onChange={e => setFormData({...formData, birth_date: e.target.value})} style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>거주 권역 *</label>
                <select required value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white' }}>
                  <option value="강진">강진</option>
                  <option value="고흥">고흥</option>
                  <option value="보성">보성</option>
                  <option value="장흥">장흥</option>
                  <option value="기타">기타</option>
                </select>
              </div>
            </div>

            {isMinor() && (
              <div style={{ background: '#fffbeb', padding: '1.5rem', borderRadius: '12px', border: '1px solid #fcd34d' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#b45309', margin: '0 0 1rem' }}>미성년자 보호자 정보 (만 18세 미만)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <input type="text" placeholder="보호자 성함" value={formData.guardian_name} onChange={e => setFormData({...formData, guardian_name: e.target.value})} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #fcd34d' }} />
                  <input type="tel" placeholder="보호자 연락처" value={formData.guardian_phone} onChange={e => setFormData({...formData, guardian_phone: e.target.value})} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #fcd34d' }} />
                </div>
                <div>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#b45309', cursor: 'pointer' }}>
                    <span style={{ fontWeight: 700 }}>보호자 동의서 첨부 (사진/PDF) *</span>
                    <input type="file" required accept="image/*,.pdf" onChange={e => setFormData({...formData, guardian_consent: e.target.files?.[0] || null})} style={{ padding: '0.5rem', background: 'white', borderRadius: '6px' }} />
                  </label>
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.8rem', fontSize: '0.9rem' }}>관심 분야 (다중 선택) *</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {['행정', '정치', '경제', '사회', '문화', '칼럼'].map(cat => (
                  <button 
                    key={cat} type="button"
                    onClick={() => handleInterestChange(cat)}
                    style={{ 
                      padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
                      background: formData.interests.includes(cat) ? '#1F5946' : '#f1f5f9',
                      color: formData.interests.includes(cat) ? 'white' : '#64748b',
                      border: 'none', transition: 'all 0.2s'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                자기소개 * <span style={{ color: formData.intro.length >= 100 && formData.intro.length <= 300 ? '#10b981' : '#ef4444', fontWeight: 400 }}>({formData.intro.length}/300자)</span>
              </label>
              <textarea 
                required 
                rows={4} 
                value={formData.intro} 
                onChange={e => setFormData({...formData, intro: e.target.value})} 
                placeholder="간단한 자기소개와 리포터 활동을 희망하시는 이유를 적어주세요. (100자 ~ 300자)" 
                style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'none', fontSize: '0.95rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>활동 가능 빈도 *</label>
                <select required value={formData.frequency} onChange={e => setFormData({...formData, frequency: e.target.value})} style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white' }}>
                  <option value="weekly">매주</option>
                  <option value="monthly">매월</option>
                  <option value="seasonal">계절별</option>
                  <option value="flexible">유동적 (자유롭게)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>추천인 (선택)</label>
                <input type="text" value={formData.referrer} onChange={e => setFormData({...formData, referrer: e.target.value})} placeholder="기존 리포터나 조합원 이름" style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', cursor: 'pointer', background: '#f8fafc', padding: '1.2rem', borderRadius: '8px', marginTop: '1rem' }}>
              <input type="checkbox" required checked={formData.agree} onChange={e => setFormData({...formData, agree: e.target.checked})} style={{ width: '18px', height: '18px', marginTop: '2px' }} />
              <span style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                (필수) 개인정보 수집 및 이용에 동의합니다. 수집된 정보는 리포터 활동 관리를 위해서만 사용되며, 동네 일 제보 외 영리 목적으로 사용되지 않습니다.
              </span>
            </label>

            <button 
              type="submit" 
              disabled={submitting}
              style={{ 
                width: '100%', background: '#1F5946', color: 'white', padding: '1.2rem', marginTop: '0.5rem',
                borderRadius: '12px', fontSize: '1.1rem', fontWeight: 800, border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1, transition: 'background 0.2s'
              }}
            >
              {submitting ? '제출 중...' : '마을 리포터 등록 신청하기'}
            </button>
          </form>
        </div>
      </section>

      <Footer />
      
      <style jsx>{`
        @media (max-width: 768px) {
          form > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          .container { padding-left: 1.5rem; padding-right: 1.5rem; }
        }
      `}</style>
    </main>
  );
}
