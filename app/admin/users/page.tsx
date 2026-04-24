'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabase';
import { Users, ShieldCheck, UserCog, ChevronLeft, Save, Search, Trash2, Download } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UserManagementPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      // Auth Check
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('로그인이 필요합니다.');
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (!profile || profile.role !== 'admin') {
        alert('관리자 전용 페이지입니다.');
        router.push('/');
        return;
      }
      setUserProfile(profile);

      // Fetch all user profiles
      const { data: allUsers, error } = await supabase
        .from('profiles')
        .select('*')
        .order('name', { ascending: true });

      if (allUsers) setUsers(allUsers);
      setLoading(false);
    };

    fetchUsers();
  }, [router]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      alert('변경 실패: ' + error.message);
    } else {
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      // alert('등급이 성공적으로 변경되었습니다.'); // Too many alerts are annoying
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`${userName} 회원을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '삭제 실패');
      }

      setUsers(users.filter(u => u.id !== userId));
      alert('회원이 성공적으로 삭제되었습니다.');
    } catch (err: any) {
      alert('회원 삭제 중 오류가 발생했습니다: ' + err.message);
    }
  };

  const downloadCSV = () => {
    // CSV Header
    let csvContent = "\uFEFF"; // UTF-8 BOM for Excel
    csvContent += "이름,이메일,등급,추천인,가입일\n";

    // CSV Rows
    filteredUsers.forEach(user => {
      const roleName = user.role === 'admin' ? '관리자' : user.role === 'editor' ? '편집자' : user.role === 'reporter' ? '리포터' : '구독자';
      const row = [
        user.name || '',
        user.email || '',
        roleName,
        user.recommender || '',
        user.created_at ? new Date(user.created_at).toLocaleDateString() : ''
      ].map(field => `"${field.toString().replace(/"/g, '""')}"`).join(",");
      csvContent += row + "\n";
    });

    // Download Logic
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `다산어보_회원명단_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>사용자 목록 로딩 중...</div>;

  return (
    <main style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Header />
      
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            <ChevronLeft size={16} /> 편집국 메인으로 돌아가기
          </Link>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'var(--primary)', padding: '10px', borderRadius: '12px' }}>
                <Users color="#1a1a1a" size={28} />
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>사용자 및 권한 관리</h1>
                <p style={{ color: '#666', fontSize: '0.9rem', margin: '0.2rem 0 0' }}>회원들의 역할을 변경하여 리포터나 편집자로 임명할 수 있습니다.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button 
                onClick={downloadCSV}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '10px 16px',
                  background: '#222',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}
              >
                <Download size={18} /> 명단 다운로드 (CSV)
              </button>
              
              <div style={{ position: 'relative', width: '300px' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#aaa' }} />
                <input 
                  type="text" 
                  placeholder="이름 또는 이메일 검색..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 10px 10px 40px',
                    borderRadius: '10px',
                    border: '1px solid #ddd',
                    outline: 'none',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #eee', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#f9fafb', borderBottom: '2px solid #eee' }}>
              <tr>
                <th style={{ padding: '1.2rem', fontWeight: 700, fontSize: '0.9rem' }}>이름 / 이메일</th>
                <th style={{ padding: '1.2rem', fontWeight: 700, fontSize: '0.9rem' }}>추천인</th>
                <th style={{ padding: '1.2rem', fontWeight: 700, fontSize: '0.9rem' }}>현재 등급</th>
                <th style={{ padding: '1.2rem', fontWeight: 700, fontSize: '0.9rem' }}>권한 설정</th>
                <th style={{ padding: '1.2rem', fontWeight: 700, fontSize: '0.9rem' }}>상태</th>
                <th style={{ padding: '1.2rem', fontWeight: 700, fontSize: '0.9rem' }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '1.2rem' }}>
                    <div style={{ fontWeight: 700 }}>{user.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>{user.email}</div>
                  </td>
                  <td style={{ padding: '1.2rem', fontSize: '0.9rem', color: '#666' }}>
                    {user.recommender || '-'}
                  </td>
                  <td style={{ padding: '1.2rem' }}>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '15px', 
                      fontSize: '0.8rem', 
                      fontWeight: 700,
                      background: user.role === 'admin' ? '#fee2e2' : user.role === 'editor' ? '#e1f5fe' : user.role === 'reporter' ? '#f0fdf4' : '#f3f4f6',
                      color: user.role === 'admin' ? '#991b1b' : user.role === 'editor' ? '#075985' : user.role === 'reporter' ? '#166534' : '#4b5563'
                    }}>
                      {user.role === 'admin' ? '관리자' : user.role === 'editor' ? '편집자' : user.role === 'reporter' ? '리포터' : '구독자'}
                    </span>
                  </td>
                  <td style={{ padding: '1.2rem' }}>
                    <select 
                      value={user.role} 
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      style={{ 
                        padding: '6px 12px', 
                        borderRadius: '6px', 
                        border: '1px solid #ddd',
                        fontSize: '0.9rem',
                        background: '#fcfcfc',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="subscriber">구독자 (일반)</option>
                      <option value="reporter">리포터</option>
                      <option value="editor">편집자 (데스크)</option>
                      <option value="admin">관리자</option>
                    </select>
                  </td>
                  <td style={{ padding: '1.2rem' }}>
                    {user.role !== 'subscriber' && user.role !== 'normal' ? (
                      <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
                        <ShieldCheck size={16} /> 활동 중
                      </span>
                    ) : (
                      <span style={{ color: '#999', fontSize: '0.85rem' }}>대기</span>
                    )}
                  </td>
                  <td style={{ padding: '1.2rem' }}>
                    <button 
                      onClick={() => handleDeleteUser(user.id, user.name)}
                      style={{
                        background: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Trash2 size={14} /> 삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div style={{ textAlign: 'center', padding: '5rem', color: '#999' }}>사용자를 찾을 수 없습니다.</div>
          )}
        </div>
      </div>
    </main>
  );
}
