'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Send, CheckCircle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function ReporterApplyPage() {
  const [formData, setFormData] = useState({
    name: '',
    birthdate: '',
    phone: '',
    email: '',
    address: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.from('reporter_applications').insert([{
      name: formData.name,
      birthdate: formData.birthdate,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      reason: formData.reason
    }]);
    
    if (error) {
      alert('신청 접수 중 오류가 발생했습니다: ' + error.message + '\n\n(관리자 안내: reporter_applications 테이블 생성이 필요할 수 있습니다.)');
    } else {
      setSubmitted(true);
    }
    setLoading(false);
  };

  return (
    <main style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Header />
      
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem', maxWidth: '800px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#666', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            <ChevronLeft size={16} /> 메인으로
          </Link>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#111', margin: '0 0 1rem' }}>마을 리포터 신청하기</h1>
          <p style={{ color: '#555', lineHeight: '1.6', fontSize: '1.05rem' }}>
            다산어보는 지역 주민의 목소리를 가장 중요하게 생각합니다.<br/>
            우리 동네의 숨겨진 이야기, 이웃의 따뜻한 소식, 또는 개선이 필요한 문제들을 직접 취재하고 알릴 <strong>마을 리포터</strong>를 모십니다.
          </p>
        </div>

        <div style={{ background: 'white', padding: '3rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #eee' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <CheckCircle size={64} color="#10b981" style={{ margin: '0 auto 1.5rem' }} />
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem' }}>신청이 완료되었습니다!</h2>
              <p style={{ color: '#666', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                마을 리포터에 지원해 주셔서 감사합니다.<br/>
                제출해주신 내용은 편집국에서 꼼꼼히 확인 후, 남겨주신 연락처로 개별 안내해 드리겠습니다.
              </p>
              <Link href="/">
                <button className="btn btn-primary" style={{ padding: '0.8rem 2.5rem', fontSize: '1.1rem' }}>메인으로 돌아가기</button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Name */}
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', color: '#333' }}>이름 (본명) <span style={{color: '#ef4444'}}>*</span></label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="홍길동"
                    style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', background: '#fcfcfc' }}
                  />
                </div>
                
                {/* Birthdate */}
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', color: '#333' }}>생년월일 <span style={{color: '#ef4444'}}>*</span></label>
                  <input 
                    type="text" 
                    name="birthdate"
                    required
                    value={formData.birthdate}
                    onChange={handleChange}
                    placeholder="YYYY-MM-DD"
                    style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', background: '#fcfcfc' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Phone */}
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', color: '#333' }}>연락처 <span style={{color: '#ef4444'}}>*</span></label>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="010-0000-0000"
                    style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', background: '#fcfcfc' }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', color: '#333' }}>이메일 <span style={{color: '#ef4444'}}>*</span></label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', background: '#fcfcfc' }}
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', color: '#333' }}>주소 <span style={{color: '#ef4444'}}>*</span></label>
                <input 
                  type="text" 
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="현재 거주하시는 상세 주소를 입력해주세요 (취재 권역 확인용)"
                  style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', background: '#fcfcfc' }}
                />
              </div>

              {/* Reason (Optional) */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', color: '#333' }}>
                  리포터 신청 사유 <span style={{color: '#999', fontWeight: 400}}>(선택사항)</span>
                </label>
                <textarea 
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="리포터로 활동하고 싶으신 이유나 다루고 싶은 주제가 있다면 자유롭게 적어주세요."
                  style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', minHeight: '150px', background: '#fcfcfc', resize: 'vertical' }}
                />
              </div>

              <div style={{ marginTop: '1rem' }}>
                <button 
                  type="submit" 
                  disabled={loading}
                  style={{ 
                    width: '100%', 
                    padding: '1rem', 
                    background: 'var(--primary-dark)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    fontSize: '1.1rem', 
                    fontWeight: 800, 
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? '신청서 제출 중...' : <><Send size={20} /> 리포터 신청서 제출하기</>}
                </button>
                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#999', marginTop: '1rem' }}>
                  입력하신 개인정보는 리포터 선발 목적으로만 사용되며, 동의 없이 외부에 제공되지 않습니다.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
