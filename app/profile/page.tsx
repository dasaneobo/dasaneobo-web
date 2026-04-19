'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { User, Settings, Save, ChevronLeft, ShieldCheck, Mail, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (data) {
        setUserProfile(data);
        setNewName(data.name || '');
      }
      setLoading(false);
    };

    fetchProfile();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      alert('이름을 입력해 주세요.');
      return;
    }

    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('세션이 만료되었습니다.');

      const { error } = await supabase
        .from('profiles')
        .update({ name: newName })
        .eq('id', session.user.id);

      if (error) throw error;
      
      setUserProfile({ ...userProfile, name: newName });
      alert('회원 정보가 수정되었습니다.');
      // Refresh to update header
      window.location.reload();
    } catch (error: any) {
      alert('수정 실패: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>회원 정보 불러오는 중...</div>;

  const roleLabel = userProfile.role === 'admin' ? '최고관리자' : 
                    userProfile.role === 'editor' ? '편집국 데스크' : 
                    userProfile.role === 'reporter' ? '지역 리포터' : '독자 회원';

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Header />
      
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            <ChevronLeft size={16} /> 메인으로 돌아가기
          </Link>

          <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            {/* Profile Header */}
            <div style={{ background: 'var(--primary-dark)', padding: '3rem 2rem', color: 'white', textAlign: 'center' }}>
              <div style={{ 
                width: '100px', height: '100px', background: 'white', borderRadius: '50%', margin: '0 auto 1.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-dark)',
                fontSize: '2.5rem', fontWeight: 900, boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }}>
                {userProfile.name?.[0] || 'U'}
              </div>
              <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900 }}>{userProfile.name} 님</h1>
              <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><ShieldCheck size={14} /> {roleLabel}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={14} /> 가입일: {new Date(userProfile.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Profile Content */}
            <div style={{ padding: '3rem 2.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Settings size={20} color="var(--primary-dark)" /> 개인 정보 수정
              </h2>

              <form onSubmit={handleSave} style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '0.6rem' }}>이름</label>
                  <input 
                    type="text" 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)} 
                    style={{ 
                      width: '100%', padding: '1rem', borderRadius: '10px', 
                      border: '1px solid #e2e8f0', fontSize: '1.1rem',
                      outline: 'none', transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.4rem' }}>기사 바이라인이나 댓글 작성 시 표시될 이름입니다.</p>
                </div>

                <div style={{ padding: '1rem', background: '#f1f5f9', borderRadius: '10px', fontSize: '0.9rem', color: '#475569' }}>
                   <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '0.5rem' }}>
                      <Mail size={16} /> <strong>계정 이메일:</strong> {userProfile.email}
                   </div>
                   <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>※ 이메일 및 비밀번호 변경은 관리자에게 문의해 주세요.</p>
                </div>

                <button 
                  type="submit" 
                  disabled={saving}
                  style={{ 
                    marginTop: '1rem', width: '100%', background: 'var(--primary-dark)', color: 'white', padding: '1.2rem', 
                    borderRadius: '12px', fontSize: '1.1rem', fontWeight: 900, border: 'none', cursor: 'pointer',
                    transition: 'all 0.2s', boxShadow: '0 8px 20px rgba(5, 150, 105, 0.15)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {saving ? '수정 중...' : '회원 정보 저장하기'}
                </button>
              </form>
            </div>
          </div>

          <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>도움이 필요하신가요? <strong style={{ color: '#64748b' }}>press@dasaneobo.kr</strong></p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
