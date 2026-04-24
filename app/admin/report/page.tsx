'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import emailjs from '@emailjs/browser';
import './report.css';

export default function ReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [notice, setNotice] = useState<{ msg: string; success: boolean } | null>(null);

  const [selectedStyle, setSelectedStyle] = useState('중립 보도');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    who: '', what: '', when: '', where: '', how: '', why: '', extra: '',
    senderName: '', senderContact: ''
  });

  useEffect(() => {
    const pubKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    if (pubKey) emailjs.init({ publicKey: pubKey });
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('로그인이 필요합니다.');
        router.push('/login');
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      if (!profile || (profile.role !== 'reporter' && profile.role !== 'editor' && profile.role !== 'admin')) {
        alert('이 메뉴를 볼 권한이 없습니다. (취재기자 등급 이상 필요)');
        router.push('/');
        return;
      }
      setUserProfile(profile);
      setFormData(prev => ({
        ...prev,
        senderName: profile.name || '',
        senderContact: profile.email || ''
      }));
      setLoading(false);
    };
    checkAuth();
  }, [router]);

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
    const { who, what, when } = formData;
    if (!who || !what || !when) {
      setNotice({ msg: '누가, 무엇을, 언제 항목은 필수입니다.', success: false });
      return;
    }

    setSubmitting(true);
    setNotice(null);

    try {
      // 1. Supabase에 직접 저장
      const { data: dbData, error: dbError } = await supabase
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
        }])
        .select()
        .single();
 
      if (dbError) throw new Error('DB 저장 오류: ' + dbError.message);

      // 사진 업로드는 선택사항이며 현재 단계에서는 Supabase에 직접 저장만 수행합니다.

      // 4. 성공 처리
      setNotice({ msg: '✓ 제보가 성공적으로 접수되었습니다!', success: true });
      setFormData({
        who: '', what: '', when: '', where: '', how: '', why: '', extra: '',
        senderName: userProfile?.name || '',
        senderContact: userProfile?.email || ''
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

  if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>권한 확인 중...</div>;

  return (
    <main className="report-body">
      <Header />
      <div className="report-masthead">
        <div className="report-masthead-name">다산어보</div>
        <div className="report-masthead-sub">마을 소식 제보 시스템 (기자 전용)</div>
        <div className="report-masthead-date">{todayStr()}</div>
      </div>

      <div className="report-container">
        <div className="report-section-head"><span>기사 스타일</span></div>
        <div className="report-style-grid">
          {[
            { id: '중립 보도', desc: '사실 중심, 객관적 보도' },
            { id: '따뜻한 마을 소식', desc: '정겨운 공동체 이야기' },
            { id: '공식 공지문', desc: '행정·단체 발표 형식' },
            { id: '짧은 단신', desc: '핵심만 2~3문장' }
          ].map(style => (
            <button
              key={style.id}
              className={`report-style-btn ${selectedStyle === style.id ? 'active' : ''}`}
              onClick={() => setSelectedStyle(style.id)}
            >
              <span className="s-name">{style.id}</span>
              <span className="s-desc">{style.desc}</span>
            </button>
          ))}
        </div>

        <div className="report-section-head"><span>육하원칙</span></div>
        <div className="report-fields-grid">
          <div className="report-field">
            <label className="report-label"><span className="report-badge b-who">누가</span> Who</label>
            <input type="text" id="who" className="report-input" value={formData.who} onChange={handleInputChange} placeholder="예: 마을 주민 30명, 청년회" />
          </div>
          <div className="report-field">
            <label className="report-label"><span className="report-badge b-what">무엇을</span> What</label>
            <input type="text" id="what" className="report-input" value={formData.what} onChange={handleInputChange} placeholder="예: 마을 청소, 경로잔치" />
          </div>
          <div className="report-field">
            <label className="report-label"><span className="report-badge b-when">언제</span> When</label>
            <input type="text" id="when" className="report-input" value={formData.when} onChange={handleInputChange} placeholder="예: 5월 10일 오전 10시" />
          </div>
          <div className="report-field">
            <label className="report-label"><span className="report-badge b-where">어디서</span> Where</label>
            <input type="text" id="where" className="report-input" value={formData.where} onChange={handleInputChange} placeholder="예: 마을 회관 앞 광장" />
          </div>
          <div className="report-field">
            <label className="report-label"><span className="report-badge b-how">어떻게</span> How</label>
            <input type="text" id="how" className="report-input" value={formData.how} onChange={handleInputChange} placeholder="예: 다같이 힘을 모아" />
          </div>
          <div className="report-field">
            <label className="report-label"><span className="report-badge b-why">왜</span> Why</label>
            <input type="text" id="why" className="report-input" value={formData.why} onChange={handleInputChange} placeholder="예: 마을 환경 개선을 위해" />
          </div>
          <div className="report-field full">
            <label className="report-label">추가로 하고 싶은 말 <span style={{fontSize:'10px', color:'var(--ink3)', fontWeight:300}}>(선택)</span></label>
            <textarea id="extra" className="report-textarea" value={formData.extra} onChange={handleInputChange} placeholder="분위기, 주민 반응, 기억나는 말 한마디 등"></textarea>
          </div>
        </div>

        <div className="report-section-head"><span>현장 사진 첨부</span></div>
        <div className="report-field full" style={{ marginBottom: '1rem' }}>
          <label className="report-label">사진 선택 (선택사항)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="report-input"
            style={{ padding: '0.5rem' }}
          />
          {preview && (
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '4px', border: '1px solid var(--report-rule)' }} />
              <p style={{ fontSize: '10px', color: 'var(--ink3)', marginTop: '0.5rem' }}>첨부된 이미지 미리보기</p>
            </div>
          )}
        </div>

        <div className="report-section-head"><span>제보자 정보</span></div>
        <div className="report-sender-grid">
          <div className="report-field">
            <label className="report-label">이름</label>
            <input type="text" id="senderName" className="report-input" value={formData.senderName} onChange={handleInputChange} placeholder="홍길동" />
          </div>
          <div className="report-field">
            <label className="report-label">연락처 또는 이메일</label>
            <input type="text" id="senderContact" className="report-input" value={formData.senderContact} onChange={handleInputChange} placeholder="010-0000-0000" />
          </div>
        </div>

        <div className="report-submit-wrap">
          <button
            className={`report-submit-btn ${submitting ? 'loading' : ''}`}
            onClick={sendReport}
            disabled={submitting}
          >
            {submitting && <div className="report-spinner"></div>}
            <span className="btn-text">{submitting ? '보내는 중...' : '편집국으로 제보 보내기'}</span>
          </button>
          {notice && (
            <div className={`report-notice ${notice.success ? 'success' : ''}`}>
              {notice.msg}
            </div>
          )}
        </div>

        <div className="report-footer-rule">다산어보 언론협동조합 · 마을 소식 제보 시스템</div>
      </div>
    </main>
  );
}
