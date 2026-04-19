'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import emailjs from '@emailjs/browser';
import { UserCheck, Camera, Star, Send, CheckCircle, Info, MapPin, Users } from 'lucide-react';

export default function ReporterRecruitPage() {
  const [reporterCount, setReporterCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    region: '강진',
    dong: '',
    motivation: '',
    agree: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchSessionAndData = async () => {
      // Auth Check
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUser(session?.user || null);

      // Reporter Count
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'reporter');
      setReporterCount(count || 12);
    };
    fetchSessionAndData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      if (confirm('로그인이 필요한 서비스입니다. 로그인 페이지로 이동할까요?')) {
        window.location.href = '/login';
      }
      return;
    }

    if (!formData.name || !formData.phone || !formData.agree) {
      alert('필수 항목을 입력하고 개인정보 동의에 체크해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const templateParams = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        region: formData.region,
        dong: formData.dong,
        motivation: formData.motivation,
        submitted_at: new Date().toLocaleString()
      };

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
        process.env.NEXT_PUBLIC_EMAILJS_REPORTER_TEMPLATE_ID || '',
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
      );

      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('EmailJS Error:', error);
      alert('신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <Header />
      
      {/* Hero Header */}
      <div style={{ background: 'var(--primary-dark)', padding: '5rem 0', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem', fontFamily: '"Nanum Myeongjo", serif' }}>마을 리포터 모집</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>우리 마을 이야기를 직접 전해주세요. 여러분이 바로 지역의 눈과 입입니다.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '5rem 0' }}>
        {/* Info Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
          <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ background: 'var(--primary)', width: '50px', height: '50px', borderRadius: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <UserCheck color="white" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>이런 분을 찾습니다</h3>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.95rem', color: '#64748b', lineHeight: 1.8 }}>
              <li>마을 소식에 관심 있는 분</li>
              <li>스마트폰 사용 가능한 분</li>
              <li>강진·고흥·보성·장흥 거주자</li>
              <li>나이·경력·학력 무관</li>
            </ul>
          </div>

          <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ background: 'var(--primary)', width: '50px', height: '50px', borderRadius: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Camera color="white" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>활동 내용</h3>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.95rem', color: '#64748b', lineHeight: 1.8 }}>
              <li>마을 행사·소식 현장 사진 촬영</li>
              <li>육하원칙으로 간단한 내용 제보</li>
              <li>월 1회 이상 활동 권장</li>
            </ul>
          </div>

          <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ background: 'var(--primary)', width: '50px', height: '50px', borderRadius: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Star color="white" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>혜택</h3>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.95rem', color: '#64748b', lineHeight: 1.8 }}>
              <li>공식 마을 리포터 위촉장 발급</li>
              <li>작성 기사에 이름 게재</li>
              <li>연간 우수 리포터 시상</li>
              <li>다산어보 1년 구독권 제공</li>
            </ul>
          </div>

          <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ background: 'var(--primary)', width: '50px', height: '50px', borderRadius: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Send color="white" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>활동 방법</h3>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.95rem', color: '#64748b', lineHeight: 1.8 }}>
              <li>스마트폰으로 현장 사진 촬영</li>
              <li>육하원칙 작성 후 제보폼 전송</li>
              <li>데스크 검토 후 기사 게재</li>
            </ul>
          </div>
        </div>

        {/* Application Form or Success Message */}
        {submitted ? (
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '5rem 2rem', background: '#ecfdf5', borderRadius: '20px', border: '2px dashed #10b981' }}>
            <CheckCircle size={80} color="#10b981" style={{ marginBottom: '1.5rem' }} />
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#065f46', marginBottom: '1rem' }}>신청이 완료됐습니다!</h2>
            <p style={{ fontSize: '1.1rem', color: '#047857', lineHeight: 1.6 }}>
              마을 리포터에 지원해주셔서 감사합니다.<br />
              담당자 확인 후 순차적으로 개별 연락드리겠습니다.
            </p>
            <button onClick={() => setSubmitted(false)} className="btn btn-outline" style={{ marginTop: '2rem' }}>새로 신청하기</button>
          </div>
        ) : (
          <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', padding: '4rem', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, textAlign: 'center', marginBottom: '3rem' }}>마을 리포터 신청하기</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.6rem' }}>이름 (필수)</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.6rem' }}>연락처 (필수)</label>
                  <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="010-0000-0000" style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.6rem' }}>이메일</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.6rem' }}>거주 지역</label>
                  <select value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', background: 'white' }}>
                    <option value="강진">강진군</option>
                    <option value="고흥">고흥군</option>
                    <option value="보성">보성군</option>
                    <option value="장흥">장흥군</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.6rem' }}>읍면동</label>
                  <input type="text" value={formData.dong} onChange={e => setFormData({...formData, dong: e.target.value})} placeholder="예: 강진읍" style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.6rem' }}>신청 동기</label>
                <textarea rows={4} value={formData.motivation} onChange={e => setFormData({...formData, motivation: e.target.value})} placeholder="리포터 활동을 희망하는 이유를 자유롭게 적어주세요." style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', resize: 'none' }}></textarea>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', background: '#f8fafc', padding: '1.2rem', borderRadius: '8px' }}>
                <input type="checkbox" required checked={formData.agree} onChange={e => setFormData({...formData, agree: e.target.checked})} style={{ width: '18px', height: '18px' }} />
                <span style={{ fontSize: '0.9rem', color: '#475569' }}>개인정보 수집 및 이용에 동의합니다. (필수)</span>
              </label>

              <button 
                type="submit" 
                disabled={submitting}
                style={{ 
                  width: '100%', background: 'var(--primary-dark)', color: 'white', padding: '1.2rem', 
                  borderRadius: '12px', fontSize: '1.1rem', fontWeight: 900, border: 'none', cursor: 'pointer',
                  transition: 'transform 0.2s', boxShadow: '0 8px 16px rgba(5, 150, 105, 0.2)'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {submitting ? '제출 중...' : '마을 리포터 신청 완료'}
              </button>
            </form>
          </div>
        )}

        {/* Footer Info */}
        <div style={{ marginTop: '6rem', textAlign: 'center', background: '#f1f5f9', padding: '4rem', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>활동 문의</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>press@dasaneobo.kr</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>활동 중인 리포터</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Users size={20} /> {reporterCount}명
              </div>
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>※ 모집은 연중 수시로 진행되며, 지역별 리포터 인원 상황에 따라 대기가 발생할 수 있습니다.</p>
        </div>
      </div>

      <Footer />
      <style jsx>{`
        @media (max-width: 768px) {
          form > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          .container { padding-left: 1.5rem; padding-right: 1.5rem; }
          h1 { font-size: 2.2rem !important; }
          div[style*="padding: 4rem"] { padding: 2rem !important; }
        }
      `}</style>
    </main>
  );
}
