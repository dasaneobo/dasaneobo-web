'use client';

import { useState, useEffect, Suspense } from 'react';
import Header from '@/components/Header';
import { Save, Image as ImageIcon, Layout, ChevronLeft, Type } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import dynamic from 'next/dynamic';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => {
    return mod.default;
  }),
  { ssr: false }
);



function EditArticleForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const articleId = searchParams.get('id');
  const reportId = searchParams.get('reportId');
  
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    category: '사회',
    region: '강진',
    author_id: ''
  });
  const [authors, setAuthors] = useState<any[]>([]);
  const [bodyUploading, setBodyUploading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("로그인이 필요합니다!");
        router.push('/login');
        return;
      }
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (!profile || profile.role === 'normal') {
        alert("기사 작성 권한이 없습니다. (리포터 이상만 가능)");
        router.push('/');
        return;
      }
      setUserProfile(profile);

      if (articleId) {
        setIsEditMode(true);
        const { data: article } = await supabase
          .from('articles')
          .select('*')
          .eq('id', articleId)
          .single();
        
        if (article) {
          setFormData({
            title: article.title,
            content: article.content,
            image_url: article.image_url,
            category: article.category,
            region: article.region,
            author_id: article.author_id
          });
        }
      } else if (reportId) {
        const { data: report } = await supabase.from('village_reports').select('*').eq('id', reportId).single();
        if (report) {
          const generatedContent = `**누가:** ${report.who}  \n**무엇을:** ${report.what}  \n**어디서:** ${report.where}  \n**언제:** ${report.when}  \n**어떻게:** ${report.how}  \n**왜:** ${report.why}  \n\n**추가 내용:** ${report.extra || ''}  \n\n*(제보자: ${report.sender_name} 리포터 / 제보 스타일: ${report.style})*`;
          setFormData(prev => ({ 
            ...prev, 
            author_id: session.user.id,
            title: `[제보 바탕] ${report.what}`,
            content: generatedContent,
            image_url: report.high_res_url || report.low_res_url || ''
          }));
        } else {
          setFormData(prev => ({ ...prev, author_id: session.user.id }));
        }
      } else {
        // Default author is the current user
        setFormData(prev => ({ ...prev, author_id: session.user.id }));
      }

      // If admin or editor, fetch all possible authors
      if (profile.role === 'admin' || profile.role === 'editor') {
        const { data: allProfiles } = await supabase
          .from('profiles')
          .select('id, name, role')
          .in('role', ['admin', 'editor', 'reporter'])
          .order('name');
        if (allProfiles) setAuthors(allProfiles);
      }
    };
    checkAuth();
  }, [router, articleId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    try {
      const publicUrl = await uploadToSupabase(file);
      setFormData({ ...formData, image_url: publicUrl });
      alert('이미지가 업로드되었습니다!');
    } catch (error: any) {
      alert('업로드 실패: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const uploadToSupabase = async (file: File) => {
    const maxWidth = 1200; 
    const reader = new FileReader();
    const compressedFile = await new Promise<Blob>((resolve, reject) => {
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Canvas conversion failed'));
          }, 'image/jpeg', 0.8);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });

    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
    const filePath = `articles/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('article-images').upload(filePath, compressedFile);
    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage.from('article-images').getPublicUrl(filePath);
    return publicUrl;
  };

  const handleBodyImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBodyUploading(true);

    try {
      const publicUrl = await uploadToSupabase(file);
      const imageMarkdown = `\n\n![이미지](${publicUrl})\n\n`;
      setFormData(prev => ({ ...prev, content: prev.content + imageMarkdown }));
    } catch (error: any) {
      alert('본문 이미지 업로드 실패: ' + error.message);
    } finally {
      setBodyUploading(false);
      e.target.value = ''; // Reset for next time
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
        category: formData.category,
        region: formData.region,
        author_id: formData.author_id
      };

      if (isEditMode && articleId) {
        const { error } = await supabase.from('articles').update(payload).eq('id', articleId);
        if (error) throw error;
        alert('기사가 성공적으로 수정되었습니다!');
      } else {
        const finalStatus = userProfile.role === 'reporter' ? 'pending' : 'published';
        const { error } = await supabase.from('articles').insert([{ ...payload, status: finalStatus }]);
        if (error) throw error;
        alert('기사가 성공적으로 접수/발행되었습니다!');
      }
      router.push('/admin');
    } catch (err: any) {
      alert('오류 발생: ' + err?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
      <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem', textDecoration: 'none' }}>
        <ChevronLeft size={16} /> 관리자 메인으로 돌아가기
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>{isEditMode ? '기사 수정' : '기사 작성'}</h1>
        <button 
          onClick={handleSubmit}
          disabled={loading || uploading}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 2.5rem', fontSize: '1rem', fontWeight: 'bold',
            background: 'var(--primary-dark)', color: 'white', border: 'none', borderRadius: '8px',
            cursor: (loading || uploading) ? 'not-allowed' : 'pointer', opacity: (loading || uploading) ? 0.7 : 1
          }}
        >
          <Save size={18} /> {loading ? (isEditMode ? '수정 중...' : '발행 중...') : (isEditMode ? '기사 수정하기' : '기사 발행하기')}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2.5rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <input 
            type="text" placeholder="기사 제목을 입력하세요"
            value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
            style={{ width: '100%', padding: '1rem 0', fontSize: '2.2rem', fontWeight: 800, border: 'none', borderBottom: '2px solid #eee', outline: 'none', fontFamily: '"Nanum Myeongjo", serif' }}
          />
          <div data-color-mode="light">
            <input 
              type="file" accept="image/*" id="body-image-upload" 
              style={{ display: 'none' }} 
              onChange={handleBodyImageUpload} 
            />
            <MDEditor
              value={formData.content}
              onChange={(val) => setFormData({ ...formData, content: val || '' })}
              preview="edit"
              height={600}
              style={{ border: 'none' }}
              extraCommands={[
                {
                  name: 'upload-image',
                  keyCommand: 'upload-image',
                  buttonProps: { 'aria-label': '이미지 업로드', title: '본문에 이미지 업로드 및 삽입' },
                  icon: (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-dark)', fontWeight: 'bold', fontSize: '12px' }}>
                      <ImageIcon size={14} /> {bodyUploading ? '업로드중...' : '사진추가'}
                    </div>
                  ),
                  execute: () => {
                    document.getElementById('body-image-upload')?.click();
                  },
                },
              ]}
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
            {(userProfile?.role === 'admin' || userProfile?.role === 'editor') && authors.length > 0 && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>작성 기자 선택</label>
                <select 
                  value={formData.author_id} 
                  onChange={(e) => setFormData({...formData, author_id: e.target.value})} 
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', background: '#fff9db' }}
                >
                  {authors.map(a => (
                    <option key={a.id} value={a.id}>
                      [{a.role === 'reporter' ? '마을리포터' : '기자'}] {a.name}
                    </option>
                  ))}
                </select>
                <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.4rem' }}>* 편집국 권한으로 기사 바이라인을 변경할 수 있습니다.</p>
              </div>
            )}
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}><ImageIcon size={18} /> 이미지 업로드</h4>
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} style={{ display: 'none' }} id="image-upload" />
            <label htmlFor="image-upload" style={{ display: 'block', width: '100%', padding: '0.8rem', textAlign: 'center', background: uploading ? '#eee' : 'var(--primary)', color: '#fff', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '1rem' }}>
              {uploading ? '처리 중...' : '이미지 파일 선택'}
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

export default function NewArticlePage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Header />
      <Suspense fallback={<div style={{ padding: '5rem', textAlign: 'center' }}>데이터 불러오는 중...</div>}>
        <EditArticleForm />
      </Suspense>
    </main>
  );
}
