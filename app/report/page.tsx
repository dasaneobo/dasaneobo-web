'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function PublicReportPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ msg: string; success: boolean } | null>(null);

  const [selectedStyle, setSelectedStyle] = useState('중립 보도');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    who: '', what: '', when: '', where: '', how: '', why: '', extra: '',
    senderName: '', senderContact: '',
    hp: '' // Honeypot field
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const todayStr = () => {
    const d = new Date();
    const days = ['일','월','화','수','목','금','토'];
    return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
  };

  const sendReport = async () => {
    // Honeypot check
    if (formData.hp) {
      console.log("Spam detected");
      return;
    }

    const { who, what, when } = formData;
    if (!who || !what || !when) {
      setNotice({ msg: '누가, 무엇을, 언제 항목은 필수입니다.', success: false });
      return;
    }

    setSubmitting(true);
    setNotice(null);

    try {
      const { error: dbError } = await supabase
        .from('village_reports')
        .insert([{
          style: selectedStyle,
          who: formData.who,
          what: formData.what,
          when: formData.when,
          where: formData.where,
          how: formData.how,
          why: formData.why,
          extra: formData.extra,
          sender_name: formData.senderName,
          sender_contact: formData.senderContact,
          status: 'new'
        }]);
 
      if (dbError) throw new Error('접수 중 오류가 발생했습니다: ' + dbError.message);

      setNotice({ msg: '✓ 제보가 성공적으로 접수되었습니다! 편집국에서 검토 후 연락드리겠습니다.', success: true });
      setFormData({
        who: '', what: '', when: '', where: '', how: '', why: '', extra: '',
        senderName: '',
        senderContact: '',
        hp: ''
      });
      setFile(null);
      setPreview(null);
      setSelectedStyle('중립 보도');

    } catch (err: any) {
      setNotice({ msg: '전송 실패: ' + err.message, success: false });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="report-body">
      <Header />
      <div className="report-masthead" style={{ background: '#2E7D52', color: 'white', padding: '3rem 0', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem', fontFamily: 'Noto Serif KR, serif' }}>기사 제보</h1>
          <p style={{ opacity: 0.9, fontSize: '1rem' }}>현장의 목소리를 전해주세요. 여러분의 제보가 우리 지역의 역사가 됩니다.</p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '800px', margin: '3rem auto 5rem' }}>
        <div className="report-container" style={{ background: 'white', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
          
          {/* Honeypot */}
          <div style={{ display: 'none' }}>
            <input type="text" id="hp" value={formData.hp} onChange={handleInputChange} tabIndex={-1} autoComplete="off" />
          </div>

          <div className="report-section-head" style={{ marginBottom: '1.5rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>
            <span style={{ fontWeight: 800, color: '#2E7D52' }}>제보 형식</span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            {['중립 보도', '따뜻한 마을 소식', '공식 공지문', '짧은 단신'].map(style => (
              <button
                key={style}
                type="button"
                onClick={() => setSelectedStyle(style)}
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  border: selectedStyle === style ? '2px solid #2E7D52' : '1px solid #ddd',
                  background: selectedStyle === style ? '#f0faf5' : 'white',
                  color: selectedStyle === style ? '#2E7D52' : '#666',
                  fontWeight: selectedStyle === style ? 800 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {style}
              </button>
            ))}
          </div>

          <div className="report-section-head" style={{ marginBottom: '1.5rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>
            <span style={{ fontWeight: 800, color: '#2E7D52' }}>제보 내용 (육하원칙)</span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '2rem' }}>
            {[
              { id: 'who', label: '누가', placeholder: '주민 30명, 청년회 등' },
              { id: 'what', label: '무엇을', placeholder: '마을 청소, 경로잔치 등' },
              { id: 'when', label: '언제', placeholder: '5월 10일 오전 10시 등' },
              { id: 'where', label: '어디서', placeholder: '마을 회관 앞 등' },
              { id: 'how', label: '어떻게', placeholder: '다같이 힘을 모아 등' },
              { id: 'why', label: '왜', placeholder: '환경 개선을 위해 등' }
            ].map(field => (
              <div key={field.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label htmlFor={field.id} style={{ fontSize: '0.85rem', fontWeight: 700, color: '#444' }}>{field.label}</label>
                <input 
                  type="text" 
                  id={field.id} 
                  className="report-input" 
                  value={(formData as any)[field.id]} 
                  onChange={handleInputChange} 
                  placeholder={field.placeholder}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ddd', outline: 'none' }}
                />
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <label htmlFor="extra" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#444', marginBottom: '0.4rem' }}>상세 내용 및 전달 사항</label>
            <textarea 
              id="extra" 
              value={formData.extra} 
              onChange={handleInputChange} 
              placeholder="추가적인 설명이나 기자에게 전달할 내용을 자유롭게 적어주세요."
              style={{ width: '100%', minHeight: '120px', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ddd', outline: 'none', resize: 'vertical' }}
            />
          </div>

          <div className="report-section-head" style={{ marginBottom: '1.5rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>
            <span style={{ fontWeight: 800, color: '#2E7D52' }}>제보자 정보</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="senderName" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#444' }}>성함 / 연락처</label>
              <input 
                type="text" 
                id="senderName" 
                value={formData.senderName} 
                onChange={handleInputChange} 
                placeholder="홍길동"
                style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ddd', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="senderContact" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#444' }}>이메일 또는 전화번호</label>
              <input 
                type="text" 
                id="senderContact" 
                value={formData.senderContact} 
                onChange={handleInputChange} 
                placeholder="010-0000-0000"
                style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ddd', outline: 'none' }}
              />
            </div>
          </div>

          <button
            onClick={sendReport}
            disabled={submitting}
            style={{
              width: '100%',
              padding: '1.2rem',
              background: '#2E7D52',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: 800,
              cursor: submitting ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
              opacity: submitting ? 0.7 : 1
            }}
          >
            {submitting ? '제보 접수 중...' : '기사 제보 보내기'}
          </button>

          {notice && (
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              borderRadius: '6px', 
              textAlign: 'center',
              background: notice.success ? '#f0faf5' : '#fff5f5',
              color: notice.success ? '#2E7D52' : '#c0392b',
              border: `1px solid ${notice.success ? '#2E7D52' : '#c0392b'}`,
              fontSize: '0.9rem',
              fontWeight: 600
            }}>
              {notice.msg}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
