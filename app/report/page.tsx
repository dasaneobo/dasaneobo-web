'use client';

import { useState, useEffect, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { requestMagicLink, verifyMagicToken } from './actions';
import emailjs from '@emailjs/browser';
import Link from 'next/link';
import { CheckCircle, Upload, AlertCircle, Send, Key } from 'lucide-react';

function ReportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [reporter, setReporter] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Magic Link State
  const [magicEmail, setMagicEmail] = useState('');
  const [magicSending, setMagicSending] = useState(false);
  const [magicSent, setMagicSent] = useState(false);

  // Form State
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    who: '', what: '', when_text: '', where_text: '', how: '', why: '', memo: '',
    region: '강진', contact_email: '', contact_phone: ''
  });
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    async function checkToken() {
      if (!token) {
        setLoadingAuth(false);
        return;
      }
      const res = await verifyMagicToken(token);
      if (res.success && res.reporter) {
        setReporter(res.reporter);
        setFormData(prev => ({
          ...prev,
          contact_email: res.reporter.email,
          contact_phone: res.reporter.contact_phone,
          region: res.reporter.region
        }));
      }
      setLoadingAuth(false);
    }
    checkToken();
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).slice(0, 5); // Max 5
      setFiles(selected);
    }
  };

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!magicEmail) return;
    
    setMagicSending(true);
    const res = await requestMagicLink(magicEmail);
    
    if (!res.success) {
      alert(res.message);
      setMagicSending(false);
      return;
    }

    try {
      const loginUrl = `${window.location.origin}/report?token=${res.token}`;
      
      // We send the email using EmailJS to the user's email
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
        process.env.NEXT_PUBLIC_EMAILJS_MAGIC_LINK_TEMPLATE_ID || 'template_default',
        {
          to_email: res.email,
          name: res.name,
          login_link: loginUrl
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
      );
      setMagicSent(true);
    } catch (err) {
      console.error('EmailJS Error:', err);
      // Fallback for development if email template is missing
      alert(`[개발/테스트용 임시 알림]\n메일 전송에 실패했습니다. 아래 링크로 바로 접속하세요:\n${window.location.origin}/report?token=${res.token}`);
    } finally {
      setMagicSending(false);
    }
  };

  const sendReport = async () => {
    if (!formData.what || !formData.who) {
      alert('누가, 무엇을 항목은 필수입니다.');
      return;
    }

    if (!reporter && (!formData.contact_email && !formData.contact_phone)) {
      alert('비회원 제보 시 연락처(이메일 또는 전화번호)를 하나 이상 남겨주세요.');
      return;
    }

    setSubmitting(true);

    try {
      // 1. Upload Photos
      const photo_urls: string[] = [];
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('reporter-submissions')
          .upload(fileName, file);
          
        if (!uploadError) {
          const { data } = supabase.storage.from('reporter-submissions').getPublicUrl(fileName);
          photo_urls.push(data.publicUrl);
        }
      }

      // 2. Save Submission
      const { error: dbError } = await supabase
        .from('submissions')
        .insert([{
          reporter_id: reporter?.id || null,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone,
          region: formData.region,
          who: formData.who,
          when_text: formData.when_text,
          where_text: formData.where_text,
          what: formData.what,
          why: formData.why,
          how: formData.how,
          memo: formData.memo,
          photo_urls,
          status: 'pending'
        }]);
 
      if (dbError) throw new Error(dbError.message);

      setSubmitted(true);
      window.scrollTo(0, 0);

    } catch (err: any) {
      alert('제보 전송 실패: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingAuth) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>인증 정보를 확인 중입니다...</div>;
  }

  if (submitted) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
        <CheckCircle size={80} color="#1F5946" style={{ margin: '0 auto 1.5rem' }} />
        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#1F5946', marginBottom: '1rem' }}>제보가 접수되었습니다</h2>
        <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.6, marginBottom: '2.5rem' }}>
          소중한 제보 감사합니다.<br />
          편집국에서 내용을 확인하고 기사로 작성·발행하겠습니다.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={() => { setSubmitted(false); setFormData({...formData, what:'', who:'', when_text:'', where_text:'', how:'', why:'', memo:''}); setFiles([]); }} style={{ padding: '1rem 2rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', fontWeight: 700, cursor: 'pointer' }}>새 제보하기</button>
          <Link href="/" style={{ padding: '1rem 2rem', borderRadius: '8px', border: 'none', background: '#1F5946', color: 'white', fontWeight: 700, textDecoration: 'none' }}>메인으로</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ background: '#2E7D52', color: 'white', padding: '4rem 0', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', fontFamily: 'Noto Serif KR, serif' }}>우리 동네 제보하기</h1>
          <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>여러분의 제보가 우리 지역의 역사가 됩니다.</p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '800px', margin: '3rem auto 5rem' }}>
        
        {/* Banner */}
        {!reporter && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.5rem 2rem', borderRadius: '12px', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#166534', margin: '0 0 0.4rem' }}>자주 제보하신다면 마을 리포터로 등록해보세요!</h3>
              <p style={{ margin: 0, color: '#15803d', fontSize: '0.95rem' }}>제보 내역이 누적되어 평생 구독, 명함 발급 등의 혜택을 드립니다.</p>
            </div>
            <Link href="/reporter-apply" style={{ background: '#166534', color: 'white', padding: '0.8rem 1.5rem', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>
              마을 리포터 안내 보기
            </Link>
          </div>
        )}

        {/* Auth Section (Only shown if logged in via email link) */}
        {reporter && (
          <div style={{ background: '#1F5946', color: 'white', padding: '1.5rem 2rem', borderRadius: '16px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <CheckCircle size={24} color="#a7f3d0" />
            <div>
              <p style={{ margin: '0 0 0.3rem', fontWeight: 800, fontSize: '1.1rem' }}>{reporter.full_name} 마을 리포터님, 환영합니다.</p>
              <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>제보하신 내용은 리포터님의 누적 실적으로 자동 기록됩니다.</p>
            </div>
          </div>
        )}

        {/* Action Choice Banner */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }} className="grid-2col">
          <div style={{ background: '#1F5946', color: 'white', padding: '1.5rem', borderRadius: '16px', textAlign: 'center', border: '2px solid #1F5946', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.3rem', fontWeight: 800 }}>간편 제보 (현재 페이지)</h3>
            <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.9 }}>사진과 육하원칙 메모만 남겨주시면 편집국에서 기사로 만들어 드립니다.</p>
          </div>
          <Link href="/reporter/write" style={{ background: 'white', color: '#1F5946', padding: '1.5rem', borderRadius: '16px', textAlign: 'center', border: '2px solid #1F5946', textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'center', transition: 'all 0.2s' }}>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.3rem', fontWeight: 800 }}>직접 기사 쓰기 </h3>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569' }}>정식 리포터이신 경우, 완성된 형태의 기사를 전용 에디터로 직접 작성할 수 있습니다.</p>
          </Link>
        </div>

        {/* Report Form */}
        <div style={{ background: 'white', padding: '3rem', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
          
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '2rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem' }}>제보 내용 (육하원칙)</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }} className="grid-2col">
            {[
              { id: 'who', label: '누가 (필수)', placeholder: '예: 주민 30명, ○○마을 청년회 등', req: true },
              { id: 'what', label: '무엇을 (필수)', placeholder: '예: 마을 대청소, 도로 파손 등', req: true },
              { id: 'when_text', label: '언제', placeholder: '예: 5월 10일 오전 10시경', req: false },
              { id: 'where_text', label: '어디서', placeholder: '예: ○○면 마을회관 앞', req: false },
              { id: 'how', label: '어떻게', placeholder: '예: 다같이 힘을 모아, 갑자기', req: false },
              { id: 'why', label: '왜', placeholder: '예: 환경 개선을 위해, 비가 와서', req: false }
            ].map(field => (
              <div key={field.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor={field.id} style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155' }}>{field.label}</label>
                <input 
                  type="text" 
                  id={field.id} 
                  value={(formData as any)[field.id]} 
                  onChange={handleInputChange} 
                  placeholder={field.placeholder}
                  style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <label htmlFor="memo" style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>추가 설명 및 메모</label>
            <textarea 
              id="memo" 
              value={formData.memo} 
              onChange={handleInputChange} 
              placeholder="위의 내용 외에 추가적인 설명이나 기자에게 전달할 내용을 자유롭게 적어주세요."
              style={{ width: '100%', minHeight: '120px', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical' }}
            />
          </div>

          <div style={{ marginBottom: '3rem', background: '#f8fafc', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <label style={{ display: 'block', fontSize: '1.05rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem' }}>
              사진 첨부 <span style={{fontSize:'0.85rem', color:'#64748b', fontWeight:400}}>(선택, 최대 5장)</span>
            </label>
            <p style={{ fontSize: '0.9rem', color: '#b45309', fontWeight: 600, marginBottom: '1rem' }}>
              ※ 사진은 가급적 스마트폰 최고 화질로 촬영해 주시기를 부탁드립니다.
            </p>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={handleFileChange}
              style={{ display: 'block', width: '100%', padding: '1rem', background: 'white', borderRadius: '8px', border: '1px dashed #94a3b8' }}
            />
            {files.length > 0 && (
              <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#475569' }}>
                선택된 파일: {files.length}개
              </div>
            )}
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '2rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem' }}>지역 및 연락처</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '3rem' }}>
            <div>
              <label htmlFor="region" style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>해당 지역</label>
              <select 
                id="region" 
                value={formData.region} 
                onChange={handleInputChange}
                disabled={!!reporter}
                style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: reporter ? '#f1f5f9' : 'white' }}
              >
                <option value="강진">강진</option>
                <option value="고흥">고흥</option>
                <option value="보성">보성</option>
                <option value="장흥">장흥</option>
                <option value="기타">기타</option>
              </select>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="grid-2col">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="contact_phone" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155' }}>연락처 (전화번호)</label>
                <input 
                  type="tel" 
                  id="contact_phone" 
                  value={formData.contact_phone} 
                  onChange={handleInputChange} 
                  readOnly={!!reporter}
                  placeholder="010-0000-0000"
                  style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: reporter ? '#f1f5f9' : 'white' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="contact_email" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155' }}>이메일</label>
                <input 
                  type="email" 
                  id="contact_email" 
                  value={formData.contact_email} 
                  onChange={handleInputChange} 
                  readOnly={!!reporter}
                  placeholder="example@email.com"
                  style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: reporter ? '#f1f5f9' : 'white' }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={sendReport}
            disabled={submitting}
            style={{
              width: '100%',
              padding: '1.2rem',
              background: '#1F5946',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: 800,
              cursor: submitting ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
              opacity: submitting ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {submitting ? '제보 접수 중...' : <><Send size={20} /> 마을 리포터 제보 보내기</>}
          </button>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .grid-2col { grid-template-columns: 1fr !important; }
        }
      `}} />
    </>
  );
}

export default function PublicReportPage() {
  return (
    <main className="report-body" style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Header />
      <Suspense fallback={<div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>로딩 중...</div>}>
        <ReportContent />
      </Suspense>
      <Footer />
    </main>
  );
}
