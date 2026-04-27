'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Send, CheckCircle, ChevronLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import emailjs from '@emailjs/browser';

const INTEREST_OPTIONS = [
  '농업·어업', '청년·교육', '문화·예술', '환경·생태',
  '복지·돌봄', '지방행정', '마을공동체', '역사·기록'
];

export default function ReporterApplyPage() {
  const [formData, setFormData] = useState({
    name: '',
    birthdate: '',
    phone: '',
    email: '',
    address: '',
    reason: '',
    region: '',
    occupation: '',
    guardian_name: '',
    guardian_contact: ''
  });

  const [interests, setInterests] = useState<string[]>([]);
  const [showOtherInterest, setShowOtherInterest] = useState(false);
  const [otherInterest, setOtherInterest] = useState('');

  const [agreements, setAgreements] = useState({
    eligibility1: false,
    eligibility2: false,
    eligibility3: false,
    volunteer: false,
    ethics: false,
    privacy: false
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [age, setAge] = useState<number | null>(null);

  useEffect(() => {
    // Calculate age based on birthdate
    if (formData.birthdate.length >= 8) {
      const match = formData.birthdate.match(/^(\d{4})-?(\d{2})-?(\d{2})$/);
      if (match) {
        const dob = new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
        if (!isNaN(dob.getTime())) {
          const today = new Date();
          let calculatedAge = today.getFullYear() - dob.getFullYear();
          const m = today.getMonth() - dob.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            calculatedAge--;
          }
          setAge(calculatedAge);
        } else {
          setAge(null);
        }
      } else {
        setAge(null);
      }
    } else {
      setAge(null);
    }
  }, [formData.birthdate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInterestChange = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleAgreementChange = (key: keyof typeof agreements) => {
    setAgreements(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isFormValid = () => {
    if (!formData.name || !formData.birthdate || !formData.phone || !formData.address || !formData.region || !formData.occupation) return false;
    if (age !== null && age < 14) return false;
    if (age !== null && age >= 14 && age < 18 && (!formData.guardian_name || !formData.guardian_contact)) return false;
    if (!agreements.eligibility1 || !agreements.eligibility2 || !agreements.eligibility3 || !agreements.volunteer || !agreements.ethics || !agreements.privacy) return false;
    if (interests.length === 0 && (!showOtherInterest || !otherInterest)) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert('모든 필수 항목을 입력하고 동의사항에 체크해주세요.');
      return;
    }
    
    setLoading(true);

    const finalInterests = [...interests];
    if (showOtherInterest && otherInterest) {
      finalInterests.push(`기타: ${otherInterest}`);
    }
    
    try {
      // 1. Save to Supabase
      const { error } = await supabase.from('reporter_applications').insert([{
        name: formData.name,
        birthdate: formData.birthdate,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        reason: formData.reason,
        region: formData.region,
        occupation: formData.occupation,
        interests: finalInterests,
        agreement_eligibility: agreements.eligibility1 && agreements.eligibility2 && agreements.eligibility3,
        agreement_volunteer: agreements.volunteer,
        agreement_ethics: agreements.ethics,
        agreement_privacy: agreements.privacy,
        guardian_name: formData.guardian_name || null,
        guardian_contact: formData.guardian_contact || null,
        status: 'pending'
      }]);
      
      if (error) throw error;

      // 2. Send Email Notification via EmailJS
      if (process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID) {
        const templateParams = {
          to_email: 'press@dasaneobo.kr',
          subject: `[다산어보] 새 마을 리포터 신청이 접수되었습니다 — ${formData.name}`,
          name: formData.name,
          region: formData.region,
          phone: formData.phone,
          occupation: formData.occupation,
          interests: finalInterests.join(', '),
          admin_link: 'https://www.dasaneobo.kr/admin'
        };

        try {
          await emailjs.send(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
            process.env.NEXT_PUBLIC_EMAILJS_REPORTER_TEMPLATE_ID || 'template_default', // Use appropriate template ID
            templateParams,
            process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
          );
        } catch (emailErr) {
          console.warn('이메일 전송 실패 (데이터는 정상 저장됨):', emailErr);
        }
      }

      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (err: any) {
      alert('신청 접수 중 오류가 발생했습니다: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Header />
      
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem', maxWidth: '850px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#666', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            <ChevronLeft size={16} /> 메인으로
          </Link>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#111', margin: '0 0 1rem' }}>마을 리포터 신청서</h1>
          <p style={{ color: '#555', lineHeight: '1.6', fontSize: '1.05rem' }}>
            강진·고흥·보성·장흥의 목소리가 되어주실 여러분을 환영합니다.<br/>
            다산어보는 지역 주민이 직접 참여하여 만드는 독립 협동조합 언론입니다.
          </p>
        </div>

        <div style={{ background: 'white', padding: '3rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #eee' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <CheckCircle size={72} color="#10b981" style={{ margin: '0 auto 1.5rem' }} />
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: '#064e3b' }}>신청서가 접수되었습니다.</h2>
              <p style={{ color: '#047857', marginBottom: '2.5rem', lineHeight: '1.6', fontSize: '1.1rem' }}>
                편집국 검토 후 3~5일 내에 연락드리겠습니다.<br/>
                감사합니다.
              </p>
              <Link href="/">
                <button className="btn btn-primary" style={{ padding: '0.8rem 2.5rem', fontSize: '1.1rem' }}>메인으로 돌아가기</button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              
              {/* 섹션 1: 기본 정보 */}
              <section>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-dark)', borderBottom: '2px solid var(--primary-dark)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>기본 정보</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', color: '#333' }}>이름 <span style={{color: '#ef4444'}}>*</span></label>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="본명 입력" style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ddd', background: '#fcfcfc' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', color: '#333' }}>생년월일 <span style={{color: '#ef4444'}}>*</span></label>
                    <input type="text" name="birthdate" required value={formData.birthdate} onChange={handleChange} placeholder="YYYY-MM-DD 또는 YYYYMMDD" style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ddd', background: '#fcfcfc' }} />
                    {age !== null && age < 14 && (
                      <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><AlertCircle size={14}/> 만 14세 미만은 신청할 수 없습니다.</div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', color: '#333' }}>연락처 <span style={{color: '#ef4444'}}>*</span></label>
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="010-0000-0000" style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ddd', background: '#fcfcfc' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', color: '#333' }}>이메일 <span style={{color: '#ef4444'}}>*</span></label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="example@email.com" style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ddd', background: '#fcfcfc' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', color: '#333' }}>주소 <span style={{color: '#ef4444'}}>*</span></label>
                  <input type="text" name="address" required value={formData.address} onChange={handleChange} placeholder="상세 주소를 입력해주세요" style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ddd', background: '#fcfcfc' }} />
                </div>
              </section>

              {/* 미성년자 보호자 동의 섹션 */}
              {age !== null && age >= 14 && age < 18 && (
                <section style={{ background: '#fffbeb', padding: '1.5rem', borderRadius: '8px', border: '1px solid #fde68a' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#b45309', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <AlertCircle size={18} /> 미성년자입니다. 보호자 동의가 필요합니다.
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.4rem', color: '#92400e', fontSize: '0.9rem' }}>보호자 성명 <span style={{color: '#ef4444'}}>*</span></label>
                      <input type="text" name="guardian_name" value={formData.guardian_name} onChange={handleChange} style={{ width: '100%', padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid #fcd34d', background: 'white' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.4rem', color: '#92400e', fontSize: '0.9rem' }}>보호자 연락처 <span style={{color: '#ef4444'}}>*</span></label>
                      <input type="tel" name="guardian_contact" value={formData.guardian_contact} onChange={handleChange} placeholder="보호자 연락처" style={{ width: '100%', padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid #fcd34d', background: 'white' }} />
                    </div>
                  </div>
                </section>
              )}

              {/* 섹션 2: 활동 정보 */}
              <section>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-dark)', borderBottom: '2px solid var(--primary-dark)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>활동 정보</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.3rem', color: '#333' }}>주 활동 지역 <span style={{color: '#ef4444'}}>*</span></label>
                    <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.8rem' }}>4개 군 중 주로 활동하실 지역을 선택해주세요.</p>
                    <select name="region" required value={formData.region} onChange={handleChange} style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ddd', background: '#fcfcfc' }}>
                      <option value="">선택해주세요</option>
                      <option value="강진군">강진군</option>
                      <option value="고흥군">고흥군</option>
                      <option value="보성군">보성군</option>
                      <option value="장흥군">장흥군</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.3rem', color: '#333' }}>직업·소속 <span style={{color: '#ef4444'}}>*</span></label>
                    <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.8rem' }}>광고주·정치 단체 소속이라면 반드시 명시해주세요.</p>
                    <input type="text" name="occupation" required value={formData.occupation} onChange={handleChange} placeholder="예: 주부, 농업, 회사원, 학생, 은퇴, 자영업 등" style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ddd', background: '#fcfcfc' }} />
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.8rem', color: '#333' }}>관심 분야 <span style={{color: '#ef4444'}}>*</span> <span style={{fontSize:'0.85rem', color:'#666', fontWeight:'normal'}}>(다중 선택 가능)</span></label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.8rem' }}>
                    {INTEREST_OPTIONS.map(opt => (
                      <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                        <input type="checkbox" checked={interests.includes(opt)} onChange={() => handleInterestChange(opt)} style={{ width: '16px', height: '16px' }} /> {opt}
                      </label>
                    ))}
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input type="checkbox" checked={showOtherInterest} onChange={(e) => setShowOtherInterest(e.target.checked)} style={{ width: '16px', height: '16px' }} /> 기타
                    </label>
                  </div>
                  {showOtherInterest && (
                    <input type="text" value={otherInterest} onChange={(e) => setOtherInterest(e.target.value)} placeholder="관심 분야를 직접 입력해주세요" style={{ width: '100%', marginTop: '0.8rem', padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid #ddd' }} />
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', color: '#333' }}>신청 사유 <span style={{color: '#999', fontWeight: 400}}>(선택사항)</span></label>
                  <textarea name="reason" value={formData.reason} onChange={handleChange} placeholder="리포터 활동을 희망하는 이유나, 지역 사회에서 다루고 싶은 주제가 있다면 자유롭게 적어주세요." style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', minHeight: '120px', resize: 'vertical' }} />
                </div>
              </section>

              {/* 섹션 3: 동의 사항 */}
              <section style={{ background: '#f8fafc', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem' }}>동의 사항 <span style={{color: '#ef4444', fontSize:'0.9rem', fontWeight:600}}>(모두 필수)</span></h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* 결격 사유 */}
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.8rem', color: '#334155' }}>결격 사유 확인</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
                        <input type="checkbox" checked={agreements.eligibility1} onChange={() => handleAgreementChange('eligibility1')} style={{ marginTop: '4px', width: '16px', height: '16px' }} />
                        <span style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.4 }}>본인은 특정 정당의 후원회·당원·당직자가 아니거나, 활동을 정지한 상태입니다.</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
                        <input type="checkbox" checked={agreements.eligibility2} onChange={() => handleAgreementChange('eligibility2')} style={{ marginTop: '4px', width: '16px', height: '16px' }} />
                        <span style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.4 }}>본인은 강진·고흥·보성·장흥 4개 군 내 광고주의 직원·임원이 아닙니다.</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
                        <input type="checkbox" checked={agreements.eligibility3} onChange={() => handleAgreementChange('eligibility3')} style={{ marginTop: '4px', width: '16px', height: '16px' }} />
                        <span style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.4 }}>본인은 최근 1년 내 명예훼손·허위사실 유포 등으로 형사처벌을 받지 않았습니다.</span>
                      </label>
                    </div>
                  </div>

                  {/* 활동 동의 */}
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.8rem', color: '#334155' }}>활동 동의</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
                        <input type="checkbox" checked={agreements.volunteer} onChange={() => handleAgreementChange('volunteer')} style={{ marginTop: '4px', width: '16px', height: '16px' }} />
                        <span style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.4 }}>본인은 다산어보 마을 리포터가 무보수 자원봉사임을 이해하며, 이에 동의합니다.</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
                        <input type="checkbox" checked={agreements.ethics} onChange={() => handleAgreementChange('ethics')} style={{ marginTop: '4px', width: '16px', height: '16px' }} />
                        <span style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.4 }}>
                          본인은 「다산어보 편집윤리규정」을 준수할 것에 동의합니다. <br/>
                          <Link href="/ethics-code" target="_blank" style={{ color: '#2E7D52', textDecoration: 'underline', fontSize: '0.85rem' }}>※ 편집윤리규정 보기</Link> (※ 마을 리포터 매뉴얼 전문은 선정 후 첫 교육에서 안내드립니다.)
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* 개인정보 동의 */}
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.8rem', color: '#334155' }}>개인정보 동의</h4>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={agreements.privacy} onChange={() => handleAgreementChange('privacy')} style={{ marginTop: '4px', width: '16px', height: '16px' }} />
                      <div style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>
                        다산어보의 개인정보 수집·이용에 동의합니다.<br/>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          - 수집 항목: 이름, 생년월일, 연락처, 이메일, 주소, 직업, 활동 정보<br/>
                          - 이용 목적: 마을 리포터 선정·운영·연락<br/>
                          - 보유 기간: 활동 종료 후 1년 (이후 자동 폐기, 본인 요청 시 즉시 폐기)
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </section>

              {/* Submit Button */}
              <div style={{ marginTop: '1rem' }}>
                <button 
                  type="submit" 
                  disabled={loading || !isFormValid()}
                  style={{ 
                    width: '100%', 
                    padding: '1.2rem', 
                    background: (loading || !isFormValid()) ? '#94a3b8' : 'var(--primary-dark)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    fontSize: '1.2rem', 
                    fontWeight: 800, 
                    cursor: (loading || !isFormValid()) ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s'
                  }}
                >
                  {loading ? '제출 중...' : <><Send size={20} /> 마을 리포터 신청 완료</>}
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
