'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Send, CheckCircle, ChevronLeft, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function AdApplyPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    content: '',
    recommender: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    let photoUrl = null;

    try {
      // 1. Upload photo if exists
      if (file) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        
        const uploadRes = await fetch('/api/upload-ad-image', {
          method: 'POST',
          body: formDataUpload,
        });
        
        const uploadData = await uploadRes.json();
        
        if (!uploadRes.ok) {
          console.error("Upload error:", uploadData.error);
          alert('이미지 업로드 중 오류가 발생했습니다. 신청서는 계속 제출됩니다. (' + uploadData.error + ')');
        } else {
          photoUrl = uploadData.url;
        }
      }

      // 2. Insert record
      const { error } = await supabase.from('ad_applications').insert([{
        name: formData.name,
        phone: formData.phone,
        content: formData.content,
        recommender: formData.recommender,
        photo_url: photoUrl
      }]);
      
      if (error) {
        alert('신청 접수 중 오류가 발생했습니다: ' + error.message + '\n\n(관리자 안내: ad_applications 테이블 생성이 필요할 수 있습니다.)');
      } else {
        setSubmitted(true);
      }
    } catch (err: any) {
      alert('오류 발생: ' + err.message);
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
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#111', margin: '0 0 1rem' }}>광고주 신청</h1>
          <p style={{ color: '#555', lineHeight: '1.6', fontSize: '1.05rem' }}>
            다산어보와 함께 지역 사회에 비즈니스를 알릴 파트너를 모십니다.<br/>
            투명하고 정직한 광고 운영을 통해 지역 경제 활성화에 기여합니다.
          </p>
        </div>

        <div style={{ background: 'white', padding: '3rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #eee' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <CheckCircle size={64} color="#10b981" style={{ margin: '0 auto 1.5rem' }} />
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem' }}>신청이 접수되었습니다!</h2>
              <p style={{ color: '#666', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                광고 신청해 주셔서 감사합니다.<br/>
                담당자가 내용을 확인한 후, 남겨주신 연락처로 안내해 드리겠습니다.
              </p>
              
              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px dashed #cbd5e1', marginBottom: '2rem', display: 'inline-block', textAlign: 'left' }}>
                <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-dark)' }}>
                  <CreditCard size={18} /> 결제 안내
                </h4>
                <div style={{ fontSize: '0.95rem', color: '#334155', lineHeight: '1.6' }}>
                  <strong>광고비:</strong> 1개월 300,000원<br/>
                  <strong>입금 계좌:</strong> 농협 000-00000-0000<br/>
                  <strong>예금주:</strong> 다산어보 언론협동조합
                </div>
              </div>
              <br />
              <Link href="/">
                <button className="btn btn-primary" style={{ padding: '0.8rem 2.5rem', fontSize: '1.1rem' }}>메인으로 돌아가기</button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Name */}
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', color: '#333' }}>이름 / 상호명 <span style={{color: '#ef4444'}}>*</span></label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="홍길동 (또는 다산식당)"
                    style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', background: '#fcfcfc' }}
                  />
                </div>
                
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
              </div>

              {/* Ad Copy */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', color: '#333' }}>광고 문구 <span style={{color: '#ef4444'}}>*</span></label>
                <textarea 
                  name="content"
                  required
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="광고에 노출될 메인 문구 및 상세 설명을 입력해주세요."
                  style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', minHeight: '120px', background: '#fcfcfc', resize: 'vertical' }}
                />
              </div>

              {/* Attachment */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', color: '#333' }}>첨부사진 <span style={{color: '#999', fontWeight: 400}}>(선택사항)</span></label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', background: '#fcfcfc' }}
                />
                <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.4rem' }}>광고 배너에 사용될 이미지나 명함, 전단지 등을 첨부해주세요. (10MB 이하)</p>
              </div>

              {/* Recommender */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', color: '#333' }}>추천인 이름 <span style={{color: '#999', fontWeight: 400}}>(선택사항)</span></label>
                <input 
                  type="text" 
                  name="recommender"
                  value={formData.recommender}
                  onChange={handleChange}
                  placeholder="추천해주신 분의 이름을 적어주세요"
                  style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', background: '#fcfcfc' }}
                />
              </div>
              
              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '1rem' }}>
                <h4 style={{ margin: '0 0 0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-dark)' }}>
                  <CreditCard size={18} /> 결제 안내
                </h4>
                <div style={{ fontSize: '0.95rem', color: '#334155', lineHeight: '1.6' }}>
                  <strong>광고비:</strong> 1개월 300,000원<br/>
                  <strong>입금 계좌:</strong> 농협 000-00000-0000<br/>
                  <strong>예금주:</strong> 다산어보 언론협동조합
                </div>
                <p style={{ margin: '0.8rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>* 신청서 제출 후 입금해 주시면 확인 후 광고가 게재됩니다.</p>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
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
                  {loading ? '신청서 제출 중...' : <><Send size={20} /> 광고 신청서 제출하기</>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
