'use client';

import { useState, useEffect, Suspense } from 'react';
import Header from '@/components/Header';
import { Save, Image as ImageIcon, Layout, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import RichTextEditor from '@/components/RichTextEditor';

function ReporterWriteForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    high_res_image_url: '',
    category: '지역',
    region: '전국/일반',
    author_id: '',
  });
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("로그인이 필요합니다!");
        router.push('/login');
        return;
      }
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      const allowedRoles = ['admin', 'editor', 'reporter', 'member'];
      if (!profile || !allowedRoles.includes(profile.role)) {
        alert("기사 작성 권한이 없습니다.");
        router.push('/');
        return;
      }
      setUserProfile(profile);
      setFormData(prev => ({ ...prev, author_id: session.user.id }));
      setAuthLoading(false);
    };
    checkAuth();
  }, [router]);

  const uploadViaApi = async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    
    const response = await fetch('/api/upload-article-image', {
      method: 'POST',
      body: fd,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '업로드 실패');
    }
    
    return await response.json();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadViaApi(file);
      setFormData({ 
        ...formData, 
        image_url: result.publicUrl,
        high_res_image_url: result.highResUrl
      });
      alert('이미지가 안전하게 업로드되었습니다! (원본 보존 완료)');
    } catch (error: any) {
      alert('업로드 실패: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleBodyImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadViaApi(file);
      const imageMarkdown = `\n\n![이미지](${result.publicUrl})\n\n`;
      setFormData(prev => ({ ...prev, content: prev.content + imageMarkdown }));
    } catch (error: any) {
      alert('본문 이미지 업로드 실패: ' + error.message);
    } finally {
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.title || !formData.content) {
      alert("제목과 내용을 모두 입력해주세요!");
      return;
    }
    setLoading(true);

    try {
      const payload = { 
        title: formData.title,
        content: formData.content,
        image_url: formData.image_url,
        high_res_image_url: formData.high_res_image_url || null,
        category: formData.category,
        region: formData.region,
        author_id: formData.author_id,
        status: 'pending' // 리포터 작성 기사는 무조건 대기 상태
      };

      const { error } = await supabase.from('articles').insert([payload]);
      if (error) throw error;
      
      alert('기사가 성공적으로 접수되었습니다! 편집국의 승인 후 발행됩니다.');
      router.push('/reporter'); // 리포터 허브로 이동 (예정)
    } catch (err: any) {
      alert('오류 발생: ' + err?.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div style={{ padding: '10rem 0', textAlign: 'center', fontSize: '1.2rem', color: '#666' }}>권한을 확인하는 중입니다...</div>;
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
      <Link href="/reporter" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem', textDecoration: 'none' }}>
        <ChevronLeft size={16} /> 리포터 홈으로 돌아가기
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>직접 기사 쓰기</h1>
        <button 
          onClick={handleSubmit}
          disabled={loading || uploading}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 2.5rem', fontSize: '1rem', fontWeight: 'bold',
            background: 'var(--primary-dark)', color: 'white', border: 'none', borderRadius: '8px',
            cursor: (loading || uploading) ? 'not-allowed' : 'pointer', opacity: (loading || uploading) ? 0.7 : 1
          }}
        >
          <Save size={18} /> {loading ? '제출 중...' : '기사 제출하기 (승인 대기)'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2.5rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <input 
            type="text" placeholder="기사 제목을 입력하세요"
            value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
            style={{ width: '100%', padding: '1rem 0', fontSize: '2.2rem', fontWeight: 800, border: 'none', borderBottom: '2px solid #eee', outline: 'none', fontFamily: '"Nanum Myeongjo", serif' }}
          />
          <div className="quill-wrapper">
            <input 
              type="file" accept="image/*" id="body-image-upload" 
              style={{ display: 'none' }} 
              onChange={handleBodyImageUpload} 
            />
            <RichTextEditor
              value={formData.content}
              onChange={(val) => setFormData({ ...formData, content: val })}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}><Layout size={18} /> 분류 설정</h4>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>카테고리</label>
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}>
                 <option>초점</option><option>행정</option><option>정치</option><option>경제</option><option>사회</option><option>교육</option><option>문화</option><option>인터뷰</option><option>지역</option><option>칼럼</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>지역</label>
              <select value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}>
                 <option>강진</option><option>보성</option><option>장흥</option><option>고흥</option><option>전국/일반</option>
              </select>
            </div>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}><ImageIcon size={18} /> 대표 사진(썸네일)</h4>
            <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem', lineHeight: '1.5', background: '#f8f9fa', padding: '0.8rem', borderRadius: '6px' }}>
              현장감이 잘 드러나는 사진을 선택해주세요.<br/>
              <strong>* 고화질 원본 자동 보존:</strong> 업로드 시 원본은 편집국 아카이브(구글 드라이브)에 안전하게 별도 보관됩니다.
            </div>
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} style={{ display: 'none' }} id="image-upload" />
            <label htmlFor="image-upload" style={{ display: 'block', width: '100%', padding: '0.8rem', textAlign: 'center', background: uploading ? '#eee' : 'var(--primary)', color: '#fff', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '1rem' }}>
              {uploading ? '업로드 중...' : '사진 선택하기'}
            </label>
            <div style={{ width: '100%', aspectRatio: '16/9', background: '#f8f9fa', border: '1px dashed #ccc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {formData.image_url ? <img src={formData.image_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: '#999', fontSize: '0.8rem' }}>이미지를 선택해 주세요.</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReporterWritePage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Header />
      <Suspense fallback={<div style={{ padding: '5rem', textAlign: 'center' }}>데이터 불러오는 중...</div>}>
        <ReporterWriteForm />
      </Suspense>
    </main>
  );
}
